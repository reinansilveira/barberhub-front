import styles from "./Howitworks.module.scss";

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
		title: "Cliente informa contato",
		description:
			"Sem cadastro com senha. Apenas WhatsApp ou e-mail para receber a confirmação.",
		note: "Rápido e sem burocracia",
		tone: "amber",
	},
	{
		number: "02",
		title: "Recebe código OTP",
		description:
			"Via WhatsApp ou e-mail. Código de 6 dígitos válido por 5 minutos para confirmar sua identidade.",
		note: "100% seguro",
		tone: "amber",
	},
	{
		number: "03",
		title: "Agendamento confirmado",
		description:
			"Slot bloqueado em tempo real. Você recebe confirmação automática e lembretes antes do horário.",
		note: "Pronto!",
		tone: "success",
	},
];

function StepIcon({ tone }: { tone: Step["tone"] }) {
	if (tone === "success") {
		return (
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
		<section className={styles["how-it-works"]}>
			<div className={`wrapper ${styles["how-it-works__inner"]}`}>
				<div className={styles["how-it-works__header"]}>
					<span className={styles["how-it-works__label"]}>
						Processo simples
					</span>
					<h2 className={styles["how-it-works__title"]}>Como funciona</h2>
					<p className={styles["how-it-works__subtitle"]}>
						Três etapas simples para garantir seu horário com os melhores
						profissionais
					</p>
				</div>

				<div className={styles["how-it-works__steps"]}>
					{STEPS.map(({ number, title, description, note, tone }) => (
						<div key={number} className={styles["how-it-works__step"]}>
							<span className={styles["how-it-works__number"]}>{number}</span>

							<h3 className={styles["how-it-works__step-title"]}>{title}</h3>

							<p className={styles["how-it-works__step-description"]}>
								{description}
							</p>

							<div
								className={`${styles["how-it-works__note"]} ${
									styles[`how-it-works__note--${tone}`]
								}`}
							>
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