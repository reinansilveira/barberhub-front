"use client";

import { CheckCircle2, Clock3, LoaderCircle, Scissors, X } from "lucide-react";
import {
  SERVICE_CATEGORIES,
  useNewServiceModal,
} from "../hooks/use-new-service-modal";

type NewServiceModalProps = { isOpen: boolean; onClose: () => void };

export const NewServiceModal = ({ isOpen, onClose }: NewServiceModalProps) => {
  const { dialogRef, ...modal } = useNewServiceModal({ isOpen, onClose });

  if (!isOpen) return null;

  return (
    <div
      className="service-modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="service-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-service-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <header className="service-modal__header">
          <div className="service-modal__heading">
            <span>
              <Scissors aria-hidden="true" />
            </span>
            <div>
              <p>NOVO ITEM DO CATÁLOGO</p>
              <h2 id="new-service-title">Novo serviço</h2>
            </div>
          </div>
          <button
            className="service-modal__close"
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <X aria-hidden="true" />
          </button>
        </header>
        {modal.success ? (
          <div className="service-modal__success">
            <CheckCircle2 aria-hidden="true" />
            <h3>Serviço criado!</h3>
            <p>O novo serviço já está disponível no catálogo.</p>
          </div>
        ) : (
          <form className="service-modal__form" onSubmit={modal.submit}>
            <div className="service-modal__grid">
              <label>
                <span>Nome do serviço</span>
                <input
                  value={modal.form.name}
                  onChange={(event) =>
                    modal.updateField("name", event.target.value)
                  }
                  placeholder="Ex.: Corte Masculino"
                  required
                />
              </label>
              <label>
                <span>Categoria</span>
                <select
                  value={modal.form.category}
                  onChange={(event) =>
                    modal.updateField("category", event.target.value)
                  }
                >
                  {SERVICE_CATEGORIES.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Preço</span>
                <input
                  inputMode="decimal"
                  value={modal.form.price}
                  onChange={(event) =>
                    modal.updateField("price", event.target.value)
                  }
                  placeholder="R$ 0,00"
                  required
                />
              </label>
              <label>
                <span>Duração</span>
                <div className="service-modal__input-wrap">
                  <Clock3 aria-hidden="true" />
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={modal.form.duration}
                    onChange={(event) =>
                      modal.updateField("duration", event.target.value)
                    }
                    required
                  />
                  <small>min</small>
                </div>
              </label>
              <label className="service-modal__field--wide">
                <span>
                  Descrição <em>opcional</em>
                </span>
                <textarea
                  rows={3}
                  value={modal.form.description}
                  onChange={(event) =>
                    modal.updateField("description", event.target.value)
                  }
                  placeholder="Descreva o que está incluído no serviço"
                />
              </label>
            </div>
            {modal.error && (
              <p className="service-modal__error" role="alert">
                {modal.error}
              </p>
            )}
            <footer className="service-modal__footer">
              <button type="button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" disabled={modal.submitting}>
                {modal.submitting && <LoaderCircle aria-hidden="true" />}
                {modal.submitting ? "Salvando..." : "Criar serviço"}
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
};
