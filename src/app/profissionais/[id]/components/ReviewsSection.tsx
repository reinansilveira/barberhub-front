import Image from "next/image";

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  comment: string;
  serviceTag?: string;
}

export interface RatingBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export const ReviewsSection = ({
  averageRating,
  reviewCount,
  ratingBreakdown,
  reviews,
}: {
  averageRating?: number;
  reviewCount?: number;
  ratingBreakdown?: RatingBreakdown;
  reviews?: Review[];
}) => {
  const hasReviews = Boolean(reviews?.length);

  return (
    <section className="card">
      <div className="sectionTitle">
        <h2>Avaliações</h2>
        {!hasReviews && <span>Novas avaliações aparecerão aqui</span>}
      </div>

      {!hasReviews && (
        <div className="ratingEmpty">
          <strong>—</strong>
          <p>Este profissional ainda não possui avaliações.</p>
        </div>
      )}

      {hasReviews && (
        <>
          <div className="ratingSummary">
            <div className="ratingScore">
              <strong>{(averageRating ?? 0).toFixed(1)}</strong>
              <span>{reviewCount ?? reviews!.length} avaliações</span>
            </div>

            {ratingBreakdown && (
              <div className="ratingBars">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingBreakdown[star as keyof RatingBreakdown] ?? 0;
                  const total = Math.max(reviewCount ?? reviews!.length, 1);
                  const percentage = Math.round((count / total) * 100);

                  return (
                    <div className="ratingBarRow" key={star}>
                      <span>{star}★</span>
                      <div className="ratingBarTrack">
                        <div className="ratingBarFill" style={{ width: `${percentage}%` }} />
                      </div>
                      <span>{count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="reviews">
            {reviews!.map((review) => (
              <article className="review" key={review.id}>
                <div className="reviewHead">
                  <Image className="reviewAvatar" src={review.authorAvatar} alt={review.authorName} width={48} height={48} />
                  <div className="reviewAuthor">
                    <strong>{review.authorName}</strong>
                    <span>{review.date}</span>
                  </div>
                  <span className="reviewStars">{"★".repeat(review.rating)}</span>
                </div>
                <p className="reviewComment">{review.comment}</p>
                {review.serviceTag && <span className="reviewTag">{review.serviceTag}</span>}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
};