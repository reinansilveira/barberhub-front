import { Rating } from "@/components/reui/rating";
import type { PublicReview } from "@/services/review";
import { buildReviewSummary } from "../professional-profile.utils";

const reviewDate = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export const ReviewsSection = ({ reviews }: { reviews: PublicReview[] }) => {
  const summary = buildReviewSummary(reviews);

  return (
    <section className="profile__card" aria-labelledby="profile-reviews-title">
      <div className="profile__section-title">
        <h2 id="profile-reviews-title">Avaliações</h2>
        {!summary.count && <span>Novas avaliações aparecerão aqui</span>}
      </div>

      {!summary.count ? (
        <div className="profile__rating-empty">
          <strong aria-hidden="true">—</strong>
          <p>Este profissional ainda não possui avaliações.</p>
        </div>
      ) : (
        <>
          <div className="reviews__summary">
            <p className="reviews__score">
              <strong>{summary.average.toFixed(1).replace(".", ",")}</strong>
              <span>
                {summary.count}{" "}
                {summary.count === 1 ? "avaliação" : "avaliações"}
              </span>
            </p>
            <ul className="reviews__bars" aria-label="Distribuição das notas">
              {summary.breakdown.map(({ stars, count, percentage }) => (
                <li className="reviews__bar-row" key={stars}>
                  <span>
                    {stars}
                    <span aria-hidden="true">★</span>
                    <span className="sr-only"> estrelas:</span>
                  </span>
                  <span className="reviews__bar-track" aria-hidden="true">
                    <span
                      className="reviews__bar-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </span>
                  <span>{count}</span>
                </li>
              ))}
            </ul>
          </div>

          <ul className="reviews">
            {summary.withComment.map((review) => (
              <li className="review" key={review.id}>
                <div className="review__head">
                  <div className="review__author">
                    <strong>Cliente verificado</strong>
                    <span>{reviewDate.format(new Date(review.createdAt))}</span>
                  </div>
                  <Rating rating={review.rating} className="review__stars" />
                </div>
                <p className="review__comment">{review.comment}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};
