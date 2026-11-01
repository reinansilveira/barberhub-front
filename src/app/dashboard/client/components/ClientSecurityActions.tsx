import { Check, ChevronRight, KeyRound, ShieldCheck, X } from "lucide-react";
import { cn } from "@/utils/class-names";
import { useClientSecurityActions } from "../hooks/use-client-security-actions";

export function ClientSecurityActions({
  phone,
  twoFactorEnabled,
}: {
  phone: string;
  twoFactorEnabled: boolean;
}) {
  const security = useClientSecurityActions(phone, twoFactorEnabled);
  const isPassword = security.modal === "password";
  const isTwoFactorVerification =
    security.modal === "two-factor" && security.twoFactorStep === "verify";

  return (
    <>
      <div className="client-account__security">
        <h2>Segurança</h2>
        <button type="button" onClick={() => security.open("password")}>
          <KeyRound aria-hidden="true" />
          <span>
            <b>Alterar senha</b>
            <small>Confirme sua senha atual para atualizar o acesso</small>
          </span>
          <ChevronRight aria-hidden="true" />
        </button>
        <button type="button" onClick={() => security.open("two-factor")}>
          <ShieldCheck aria-hidden="true" />
          <span>
            <b>
              {twoFactorEnabled
                ? "Desativar autenticação em duas etapas"
                : "Autenticação em duas etapas"}
            </b>
            <small>
              {twoFactorEnabled
                ? "Proteção ativa no seu próximo login"
                : "Adicione uma camada extra de proteção"}
            </small>
          </span>
          <ChevronRight aria-hidden="true" />
        </button>
      </div>

      {security.modal && (
        <div
          className="profile-settings__modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) security.close();
          }}
        >
          <section
            className={cn(
              "profile-settings__modal client-security-modal",
              isPassword && "client-security-modal--password",
            )}
            aria-labelledby="client-security-title"
            aria-modal="true"
            role="dialog"
          >
            <header>
              <div>
                <h2 id="client-security-title">
                  {isPassword
                    ? "Alterar senha"
                    : twoFactorEnabled
                      ? "Desativar duas etapas"
                      : "Autenticação em duas etapas"}
                </h2>
                <p>
                  {isPassword
                    ? "Use sua senha atual para confirmar a alteração."
                    : "Um código temporário será enviado ao seu telefone cadastrado."}
                </p>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={security.close}
              >
                <X aria-hidden="true" />
              </button>
            </header>

            {isPassword ? (
              <form
                className="profile-settings__modal-fields client-security-modal__password-form"
                id="client-password-change-form"
                onSubmit={security.submitPasswordChange}
              >
                <label>
                  Senha atual
                  <input
                    autoComplete="current-password"
                    onChange={(event) =>
                      security.setCurrentPassword(event.target.value)
                    }
                    placeholder="Digite sua senha atual"
                    required
                    type="password"
                    value={security.currentPassword}
                  />
                </label>
                <label>
                  Nova senha
                  <input
                    autoComplete="new-password"
                    minLength={8}
                    onChange={(event) =>
                      security.setNewPassword(event.target.value)
                    }
                    placeholder="Mínimo de 8 caracteres"
                    required
                    type="password"
                    value={security.newPassword}
                  />
                </label>
                <label>
                  Confirmar nova senha
                  <input
                    autoComplete="new-password"
                    minLength={8}
                    onChange={(event) =>
                      security.setConfirmPassword(event.target.value)
                    }
                    placeholder="Repita a nova senha"
                    required
                    type="password"
                    value={security.confirmPassword}
                  />
                </label>
              </form>
            ) : (
              <>
                {!isTwoFactorVerification && (
                  <div className="profile-settings__modal-message client-security-modal__message">
                    <ShieldCheck aria-hidden="true" />
                    <div>
                      <b>
                        {twoFactorEnabled
                          ? "Confirme a desativação"
                          : "Proteja seu próximo login"}
                      </b>
                      <p>
                        O código será enviado para{" "}
                        {security.phone || "o telefone cadastrado"}.
                      </p>
                    </div>
                  </div>
                )}

                {isTwoFactorVerification && (
                  <form
                    className="profile-settings__modal-fields"
                    id="client-two-factor-form"
                    onSubmit={security.submitTwoFactor}
                  >
                    <label>
                      Código de segurança
                      <input
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        maxLength={6}
                        onChange={(event) =>
                          security.setCode(event.target.value)
                        }
                        placeholder="000000"
                        required
                        value={security.code}
                      />
                    </label>
                    {twoFactorEnabled && (
                      <label>
                        Senha atual
                        <input
                          autoComplete="current-password"
                          onChange={(event) =>
                            security.setCurrentPassword(event.target.value)
                          }
                          required
                          type="password"
                          value={security.currentPassword}
                        />
                      </label>
                    )}
                  </form>
                )}
              </>
            )}

            {security.feedback && (
              <p className="member-feedback" role="status">
                {security.feedback}
              </p>
            )}

            <footer>
              <button
                className="profile-settings__modal-secondary"
                onClick={security.close}
                type="button"
              >
                Cancelar
              </button>
              {isPassword && (
                <button
                  className="profile-settings__modal-primary"
                  disabled={security.submitting}
                  form="client-password-change-form"
                  type="submit"
                >
                  <Check aria-hidden="true" />
                  {security.submitting ? "Atualizando..." : "Atualizar senha"}
                </button>
              )}
              {!isPassword && !isTwoFactorVerification && (
                <button
                  className="profile-settings__modal-primary"
                  disabled={
                    security.submitting || security.verifiedPhone.length < 10
                  }
                  onClick={security.startTwoFactor}
                  type="button"
                >
                  <ShieldCheck aria-hidden="true" />
                  {security.submitting ? "Enviando..." : "Enviar código"}
                </button>
              )}
              {!isPassword && isTwoFactorVerification && (
                <button
                  className="profile-settings__modal-primary"
                  disabled={security.submitting}
                  form="client-two-factor-form"
                  type="submit"
                >
                  <Check aria-hidden="true" />
                  {security.submitting ? "Verificando..." : "Confirmar código"}
                </button>
              )}
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
