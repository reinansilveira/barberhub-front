"use client";

import {
  Check,
  ChevronRight,
  Crown,
  LockKeyhole,
  PencilLine,
  Upload,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currency, initials } from "../../_shared/dashboard.utils";
import { useChangePassword } from "../hooks/use-change-password";
import { useProfileAvatarUpload } from "../hooks/use-profile-avatar-upload";
import { ROLE_LABELS, getProfileAvatar } from "../profile-settings.utils";

export type ProfileSettingsData = {
  id: string;
  name: string;
  email?: string | null;
  avatar?: string | null;
  role?: string;
};

export type ProfileStats = {
  completedAppointments: number;
  receivedRevenue: number;
  clients: number;
};

export const ProfileSettingsPanel = ({
  profile,
  stats,
}: {
  profile: ProfileSettingsData;
  stats: ProfileStats;
}) => {
  const { fileInputRef, ...avatarUpload } = useProfileAvatarUpload(
    getProfileAvatar(profile),
  );
  const password = useChangePassword(profile.id);
  const profileInitials = initials(profile.name);

  return (
    <div className="profile-settings">
      <aside className="profile-settings__sidebar">
        <section className="profile-settings__identity">
          <div className="profile-settings__avatar-wrap">
            <Avatar className="profile-settings__avatar">
              <AvatarImage src={avatarUpload.avatarSrc} alt="" />
              <AvatarFallback>{profileInitials}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              aria-label="Alterar foto do perfil"
              onClick={avatarUpload.open}
            >
              <PencilLine aria-hidden="true" />
            </button>
          </div>
          <h2>{profile.name}</h2>
          <p>{profile.email || "E-mail não informado"}</p>
          <strong>
            <Crown aria-hidden="true" />
            {ROLE_LABELS[profile.role ?? ""] ?? "Conta BarberHub"}
          </strong>
          <dl className="profile-settings__stats">
            <div>
              <dt>Atendimentos</dt>
              <dd>{stats.completedAppointments}</dd>
            </div>
            <div>
              <dt>Clientes</dt>
              <dd>{stats.clients}</dd>
            </div>
            <div>
              <dt>Recebido</dt>
              <dd>{currency.format(stats.receivedRevenue)}</dd>
            </div>
          </dl>
        </section>
      </aside>
      <div className="profile-settings__main">
        <section className="profile-settings__card profile-settings__form-card">
          <header className="profile-settings__card-heading">
            <div>
              <h3>Informações da conta</h3>
              <p>Para alterar nome ou e-mail, fale com o suporte.</p>
            </div>
          </header>
          <dl className="profile-settings__fields">
            <div>
              <dt>Nome completo</dt>
              <dd>{profile.name}</dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>{profile.email || "Não informado"}</dd>
            </div>
          </dl>
        </section>
        <section className="profile-settings__card profile-settings__security">
          <header className="profile-settings__card-heading">
            <div>
              <h3>Segurança</h3>
              <p>Proteja o acesso à sua conta.</p>
            </div>
          </header>
          {password.success && (
            <p className="profile-settings__success" role="status">
              {password.success}
            </p>
          )}
          <button type="button" onClick={password.open}>
            <LockKeyhole aria-hidden="true" />
            <span>
              <b>Alterar senha</b>
              <small>Confirme a senha atual e defina uma nova</small>
            </span>
            <ChevronRight aria-hidden="true" />
          </button>
        </section>
      </div>

      {avatarUpload.isOpen && (
        <div
          className="profile-settings__modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) avatarUpload.close();
          }}
        >
          <div
            className="profile-settings__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-upload-title"
          >
            <header>
              <div>
                <h2 id="profile-upload-title">Editar foto de perfil</h2>
                <p>Escolha uma imagem nítida para sua conta.</p>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={avatarUpload.close}
              >
                <X aria-hidden="true" />
              </button>
            </header>
            <button
              type="button"
              className="profile-settings__upload-zone"
              onClick={avatarUpload.openFilePicker}
            >
              <Avatar className="profile-settings__upload-avatar">
                <AvatarImage
                  src={avatarUpload.preview || avatarUpload.avatarSrc}
                  alt=""
                />
                <AvatarFallback>{profileInitials}</AvatarFallback>
              </Avatar>
              <Upload aria-hidden="true" />
              <b>Selecionar imagem</b>
              <span>PNG, JPG ou WEBP · até 5 MB</span>
            </button>
            <input
              ref={fileInputRef}
              className="profile-settings__file-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              aria-label="Arquivo da foto de perfil"
              onChange={avatarUpload.chooseImage}
            />
            {avatarUpload.error && (
              <p className="profile-settings__modal-error" role="alert">
                {avatarUpload.error}
              </p>
            )}
            <footer>
              <button
                type="button"
                className="profile-settings__modal-secondary"
                onClick={avatarUpload.close}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="profile-settings__modal-primary"
                disabled={!avatarUpload.preview || avatarUpload.saving}
                onClick={avatarUpload.save}
              >
                <Check aria-hidden="true" />
                {avatarUpload.saving ? "Salvando..." : "Salvar foto"}
              </button>
            </footer>
          </div>
        </div>
      )}

      {password.isOpen && (
        <div
          className="profile-settings__modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) password.close();
          }}
        >
          <form
            className="profile-settings__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-modal-title"
            onSubmit={password.submit}
            noValidate
          >
            <header>
              <div>
                <h2 id="password-modal-title">Alterar senha</h2>
                <p>Use pelo menos 8 caracteres.</p>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={password.close}
              >
                <X aria-hidden="true" />
              </button>
            </header>
            <div className="profile-settings__modal-fields">
              <label>
                Senha atual
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password.form.currentPassword}
                  onChange={(event) =>
                    password.setField("currentPassword", event.target.value)
                  }
                />
              </label>
              <label>
                Nova senha
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password.form.newPassword}
                  onChange={(event) =>
                    password.setField("newPassword", event.target.value)
                  }
                />
              </label>
              <label>
                Confirmar nova senha
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password.form.confirmPassword}
                  onChange={(event) =>
                    password.setField("confirmPassword", event.target.value)
                  }
                />
              </label>
            </div>
            {password.error && (
              <p className="profile-settings__modal-error" role="alert">
                {password.error}
              </p>
            )}
            <footer>
              <button
                type="button"
                className="profile-settings__modal-secondary"
                onClick={password.close}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="profile-settings__modal-primary"
                disabled={password.submitting}
              >
                <Check aria-hidden="true" />
                {password.submitting ? "Salvando..." : "Atualizar senha"}
              </button>
            </footer>
          </form>
        </div>
      )}
    </div>
  );
};
