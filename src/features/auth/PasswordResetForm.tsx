"use client";

import Link from "next/link";
import "./AuthForm.scss";
import { usePasswordReset } from "./use-password-reset";

export function PasswordResetForm() {
  const reset = usePasswordReset();

  return (
    <div className="auth-form">
      <div className="auth-form__content">
        <h1 className="auth-form__title">Recuperar senha</h1>
        <p className="auth-form__subtitle">
          {reset.step === "email"
            ? "Informe o e-mail da sua conta. Vamos enviar um código para criar uma nova senha."
            : reset.message}
        </p>

        {reset.step === "email" ? (
          <form
            className="auth-form__fields"
            onSubmit={reset.requestCode}
            noValidate
          >
            <label className="auth-form__field">
              <span className="auth-form__field-label">E-mail</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={reset.email}
                onChange={(event) => reset.setEmail(event.target.value)}
                required
              />
            </label>
            {reset.error && (
              <p className="auth-form__error" role="alert">
                {reset.error}
              </p>
            )}
            <button
              type="submit"
              className="auth-form__submit"
              disabled={reset.submitting}
            >
              {reset.submitting ? "Enviando..." : "Enviar código"}
            </button>
          </form>
        ) : (
          <form
            className="auth-form__fields"
            onSubmit={reset.resetPassword}
            noValidate
          >
            <label className="auth-form__field">
              <span className="auth-form__field-label">
                Código de 6 dígitos
              </span>
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                value={reset.code}
                onChange={(event) => reset.setCode(event.target.value)}
                required
              />
            </label>
            <label className="auth-form__field">
              <span className="auth-form__field-label">Nova senha</span>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo de 8 caracteres"
                value={reset.password}
                onChange={(event) => reset.setPassword(event.target.value)}
                required
              />
            </label>
            <label className="auth-form__field">
              <span className="auth-form__field-label">
                Confirmar nova senha
              </span>
              <input
                type="password"
                autoComplete="new-password"
                value={reset.confirmPassword}
                onChange={(event) =>
                  reset.setConfirmPassword(event.target.value)
                }
                required
              />
            </label>
            {reset.error && (
              <p className="auth-form__error" role="alert">
                {reset.error}
              </p>
            )}
            <button
              type="submit"
              className="auth-form__submit"
              disabled={reset.submitting}
            >
              {reset.submitting ? "Salvando..." : "Salvar nova senha"}
            </button>
            <button
              type="button"
              className="auth-form__forgot-link"
              onClick={reset.startOver}
            >
              Usar outro e-mail
            </button>
          </form>
        )}

        <div className="auth-form__signup">
          Lembrou a senha? <Link href="/login">Voltar ao login</Link>
        </div>
      </div>
    </div>
  );
}
