import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { ContentPage } from "@/components/content-page/ContentPage";
import { whatsappUrl } from "@/config/business";
import "./SuccessPage.scss";

export const metadata: Metadata = {
  title: "Agendamento confirmado",
  robots: { index: false },
};

type SuccessPageProps = {
  searchParams: Promise<{
    service?: string;
    professional?: string;
    date?: string;
    time?: string;
  }>;
};

export default async function BookingSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { service, professional, date, time } = await searchParams;
  const details = [
    ["Serviço", service],
    ["Profissional", professional],
    ["Data", date],
    ["Horário", time],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <ContentPage
      tone="dark"
      eyebrow="Tudo certo"
      title="Agendamento confirmado!"
    >
      <div className="booking-success" role="status">
        <CheckCircle2 className="booking-success__icon" aria-hidden="true" />
        <p className="booking-success__message">
          Seu horário está reservado. Você vai receber a confirmação no WhatsApp
          e no e-mail informados.
        </p>
        {details.length > 0 && (
          <dl className="booking-success__details">
            {details.map(([label, value]) => (
              <div key={label} className="booking-success__row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="booking-success__hint">
          Precisa remarcar ou cancelar? Faça isso até 2 horas antes pelo{" "}
          <a
            href={whatsappUrl("Olá! Preciso remarcar meu horário.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp<span className="sr-only"> (abre em nova aba)</span>
          </a>{" "}
          ou pela sua conta.
        </p>
        <div className="booking-success__actions">
          <Link href="/" className="content-page__button">
            Voltar para o início
          </Link>
          <Link
            href="/agendar"
            className="content-page__button content-page__button--secondary"
          >
            Agendar outro horário
          </Link>
        </div>
      </div>
    </ContentPage>
  );
}
