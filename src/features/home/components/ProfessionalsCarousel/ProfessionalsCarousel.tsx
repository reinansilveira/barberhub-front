"use client";

import "./ProfessionalsCarousel.scss";

import type { Professional } from "./Professionals.types";
import { useCarouselScroll } from "./use-carousel-scroll";

interface ProfessionalsCarouselProps {
  professionals: Professional[];
}

function RatingStars({ rating }: { rating: number }) {
  const filledStars = Math.round(rating);

  return (
    <div className="professionals-carousel__stars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          aria-hidden="true"
          key={index}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={index < filledStars ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ProfessionalsCarousel({
  professionals,
}: ProfessionalsCarouselProps) {
  const { trackRef, scroll } = useCarouselScroll();

  return (
    <>
      <div className="professionals-carousel__nav">
        <button
          type="button"
          aria-label="Profissional anterior"
          onClick={() => scroll("prev")}
          className="professionals-carousel__nav-button"
        >
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Próximo profissional"
          onClick={() => scroll("next")}
          className="professionals-carousel__nav-button"
        >
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div ref={trackRef} className="professionals-carousel__track">
        {professionals.map((professional) => (
          <article
            key={professional.id}
            className="professionals-carousel__card"
          >
            <a
              href={`/profissionais/${professional.id}`}
              className="professionals-carousel__card-link"
              aria-label={`Abrir perfil de ${professional.name}`}
            />
            <div className="professionals-carousel__image-wrapper">
              <img
                src={professional.imageUrl}
                alt=""
                loading="lazy"
                className="professionals-carousel__image"
              />

              {professional.available && (
                <span className="professionals-carousel__badge">
                  <span className="professionals-carousel__badge-dot" />
                  Agenda online
                </span>
              )}
            </div>

            <div className="professionals-carousel__content">
              <h3 className="professionals-carousel__name">
                {professional.name}
              </h3>
              <span className="professionals-carousel__role">
                {professional.role}
              </span>
              <p className="professionals-carousel__description">
                {professional.description}
              </p>

              <div className="professionals-carousel__footer">
                {professional.reviewsCount ? (
                  <div
                    className="professionals-carousel__rating"
                    aria-label={`Nota ${professional.rating.toFixed(1)} de 5 em ${professional.reviewsCount} avaliações`}
                  >
                    <RatingStars rating={professional.rating} />
                    <span className="professionals-carousel__rating-value">
                      {professional.rating.toFixed(1).replace(".", ",")}
                    </span>
                  </div>
                ) : (
                  <span className="professionals-carousel__rating-value">
                    Novo na equipe
                  </span>
                )}

                <span className="professionals-carousel__link">Ver perfil</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
