"use client";

import {
  CheckCircle2,
  LoaderCircle,
  Scissors,
  UserRound,
  X,
} from "lucide-react";
import {
  useNewBarberModal,
  type NewBarberModalProps,
} from "../hooks/use-new-barber-modal";

export const NewBarberModal = (props: NewBarberModalProps) => {
  const {
    dialogRef,
    form,
    submitting,
    success,
    error,
    temporaryPassword,
    closeModal,
    updateField,
    handleSubmit,
  } = useNewBarberModal(props);
  const { isOpen } = props;

  if (!isOpen) return null;

  return (
    <div
      className="barber-modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div
        className="barber-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-barber-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <header className="barber-modal__header">
          <div className="barber-modal__heading">
            <span>
              <Scissors aria-hidden="true" />
            </span>
            <div>
              <p>NOVA PESSOA NA EQUIPE</p>
              <h2 id="new-barber-title">Novo barbeiro</h2>
            </div>
          </div>
          <button
            className="barber-modal__close"
            type="button"
            onClick={closeModal}
            aria-label="Fechar modal"
          >
            <X aria-hidden="true" />
          </button>
        </header>
        {success ? (
          <div className="barber-modal__success">
            <CheckCircle2 aria-hidden="true" />
            <h3>Barbeiro cadastrado!</h3>
            <p>O profissional já foi adicionado à sua equipe.</p>
            <p role="status">
              Senha temporária: <strong>{temporaryPassword}</strong>
            </p>
            <button type="button" onClick={closeModal}>
              Concluir
            </button>
          </div>
        ) : (
          <form className="barber-modal__form" onSubmit={handleSubmit}>
            <div className="barber-modal__intro">
              <UserRound aria-hidden="true" />
              <p>
                Cadastre os dados principais para liberar o profissional na
                agenda.
              </p>
            </div>
            <div className="barber-modal__grid">
              <label>
                <span>Nome completo</span>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Ex.: Enzo Ribeiro"
                  required
                />
              </label>
              <label>
                <span>Função</span>
                <select
                  value={form.role}
                  onChange={(event) => updateField("role", event.target.value)}
                >
                  <option>Barbeiro profissional</option>
                  <option>Barbeiro sênior</option>
                  <option>Barbeiro pleno</option>
                  <option>Barbeiro júnior</option>
                </select>
              </label>
              <label>
                <span>E-mail de acesso</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="barbeiro@email.com"
                  required
                />
              </label>
              <label>
                <span>
                  Telefone <em>opcional</em>
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="(11) 98765-4321"
                />
              </label>
            </div>
            <p className="barber-modal__hint">
              A senha temporária é gerada com segurança no servidor e será
              exibida uma única vez após o cadastro.
            </p>
            {error && (
              <p className="barber-modal__error" role="alert">
                {error}
              </p>
            )}
            <footer className="barber-modal__footer">
              <button type="button" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" disabled={submitting}>
                {submitting && <LoaderCircle aria-hidden="true" />}
                {submitting ? "Salvando..." : "Cadastrar barbeiro"}
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
};
