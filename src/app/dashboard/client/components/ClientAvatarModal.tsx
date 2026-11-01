import { Check, Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ReactNode } from "react";
import { initials } from "../../_shared/dashboard.utils";
import { useClientAvatarModal } from "../hooks/use-client-avatar-modal";

type ClientAvatarModalProps = {
  trigger: (open: () => void, avatar?: string) => ReactNode;
};

export function ClientAvatarModal({ trigger }: ClientAvatarModalProps) {
  const avatarModal = useClientAvatarModal();

  return (
    <>
      {trigger(avatarModal.open, avatarModal.avatar)}
      {avatarModal.isOpen && (
        <div
          className="profile-settings__modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) avatarModal.close();
          }}
        >
          <section
            className="profile-settings__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="client-avatar-title"
          >
            <header>
              <div>
                <h2 id="client-avatar-title">Editar foto de perfil</h2>
                <p>Escolha uma imagem nítida para sua conta.</p>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={avatarModal.close}
              >
                <X aria-hidden="true" />
              </button>
            </header>
            <label className="profile-settings__upload-zone">
              <Avatar className="profile-settings__upload-avatar">
                <AvatarImage
                  src={avatarModal.avatar}
                  alt="Pré-visualização da foto"
                />
                <AvatarFallback>
                  {initials(avatarModal.clientName)}
                </AvatarFallback>
              </Avatar>
              <Upload aria-hidden="true" />
              <b>Selecionar imagem</b>
              <span>PNG, JPG ou WEBP · até 5 MB</span>
              <input
                className="profile-settings__file-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={avatarModal.chooseImage}
              />
            </label>
            {avatarModal.error && (
              <p className="profile-settings__modal-error" role="alert">
                {avatarModal.error}
              </p>
            )}
            <footer>
              <button
                type="button"
                className="profile-settings__modal-secondary"
                onClick={avatarModal.close}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="profile-settings__modal-primary"
                disabled={!avatarModal.preview || avatarModal.saving}
                onClick={avatarModal.save}
              >
                <Check aria-hidden="true" />
                {avatarModal.saving ? "Salvando..." : "Salvar foto"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
