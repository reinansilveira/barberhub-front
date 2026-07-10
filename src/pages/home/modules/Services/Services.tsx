import type { ReactNode } from "react";
import styles from "./Services.module.scss";

interface Service {
	icon: ReactNode;
	title: string;
	description: string;
	price: string;
	duration: string;
}

const SCISSORS_ICON = (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<circle cx="6" cy="6" r="3" />
		<circle cx="6" cy="18" r="3" />
		<line x1="20" y1="4" x2="8.12" y2="15.88" />
		<line x1="14.47" y1="14.48" x2="20" y2="20" />
		<line x1="8.12" y1="8.12" x2="12" y2="12" />
	</svg>
);

const BEARD_ICON = (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<circle cx="12" cy="8" r="4" />
		<path d="M4 21c0-4.5 3.5-8 8-8s8 3.5 8 8" />
	</svg>
);

const CROWN_ICON = (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="m2 18 2-11 5 4 3-6 3 6 5-4 2 11H2Z" />
		<line x1="2" y1="21" x2="22" y2="21" />
	</svg>
);

const BRUSH_ICON = (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M9.06 11.9 4.34 16.6a2.4 2.4 0 0 0 3.4 3.4l4.7-4.72" />
		<path d="M11.6 6.7 15 3.3a1.5 1.5 0 0 1 2.1 0l3.5 3.5a1.5 1.5 0 0 1 0 2.1l-3.4 3.4a1.5 1.5 0 0 1-2.1 0l-3.5-3.5a1.5 1.5 0 0 1 0-2.1Z" />
	</svg>
);

const LEAF_ICON = (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 8-9 3.5 0 8 4 8 9a7 7 0 0 1-7 7Z" />
		<path d="M11 20v-9" />
	</svg>
);

const CHILD_ICON = (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<circle cx="12" cy="5" r="3" />
		<path d="M12 8v6" />
		<path d="m8 12 4 2 4-2" />
		<path d="m8 21 4-7 4 7" />
	</svg>
);

const SERVICES: Service[] = [
	{
		icon: SCISSORS_ICON,
		title: "Corte Clássico",
		description:
			"Técnicas tradicionais com tesoura e navalha. Inclui lavagem e finalização com produtos premium.",
		price: "R$ 85",
		duration: "45 minutos",
	},
	{
		icon: BEARD_ICON,
		title: "Barba Completa",
		description:
			"Modelagem, aparação e navalha. Tratamento com toalha quente e hidratação profunda.",
		price: "R$ 65",
		duration: "35 minutos",
	},
	{
		icon: CROWN_ICON,
		title: "Combo Premium",
		description:
			"Corte + barba + tratamento capilar. Experiência completa com produtos exclusivos.",
		price: "R$ 135",
		duration: "75 minutos",
	},
	{
		icon: BRUSH_ICON,
		title: "Pigmentação",
		description:
			"Cobertura de fios brancos com pigmentos naturais. Resultado discreto e profissional.",
		price: "R$ 95",
		duration: "60 minutos",
	},
	{
		icon: LEAF_ICON,
		title: "Tratamento Capilar",
		description:
			"Hidratação profunda e massagem relaxante. Produtos importados de alta performance.",
		price: "R$ 75",
		duration: "40 minutos",
	},
	{
		icon: CHILD_ICON,
		title: "Corte Infantil",
		description:
			"Atendimento especializado para crianças. Ambiente lúdico e profissionais pacientes.",
		price: "R$ 55",
		duration: "30 minutos",
	},
];

export default function Services() {
	return (
		<section className={styles.services}>
			<div className={`wrapper ${styles.services__inner}`}>
				<div className={styles.services__header}>
					<span className={styles.services__label}>Nossos serviços</span>
					<h2 className={styles.services__title}>Experiência completa</h2>
					<p className={styles.services__subtitle}>
						Do corte clássico ao tratamento premium, cada serviço é uma obra
						de arte
					</p>
				</div>

				<div className={styles.services__grid}>
					{SERVICES.map(({ icon, title, description, price, duration }) => (
						<article key={title} className={styles.services__card}>
							<div className={styles.services__icon}>{icon}</div>

							<h3 className={styles.services__card_title}>{title}</h3>
							<p className={styles.services__description}>{description}</p>

							<div className={styles.services__footer}>
								<div className={styles.services__price_group}>
									<span className={styles.services__price}>{price}</span>
									<span className={styles.services__duration}>{duration}</span>
								</div>

								<a href="/agendar" className={styles.services__link}>
									Agendar
									<svg
										width="14"
										height="14"
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
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}