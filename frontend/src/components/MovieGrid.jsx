import MovieCard from "./MovieCard";

function MovieGrid({ movies, onSelectMovie }) {
  return (
    <section className="movies-section">
      <h2>Películas encontradas</h2>

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
