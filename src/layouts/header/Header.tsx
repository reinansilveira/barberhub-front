import Link from "next/link";
import "./Header.scss";
import { NAV_LINKS } from "./header-nav";
import { isLoggedIn } from "./use-header";

export default async function Header() {
	const loggedIn = await isLoggedIn();

	return (
		<header className="header">
			<div className="wrapper header__inner">
				<Link href="/" className="header__logo" prefetch={false}>
					BarberHub
				</Link>

				<nav className="header__nav">
					{NAV_LINKS.map(({ label, href }) => (
						<Link
							key={href}
							href={href}
							prefetch={false}
							className="header__nav-link"
						>
							{label}
						</Link>
					))}
				</nav>

				<div className="header__actions">
					{loggedIn ? (
						<Link href="/dashboard" className="header__authButton" prefetch={false}>
							Minha conta
						</Link>
					) : (
						<div className="header__auth">
							<Link href="/login" className="header__authLink" prefetch={false}>
								Entrar
							</Link>
							<Link href="/cadastrar" className="header__authButton" prefetch={false}>
								Cadastre-se
							</Link>
						</div>
					)}

					<Link href="/agendar" className="header__cta" prefetch={false}>
						Agendar agora
					</Link>
				</div>

				<button
					className="header__menu-toggle"
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
