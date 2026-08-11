require("dotenv").config();

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3001;
const reviews = [];

// Servir el frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Buscar películas
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

// Obtener detalle de una película
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

    const movieReviews = reviews.filter(
      (review) => review.tmdbId === Number(id)
    );

    const avgScore =
      movieReviews.length === 0
        ? 0
        : movieReviews.reduce((sum, review) => sum + review.score, 0) /
          movieReviews.length;

    res.json({
      ...response.data,
      reviews: movieReviews,
      avgScore,
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        error: "Película no encontrada",
      });
    }

    console.error("Error al consultar TMDB:", error.message);

    res.status(500).json({
      error: "No se pudo obtener la película",
    });
  }
});

// Crear una reseña
app.post("/api/movies/:tmdbId/reviews", express.json(), (req, res) => {
  const { tmdbId } = req.params;
  const { author, score, comment } = req.body;

  if (!author || !score || !comment) {
    return res.status(400).json({
      error: "author, score y comment son obligatorios",
    });
  }

  const numericScore = Number(score);

  if (
    numericScore < 1 ||
    numericScore > 5 ||
    !Number.isInteger(numericScore)
  ) {
    return res.status(400).json({
      error: "score debe ser un número entero entre 1 y 5",
    });
  }

  const review = {
    id: Date.now(),
    tmdbId: Number(tmdbId),
    author,
    score: numericScore,
    comment,
  };

  reviews.push(review);

  res.status(201).json(review);
});

// Eliminar una reseña
app.delete("/api/reviews/:reviewId", (req, res) => {
  const reviewId = Number(req.params.reviewId);

  const index = reviews.findIndex(
    (review) => review.id === reviewId
  );

  if (index === -1) {
    return res.status(404).json({
      error: "Reseña no encontrada",
    });
  }

  const deletedReview = reviews.splice(index, 1);

  res.json(deletedReview[0]);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});