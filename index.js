const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

console.log("🔥 APP INICIANDO");

// Ruta raíz (health / prueba)
app.get("/", (req, res) => {
  res.send("Servidor MCP activo ✅");
});

// Ruta MCP (SSE)
app.get("/mcp", (req, res) => {
  res.status(200);
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  res.flushHeaders();

  console.log("🧠 Cliente MCP conectado");

  // Evento inmediato (evita timeout)
  res.write(`event: ready\ndata: MCP conectado correctamente\n\n`);

  // Evento inicial
  res.write(
    `event: load_model\ndata: ${JSON.stringify({
      modelo: "femur",
      calidad: "alta",
      vista: "anatomica"
    })}\n\n`
  );

  // Ping cada 15 segundos
  const pingInterval = setInterval(() => {
    res.write(`event: ping\ndata: ${Date.now()}\n\n`);
  }, 15000);

  // Cleanup
  req.on("close", () => {
    clearInterval(pingInterval);
    console.log("❌ Cliente MCP desconectado");
  });
});

// Arranque del servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor MCP corriendo en puerto ${PORT}`);
});
