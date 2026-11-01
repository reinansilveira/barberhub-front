"use client";

import Link from "next/link";
import "./AuthForm.scss";
import { useLoginForm } from "./use-login-form";
import { API_BASE_URL } from "@/services/api/config";

export const LoginForm = ({ notice }: { notice?: string }) => {
  const {
    emailField,
    passwordField,
    errors,
    isSubmitting,
    isVerifyingTwoFactor,
    showPassword,
    twoFactorChallenge,
    twoFactorCode,
    onTwoFactorSubmit,
    setTwoFactorCode,
    cancelTwoFactor,
    togglePassword,
    onSubmit,
  } = useLoginForm();

  return (
    <div className="auth-form">
      <div className="auth-form__content">
        <h1 className="auth-form__title">Bem-vindo de volta</h1>
        <p className="auth-form__subtitle">
          Informe seus dados para acessar sua conta.
        </p>
        {notice && (
          <p className="auth-form__notice" role="status">
            {notice}
          </p>
        )}

        <div className="auth-form__oauth-group">
          <Link
            href={`${API_BASE_URL}/clients/google`}
            className="auth-form__oauth-button"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Continuar com Google</span>
          </Link>
        </div>

        <div className="auth-form__divider">
          <span>ou</span>
        </div>

        {twoFactorChallenge ? (
          <form
            className="auth-form__fields"
            onSubmit={onTwoFactorSubmit}
            noValidate
          >
            <label className="auth-form__field">
              <span className="auth-form__field-label">
                Código de segurança
              </span>
              <input
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                onChange={(event) => setTwoFactorCode(event.target.value)}
                placeholder="000000"
                required
                value={twoFactorCode}
              />
              <small>
                {twoFactorChallenge.message} O código expira em 5 minutos.
              </small>
            </label>
            {errors.root && (
              <small className="auth-form__error" role="alert">
                {errors.root.message}
              </small>
            )}
            <button
              type="submit"
              className="auth-form__submit"
              disabled={isVerifyingTwoFactor}
            >
              {isVerifyingTwoFactor ? "Verificando..." : "Confirmar código"}
            </button>
            <button
              type="button"
              className="auth-form__forgot-link"
              onClick={cancelTwoFactor}
            >
              Voltar ao login
            </button>
          </form>
        ) : (
          <form className="auth-form__fields" onSubmit={onSubmit} noValidate>
            <label className="auth-form__field">
              <span className="auth-form__field-label">E-mail</span>
              <input
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                {...emailField}
              />
              {errors.email && (
                <small className="auth-form__error" role="alert">
                  {errors.email.message}
                </small>
              )}
            </label>

            <label className="auth-form__field">
              <div className="auth-form__field-head">
                <span className="auth-form__field-label">Senha</span>
                <Link href="/esqueci-senha" className="auth-form__forgot-link">
                  Esqueci a senha
                </Link>
              </div>
              <div className="auth-form__password">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...passwordField}
                />
                <button
                  type="button"
                  className="auth-form__password-toggle"
                  onClick={togglePassword}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M3 3l18 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.6 10.6a3 3 0 1 0 4.24 4.24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.18 5.02A11.63 11.63 0 0 1 12 4c6.5 0 10 8 10 8a18.84 18.84 0 0 1-4.18 5.02"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.2 7.64A18.46 18.46 0 0 0 2 12s3.5 7 10 7a11.9 11.9 0 0 0 4.4-.84"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <small className="auth-form__error" role="alert">
                  {errors.password.message}
                </small>
              )}
            </label>

            {errors.root && (
              <p className="auth-form__error" role="alert">
                {errors.root.message}
              </p>
            )}
            <button
              type="submit"
              className="auth-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
        )}

        <div className="auth-form__signup">
          Ainda não tem conta? <Link href="/cadastrar">Crie agora</Link>
        </div>

        <div className="auth-form__legal">
          Ao continuar, você concorda com os{" "}
          <Link href="/termos">Termos de uso</Link> e a{" "}
          <Link href="/privacidade">Política de privacidade</Link>
        </div>
      </div>
    </div>
  );
};
