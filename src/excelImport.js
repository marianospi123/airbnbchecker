// excelImport.js
const fs = require("fs");
const XLSX = require("xlsx");
const path = require("path");

const RESERVAS_FILE = path.join(__dirname, "reservas.json");

function leerReservas() {
  if (!fs.existsSync(RESERVAS_FILE)) fs.writeFileSync(RESERVAS_FILE, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(RESERVAS_FILE, "utf-8"));
}

function guardarReservas(reservas) {
  fs.writeFileSync(RESERVAS_FILE, JSON.stringify(reservas, null, 2));
}

function importarExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

  const reservasExistentes = leerReservas();

  const nuevasReservas = data.map((row) => ({
    id: Date.now() + Math.floor(Math.random() * 1000), // ID único
    fechaCheckin: row["FechaCheckin"] || new Date().toISOString().split("T")[0],
    fechaCheckout: row["FechaCheckout"] || new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0],
    plataforma: row["Plataforma"] || "",
    huesped: row["Huesped"] || "Pendiente",
    monto: row["Monto"] || 0,
    noches: row["Noches"] || 1,
    envioInfo: row["EnvioInfo"] || "",
    checkin: row["Checkin"] || "",
    cada3dias: row["Cada3Dias"] || "",
    checkout: row["Checkout"] || ""
  }));

  const todasReservas = [...reservasExistentes, ...nuevasReservas];
  guardarReservas(todasReservas);

  console.log(`${nuevasReservas.length} reservas importadas desde Excel`);
  return nuevasReservas;
}

module.exports = { importarExcel };
