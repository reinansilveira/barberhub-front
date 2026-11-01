import type { ReactNode } from "react";
import Image from "next/image";
import bannerLogin from "@/assets/images/banner-login.png";
import "./AuthLayout.scss";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-page">
      <section className="auth-page__form-side">{children}</section>

      <aside className="auth-page__showcase">
        <div className="auth-page__image-frame">
          <Image
            src={bannerLogin}
            alt=""
            fill
            priority
            className="auth-page__banner"
            sizes="(max-width: 900px) 0px, 50vw"
          />
        </div>
      </aside>
    </div>
  );
}
