import { Rating } from "@/components/reui/rating";
import { BUSINESS } from "@/config/business";
import { findReviews } from "@/services/review";
import { cn } from "@/utils/class-names";
import "./Testimonials.scss";

const MAX_TESTIMONIALS = 8;
const MIN_FOR_MARQUEE = 3;

const reviewDate = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

export default async function Testimonials() {
  const reviews = (await findReviews().catch(() => []))
    .filter((review) => review.active && review.comment?.trim())
    .slice(0, MAX_TESTIMONIALS);

  if (!reviews.length) return null;

  const loop = reviews.length >= MIN_FOR_MARQUEE;
  const cards = loop ? [...reviews, ...reviews] : reviews;

  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      <div className="wrapper testimonials__header">
        <span className="testimonials__label">Depoimentos</span>
        <h2 className="testimonials__title" id="testimonials-title">
          O que dizem nossos clientes
        </h2>
        <p className="testimonials__subtitle">
          Avaliações de clientes atendidos na {BUSINESS.name}
        </p>
      </div>

      <div className="testimonials__marquee">
        <ul
          className={cn(
            "testimonials__track",
            !loop && "testimonials__track--static",
          )}
        >
          {cards.map((review, index) => (
            <li
              key={`${review.id}-${index}`}
              className="testimonials__card"
              aria-hidden={index >= reviews.length ? true : undefined}
            >
              <Rating rating={review.rating} className="testimonials__stars" />
              <p className="testimonials__quote">
                &ldquo;{review.comment}&rdquo;
              </p>
              <div className="testimonials__author">
                <span className="testimonials__avatar" aria-hidden="true">
                  {review.rating}★
                </span>
                <div className="testimonials__author-info">
                  <span className="testimonials__name">Cliente verificado</span>
                  <span className="testimonials__role">
                    {reviewDate.format(new Date(review.createdAt))}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
