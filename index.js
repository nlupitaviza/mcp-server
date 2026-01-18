const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Ruta raíz (para Render / salud)
app.get("/", (req, res) => {
  res.send("MCP Server activo 🧠🦴");
});

// Ruta MCP (SSE)
app.get("/mcp", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  console.log("Cliente MCP conectado");

  // Evento inicial: cargar fémur
  res.write(
    `event: load_model\ndata: ${JSON.stringify({
      modelo: "femur",
      calidad: "alta",
      vista: "anatomica"
    })}\n\n`
  );

  // Ping para mantener viva la conexión
  const keepAlive = setInterval(() => {
    res.write(`event: ping\ndata: ${Date.now()}\n\n`);
  }, 15000);

  req.on("close", () => {
    clearInterval(keepAlive);
    console.log("Cliente MCP desconectado");
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`Servidor MCP corriendo en puerto ${PORT}`);
});
