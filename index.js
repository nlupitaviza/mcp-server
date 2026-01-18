const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Ruta raíz (para Render / salud)
app.get("/", (req, res) => {
  res.send("MCP Server activo 🧠🦴");
});

app.get("/mcp", (req, res) => {
  res.status(200);
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  res.flushHeaders();
  console.log("Cliente MCP conectado");

  // Mensaje inmediato (clave para evitar timeout)
  res.write(`event: ready\ndata: connected\n\n`);

  // Evento real: cargar fémur
  res.write(
    `event: load_model\ndata: ${JSON.stringify({
      modelo: "femur",
      calidad: "alta",
      vista: "anatomica"
    })}\n\n`
  );

  // Mantener viva la conexión
  const keepAlive = setInterval(() => {
    res.write(`event: ping\ndata: ${Date.now()}\n\n`);
  }, 15000);

  req.on("close", () => {
    clearInterval(keepAlive);
    console.log("Cliente MCP desconectado");
    res.end();
  });
});

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
