const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const ICAL = require("ical.js");
const calendarFetch =
  typeof globalThis.fetch === "function" ? globalThis.fetch.bind(globalThis) : fetch;

// =======================
// GOOGLE APPS SCRIPT CONFIG
// =======================
const GS_BASE =
  process.env.GS_BASE ||
  "https://script.google.com/macros/s/AKfycbwMy-p7W63NzaerSTbu8ls6k25ZXsvqiQVzKvkQ8hFdRNCKsLh_wJlXtm2M9zcpeame/exec";

const GS_TOKEN =
  process.env.GS_TOKEN || "huespedex_api_2025_super_seguro_9f8a7s6d";

const app = express();

app.use(express.json());

// ✅ Configuración CORS global
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const RESERVAS_FILE = path.join(__dirname, "reservas.json");
const TOKENS_FILE = path.join(__dirname, "tokens.json");

// -------------------
// CACHE DISPONIBILIDAD
// -------------------
const availabilityCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
const CALENDAR_FETCH_TIMEOUT_MS = 15000;
const CHACAO_ESTEI_ICAL_URL =
  "https://api.estei.app/api/calendars/1473257424-stay-17432889927468941438.ics";

function getCacheKey(params) {
  return JSON.stringify(params);
}

function getCalendarResponseMeta(response) {
  return {
    status: response.status,
    contentType: response.headers.get("content-type"),
    server: response.headers.get("server"),
    cfRay: response.headers.get("cf-ray"),
  };
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CALENDAR_FETCH_TIMEOUT_MS);

  try {
    return await calendarFetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchCalendarResource(url) {
  const response = await fetchWithTimeout(url, {
    redirect: "follow",
    headers: {
      "User-Agent": "AirbnbChecker/1.0",
      Accept: "text/calendar,text/plain,*/*",
      "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  const body = await response.text();
  const meta = getCalendarResponseMeta(response);

  return {
    ok: response.ok,
    body,
    ...meta,
    attempts: [{ profile: "native-fetch", ...meta }],
  };
}

// -------------------
// Inicializar Firebase Admin
// -------------------
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  console.log("Usando credenciales de Firebase desde variable de entorno ✅");
} else {
  try {
    serviceAccount = require("./serviceAccountKey.json");
    console.log("Usando credenciales de Firebase desde archivo local ✅");
  } catch (err) {
    console.log("⚠️ No se encontró serviceAccountKey.json, Firebase Admin deshabilitado en local");
  }
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// -------------------
// FUNCIONES AUXILIARES
// -------------------
const leerReservas = () => {
  if (!fs.existsSync(RESERVAS_FILE)) {
    fs.writeFileSync(RESERVAS_FILE, JSON.stringify([]));
  }

  return JSON.parse(fs.readFileSync(RESERVAS_FILE, "utf-8"));
};

const guardarReservas = (reservas) => {
  fs.writeFileSync(RESERVAS_FILE, JSON.stringify(reservas, null, 2));
};

const leerTokens = () => {
  if (!fs.existsSync(TOKENS_FILE)) {
    fs.writeFileSync(TOKENS_FILE, JSON.stringify([]));
  }

  return JSON.parse(fs.readFileSync(TOKENS_FILE, "utf-8"));
};

const guardarTokens = (tokens) => {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
};

function safeJsonFromResponse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {
      ok: false,
      error: "Respuesta no JSON desde Apps Script",
      raw: text.slice(0, 400),
    };
  }
}

// -------------------
// HEALTH CHECK RENDER
// -------------------
app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

// -------------------
// ENDPOINT FCM NOTIFY
// -------------------
app.post("/api/fcm-notify", async (req, res) => {
  try {
    const { notification, tokens } = req.body;

    if (!admin.apps.length) {
      return res.status(500).json({
        error: "Firebase Admin no está inicializado",
      });
    }

    if (!tokens || !tokens.length) {
      return res.status(400).json({ error: "No hay tokens" });
    }

    if (!notification || !notification.title || !notification.body) {
      return res.status(400).json({ error: "Notification inválida" });
    }

    const message = { notification, tokens };
    const resp = await admin.messaging().sendEachForMulticast(message);

    res.json({
      success: true,
      sent: resp.successCount,
      failed: resp.failureCount,
    });
  } catch (err) {
    console.error("Error enviando notificación:", err);
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
});

// -------------------
// ENDPOINTS RESERVAS LOCALES
// -------------------
app.get("/api/reservas", (req, res) => {
  try {
    res.json(leerReservas());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error leyendo reservas" });
  }
});

app.post("/api/reservas", (req, res) => {
  try {
    const {
      fechaCheckin,
      fechaCheckout,
      plataforma,
      huesped,
      monto,
      noches,
      envioInfo,
      checkin,
      cada3dias,
      checkout,
    } = req.body;

    const reservas = leerReservas();

    const nuevaReserva = {
      id: Date.now(),
      fechaCheckin: fechaCheckin || new Date().toISOString().split("T")[0],
      fechaCheckout:
        fechaCheckout ||
        new Date(new Date().setDate(new Date().getDate() + 1))
          .toISOString()
          .split("T")[0],
      plataforma: plataforma || "",
      huesped: huesped || "Pendiente",
      monto: monto || 0,
      noches: noches || 1,
      envioInfo: envioInfo || "",
      checkin: checkin || "",
      cada3dias: cada3dias || "",
      checkout: checkout || "",
      notiCheckin: false,
      notiEnvioInfo: false,
      notiCheckout: false,
    };

    reservas.push(nuevaReserva);
    guardarReservas(reservas);

    res.json({ success: true, reserva: nuevaReserva });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error guardando reserva" });
  }
});

app.put("/api/reservas/:id", (req, res) => {
  try {
    const { id } = req.params;
    const reservas = leerReservas();
    const idx = reservas.findIndex((r) => r.id === parseInt(id));

    if (idx === -1) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    reservas[idx] = { ...reservas[idx], ...req.body };
    guardarReservas(reservas);

    res.json({ success: true, reserva: reservas[idx] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error editando reserva" });
  }
});

app.delete("/api/reservas/:id", (req, res) => {
  try {
    const { id } = req.params;
    const reservas = leerReservas();
    const nuevas = reservas.filter((r) => r.id !== parseInt(id));

    if (reservas.length === nuevas.length) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    guardarReservas(nuevas);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error eliminando reserva" });
  }
});

// -------------------
// ENDPOINT TOKEN FCM
// -------------------
app.post("/api/fcm-token", (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Falta token" });
    }

    let tokens = leerTokens();

    if (!tokens.includes(token)) {
      tokens.push(token);
    }

    guardarTokens(tokens);

    res.json({
      success: true,
      tokensCount: tokens.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error guardando token" });
  }
});

// -------------------
// GOOGLE SHEETS / APPS SCRIPT
// -------------------
app.get("/api/gs/meta", async (req, res) => {
  try {
    const url = `${GS_BASE}?action=meta&token=${encodeURIComponent(GS_TOKEN)}`;
    const r = await fetch(url, { redirect: "follow" });
    const text = await r.text();
    const data = safeJsonFromResponse(text);

    res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    console.error("GS meta error:", e);
    res.status(500).json({
      ok: false,
      error: e.message || "GS meta error",
    });
  }
});

app.get("/api/gs/reservas", async (req, res) => {
  try {
    const { apartamento = "", mes = "", ano = "" } = req.query;

    const qs = new URLSearchParams({
      action: "reservas",
      token: GS_TOKEN,
      apartamento,
      mes,
      ano,
    });

    const url = `${GS_BASE}?${qs.toString()}`;
    const r = await fetch(url, { redirect: "follow" });
    const text = await r.text();
    const data = safeJsonFromResponse(text);

    res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    console.error("GS reservas error:", e);
    res.status(500).json({
      ok: false,
      error: e.message || "GS reservas error",
    });
  }
});

app.post("/api/gs/update-reserva", async (req, res) => {
  try {
    const r = await fetch(GS_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({
        action: "update_reserva",
        token: GS_TOKEN,
        id_unico: req.body.id_unico,
        fields: req.body.fields,
      }),
    });

    const text = await r.text();
    const data = safeJsonFromResponse(text);

    res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    console.error("GS update error:", e);
    res.status(500).json({
      ok: false,
      error: e.message || "GS update error",
    });
  }
});

app.post("/api/gs/create-reserva", async (req, res) => {
  try {
    const r = await fetch(GS_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({
        action: "create_reserva",
        token: GS_TOKEN,
        fields: req.body.fields,
      }),
    });

    const text = await r.text();
    const data = safeJsonFromResponse(text);

    res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    console.error("GS create reserva error:", e);
    res.status(500).json({
      ok: false,
      error: e.message || "GS create error",
    });
  }
});

app.post("/api/gs/delete-reserva", async (req, res) => {
  try {
    const { id_unico } = req.body || {};

    if (!id_unico) {
      return res.status(400).json({
        ok: false,
        error: "Falta id_unico",
      });
    }

    const r = await fetch(GS_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({
        action: "delete_reserva",
        token: GS_TOKEN,
        id_unico,
      }),
    });

    const text = await r.text();
    const data = safeJsonFromResponse(text);

    return res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    console.error("GS delete reserva error:", e);
    return res.status(500).json({
      ok: false,
      error: e.message || "GS delete error",
    });
  }
});

// -------------------
// PROXY ICS
// -------------------
app.get("/debug/estei", async (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate");

  try {
    const result = await fetchCalendarResource(CHACAO_ESTEI_ICAL_URL);

    return res.json({
      url: CHACAO_ESTEI_ICAL_URL,
      ok: result?.ok || false,
      status: result?.status || null,
      contentType: result?.contentType || null,
      server: result?.server || null,
      cfRay: result?.cfRay || null,
      attempts: result?.attempts || [],
      body: String(result?.body || "").slice(0, 10000),
    });
  } catch (error) {
    console.error("Error en diagnóstico de Estéi:", error);
    return res.status(500).json({
      ok: false,
      error: error.name === "AbortError" ? "Tiempo de espera agotado" : error.message,
    });
  }
});

app.get("/proxy", async (req, res) => {
  const icalUrl = req.query.url;

  if (!icalUrl) {
    return res.status(400).send("Falta url");
  }

  try {
    const result = await fetchCalendarResource(icalUrl);

    if (!result?.ok) {
      console.warn("El proveedor rechazó el calendario", {
        host: new URL(icalUrl).hostname,
        attempts: result?.attempts || [],
      });

      if (result?.status) res.set("X-Calendar-Upstream-Status", String(result.status));
      if (result?.cfRay) res.set("X-Calendar-Cf-Ray", result.cfRay);

      return res
        .status(result?.status || 502)
        .send("No se pudo obtener el calendario");
    }

    const text = result.body;

    if (!text || !text.includes("BEGIN:VCALENDAR")) {
      return res.status(502).send("El proveedor devolvió un calendario inválido");
    }

    res.set("Cache-Control", "no-store, no-cache, must-revalidate");
    if (result.cfRay) res.set("X-Calendar-Cf-Ray", result.cfRay);
    res.set("X-Calendar-Fetch-Attempts", String(result.attempts.length));
    res.type("text/calendar").send(text);
  } catch (error) {
    console.error("Error fetching ICS:", error);
    const status = error.name === "AbortError" ? 504 : 500;
    res.status(status).send("Error al obtener el calendario");
  }
});

// -------------------
// DISPONIBILIDAD Y PRECIOS
// -------------------
const calendars = require("./calendars.js");
const calendarSourceOverrides = require("../src/data/calendarSources.json");
const chacaoEsteiAvailability = require("../src/data/esteiChacaoAvailability.json");

for (const calendar of calendars) {
  const sourceOverrides = calendarSourceOverrides[calendar.name];
  if (sourceOverrides) Object.assign(calendar, sourceOverrides);
}

function getCalendarSources(calendar) {
  const candidates = [
    { name: "Airbnb", url: calendar.url },
    { name: "Estéi", url: calendar.esteiUrl },
    { name: "Booking", url: calendar.bookingUrl },
    { name: "VRBO", url: calendar.vrboUrl },
  ];
  const seen = new Set();

  return candidates.filter((source) => {
    const url = String(source.url || "").trim();
    if (!url || seen.has(url)) return false;
    seen.add(url);
    source.url = url;
    return true;
  });
}

function rangesOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

app.get("/api/availability", async (req, res) => {
  const { from, to, people, estado } = req.query;

  if (!from || !to || !people || !estado) {
    return res.status(400).json({
      error: "Faltan parámetros (from, to, people, estado)",
    });
  }

  const cacheKey = getCacheKey({ from, to, people, estado });
  const cached = availabilityCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
  }

  const startDate = new Date(from);
  const endDate = new Date(to);
  const peopleNumber = parseInt(people, 10);
  const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return res.status(400).json({
      error: "Fechas inválidas",
    });
  }

  if (Number.isNaN(peopleNumber) || peopleNumber <= 0) {
    return res.status(400).json({
      error: "Cantidad de personas inválida",
    });
  }

  if (nights <= 0) {
    return res.status(400).json({
      error: "Rango de fechas inválido",
    });
  }

  const base = `${req.protocol}://${req.get("host")}`;

  const output = [];

  const filteredCalendars = calendars.filter(
    (cal) => cal.estado === estado && cal.capacity >= peopleNumber
  );

  for (const cal of filteredCalendars) {
    try {
      let isAvailable = false;
      let airbnbPrice = null;
      let esteiPrice = null;
      let errorMsg = null;

      try {
        const calendarSources = getCalendarSources(cal);
        const reservas = [];
        const sourceErrors = [];
        let successfulSources = 0;

        if (cal.name === "Chacao") {
          for (const range of chacaoEsteiAvailability.ranges || []) {
            const snapshotStart = new Date(`${range.start}T00:00:00.000Z`);
            const snapshotEnd = new Date(`${range.end}T00:00:00.000Z`);

            if (
              !Number.isNaN(snapshotStart.getTime()) &&
              !Number.isNaN(snapshotEnd.getTime()) &&
              snapshotStart < snapshotEnd
            ) {
              reservas.push({ start: snapshotStart, end: snapshotEnd });
            }
          }
        }

        for (const source of calendarSources) {
          try {
            const proxyUrl = `${base}/proxy?url=${encodeURIComponent(source.url)}&_=${Date.now()}`;
            const resp = await fetch(proxyUrl, { cache: "no-store" });

            if (!resp.ok) {
              throw new Error(`respondió HTTP ${resp.status}`);
            }

            const text = await resp.text();
            if (!text || !text.includes("BEGIN:VCALENDAR")) {
              throw new Error("devolvió un calendario inválido");
            }

            const jcalData = ICAL.parse(text);
            const comp = new ICAL.Component(jcalData);
            const events = comp.getAllSubcomponents("vevent");
            successfulSources += 1;

            for (const eventComponent of events) {
              const ev = new ICAL.Event(eventComponent);
              if (ev.startDate && ev.endDate) {
                reservas.push({
                  start: ev.startDate.toJSDate(),
                  end: ev.endDate.toJSDate(),
                  source: source.name,
                });
              }
            }
          } catch (sourceError) {
            sourceErrors.push(
              `${source.name}: ${sourceError.message || "no se pudo leer"}`
            );
          }
        }

        if (calendarSources.length > 0 && successfulSources === 0) {
          throw new Error(`No se pudo leer ningún calendario de ${cal.name}`);
        }

        if (sourceErrors.length > 0) errorMsg = sourceErrors.join(" | ");

        if (["Chacao", "Altamira 1"].includes(cal.name) && reservas.length === 0) {
          throw new Error(
            `Los calendarios de ${cal.name} llegaron vacíos; se bloquea por seguridad`
          );
        }

        isAvailable = !reservas.some((r) =>
          rangesOverlap(startDate, endDate, r.start, r.end)
        );

        // === AIRBNB ===
        if (cal.airbnb) {
          const a = cal.airbnb;

          const extraGuests = Math.max(
            0,
            peopleNumber - (a.maxGuestsIncluded || 0)
          );

          const baseNightsPrice = (a.pricePerNight || 0) * nights;
          const extraGuestPrice =
            (a.extraGuestFeePerNight || 0) * extraGuests * nights;

          let discounted = baseNightsPrice;

          if (nights >= 7 && nights < 26) {
            discounted *= 1 - (a.discountWeek || 0);
          } else if (nights >= 26) {
            discounted *= 1 - (a.discountMonth || 0);
          }

          const subtotal = discounted + extraGuestPrice + (a.cleaningFee || 0);
          const platformFee = subtotal * (a.platformFeeRate || 0.1411);

          airbnbPrice = Math.round((subtotal + platformFee) * 100) / 100;
        }

        // === ESTEI ===
        if (cal.estei) {
          const e = cal.estei;

          const eNightsPrice = (e.pricePerNight || 0) * nights;

          const eExtraGuests = Math.max(
            0,
            peopleNumber - (e.maxGuestsIncluded || 2)
          );

          const eExtraGuestPrice =
            (e.extraGuestFeePerNight || 0) * eExtraGuests * nights;

          const eSubtotal =
            eNightsPrice + eExtraGuestPrice + (e.cleaningFee || 0);

          let eDiscount = 0;

          if (nights >= 7 && nights < 30) {
            eDiscount = eNightsPrice * (e.discountWeek || 0);
          } else if (nights >= 30) {
            eDiscount = eNightsPrice * (e.discountMonth || 0);
          }

          const ePlatformFee = eSubtotal * (e.platformFeePercentage || 0);

          esteiPrice = eSubtotal + ePlatformFee - eDiscount;
        }
      } catch (errInner) {
        console.error(`Error procesando ${cal.name}:`, errInner);
        errorMsg = errInner.message;
      }

      output.push({
        name: cal.name,
        estado: cal.estado,
        isAvailable,
        nights,
        capacity: cal.capacity,
        rooms: cal.rooms,
        baths: cal.baths,
        airbnbPrice: airbnbPrice?.toFixed(2) ?? null,
        esteiPrice: esteiPrice?.toFixed(2) ?? null,
        airbnbLink: cal.airbnbLink,
        esteiLink: cal.esteiLink,
        error: errorMsg,
      });
    } catch (errOuter) {
      console.error(`Error inesperado con ${cal.name}:`, errOuter);
    }
  }

  const availableOutput = output.filter((ap) => ap.isAvailable);

  availabilityCache.set(cacheKey, {
    timestamp: Date.now(),
    data: availableOutput,
  });

  return res.json(availableOutput);
});

// -------------------
// SERVIR FRONTEND REACT
// -------------------
const buildPath = path.join(__dirname, "../build");

app.use(express.static(buildPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// -------------------
// INICIAR SERVIDOR
// -------------------
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en 0.0.0.0:${PORT}`);
});
