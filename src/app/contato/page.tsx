import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page/ContentPage";
import {
  BUSINESS,
  instagramUrl,
  whatsappLabel,
  whatsappUrl,
} from "@/config/business";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a ${BUSINESS.name} pelo WhatsApp, e-mail ou Instagram.`,
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.address)}`;

export default function ContatoPage() {
  return (
    <ContentPage
      eyebrow="Contato"
      title="Fale com a gente"
      description="Tire dúvidas, remarque ou peça ajuda com o seu agendamento."
    >
      <ul className="content-page__cards">
        <li className="content-page__card">
          <h2>WhatsApp</h2>
          <p>O jeito mais rápido de falar com a barbearia.</p>
          <a
            href={whatsappUrl("Olá! Preciso de ajuda com um agendamento.")}
            className="content-page__button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {whatsappLabel}
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </li>
        <li className="content-page__card">
          <h2>E-mail</h2>
          <p>Respondemos em até um dia útil.</p>
          <a
            href={`mailto:${BUSINESS.email}`}
            className="content-page__button content-page__button--secondary"
          >
            {BUSINESS.email}
          </a>
        </li>
        <li className="content-page__card">
          <h2>Endereço</h2>
          <p>
            {BUSINESS.address}
            <br />
            {BUSINESS.openingHours}
          </p>
          <a
            href={mapsUrl}
            className="content-page__button content-page__button--secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver no mapa
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </li>
        <li className="content-page__card">
          <h2>Instagram</h2>
          <p>Acompanhe os trabalhos da equipe.</p>
          <a
            href={instagramUrl}
            className="content-page__button content-page__button--secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            @{BUSINESS.instagram}
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </li>
      </ul>
    </ContentPage>
  );
}
