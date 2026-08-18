import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";

function MovieDetail({
  movie,
  onBack,
  onDeleteReview,
  apiUrl,
  onMovieUpdated,
}) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  const genres =
    movie.genres && movie.genres.length > 0
      ? movie.genres
          .map((genre) => genre.name)
          .join(", ")
      : "No disponibles";

  async function refreshMovie() {
    try {
      const response = await fetch(
        `${apiUrl}/api/movies/${movie.id}`
      );

      const data = await response.json();

      if (response.ok) {
        onMovieUpdated(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="movie-detail">
      <button
        className="back-button"
        onClick={onBack}
      >
        ← Volver a resultados
      </button>

      <div className="movie-detail-content">
        <div className="movie-detail-poster">
          {poster ? (
            <img
              src={poster}
              alt={`Póster de ${movie.title}`}
            />
          ) : (
            <div className="no-poster">
              Sin póster
            </div>
          )}
        </div>

        <div className="movie-detail-info">
          <h2>{movie.title}</h2>

          <p>
            <strong>Fecha de estreno:</strong>{" "}
            {movie.release_date ||
              "Fecha desconocida"}
          </p>

          <p>
            <strong>Géneros:</strong>{" "}
            {genres}
          </p>

          <p>
            <strong>Puntuación TMDB:</strong>{" "}
            ⭐ {Number(movie.vote_average).toFixed(1)}
          </p>

          <p>
            <strong>Promedio CineClub:</strong>{" "}
            ⭐ {Number(movie.avgScore).toFixed(1)}
          </p>

          <p>
            <strong>Duración:</strong>{" "}
            {movie.runtime
              ? `${movie.runtime} minutos`
              : "No disponible"}
          </p>

          <h3>Sinopsis</h3>

          <p className="movie-detail-overview">
            {movie.overview ||
              "No hay descripción disponible."}
          </p>
        </div>
      </div>

      <section className="reviews-section">
        <h3>Reseñas de CineClub</h3>

        <ReviewList
          reviews={movie.reviews}
          onDelete={onDeleteReview}
        />

        <ReviewForm
          movieId={movie.id}
          apiUrl={apiUrl}
          onReviewCreated={refreshMovie}
        />
      </section>
    </section>
  );
}

export default MovieDetail;