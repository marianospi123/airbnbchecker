// ===============================
// API FRONTEND → BACKEND (EXPRESS)
// ===============================
// Todo pasa por el backend para evitar CORS y no exponer tokens.

const API_BASE = process.env.REACT_APP_API_BASE || "/api/gs";

async function parseJsonOrThrow(res) {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Respuesta NO JSON desde ${res.url}\n` +
      `Status: ${res.status}\n` +
      `Content-Type: ${contentType}\n` +
      `Preview: ${text.slice(0, 200)}`
    );
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(
      `JSON inválido desde ${res.url}\n` +
      `Status: ${res.status}\n` +
      `Preview: ${text.slice(0, 200)}`
    );
  }
}

/**
 * Normaliza catálogo de apartamentos.
 * Esperado ideal:
 *   apartments: [{ display, sheetName, aptId? }]
 * Fallback viejo:
 *   apartamentos: ["NombreHoja1","NombreHoja2",...]
 */
function normalizeApartmentsMeta(m) {
  // Caso nuevo
  if (Array.isArray(m.apartments) && m.apartments.length) {
    const apartments = m.apartments
      .map((a) => ({
        display: String(a?.display || a?.DISPLAY_NAME || "").trim(),
        sheetName: String(a?.sheetName || a?.SHEET_NAME || "").trim(),
        aptId: String(a?.aptId || a?.APARTMENT_ID || "").trim(),
      }))
      .filter((a) => a.sheetName && a.display);

    return {
      apartments,
      // compat: lista vieja (sheetName)
      apartamentos: apartments.map((a) => a.sheetName),
    };
  }

  // Caso viejo
  const apartamentos = Array.isArray(m.apartamentos) ? m.apartamentos : [];
  const apartments = apartamentos
    .map((s) => ({ display: String(s).trim(), sheetName: String(s).trim(), aptId: "" }))
    .filter((a) => a.sheetName);

  return { apartments, apartamentos };
}

// META (apartamentos / meses / años)
export async function getMeta() {
  const res = await fetch(`${API_BASE}/meta`, { method: "GET" });
  const data = await parseJsonOrThrow(res);

  if (!data.ok) throw new Error(data.error || "Error obteniendo meta");

  const m = data.meta ?? data;

  const { apartments, apartamentos } = normalizeApartmentsMeta(m);

  return {
    // ✅ nuevo (para dropdown bonito)
    apartments,
    // ✅ viejo (compat)
    apartamentos,
    meses: Array.isArray(m.meses) ? m.meses : [],
    anos: Array.isArray(m.anos) ? m.anos : [],
  };
}

// RESERVAS (ADMIN)
// ✅ apartamento aquí debe ser el SHEET_NAME real (lo que vive en maestro)
export async function getReservas({ apartamento, mes, ano }) {
  const qs = new URLSearchParams({
    apartamento: apartamento || "",
    mes: mes || "",
    ano: ano || "",
  });

  const res = await fetch(`${API_BASE}/reservas?${qs.toString()}`, { method: "GET" });
  const data = await parseJsonOrThrow(res);

  if (!data.ok) throw new Error(data.error || "Error obteniendo reservas");
  return data.reservas || [];
}

// UPDATE RESERVA
export async function updateReserva(id_unico, fields) {
  const res = await fetch(`${API_BASE}/update-reserva`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_unico, fields }),
  });

  const data = await parseJsonOrThrow(res);
  if (!data.ok) throw new Error(data.error || "Error actualizando reserva");
  return true;
}

// CREATE RESERVA
// ✅ fields.Apartamento debe venir como SHEET_NAME real (tu UI nueva ya lo hace)
export async function createReserva(fields) {
  const res = await fetch(`${API_BASE}/create-reserva`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });

  const data = await parseJsonOrThrow(res);
  if (!data.ok) throw new Error(data.error || "Error creando reserva");
  return data;
}
