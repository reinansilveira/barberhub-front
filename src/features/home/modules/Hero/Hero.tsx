import Image from "next/image";
import "./Hero.scss";
import heroBg from "@/assets/images/hero.png";
import BookingCard from "../../components/Bookingcard/Bookingcard";
import { findAllProfessionals } from "@/services/professional";


const WHATSAPP_NUMBER = "(79) 9 9999-9999";

export default async function Hero() {
  const professionals = await findAllProfessionals(true).catch((err) => {
    console.error("Erro ao buscar profissionais:", err);
    return [];
  });

  return (
    <section className="hero">
      <div className="hero__background">
        <Image
          src={heroBg}
          alt="Barbeiro finalizando o corte de um cliente"
          fill
          priority
          className="hero__background-image"
        />
        <div className="hero__overlay" />
      </div>

      <div className="wrapper hero__inner">
        <div className="hero__content">
          <span className="hero__label">
            Agendamento sem complicação
          </span>

          <h1 className="hero__title">Seu corte perfeito.</h1>

          <p className="hero__subtitle">
            Agende em menos de 1 minuto,
            <br />
            sem cadastro.
          </p>

          <p className="hero__description">
            Escolha o profissional, veja os slots disponíveis e confirme com seu
            WhatsApp ou e-mail. Simples, rápido e seguro.
          </p>

          <div className="hero__actions">
            <a href="/agendar" className="hero__cta">
              Começar agora
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
              href={`https://wa.me/55${WHATSAPP_NUMBER.replace(/\D/g, "")}`}
              className="hero__whatsapp"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="hero__whatsapp-icon"
              >
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2Zm0 18.15h-.01a8.22 8.22 0 0 1-4.2-1.15l-.3-.18-3.14.82.84-3.06-.2-.31a8.21 8.21 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.22 8.24Zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.38-1.99-1.22-.74-.65-1.23-1.46-1.38-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.83-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.02 2.6c.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" />
              </svg>
              <span className="hero__whatsapp-number">
                {WHATSAPP_NUMBER}
              </span>
            </a>
          </div>
        </div>

        <BookingCard
          professionals={professionals.map((professional) => ({
            id: professional.id,
            name: professional.user.name,
          }))}
        />
      </div>

      <div className="hero__scroll">
        <span className="hero__scroll-text">Role para explorar</span>
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
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
