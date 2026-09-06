"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, Scissors, UserRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createUser, generateTempPassword } from "@/services/user";
import { apiErrorMessage } from "@/services/api/api-error";

type NewBarberModalProps = { isOpen: boolean; onClose: () => void };
const initialForm = { name: "", email: "", phone: "", role: "Barbeiro profissional" };

export function NewBarberModal({ isOpen, onClose }: NewBarberModalProps) {
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
  function updateField(field: keyof typeof initialForm, value: string) { setForm((current) => ({ ...current, [field]: value })); setError(""); }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!form.name.trim() || !form.email.trim()) { setError("Preencha o nome e o e-mail do barbeiro."); return; }
    setSubmitting(true);
    try {
      await createUser({ name: form.name.trim(), email: form.email.trim(), password: generateTempPassword(), phone: form.phone.trim() || undefined, role: "PROFESSIONAL" });
      setSuccess(true);
      window.setTimeout(() => { setForm(initialForm); setSuccess(false); onClose(); router.refresh(); }, 900);
    } catch (requestError) { setError(apiErrorMessage(requestError, "Não foi possível cadastrar o barbeiro.")); } finally { setSubmitting(false); }
  }
  return (
    <div className="barber-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="barber-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="new-barber-title" tabIndex={-1} ref={dialogRef}>
        <header className="barber-modal__header"><div className="barber-modal__heading"><span><Scissors aria-hidden="true" /></span><div><p>NOVA PESSOA NA EQUIPE</p><h2 id="new-barber-title">Novo barbeiro</h2></div></div><button className="barber-modal__close" type="button" onClick={onClose} aria-label="Fechar modal"><X aria-hidden="true" /></button></header>
        {success ? <div className="barber-modal__success"><CheckCircle2 aria-hidden="true" /><h3>Barbeiro cadastrado!</h3><p>O profissional já foi adicionado à sua equipe.</p></div> : <form className="barber-modal__form" onSubmit={handleSubmit}>
          <div className="barber-modal__intro"><UserRound aria-hidden="true" /><p>Cadastre os dados principais para liberar o profissional na agenda.</p></div>
          <div className="barber-modal__grid"><label><span>Nome completo</span><input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Ex.: Enzo Ribeiro" required /></label><label><span>Função</span><select value={form.role} onChange={(event) => updateField("role", event.target.value)}><option>Barbeiro profissional</option><option>Barbeiro sênior</option><option>Barbeiro pleno</option><option>Barbeiro júnior</option></select></label><label><span>E-mail de acesso</span><input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="barbeiro@email.com" required /></label><label><span>Telefone <em>opcional</em></span><input type="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="(11) 98765-4321" /></label></div>
          <p className="barber-modal__hint">Uma senha temporária poderá ser definida pelo profissional no primeiro acesso.</p>{error && <p className="barber-modal__error" role="alert">{error}</p>}
          <footer className="barber-modal__footer"><button type="button" onClick={onClose}>Cancelar</button><button type="submit" disabled={submitting}>{submitting && <LoaderCircle aria-hidden="true" />}{submitting ? "Salvando..." : "Cadastrar barbeiro"}</button></footer>
        </form>}
      </div>
    </div>
  );
}
