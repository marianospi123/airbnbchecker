const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const admin = require("firebase-admin"); // <-- se mantiene solo este
const fetch = require("node-fetch");
const ICAL = require("ical.js");


// =======================
// GOOGLE APPS SCRIPT CONFIG
// =======================
const GS_BASE =
  process.env.GS_BASE ||
  "https://script.google.com/macros/s/AKfycbz0-aMETzx3oddL1e6nAScOCwOBo6cZ817o8VBo-6u1FPpouutNEctQp6ut7jHF0Hsk/exec";

const GS_TOKEN =
  process.env.GS_TOKEN || "huespedex_api_2025_super_seguro_9f8a7s6d";


const app = express();
app.use(express.json());

// ✅ Configuración CORS global
app.use(
  cors({
    origin: "*", // cambia a tu dominio en prod si quieres más seguridad
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const RESERVAS_FILE = path.join(__dirname, "reservas.json");
const TOKENS_FILE = path.join(__dirname, "tokens.json");

// -------------------
// Inicializar Firebase Admin (local o producción)
// -------------------
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  // 🔹 En Render / Producción
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  console.log("Usando credenciales de Firebase desde variable de entorno ✅");
} else {
  try {
    // 🔹 En local (archivo ignorado en Git)
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
  if (!fs.existsSync(RESERVAS_FILE)) fs.writeFileSync(RESERVAS_FILE, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(RESERVAS_FILE, "utf-8"));
};
const guardarReservas = (reservas) => {
  fs.writeFileSync(RESERVAS_FILE, JSON.stringify(reservas, null, 2));
};
const leerTokens = () => {
  if (!fs.existsSync(TOKENS_FILE)) fs.writeFileSync(TOKENS_FILE, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(TOKENS_FILE, "utf-8"));
};
const guardarTokens = (tokens) => {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
};

// -------------------
// ENDPOINT FCM NOTIFY
// -------------------
app.post("/api/fcm-notify", async (req, res) => {
  try {
    const { notification, tokens } = req.body;
    if (!tokens || !tokens.length) return res.status(400).json({ error: "No hay tokens" });
    if (!notification || !notification.title || !notification.body)
      return res.status(400).json({ error: "Notification inválida" });

    const message = { notification, tokens };
    const resp = await admin.messaging().sendEachForMulticast(message);
    res.json({ success: true, sent: resp.successCount, failed: resp.failureCount });
  } catch (err) {
    console.error("Error enviando notificación:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// -------------------
// ENDPOINTS RESERVAS
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
        fechaCheckout || new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0],
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
    if (idx === -1) return res.status(404).json({ error: "Reserva no encontrada" });

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
    if (reservas.length === nuevas.length) return res.status(404).json({ error: "Reserva no encontrada" });

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
    if (!token) return res.status(400).json({ error: "Falta token" });

    let tokens = leerTokens();
    if (!tokens.includes(token)) tokens.push(token);
    guardarTokens(tokens);

    res.json({ success: true, tokensCount: tokens.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error guardando token" });
  }
});


function safeJsonFromResponse(text) {
  try { return JSON.parse(text); }
  catch { return { ok: false, error: "Respuesta no JSON desde Apps Script", raw: text.slice(0, 400) }; }
}

// GET META
app.get("/api/gs/meta", async (req, res) => {
  try {
    const url = `${GS_BASE}?action=meta&token=${encodeURIComponent(GS_TOKEN)}`;
    const r = await fetch(url, { redirect: "follow" });
    const text = await r.text();
    const data = safeJsonFromResponse(text);
    res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    console.error("GS meta error:", e);
    res.status(500).json({ ok: false, error: e.message || "GS meta error" });
  }
});

// GET RESERVAS
app.get("/api/gs/reservas", async (req, res) => {
  try {
    const { apartamento = "", mes = "", ano = "" } = req.query;
    const qs = new URLSearchParams({ action: "reservas", token: GS_TOKEN, apartamento, mes, ano });
    const url = `${GS_BASE}?${qs.toString()}`;
    const r = await fetch(url, { redirect: "follow" });
    const text = await r.text();
    const data = safeJsonFromResponse(text);
    res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    console.error("GS reservas error:", e);
    res.status(500).json({ ok: false, error: e.message || "GS reservas error" });
  }
});

// POST UPDATE
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
    res.status(500).json({ ok: false, error: e.message || "GS update error" });
  }
});

// POST CREATE
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
    res.status(500).json({ ok: false, error: e.message || "GS create error" });
  }
});



// -------------------
// PROXY ICS
// -------------------
app.get("/proxy", async (req, res) => {
  const icalUrl = req.query.url;
  if (!icalUrl) return res.status(400).send("Falta url");

  try {
    const response = await fetch(icalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "text/calendar, text/plain, */*",
      },
    });
    if (!response.ok) return res.status(response.status).send("No se pudo obtener el calendario");

    const text = await response.text();
    res.type("text/calendar").send(text);
  } catch (error) {
    console.error("Error fetching ICS:", error.message);
    res.status(500).send("Error al obtener el calendario");
  }
});

const calendars = require("./calendars.js"); // <-- tu array de propiedades

function rangesOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}
app.get("/api/availability", async (req, res) => {
  const { from, to, people, estado } = req.query;

  if (!from || !to || !people || !estado) {
    return res.status(400).json({ error: "Faltan parámetros (from, to, people, estado)" });
  }

  const cacheKey = getCacheKey({ from, to, people, estado });
  const cached = availabilityCache.get(cacheKey);

  // ✅ DEVUELVE CACHE SI AÚN ES VÁLIDO
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
  }

  const startDate = new Date(from);
  const endDate = new Date(to);
  const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  if (nights <= 0) return res.status(400).json({ error: "Rango de fechas inválido" });

  // ✅ base URL real (Render / Local)
  const base = `${req.protocol}://${req.get("host")}`;

  const output = [];
  const filteredCalendars = calendars.filter(
    (cal) => cal.estado === estado && cal.capacity >= parseInt(people)
  );

  for (const cal of filteredCalendars) {
    try {
      let isAvailable = false;
      let airbnbPrice = null;
      let esteiPrice = null;
      let errorMsg = null;

      try {
        const proxyUrl = `${base}/proxy?url=${encodeURIComponent(cal.url)}`;
        const resp = await fetch(proxyUrl);
        if (!resp.ok) throw new Error(`No se pudo obtener el ICS de ${cal.name}`);
        const text = await resp.text();

        const jcalData = ICAL.parse(text);
        const comp = new ICAL.Component(jcalData);
        const events = comp.getAllSubcomponents("vevent");

        const reservas = events.map((e) => {
          const ev = new ICAL.Event(e);
          return { start: ev.startDate.toJSDate(), end: ev.endDate.toJSDate() };
        });

        isAvailable = !reservas.some((r) =>
          rangesOverlap(startDate, endDate, r.start, r.end)
        );

        // === AIRBNB ===
        const a = cal.airbnb;
        const extraGuests = Math.max(0, parseInt(people) - a.maxGuestsIncluded);
        const baseNightsPrice = a.pricePerNight * nights;
        const extraGuestPrice = a.extraGuestFeePerNight * extraGuests * nights;

        let discounted = baseNightsPrice;
        if (nights >= 7 && nights < 26) discounted *= (1 - a.discountWeek);
        else if (nights >= 26) discounted *= (1 - a.discountMonth);

        const subtotal = discounted + extraGuestPrice + a.cleaningFee;
        const platformFee = subtotal * (a.platformFeeRate || 0.1411);
        airbnbPrice = Math.round((subtotal + platformFee) * 100) / 100;

        // === ESTEI ===
        const e = cal.estei;
        const eNightsPrice = e.pricePerNight * nights;
        const eExtraGuests = Math.max(0, parseInt(people) - (e.maxGuestsIncluded || 2));
        const eExtraGuestPrice = (e.extraGuestFeePerNight || 0) * eExtraGuests * nights;

        const eSubtotal = eNightsPrice + eExtraGuestPrice + (e.cleaningFee || 0);
        let eDiscount = 0;
        if (nights >= 7 && nights < 30) eDiscount = eNightsPrice * (e.discountWeek || 0);
        else if (nights >= 30) eDiscount = eNightsPrice * (e.discountMonth || 0);

        const ePlatformFee = eSubtotal * (e.platformFeePercentage || 0);
        esteiPrice = eSubtotal + ePlatformFee - eDiscount;

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

  // ✅ GUARDA EN CACHE
  availabilityCache.set(cacheKey, {
    timestamp: Date.now(),
    data: availableOutput,
  });

  return res.json(availableOutput);
});



// -------------------
// SERVIR FRONTEND REACT
// -------------------
app.use(express.static(path.join(__dirname, "../build")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "../build/index.html")));

// -------------------
// INICIAR SERVIDOR
// -------------------
const PORT = process.env.PORT || 4004;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));