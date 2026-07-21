"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { login, type LoginInput } from "@/services/auth";
import { saveSession } from "./actions";
import styles from "@/features/app/AppPage.module.scss";

export function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginInput>();
  async function submit(values: LoginInput) {
    try { const session = await login(values); await saveSession(session); router.replace("/dashboard"); router.refresh(); }
    catch { setError("root", { message: "Não foi possível entrar. Confira suas credenciais." }); }
  }
  return <form className={styles.form} onSubmit={handleSubmit(submit)} noValidate>
    <label>E-mail<input type="email" {...register("email", { required: "Informe seu e-mail" })} /></label>{errors.email && <small>{errors.email.message}</small>}
    <label>Senha<input type="password" {...register("password", { required: "Informe sua senha", minLength: { value: 6, message: "Mínimo de 6 caracteres" } })} /></label>{errors.password && <small>{errors.password.message}</small>}
    {errors.root && <p className={styles.error}>{errors.root.message}</p>}<button disabled={isSubmitting}>{isSubmitting ? "Entrando..." : "Entrar"}</button>
  </form>;
}
