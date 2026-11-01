import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page/ContentPage";
import { BUSINESS } from "@/config/business";

export const metadata: Metadata = { title: "Política de privacidade" };

export default function PrivacidadePage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Política de privacidade"
      updatedAt="1º de novembro de 2026"
    >
      <div className="content-page__section">
        <h2>Quais dados coletamos</h2>
        <ul>
          <li>Nome, telefone (WhatsApp) e e-mail informados no agendamento.</li>
          <li>Histórico de agendamentos, serviços e avaliações.</li>
          <li>Foto de perfil, quando você decide enviar uma.</li>
        </ul>
      </div>
      <div className="content-page__section">
        <h2>Para que usamos</h2>
        <ul>
          <li>Confirmar, lembrar, remarcar e cancelar seus horários.</li>
          <li>Permitir que o profissional prepare o atendimento.</li>
          <li>Melhorar a agenda e a qualidade do atendimento.</li>
        </ul>
        <p>
          Não vendemos seus dados e não usamos para publicidade de terceiros.
        </p>
      </div>
      <div className="content-page__section" id="cookies">
        <h2>Cookies</h2>
        <p>
          Usamos apenas cookies essenciais para manter você conectado à sua
          conta com segurança. Não usamos cookies de rastreamento ou de
          publicidade.
        </p>
      </div>
      <div className="content-page__section">
        <h2>Por quanto tempo guardamos</h2>
        <p>
          Mantemos os dados enquanto sua conta estiver ativa ou pelo tempo
          exigido por lei. Você pode pedir a exclusão a qualquer momento.
        </p>
      </div>
      <div className="content-page__section">
        <h2>Seus direitos</h2>
        <p>
          Veja como acessar, corrigir ou excluir seus dados na{" "}
          <Link href="/lgpd">página da LGPD</Link>, ou escreva para{" "}
          <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
        </p>
      </div>
    </ContentPage>
  );
}
