function ReviewList({ reviews, onDelete }) {
  if (!reviews || reviews.length === 0) {
    return (
      <p className="empty-message">
        Todavía no hay reseñas.
      </p>
    );
  }

  return (
    <div className="reviews-list">
      {reviews.map((review) => (
        <article
          className="review-card"
          key={review.id}
        >
          <div className="review-header">
            <div>
              <h4>{review.author}</h4>

              <p>
                ⭐ {review.score}/5
              </p>
            </div>

            <button
              className="delete-review-button"
              onClick={() => onDelete(review.id)}
            >
              Eliminar
            </button>
          </div>

          <p>{review.comment}</p>
        </article>
      ))}
    </div>
  );
}

export default ReviewList;