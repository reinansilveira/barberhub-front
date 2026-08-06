import Image from "next/image";
import "./RegisterPage.scss";
import bannerLogin from "@/assets/images/banner-login.png";
import { RegisterForm } from "@/features/auth/Registerform";

export default function RegisterPage() {
  return (
    <main className="register-page">
      <section className="formSide">
        <RegisterForm />
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