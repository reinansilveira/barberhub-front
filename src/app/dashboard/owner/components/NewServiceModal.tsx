"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock3, LoaderCircle, Scissors, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createService } from "@/services/service";
import { apiErrorMessage } from "@/services/api/api-error";

type NewServiceModalProps = { isOpen: boolean; onClose: () => void };
const initialForm = { name: "", description: "", price: "", duration: "45", category: "Cortes" };

export function NewServiceModal({ isOpen, onClose }: NewServiceModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", handleEscape); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const price = Number(form.price.replace(",", "."));
    const duration = Number(form.duration);
    if (!form.name.trim() || !price || !duration) {
      setError("Preencha o nome, o preço e a duração do serviço.");
      return;
    }
    setSubmitting(true);
    try {
      await createService({ name: form.name.trim(), description: form.description.trim() || undefined, price, duration, category: form.category });
      setSuccess(true);
      window.setTimeout(() => { setForm(initialForm); setSuccess(false); onClose(); router.refresh(); }, 900);
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Não foi possível criar o serviço."));
    } finally { setSubmitting(false); }
  }

  return (
    <div className="service-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="service-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="new-service-title" tabIndex={-1} ref={dialogRef}>
        <header className="service-modal__header">
          <div className="service-modal__heading"><span><Scissors aria-hidden="true" /></span><div><p>NOVO ITEM DO CATÁLOGO</p><h2 id="new-service-title">Novo serviço</h2></div></div>
          <button className="service-modal__close" type="button" onClick={onClose} aria-label="Fechar modal"><X aria-hidden="true" /></button>
        </header>
        {success ? (
          <div className="service-modal__success"><CheckCircle2 aria-hidden="true" /><h3>Serviço criado!</h3><p>O novo serviço já está disponível no catálogo.</p></div>
        ) : (
          <form className="service-modal__form" onSubmit={handleSubmit}>
            <div className="service-modal__grid">
              <label><span>Nome do serviço</span><input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Ex.: Corte Masculino" required /></label>
              <label><span>Categoria</span><select value={form.category} onChange={(event) => updateField("category", event.target.value)}><option>Cortes</option><option>Barba</option><option>Combos</option><option>Tratamentos</option></select></label>
              <label><span>Preço</span><input inputMode="decimal" value={form.price} onChange={(event) => updateField("price", event.target.value)} placeholder="R$ 0,00" required /></label>
              <label><span>Duração</span><div className="service-modal__input-wrap"><Clock3 aria-hidden="true" /><input type="number" min="5" step="5" value={form.duration} onChange={(event) => updateField("duration", event.target.value)} required /><small>min</small></div></label>
              <label className="service-modal__field--wide"><span>Descrição <em>opcional</em></span><textarea rows={3} value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Descreva o que está incluído no serviço" /></label>
            </div>
            {error && <p className="service-modal__error" role="alert">{error}</p>}
            <footer className="service-modal__footer"><button type="button" onClick={onClose}>Cancelar</button><button type="submit" disabled={submitting}>{submitting && <LoaderCircle aria-hidden="true" />}{submitting ? "Salvando..." : "Criar serviço"}</button></footer>
          </form>
        )}
      </div>
    </div>
  );
}
