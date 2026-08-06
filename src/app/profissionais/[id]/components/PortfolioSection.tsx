"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const FALLBACK_IMAGES = [
  "https://picsum.photos/seed/barber-1/400/300",
  "https://picsum.photos/seed/barber-2/400/300",
  "https://picsum.photos/seed/barber-3/400/300",
  "https://picsum.photos/seed/barber-4/400/300",
  "https://picsum.photos/seed/barber-5/400/300",
  "https://picsum.photos/seed/barber-6/400/300",
];

const MIN_ITEMS = 6;

const PortfolioImage = ({
  src,
  fallbackSrc,
  alt,
  className,
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <img
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setCurrentSrc(fallbackSrc)}
      src={currentSrc}
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const padCount = Math.max(0, MIN_ITEMS - images.length);
  const portfolioImages = [
    ...images.map((src, index) => ({
      src,
      fallbackSrc: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    })),
    ...FALLBACK_IMAGES.slice(0, padCount).map((src) => ({ src, fallbackSrc: src })),
  ];

  useEffect(() => {
    if (openIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [openIndex]);

  return (
    <section className="card">
      <div className="sectionTitle">
        <h2>Portfólio</h2>
        <span>Trabalhos do profissional</span>
      </div>

      <div className="portfolio">
        {portfolioImages.map((item, index) => (
          <button
            className="portfolioItem"
            key={`${item.src}-${index}`}
            onClick={() => setOpenIndex(index)}
            type="button"
          >
            <PortfolioImage alt={alt} fallbackSrc={item.fallbackSrc} src={item.src} />

            <span className="portfolioOverlay">
              <svg fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="lightbox" onClick={() => setOpenIndex(null)}>
            <button
              aria-label="Fechar"
              className="lightboxClose"
              onClick={() => setOpenIndex(null)}
              type="button"
            >
              <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <PortfolioImage
              alt={alt}
              className="lightboxImage"
              fallbackSrc={portfolioImages[openIndex].fallbackSrc}
              src={portfolioImages[openIndex].src}
            />
          </div>,
          document.body,
        )}
    </section>
  );
};