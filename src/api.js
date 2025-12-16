// ===============================
// API FRONTEND → BACKEND (EXPRESS)
// ===============================
// Todo pasa por el backend para evitar CORS y no exponer tokens.

const API_BASE = process.env.REACT_APP_API_BASE || "/api/gs";

async function parseJsonOrThrow(res) {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  // Si no es JSON, normalmente te llegó HTML (index.html / error page)
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

// META (apartamentos / meses / años)
export async function getMeta() {
  const res = await fetch(`${API_BASE}/meta`, { method: "GET" });
  const data = await parseJsonOrThrow(res);

  if (!data.ok) throw new Error(data.error || "Error obteniendo meta");

  const m = data.meta ?? data;
  return {
    apartamentos: Array.isArray(m.apartamentos) ? m.apartamentos : [],
    meses: Array.isArray(m.meses) ? m.meses : [],
    anos: Array.isArray(m.anos) ? m.anos : [],
  };
}

// RESERVAS (ADMIN)
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
