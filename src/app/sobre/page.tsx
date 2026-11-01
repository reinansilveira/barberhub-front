import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page/ContentPage";
import { BUSINESS } from "@/config/business";

export const metadata: Metadata = {
  title: "Sobre nós",
  description: `Conheça a ${BUSINESS.name} e como funciona o agendamento online.`,
};

export default function SobrePage() {
  return (
    <ContentPage
      eyebrow="Sobre nós"
      title={`Cuidado com o seu visual, sem fila e sem complicação`}
      description={`A ${BUSINESS.name} une o atendimento de barbearia de confiança a uma agenda online simples de usar.`}
    >
      <div className="content-page__section">
        <h2>O que fazemos</h2>
        <p>
          Cortes, barba e cuidados masculinos com profissionais que você pode
          escolher pelo nome. Cada profissional tem a própria agenda, com
          horários atualizados em tempo real.
        </p>
      </div>
      <div className="content-page__section">
        <h2>Como agendar</h2>
        <ul>
          <li>Escolha o profissional e o serviço.</li>
          <li>Veja os dias e horários livres e escolha o seu.</li>
          <li>
            Informe nome, WhatsApp e e-mail. Pronto, o horário fica reservado.
          </li>
        </ul>
        <p>
          Não precisa criar conta. Se preferir acompanhar seus horários, crie
          uma conta gratuita e veja tudo em um só lugar.
        </p>
      </div>
      <div className="content-page__section">
        <h2>Onde estamos</h2>
        <p>
          {BUSINESS.address}
          <br />
          {BUSINESS.openingHours}
        </p>
        <Link href="/agendar" className="content-page__button">
          Agendar um horário
        </Link>
      </div>
    </ContentPage>
  );
}
