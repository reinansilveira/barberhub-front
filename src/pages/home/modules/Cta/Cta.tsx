"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import styles from "./Cta.module.scss";

// Vídeo temporário (livre, sem marca d'água — licença Mixkit).
// Troque por material próprio da barbearia quando tiver.
const CTA_VIDEO_URL = "/videos/barbearia-video.mp4";
const CTA_POSTER_URL =
  "https://assets.mixkit.co/videos/43236/43236-thumb-360-0.jpg";

interface Feature {
  icon: ReactNode;
  label: string;
  value: string;
}

const CLOCK_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SHIELD_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5Z" />
  </svg>
);

const USER_LOCK_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="7" r="4" />
    <path d="M2 21v-2a5 5 0 0 1 5-5h1.5" />
    <rect x="14" y="12" width="8" height="7" rx="1.5" />
    <path d="M16 12v-1.5a2 2 0 1 1 4 0V12" />
  </svg>
);

const FEATURES: Feature[] = [
  { icon: CLOCK_ICON, label: "Agendamento em", value: "Menos de 60s" },
  { icon: SHIELD_ICON, label: "Confirmação", value: "100% segura" },
  { icon: USER_LOCK_ICON, label: "Sem cadastro", value: "Sem senha" },
];

const WHATSAPP_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2Zm0 18.15h-.01a8.22 8.22 0 0 1-4.2-1.15l-.3-.18-3.14.82.84-3.06-.2-.31a8.21 8.21 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.22 8.24Zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.38-1.99-1.22-.74-.65-1.23-1.46-1.38-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.83-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.02 2.6c.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" />
  </svg>
);

export default function Cta() {
  const [isVideoActive, setIsVideoActive] = useState(false);

  return (
    <section className={styles.cta} onMouseEnter={() => setIsVideoActive(true)}>
      <div className={styles.cta__background}>
        <img
          src={CTA_POSTER_URL}
          alt=""
          aria-hidden="true"
          className={`${styles.cta__poster} ${
            isVideoActive ? styles["cta__poster--hidden"] : ""
          }`}
        />

        {isVideoActive && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={CTA_POSTER_URL}
            className={styles.cta__video}
          >
            <source src={CTA_VIDEO_URL} type="video/mp4" />
          </video>
        )}

        <div className={styles.cta__overlay} />
      </div>

      <div className={`wrapper ${styles.cta__inner}`}>
        <span className={styles.cta__label}>Agende agora</span>

        <h2 className={styles.cta__title}>
          Pronto para o
          <br />
          próximo corte?
        </h2>

        <p className={styles.cta__subtitle}>
          Reserve seu horário em menos de 60 segundos. Sem cadastro, sem
          complicação. Apenas você e o melhor corte da cidade.
        </p>

        <div className={styles.cta__actions}>
          <a href="/agendar" className={styles.cta__primary}>
            Agendar meu horário
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>

          <a
            href="https://wa.me/5579999999999"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta__secondary}
          >
            {WHATSAPP_ICON}
            WhatsApp
          </a>
        </div>

        <div className={styles.cta__features}>
          {FEATURES.map(({ icon, label, value }) => (
            <div key={label} className={styles.cta__feature}>
              <span className={styles.cta__feature_icon}>{icon}</span>
              <span className={styles.cta__feature_text}>
                <span className={styles.cta__feature_label}>{label}</span>
                <strong className={styles.cta__feature_value}>{value}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
