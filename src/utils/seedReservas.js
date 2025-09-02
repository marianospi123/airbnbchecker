// src/utils/seedReservas.js
export const reservasEjemplo = [
  {
    id: 1,
    fechaCheckin: "19-ago",    // Hoy
    fechaCheckout: "22-ago",
    plataforma: "Airbnb",
    huesped: "María Pérez",
    monto: "120",
    noches: "3",
    envioInfo: "",
    checkin: "",
    cada3dias: "",
    checkout: "",
  },
  {
    id: 2,
    fechaCheckin: "21-ago",    // Dentro de 2 días
    fechaCheckout: "25-ago",
    plataforma: "Booking",
    huesped: "Carlos López",
    monto: "200",
    noches: "4",
    envioInfo: "",
    checkin: "",
    cada3dias: "",
    checkout: "",
  },
  {
    id: 3,
    fechaCheckin: "15-ago",    // Pasado
    fechaCheckout: "18-ago",   // Check-out pendiente
    plataforma: "Airbnb",
    huesped: "Ana Gómez",
    monto: "150",
    noches: "3",
    envioInfo: "listo",
    checkin: "listo",
    cada3dias: "listo",
    checkout: "",
  },
  {
    id: 4,
    fechaCheckin: "20-ago",    // Seguimiento cada 3 días
    fechaCheckout: "23-ago",
    plataforma: "Vrbo",
    huesped: "Luis Martínez",
    monto: "180",
    noches: "3",
    envioInfo: "listo",
    checkin: "",
    cada3dias: "",
    checkout: "",
  },
];
