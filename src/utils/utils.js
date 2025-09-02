// src/utils.js
// ---------------------------------
// Convierte formato "12-ene" en objeto Date
// ---------------------------------
export const parseDate = (str) => {
  if (!str) return null;

  // Formato "12-ene"
  if (str.includes("-") && str.match(/[a-zA-Z]/)) {
    const [day, month] = str.split("-");
    const months = {
      ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
      jul: 6, ago: 7, sept: 8, oct: 9, nov: 10, dic: 11
    };
    const year = new Date().getFullYear();
    return new Date(year, months[month.toLowerCase()], parseInt(day));
  }

  // Formato ISO "YYYY-MM-DD"
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

// ---------------------------------
// Genera alertas según fechas y estado
// ---------------------------------
export const getAlert = (reserva) => {
  const checkinDate = parseDate(reserva.fechaCheckin);
  const checkoutDate = parseDate(reserva.fechaCheckout);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Validamos estado como booleano seguro
  const checkin = String(reserva.checkin || "").toLowerCase() === "listo";
  const checkout = String(reserva.checkout || "").toLowerCase() === "listo";
  const cada3dias = String(reserva.cada3dias || "").toLowerCase() === "listo";
  const envioInfo = String(reserva.envioInfo || "").toLowerCase() === "listo";

  // 🟢 Check-in hoy
  if (checkinDate && checkinDate.toDateString() === hoy.toDateString() && !checkin) {
    return "Hoy llega el huésped ✅";
  }

  // ⚠️ Enviar info 2 días antes del check-in
  if (checkinDate) {
    const diffCheckin = (checkinDate - hoy) / (1000 * 60 * 60 * 24);
    if (diffCheckin > 0 && diffCheckin <= 2 && !envioInfo) {
      return "Enviar información pronto ⚠️";
    }
    if (diffCheckin > 0 && Math.floor(diffCheckin) % 3 === 0 && !cada3dias) {
      return "Seguimiento cada 3 días 📩";
    }
  }

  // 🟡 Check-out hoy
  if (checkoutDate && checkoutDate.toDateString() === hoy.toDateString() && !checkout) {
    return "Hoy se va el huésped 🟡";
  }

  // 🔴 Check-out pendiente (pasado y no marcado)
  if (checkoutDate && checkoutDate < hoy && !checkout) {
    return "Check-out pendiente ❌";
  }

  return "";
};

// ---------------------------------
// Aplica clases según la alerta
// ---------------------------------
export const getRowClass = (reserva) => {
  const alerta = getAlert(reserva);
  if (alerta.includes("llega")) return "bg-green-200";
  if (alerta.includes("Información") || alerta.includes("Seguimiento")) return "bg-yellow-200";
  if (alerta.includes("se va")) return "bg-blue-200";
  if (alerta.includes("pendiente")) return "bg-red-200";
  return "";
};
