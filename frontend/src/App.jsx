import { useState } from "react";
import SearchBar from "./components/SearchBar";
import MovieGrid from "./components/MovieGrid";
import MovieDetail from "./components/MovieDetail";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchMovies(query) {
    if (!query.trim()) {
      setMovies([]);
      setError("Escribí el nombre de una película para buscar.");
      return;
    }

    setLoading(true);
    setError("");
    setSelectedMovie(null);

    try {
      const response = await fetch(
        `${API_URL}/api/movies/search?q=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudieron obtener las películas"
        );
      }

      setMovies(data.results || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las películas.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  async function showMovieDetails(movieId) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/movies/${movieId}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo obtener la película"
        );
      }

      setSelectedMovie(data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el detalle de la película.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteReview(reviewId) {
    const confirmDelete = window.confirm(
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

      await showMovieDetails(selectedMovie.id);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar la reseña.");
    }
  }

  function handleBack() {
    setSelectedMovie(null);
    setError("");
  }

  return (
    <div className="app">
      <header className="header">
        <h1>CineClub</h1>
        <p>Buscá películas y compartí tus reseñas</p>
      </header>

      <main className="container">
        {!selectedMovie && (
          <>
            <section className="search-section">
              <h2>Buscar películas</h2>
              <SearchBar onSearch={searchMovies} />
            </section>

            {loading && (
              <p className="status-message">
                Buscando películas...
              </p>
            )}

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            {!loading && !error && movies.length > 0 && (
              <MovieGrid
                movies={movies}
                onSelectMovie={showMovieDetails}
              />
            )}

            {!loading &&
              !error &&
              movies.length === 0 && (
                <p className="empty-message">
                  Todavía no hay películas para mostrar.
                </p>
              )}
          </>
        )}

        {selectedMovie && (
          <MovieDetail
            movie={selectedMovie}
            onBack={handleBack}
            onDeleteReview={deleteReview}
            apiUrl={API_URL}
            onMovieUpdated={setSelectedMovie}
          />
        )}

        {error && selectedMovie && (
          <p className="error-message">{error}</p>
        )}
      </main>

      <footer className="footer">
        <p>CineClub © 2026</p>
      </footer>
    </div>
  );
}

export default App;