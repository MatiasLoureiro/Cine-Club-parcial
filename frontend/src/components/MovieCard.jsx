function MovieCard({ movie, onSelect }) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "Año desconocido";

  const tmdbScore = Number(movie.vote_average || 0).toFixed(1);

  return (
    <article className="movie-card">
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

      <div className="movie-info">
        <h3>{movie.title}</h3>

        <p className="movie-year">
          {releaseYear}
        </p>

        <p className="movie-rating">
          ⭐ {tmdbScore}
          <span>Puntuación TMDB</span>
        </p>

        <button
          className="details-button"
          onClick={() => onSelect(movie.id)}
        >
          Ver detalle
        </button>
      </div>
    </article>
  );
}

export default MovieCard;