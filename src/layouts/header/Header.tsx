import Link from "next/link";
import styles from "./Header.module.scss";

const NAV_LINKS = [
	{ label: "Início", href: "/" },
	{ label: "Serviços", href: "/servicos" },
	{ label: "Profissionais", href: "/profissionais" },
	{ label: "Sobre", href: "/sobre" },
	{ label: "Contato", href: "/contato" },
];

export default function Header() {
	return (
		<header className={styles.header}>
			<div className={`wrapper ${styles.header__inner}`}>
				<Link href="/" className={styles.header__logo}>
					BarberHub
				</Link>

				<nav className={styles.header__nav}>
					{NAV_LINKS.map(({ label, href }) => (
						<Link
							key={href}
							href={href}
							className={styles["header__nav-link"]}
						>
							{label}
						</Link>
					))}
				</nav>

				<Link href="/agendar" className={styles.header__cta}>
					Agendar agora
				</Link>

				<button
					className={styles["header__menu-toggle"]}
					aria-label="Abrir menu"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
					>
						<line x1="3" y1="6" x2="21" y2="6" />
						<line x1="3" y1="12" x2="21" y2="12" />
						<line x1="3" y1="18" x2="21" y2="18" />
					</svg>
				</button>
			</div>
		</header>
	);
}