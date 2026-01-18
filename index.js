const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("MCP Server activo 🧠🦴");
});
app.get("/mcp", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write(`data: MCP conectado correctamente\n\n`);

  const interval = setInterval(() => {
    res.write(`data: ping ${new Date().toISOString()}\n\n`);
  }, 3000);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});


// Endpoint MCP (SSE)
app.get("/mcp", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write("event: ready\n");
  res.write("data: MCP listo\n\n");

  const keepAlive = setInterval(() => {
    res.write("event: ping\ndata: ok\n\n");
  }, 15000);

  req.on("close", () => {
    clearInterval(keepAlive);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("MCP server corriendo en puerto " + PORT);
});
