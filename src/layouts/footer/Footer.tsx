import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Footer.module.scss";

interface FooterLink {
	label: string;
	href: string;
}

interface SocialLink {
	label: string;
	href: string;
	icon: ReactNode;
}

interface ContactItem {
	label: string;
	value: string;
	href?: string;
	icon: ReactNode;
}

const QUICK_LINKS: FooterLink[] = [
	{ label: "Início", href: "/" },
	{ label: "Serviços", href: "/servicos" },
	{ label: "Profissionais", href: "/profissionais" },
	{ label: "Sobre nós", href: "/sobre" },
	{ label: "Blog", href: "/blog" },
];

const LEGAL_LINKS: FooterLink[] = [
	{ label: "Termos de uso", href: "/termos" },
	{ label: "Política de privacidade", href: "/privacidade" },
	{ label: "Política de cookies", href: "/cookies" },
	{ label: "LGPD", href: "/lgpd" },
	{ label: "FAQ", href: "/faq" },
];

const INSTAGRAM_ICON = (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<rect x="2" y="2" width="20" height="20" rx="5" />
		<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
		<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
	</svg>
);

const WHATSAPP_ICON = (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
		<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2Zm0 18.15h-.01a8.22 8.22 0 0 1-4.2-1.15l-.3-.18-3.14.82.84-3.06-.2-.31a8.21 8.21 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.22 8.24Zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.38-1.99-1.22-.74-.65-1.23-1.46-1.38-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.83-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.02 2.6c.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" />
	</svg>
);

const FACEBOOK_ICON = (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
		<path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
	</svg>
);

const SOCIAL_LINKS: SocialLink[] = [
	{ label: "Instagram", href: "https://instagram.com/barbehub", icon: INSTAGRAM_ICON },
	{ label: "WhatsApp", href: "https://wa.me/5579999991234", icon: WHATSAPP_ICON },
	{ label: "Facebook", href: "https://facebook.com/barbehub", icon: FACEBOOK_ICON },
];

const MAIL_ICON = (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<rect x="2" y="4" width="20" height="16" rx="2" />
		<path d="m2 7 10 6 10-6" />
	</svg>
);

const PHONE_ICON = (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
	</svg>
);

const MAP_PIN_ICON = (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
		<circle cx="12" cy="10" r="3" />
	</svg>
);

const CONTACT_ITEMS: ContactItem[] = [
	{
		label: "Email",
		value: "contato@barbehub.com.br",
		href: "mailto:contato@barbehub.com.br",
		icon: MAIL_ICON,
	},
	{
		label: "Telefone",
		value: "(79) 9 9999-1234",
		href: "tel:+5579999991234",
		icon: PHONE_ICON,
	},
	{
		label: "Endereço",
		value: "Av. Paulista, 1000\nSão Paulo - SP",
		icon: MAP_PIN_ICON,
	},
];

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className={styles.footer}>
			<div className={`wrapper ${styles.footer__inner}`}>
				<div className={styles.footer__brand}>
					<Link href="/" className={styles.footer__logo}>
						BarbeHub
					</Link>

					<p className={styles.footer__description}>
						A experiência premium de barbearia que você merece. Agendamento
						simples, profissionais de elite, resultados impecáveis.
					</p>

					<div className={styles.footer__social}>
						{SOCIAL_LINKS.map(({ label, href, icon }) => (
							<a
								key={label}
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={label}
								className={styles.footer__social_link}
							>
								{icon}
							</a>
						))}
					</div>
				</div>

				<nav className={styles.footer__column}>
					<span className={styles.footer__heading}>Links rápidos</span>
					<ul className={styles.footer__list}>
						{QUICK_LINKS.map(({ label, href }) => (
							<li key={href}>
								<Link href={href} className={styles.footer__link}>
									{label}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<nav className={styles.footer__column}>
					<span className={styles.footer__heading}>Legal</span>
					<ul className={styles.footer__list}>
						{LEGAL_LINKS.map(({ label, href }) => (
							<li key={href}>
								<Link href={href} className={styles.footer__link}>
									{label}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<div className={styles.footer__column}>
					<span className={styles.footer__heading}>Contato</span>
					<ul className={styles.footer__list}>
						{CONTACT_ITEMS.map(({ label, value, href, icon }) => {
							const content = (
								<>
									<span className={styles.footer__contact_icon}>{icon}</span>
									<span className={styles.footer__contact_text}>
										<span className={styles.footer__contact_label}>
											{label}
										</span>
										<span className={styles.footer__contact_value}>
											{value.split("\n").map((line, index) => (
												<span key={index}>
													{line}
													{index < value.split("\n").length - 1 && <br />}
												</span>
											))}
										</span>
									</span>
								</>
							);

							return (
								<li key={label} className={styles.footer__contact_item}>
									{href ? (
										<a href={href} className={styles.footer__contact_link}>
											{content}
										</a>
									) : (
										<span className={styles.footer__contact_link}>
											{content}
										</span>
									)}
								</li>
							);
						})}
					</ul>
				</div>
			</div>

			<div className={`wrapper ${styles.footer__bottom}`}>
				<span className={styles.footer__copyright}>
					© {currentYear} BarbeHub. Todos os direitos reservados.
				</span>

				<a
					href="https://sitelance.com.br"
					target="_blank"
					rel="noopener noreferrer"
					className={styles.footer__credit}
				>
					Desenvolvido com{" "}
					<span className={styles.footer__heart} aria-hidden="true">
						♥
					</span>{" "}
					por Sitelance
				</a>
			</div>
		</footer>
	);
}