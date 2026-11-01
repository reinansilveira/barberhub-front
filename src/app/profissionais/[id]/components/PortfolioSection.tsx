"use client";

import { createPortal } from "react-dom";
import { useImageError } from "@/hooks/use-image-error";
import { usePortfolioLightbox } from "../hooks/use-portfolio-lightbox";

const PortfolioImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const image = useImageError();

  if (image.failed) return null;

  return (
    <img
      alt={alt}
      className={className}
      loading="lazy"
      onError={image.onError}
      src={src}
    />
  );
};

export const PortfolioSection = ({
  images,
  professionalName,
}: {
  images: string[];
  professionalName: string;
}) => {
  const alt = `Trabalho de ${professionalName}`;
  const { closeButtonRef, dialogRef, ...lightbox } = usePortfolioLightbox();
  const openItem =
    lightbox.openIndex === null ? null : images[lightbox.openIndex];

  return (
    <section className="profile__card">
      <div className="profile__section-title">
        <h2>Portfólio</h2>
        <span>Trabalhos do profissional</span>
      </div>

      {!images.length && (
        <p className="profile__empty">
          {professionalName} ainda não publicou trabalhos.
        </p>
      )}
      <div className="portfolio">
        {images.map((src, index) => (
          <button
            className="portfolio__item"
            key={`${src}-${index}`}
            onClick={() => lightbox.open(index)}
            type="button"
            aria-label={`Ampliar trabalho ${index + 1} de ${images.length}`}
          >
            <PortfolioImage alt="" src={src} />

            <span className="portfolio__overlay">
              <svg
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {openItem &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            aria-label={`Imagem do portfólio de ${professionalName}`}
            aria-modal="true"
            className="lightbox"
            onClick={(event) => {
              if (event.target === event.currentTarget) lightbox.close();
            }}
            ref={dialogRef}
            role="dialog"
            tabIndex={-1}
          >
            <button
              aria-label="Fechar"
              className="lightbox__close"
              onClick={lightbox.close}
              ref={closeButtonRef}
              type="button"
            >
              <svg
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <PortfolioImage
              alt={alt}
              className="lightbox__image"
              src={openItem}
            />
          </div>,
          document.body,
        )}
    </section>
  );
};
