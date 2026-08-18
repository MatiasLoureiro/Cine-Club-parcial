import MovieCard from "./MovieCard";

function MovieGrid({ movies, onSelectMovie }) {
  return (
    <section className="movies-section">
      <div className="movies-section-header">
        <h2>Películas encontradas</h2>
        <span>{movies.length} resultados</span>
      </div>

      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelect={onSelectMovie}
          />
        ))}
      </div>
    </section>
  );
}

export default MovieGrid;