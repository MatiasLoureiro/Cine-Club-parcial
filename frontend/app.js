const API_URL = "http://localhost:3001";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const moviesContainer = document.getElementById("moviesContainer");

searchButton.addEventListener("click", searchMovies);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchMovies();
  }
});

async function searchMovies() {
  moviesContainer.classList.remove("detail-view");
  const query = searchInput.value.trim();

  if (!query) {
    moviesContainer.innerHTML = `
      <p class="empty-message">
        Escribí el nombre de una película para buscar.
      </p>
    `;
    return;
  }

  moviesContainer.innerHTML = `
    <p class="empty-message">
      Buscando películas...
    </p>
  `;

  try {
    const response = await fetch(
      `${API_URL}/api/movies/search?q=${encodeURIComponent(query)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudieron obtener las películas");
    }

    displayMovies(data.results);
  } catch (error) {
    console.error("Error:", error);

    moviesContainer.innerHTML = `
      <p class="empty-message">
        No se pudieron cargar las películas.
      </p>
    `;
  }
}

function displayMovies(movies) {
  moviesContainer.classList.remove("detail-view");

  if (!movies || movies.length === 0) {
    moviesContainer.innerHTML = `
      <p class="empty-message">
        No se encontraron películas.
      </p>
    `;
    return;
  }

  moviesContainer.innerHTML = movies
    .map((movie) => {
      const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "";

      const releaseYear = movie.release_date
        ? movie.release_date.substring(0, 4)
        : "Año desconocido";

      const overview = movie.overview
        ? movie.overview
        : "No hay descripción disponible.";

      return `
        <article class="movie-card">
          ${
            poster
              ? `<img src="${poster}" alt="Póster de ${movie.title}">`
              : `<div class="no-poster">Sin póster</div>`
          }

          <div class="movie-info">
            <h3>${movie.title}</h3>

            <p class="movie-year">
              ${releaseYear}
            </p>

            <p class="movie-rating">
              ⭐ ${movie.vote_average.toFixed(1)}
            </p>

            <p class="movie-overview">
              ${overview}
            </p>

            <button
              class="details-button"
              onclick="showMovieDetails(${movie.id})"
            >
              Ver detalle
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

async function showMovieDetails(movieId) {
  moviesContainer.classList.add("detail-view");
  moviesContainer.innerHTML = `
    <p class="empty-message">
      Cargando detalle...
    </p>
  `;

  try {
    const response = await fetch(`${API_URL}/api/movies/${movieId}`);

    const movie = await response.json();

    if (!response.ok) {
      throw new Error(movie.error || "No se pudo obtener la película");
    }

    displayMovieDetails(movie);
  } catch (error) {
    console.error("Error:", error);

    moviesContainer.innerHTML = `
      <p class="empty-message">
        No se pudo cargar el detalle de la película.
      </p>
    `;
  }
}

function displayMovieDetails(movie) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  const genres =
    movie.genres && movie.genres.length > 0
      ? movie.genres.map((genre) => genre.name).join(", ")
      : "No disponibles";

  const releaseDate = movie.release_date || "Fecha desconocida";

  const reviews = movie.reviews || [];

  const reviewsHTML =
    reviews.length > 0
      ? reviews
          .map(
            (review) => `
              <article class="review-card">
                <div class="review-header">
                  <div>
                    <h4>${review.author}</h4>
                    <p>⭐ ${review.score}/5</p>
                  </div>

                  <button
                    class="delete-review-button"
                    onclick="deleteReview(${review.id}, ${movie.id})"
                  >
                    Eliminar
                  </button>
                </div>

                <p>${review.comment}</p>
              </article>
            `
          )
          .join("")
      : `<p class="empty-message">Todavía no hay reseñas.</p>`;

  moviesContainer.innerHTML = `
    <section class="movie-detail">

      <button class="back-button" onclick="searchMovies()">
        ← Volver a resultados
      </button>

      <div class="movie-detail-content">

        <div class="movie-detail-poster">
          ${
            poster
              ? `<img src="${poster}" alt="Póster de ${movie.title}">`
              : `<div class="no-poster">Sin póster</div>`
          }
        </div>

        <div class="movie-detail-info">

          <h2>${movie.title}</h2>

          <p>
            <strong>Fecha de estreno:</strong>
            ${releaseDate}
          </p>

          <p>
            <strong>Géneros:</strong>
            ${genres}
          </p>

          <p>
            <strong>Puntuación TMDB:</strong>
            ⭐ ${movie.vote_average.toFixed(1)}
          </p>

          <p>
            <strong>Promedio CineClub:</strong>
            ⭐ ${movie.avgScore.toFixed(1)}
          </p>

          <p>
            <strong>Duración:</strong>
            ${
              movie.runtime
                ? `${movie.runtime} minutos`
                : "No disponible"
            }
          </p>

          <h3>Sinopsis</h3>

          <p class="movie-detail-overview">
            ${movie.overview || "No hay descripción disponible."}
          </p>

        </div>
      </div>

      <section class="reviews-section">

        <h3>Reseñas de CineClub</h3>

        <div class="reviews-list">
          ${reviewsHTML}
        </div>

        <div class="review-form">

          <h3>Dejá tu reseña</h3>

          <form id="reviewForm">

            <label for="reviewAuthor">
              Nombre
            </label>

            <input
              id="reviewAuthor"
              type="text"
              placeholder="Tu nombre"
              required
            >

            <label for="reviewScore">
              Puntuación
            </label>

            <select id="reviewScore" required>
              <option value="">Seleccioná una puntuación</option>
              <option value="1">⭐ 1</option>
              <option value="2">⭐ 2</option>
              <option value="3">⭐ 3</option>
              <option value="4">⭐ 4</option>
              <option value="5">⭐ 5</option>
            </select>

            <label for="reviewComment">
              Comentario
            </label>

            <textarea
              id="reviewComment"
              rows="4"
              placeholder="Escribí tu opinión..."
              required
            ></textarea>

            <button type="submit">
              Publicar reseña
            </button>

          </form>

          <p id="reviewMessage"></p>

        </div>

      </section>

    </section>
  `;

  const reviewForm = document.getElementById("reviewForm");

  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();

    submitReview(movie.id);
  });
}

async function submitReview(movieId) {
  const author = document.getElementById("reviewAuthor").value.trim();
  const score = Number(document.getElementById("reviewScore").value);
  const comment = document.getElementById("reviewComment").value.trim();
  const message = document.getElementById("reviewMessage");

  if (!author || !score || !comment) {
    message.textContent = "Completá todos los campos.";
    return;
  }

  message.textContent = "Publicando reseña...";

  try {
    const response = await fetch(
      `${API_URL}/api/movies/${movieId}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author,
          score,
          comment,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo publicar la reseña");
    }

    message.textContent = "¡Reseña publicada correctamente!";

    await showMovieDetails(movieId);
  } catch (error) {
    console.error("Error:", error);

    message.textContent = "No se pudo publicar la reseña.";
  }
}

async function deleteReview(reviewId, movieId) {
  const confirmDelete = confirm(
    "¿Seguro que querés eliminar esta reseña?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/reviews/${reviewId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "No se pudo eliminar la reseña"
      );
    }

    await showMovieDetails(movieId);
  } catch (error) {
    console.error("Error:", error);

    alert("No se pudo eliminar la reseña.");
  }
}