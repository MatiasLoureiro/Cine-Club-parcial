import { useState } from "react";

function ReviewForm({
  movieId,
  apiUrl,
  onReviewCreated,
}) {
  const [author, setAuthor] = useState("");
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!author.trim() || !score || !comment.trim()) {
      setMessage("Completá todos los campos.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${apiUrl}/api/movies/${movieId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author: author.trim(),
            score: Number(score),
            comment: comment.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo publicar la reseña"
        );
      }

      setAuthor("");
      setScore("");
      setComment("");
      setMessage("¡Reseña publicada correctamente!");

      await onReviewCreated();
    } catch (error) {
      console.error(error);
      setMessage("No se pudo publicar la reseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="review-form">
      <h3>Dejá tu reseña</h3>

      <form onSubmit={handleSubmit}>
        <label htmlFor="reviewAuthor">
          Nombre
        </label>

        <input
          id="reviewAuthor"
          type="text"
          value={author}
          onChange={(event) =>
            setAuthor(event.target.value)
          }
          placeholder="Tu nombre"
        />

        <label htmlFor="reviewScore">
          Puntuación
        </label>

        <select
          id="reviewScore"
          value={score}
          onChange={(event) =>
            setScore(event.target.value)
          }
        >
          <option value="">
            Seleccioná una puntuación
          </option>
          <option value="1">⭐ 1</option>
          <option value="2">⭐ 2</option>
          <option value="3">⭐ 3</option>
          <option value="4">⭐ 4</option>
          <option value="5">⭐ 5</option>
        </select>

        <label htmlFor="reviewComment">
          Comentario
        </label>

        <textarea
          id="reviewComment"
          rows="4"
          value={comment}
          onChange={(event) =>
            setComment(event.target.value)
          }
          placeholder="Escribí tu opinión..."
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Publicando..."
            : "Publicar reseña"}
        </button>
      </form>

      {message && (
        <p className="review-message">
          {message}
        </p>
      )}
    </div>
  );
}

export default ReviewForm;