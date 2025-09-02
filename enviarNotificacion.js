// notificaciones.js
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Inicializar Firebase Admin si no está inicializado
if (!admin.apps.length) {
  const serviceAccount = require("./src/serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Leer tokens de usuarios
function leerTokens() {
  const TOKENS_FILE = path.join(__dirname, "tokens.json");
  let tokens = [];
  try {
    if (fs.existsSync(TOKENS_FILE)) {
      tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Error leyendo tokens.json:", err.message);
  }
  return tokens;
}

// Leer reservas
function leerReservas() {
  const RESERVAS_FILE = path.join(__dirname, "reservas.json");
  let reservas = [];
  try {
    if (fs.existsSync(RESERVAS_FILE)) {
      reservas = JSON.parse(fs.readFileSync(RESERVAS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Error leyendo reservas.json:", err.message);
  }
  return reservas;
}

// Determinar alerta de cada reserva
function getAlerta(reserva) {
  const hoy = new Date().toISOString().slice(0, 10);
  if (reserva.fecha === hoy) return "Hoy llega";
  if (!reserva.envioInfo) return "Enviar información";
  if (!reserva.checkout) return "Check-out pendiente";
  return null;
}

// Función principal para enviar notificaciones
async function enviarNotificacionesAutomaticas() {
  const tokens = leerTokens();
  if (!tokens.length) {
    console.log("No hay tokens para enviar notificaciones.");
    return;
  }

  const reservas = leerReservas();
  const alertas = reservas
    .map(r => ({ reserva: r, alerta: getAlerta(r) }))
    .filter(a => a.alerta);

  if (!alertas.length) {
    console.log("No hay reservas pendientes para notificar hoy.");
    return;
  }

  const mensaje = {
    notification: {
      title: "Reserva pendiente",
      body: `Tienes ${alertas.length} reserva(s) pendiente(s). Revisa tu app.`,
    },
    tokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(mensaje);
    console.log(`${response.successCount} notificaciones enviadas correctamente.`);
    if (response.failureCount > 0) {
      console.log("Errores en:", response.responses.filter(r => !r.success));
    }
  } catch (err) {
    console.error("Error enviando notificaciones:", err);
  }
}

// Exportar función
module.exports = { enviarNotificacionesAutomaticas };
