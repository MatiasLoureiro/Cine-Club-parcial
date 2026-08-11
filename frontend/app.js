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

      return `
        <article class="movie-card">
          ${
            poster
              ? `<img src="${poster}" alt="Póster de ${movie.title}">`
              : `<div class="no-poster">Sin póster</div>`
          }

          <div class="movie-info">
            <h3>${movie.title}</h3>
            <p>
              ${movie.release_date || "Fecha desconocida"}
            </p>
          </div>
        </article>
      `;
    })
    .join("");
}