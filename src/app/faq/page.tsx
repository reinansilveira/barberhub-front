import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page/ContentPage";
import { BUSINESS, whatsappLabel } from "@/config/business";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  description: "Respostas sobre agendamento, cancelamento e pagamento.",
};

const QUESTIONS = [
  {
    question: "Preciso criar conta para agendar?",
    answer:
      "Não. Basta escolher o profissional, o serviço e o horário e informar nome, WhatsApp e e-mail. Com uma conta você consegue ver, remarcar e cancelar seus horários pelo painel.",
  },
  {
    question: "Como cancelo ou remarco um horário?",
    answer: `Com conta, acesse "Meus agendamentos" e use os botões Remarcar ou Cancelar. Sem conta, fale com a barbearia pelo WhatsApp ${whatsappLabel}.`,
  },
  {
    question: "Até quando posso cancelar sem custo?",
    answer:
      "O cancelamento é gratuito até 2 horas antes do horário marcado. Depois disso, fale com a barbearia.",
  },
  {
    question: "Como pago o serviço?",
    answer:
      "O pagamento é feito na barbearia, no dia do atendimento. Os valores aparecem antes de você confirmar o agendamento.",
  },
  {
    question: "Por que o preço muda de um profissional para outro?",
    answer:
      "Cada profissional pode ter um valor próprio para o mesmo serviço. O preço exibido no perfil do profissional é o que vale para o seu agendamento.",
  },
  {
    question: "Não aparece nenhum horário. O que faço?",
    answer:
      "Use o calendário para ver outros dias ou escolha outro profissional. Se precisar de um horário específico, fale com a barbearia pelo WhatsApp.",
  },
  {
    question: "Meus dados estão seguros?",
    answer: `Usamos seus dados apenas para o agendamento e para avisar sobre seus horários. Veja os detalhes na Política de privacidade da ${BUSINESS.name}.`,
  },
];

export default function FaqPage() {
  return (
    <ContentPage
      eyebrow="Ajuda"
      title="Perguntas frequentes"
      description="Não encontrou o que procurava? Fale com a gente pela página de contato."
    >
      <div className="content-page__faq">
        {QUESTIONS.map(({ question, answer }) => (
          <details key={question} className="content-page__question">
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </ContentPage>
  );
}
