import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page/ContentPage";
import { BUSINESS } from "@/config/business";

export const metadata: Metadata = { title: "Termos de uso" };

export default function TermosPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Termos de uso"
      updatedAt="1º de novembro de 2026"
    >
      <div className="content-page__section">
        <h2>1. Sobre o serviço</h2>
        <p>
          A {BUSINESS.name} oferece agendamento online de serviços de barbearia.
          Ao usar o site você concorda com estes termos.
        </p>
      </div>
      <div className="content-page__section">
        <h2>2. Agendamentos</h2>
        <ul>
          <li>O horário só é reservado depois da confirmação na tela.</li>
          <li>
            Os dados informados (nome, WhatsApp e e-mail) precisam ser
            verdadeiros para que possamos confirmar e lembrar o horário.
          </li>
          <li>
            O cancelamento gratuito pode ser feito até 2 horas antes do
            atendimento.
          </li>
          <li>
            Atrasos acima de 15 minutos podem exigir remarcação para não
            prejudicar o próximo cliente.
          </li>
        </ul>
      </div>
      <div className="content-page__section">
        <h2>3. Preços e pagamento</h2>
        <p>
          Os valores exibidos antes da confirmação são os praticados pelo
          profissional escolhido. O pagamento é feito na barbearia.
        </p>
      </div>
      <div className="content-page__section">
        <h2>4. Conta do cliente</h2>
        <p>
          Você é responsável por manter sua senha em sigilo. Podemos suspender
          contas usadas de forma abusiva, como reservas repetidas sem
          comparecimento.
        </p>
      </div>
      <div className="content-page__section">
        <h2>5. Privacidade</h2>
        <p>
          O tratamento dos seus dados segue a nossa{" "}
          <Link href="/privacidade">Política de privacidade</Link> e a{" "}
          <Link href="/lgpd">página da LGPD</Link>.
        </p>
      </div>
      <div className="content-page__section">
        <h2>6. Contato</h2>
        <p>
          Dúvidas sobre estes termos:{" "}
          <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
        </p>
      </div>
    </ContentPage>
  );
}
