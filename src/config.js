// src/config.js
export const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://airbnbchecker-production.up.railway.app"
  : "http://localhost:4004";
