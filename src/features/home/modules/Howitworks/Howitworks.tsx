interface Step {
  number: string;
  title: string;
  description: string;
  note: string;
  tone: "amber" | "success";
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Escolha o profissional",
    description:
      "Selecione quem vai te atender e o serviço que você quer fazer.",
    note: "Sem cadastro e sem senha",
    tone: "amber",
  },
  {
    number: "02",
    title: "Escolha o horário",
    description:
      "Veja só os horários realmente livres e escolha o que encaixa na sua rotina.",
    note: "Agenda atualizada em tempo real",
    tone: "amber",
  },
  {
    number: "03",
    title: "Confirme seus dados",
    description:
      "Informe nome, WhatsApp e e-mail. Seu horário fica reservado na hora.",
    note: "Pronto!",
    tone: "success",
  },
];

function StepIcon({ tone }: { tone: Step["tone"] }) {
  if (tone === "success") {
    return (
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <path
          d="M8 12.5l2.5 2.5L16 9"
          stroke="#111111"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="wrapper how-it-works__inner">
        <div className="how-it-works__header">
          <span className="how-it-works__label">Processo simples</span>
          <h2 className="how-it-works__title">Como funciona</h2>
          <p className="how-it-works__subtitle">
            Três passos para garantir seu horário
          </p>
        </div>

        <div className="how-it-works__steps">
          {STEPS.map(({ number, title, description, note, tone }) => (
            <div key={number} className="how-it-works__step">
              <span className="how-it-works__number">{number}</span>

              <h3 className="how-it-works__step-title">{title}</h3>

              <p className="how-it-works__step-description">{description}</p>

              <div className={`how-it-works__note how-it-works__note--${tone}`}>
                <StepIcon tone={tone} />
                <span>{note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import "./Howitworks.scss";
