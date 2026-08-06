import Image from "next/image";
import "./LoginPage.scss";
import bannerLogin from "@/assets/images/banner-login.png";
import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="formSide">
        <LoginForm />
      </section>

      <aside className="showcaseSide">
        <div className="imageFrame">
          <Image
            src={bannerLogin}
            alt="Banner Barberhub"
            fill
            priority
            className="bannerImage"
            sizes="(max-width: 900px) 0px, 50vw"
          />
        </div>
      </aside>
    </main>
  );
}
