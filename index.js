const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Ruta base (solo para comprobar que el server vive)
app.get("/", (req, res) => {
  res.send("MCP Server activo 🧠🦴");
});

// Ruta MCP con Server-Sent Events (SSE)
app.get("/mcp", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Handshake inicial MCP
  res.write(`event: ready\ndata: MCP conectado correctamente\n\n`);

  // Keep-alive
  const keepAlive = setInterval(() => {
    res.write(`event: ping\ndata: ${Date.now()}\n\n`);
  }, 15000);

  // Cierre limpio
  req.on("close", () => {
    clearInterval(keepAlive);
    res.end();
    console.log("Cliente MCP desconectado");
  });
});

// Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("MCP server corriendo en puerto " + PORT);
});
