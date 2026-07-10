"use client";

import { useRef } from "react";
import type { Professional } from "./Professionals.types";
import styles from "./ProfessionalsCarousel.module.scss";

interface ProfessionalsCarouselProps {
  professionals: Professional[];
}

function RatingStars({ rating }: { rating: number }) {
  const filledStars = Math.round(rating);

  return (
    <div
      className={styles["professionals-carousel__stars"]}
      aria-label={`Avaliação ${rating} de 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
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
  const trackRef = useRef<HTMLDivElement>(null);

  function handleScroll(direction: "prev" | "next") {
    const track = trackRef.current;
    if (!track) return;

    const amount = track.clientWidth * 0.85;

    track.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <>
      <div className={styles["professionals-carousel__nav"]}>
        <button
          type="button"
          aria-label="Profissional anterior"
          onClick={() => handleScroll("prev")}
          className={styles["professionals-carousel__nav-button"]}
        >
          <svg
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
          onClick={() => handleScroll("next")}
          className={styles["professionals-carousel__nav-button"]}
        >
          <svg
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

      <div ref={trackRef} className={styles["professionals-carousel__track"]}>
        {professionals.map((professional) => (
          <article
            key={professional.id}
            className={styles["professionals-carousel__card"]}
          >
            <div className={styles["professionals-carousel__image-wrapper"]}>
              <img
                src={professional.imageUrl}
                alt={professional.name}
                loading="lazy"
                className={styles["professionals-carousel__image"]}
              />

              {professional.available && (
                <span className={styles["professionals-carousel__badge"]}>
                  <span
                    className={styles["professionals-carousel__badge-dot"]}
                  />
                  Disponível hoje
                </span>
              )}
            </div>

            <div className={styles["professionals-carousel__content"]}>
              <h3 className={styles["professionals-carousel__name"]}>
                {professional.name}
              </h3>
              <span className={styles["professionals-carousel__role"]}>
                {professional.role}
              </span>
              <p className={styles["professionals-carousel__description"]}>
                {professional.description}
              </p>

              <div className={styles["professionals-carousel__footer"]}>
                <div className={styles["professionals-carousel__rating"]}>
                  <RatingStars rating={professional.rating} />
                  <span
                    className={styles["professionals-carousel__rating-value"]}
                  >
                    {professional.rating.toFixed(1)}
                  </span>
                </div>

                <a
                  href={`/profissionais/${professional.id}`}
                  className={styles["professionals-carousel__link"]}
                >
                  Ver agenda
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
