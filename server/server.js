const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Proxy endpoint
app.get("/proxy", async (req, res) => {
  const icalUrl = req.query.url;
  if (!icalUrl) return res.status(400).send("Falta url");

  try {
    const response = await fetch(icalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AirbnbChecker/1.0)"
      }
    });

    if (!response.ok) {
      console.error("Error al obtener calendario:", response.status, response.statusText);
      return res.status(response.status).send("No se pudo obtener el calendario");
    }

    const text = await response.text();
    res.send(text);
  } catch (error) {
    console.error("Error fetching ICS:", error.message);
    res.status(500).send("Error al obtener el calendario");
  }
});

// Sirve la carpeta de React (luego de hacer `npm run build`)
app.use(express.static(path.join(__dirname, "../build")));

// Catch-all para rutas del frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

// Puerto para Replit
const PORT = process.env.PORT || 4004;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
