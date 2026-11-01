import Link from "next/link";
import "./Header.scss";
import { HeaderMenu } from "./HeaderMenu";
import { HeaderNav } from "./HeaderNav";
import { isLoggedIn } from "./header.service";

export default async function Header() {
  const loggedIn = await isLoggedIn();

  return (
    <header className="header">
      <div className="wrapper header__inner">
        <Link href="/" className="header__logo" prefetch={false}>
          BarberHub
        </Link>

        <HeaderNav />

        <div className="header__actions">
          {loggedIn ? (
            <Link
              href="/dashboard"
              className="header__auth-button"
              prefetch={false}
            >
              Minha conta
            </Link>
          ) : (
            <div className="header__auth">
              <Link
                href="/login"
                className="header__auth-link"
                prefetch={false}
              >
                Entrar
              </Link>
              <Link
                href="/cadastrar"
                className="header__auth-button"
                prefetch={false}
              >
                Cadastre-se
              </Link>
            </div>
          )}

          <Link href="/agendar" className="header__cta" prefetch={false}>
            Agendar agora
          </Link>
        </div>

        <HeaderMenu loggedIn={loggedIn} />
      </div>
    </header>
  );
}
