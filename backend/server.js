const express = require("express");

const app = express();

const PORT = 3001;

app.get("/", (req, res) => {
  res.send("CineClub API funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});