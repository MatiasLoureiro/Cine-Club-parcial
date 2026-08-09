require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("CineClub API funcionando");
});

app.get("/api/movies/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      error: "Falta el parámetro de búsqueda",
    });
  }

  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query: q,
          language: "es-ES",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error al consultar TMDB:", error.message);

    res.status(500).json({
      error: "No se pudieron obtener las películas",
    });
  }
});

app.get("/api/movies/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "es-ES",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error al consultar TMDB:", error.message);

    res.status(500).json({
      error: "No se pudo obtener la película",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});