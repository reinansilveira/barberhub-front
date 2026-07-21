import { LoginForm } from "@/features/auth/LoginForm";
import styles from "@/features/app/AppPage.module.scss";

export default function LoginPage() {
  return <main className={styles.page}><section className={styles.card}><span className={styles.eyebrow}>Área administrativa</span><h1>Acesse sua conta</h1><p>Entre para gerenciar agenda, serviços e agendamentos.</p><LoginForm /></section></main>;
}
