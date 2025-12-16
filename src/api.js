// ===============================
// API FRONTEND → BACKEND (EXPRESS)
// ===============================
// ⚠️ El frontend YA NO habla directo con Google Apps Script
//     Todo pasa por el backend para evitar CORS y exponer tokens

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  `${window.location.origin}/api/gs`;


// -------------------------------
// META (apartamentos / meses / años)
// -------------------------------
export async function getMeta() {
  const res = await fetch(`${API_BASE}/meta`);
  const data = await res.json();

  if (!data.ok) {
    throw new Error(data.error || "Error obteniendo meta");
  }

  const m = data.meta ?? data;

  return {
    apartamentos: Array.isArray(m.apartamentos) ? m.apartamentos : [],
    meses: Array.isArray(m.meses) ? m.meses : [],
    anos: Array.isArray(m.anos) ? m.anos : [],
  };
}

// -------------------------------
// RESERVAS (ADMIN)
// -------------------------------
export async function getReservas({ apartamento, mes, ano }) {
  const qs = new URLSearchParams({
    apartamento: apartamento || "",
    mes: mes || "",
    ano: ano || "",
  });

  const res = await fetch(`${API_BASE}/reservas?${qs.toString()}`);
  const data = await res.json();

  if (!data.ok) {
    throw new Error(data.error || "Error obteniendo reservas");
  }

  return data.reservas || [];
}

// -------------------------------
// UPDATE RESERVA
// -------------------------------
export async function updateReserva(id_unico, fields) {
  const res = await fetch(`${API_BASE}/update-reserva`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_unico,
      fields,
    }),
  });

  const data = await res.json();

  if (!data.ok) {
    throw new Error(data.error || "Error actualizando reserva");
  }

  return true;
}
export async function createReserva(fields) {
  const res = await fetch(`${API_BASE}/create-reserva`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });

  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Error creando reserva");
  return data; // puede traer id_unico
}
