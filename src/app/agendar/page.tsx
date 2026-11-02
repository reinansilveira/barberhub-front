import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page/ContentPage";
import { BUSINESS, whatsappLabel, whatsappUrl } from "@/config/business";
import BookingCard from "@/features/home/components/Bookingcard/Bookingcard";
import { findAllProfessionals } from "@/services/professional";
import "./AgendarPage.scss";

export const metadata: Metadata = {
  title: "Agendar horário",
  description: "Escolha o profissional, o serviço e o horário livre.",
};

export default async function AgendarPage() {
  const professionals = await findAllProfessionals(true).catch(() => []);

  return (
    <ContentPage
      tone="dark"
      eyebrow="Agendamento"
      title="Agende seu horário"
      description="Sem cadastro: escolha o profissional, o serviço e o horário, e informe seus dados para confirmar."
    >
      <div className="schedule-page">
        <BookingCard
          professionals={professionals.map((professional) => ({
            id: professional.id,
            name: professional.user.name,
          }))}
        />
        <aside className="schedule-page__info" aria-label="Informações úteis">
          <div className="content-page__section">
            <h2>Antes de agendar</h2>
            <ul>
              <li>Cancelamento gratuito até 2 horas antes.</li>
              <li>O pagamento é feito na barbearia.</li>
              <li>
                Prefere escolher pelo perfil?{" "}
                <Link href="/profissionais">Veja a equipe</Link>.
              </li>
            </ul>
          </div>
          <div className="content-page__section">
            <h2>Onde estamos</h2>
            <p>
              {BUSINESS.address}
              <br />
              {BUSINESS.openingHours}
            </p>
            <p>
              Dúvidas?{" "}
              <a
                href={whatsappUrl("Olá! Preciso de ajuda para agendar.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chame no WhatsApp {whatsappLabel}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </p>
          </div>
        </aside>
      </div>
    </ContentPage>
  );
}
