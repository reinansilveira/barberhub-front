import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page/ContentPage";
import { BUSINESS } from "@/config/business";

export const metadata: Metadata = { title: "LGPD" };

const RIGHTS = [
  "Confirmar se tratamos seus dados e acessar uma cópia deles.",
  "Corrigir dados incompletos, inexatos ou desatualizados.",
  "Pedir a exclusão dos dados tratados com o seu consentimento.",
  "Pedir a portabilidade dos dados para outro fornecedor.",
  "Revogar o consentimento a qualquer momento.",
  "Saber com quem compartilhamos seus dados.",
];

export default function LgpdPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Seus direitos pela LGPD"
      description="A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) garante que você tenha controle sobre os seus dados pessoais."
      updatedAt="1º de novembro de 2026"
    >
      <div className="content-page__section">
        <h2>O que você pode pedir</h2>
        <ul>
          {RIGHTS.map((right) => (
            <li key={right}>{right}</li>
          ))}
        </ul>
      </div>
      <div className="content-page__section">
        <h2>Como fazer o pedido</h2>
        <p>
          Envie um e-mail para{" "}
          <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> com o
          assunto &ldquo;LGPD&rdquo; e o e-mail ou telefone usado nos
          agendamentos. Respondemos em até 15 dias.
        </p>
      </div>
      <div className="content-page__section">
        <h2>Com quem compartilhamos</h2>
        <p>
          Apenas com os serviços necessários para funcionar: hospedagem do site
          e envio de mensagens de confirmação por e-mail e WhatsApp.
        </p>
      </div>
    </ContentPage>
  );
}
