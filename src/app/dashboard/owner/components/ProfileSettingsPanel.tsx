"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  Crown,
  LockKeyhole,
  Pencil,
  Save,
  ShieldCheck,
  Smartphone,
  Upload,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type ProfileSettingsData = { name: string; email?: string | null; avatar?: string | null; role?: string };
type SecurityModal = "password" | "two-factor" | "sessions" | null;

export function ProfileSettingsPanel({ profile }: { profile: ProfileSettingsData }) {
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [avatarSrc, setAvatarSrc] = useState(profile.avatar || `https://i.pravatar.cc/160?u=${encodeURIComponent(profile.name)}`);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [securityModal, setSecurityModal] = useState<SecurityModal>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const preferences = [["Notificações push", "Alertas importantes", notifications, setNotifications], ["E-mails promocionais", "Novidades e ofertas", promotions, setPromotions], ["Lembretes", "Avisos de agenda", reminders, setReminders]] as const;

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { setUploadOpen(false); setSecurityModal(null); } };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const chooseImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setUploadError("Escolha um arquivo de imagem."); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError("A imagem deve ter no máximo 5 MB."); return; }
    setUploadError("");
    setUploadPreview(URL.createObjectURL(file));
  };

  const closeUpload = () => { setUploadOpen(false); setUploadPreview(null); setUploadError(""); };
  const securityCopy = {
    password: { title: "Alterar senha", description: "Atualize sua senha de acesso.", body: <div className="profile-settings__modal-fields"><label>Senha atual<input type="password" placeholder="Digite sua senha atual" /></label><label>Nova senha<input type="password" placeholder="Mínimo de 8 caracteres" /></label><label>Confirmar nova senha<input type="password" placeholder="Repita a nova senha" /></label></div> },
    "two-factor": { title: "Autenticação em duas etapas", description: "Adicione uma camada extra de proteção.", body: <div className="profile-settings__modal-message"><ShieldCheck aria-hidden="true" /><p>Ative a autenticação em duas etapas para proteger sua conta mesmo quando sua senha for descoberta.</p><button type="button" className="profile-settings__modal-primary">Ativar autenticação</button></div> },
    sessions: { title: "Sessões ativas", description: "Gerencie os dispositivos conectados.", body: <div className="profile-settings__session-list"><div><Smartphone aria-hidden="true" /><span><b>Chrome · Este dispositivo</b><small>São Paulo, Brasil · Agora</small></span><strong>Ativa</strong></div><div><Smartphone aria-hidden="true" /><span><b>Firefox · Último acesso</b><small>São Paulo, Brasil · ontem</small></span><button type="button">Encerrar</button></div></div> },
  } as const;
  const activeSecurity = securityModal ? securityCopy[securityModal] : null;

  return (
    <div className="profile-settings">
      <aside className="profile-settings__sidebar">
        <section className="profile-settings__identity">
          <div className="profile-settings__avatar-wrap">
            <Avatar className="profile-settings__avatar"><AvatarImage src={avatarSrc} alt={profile.name} /><AvatarFallback>{initials}</AvatarFallback></Avatar>
            <button type="button" aria-label="Editar perfil" onClick={() => setUploadOpen(true)}><Pencil aria-hidden="true" /><span>Editar perfil</span></button>
          </div>
          <h2>{profile.name}</h2><p>{profile.email || "email não informado"}</p><strong><Crown aria-hidden="true" />{profile.role || "Conta BarberHub"}</strong>
          <div className="profile-settings__stats"><div><b>24</b><span>Atendimentos</span></div><div><b>4,9</b><span>Avaliação</span></div><div><b>R$ 1,8k</b><span>Total gerado</span></div></div>
        </section>
        <section className="profile-settings__card"><div className="profile-settings__card-heading"><h3>Preferências</h3><span>Configurações</span></div>{preferences.map(([title, description, checked, setChecked]) => <label className="profile-settings__switch-row" key={title}><span><b>{title}</b><small>{description}</small></span><input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} /><i aria-hidden="true" /></label>)}</section>
      </aside>
      <div className="profile-settings__main">
        <section className="profile-settings__card profile-settings__form-card"><header className="profile-settings__card-heading"><div><h3>Informações pessoais</h3><p>Mantenha seus dados atualizados.</p></div><button type="button" className="profile-settings__save" onClick={() => setSaved(true)}><Save aria-hidden="true" />{saved ? "Alterações salvas" : "Salvar alterações"}</button></header><div className="profile-settings__fields"><label>Nome completo<input defaultValue={profile.name} /></label><label>E-mail<input type="email" defaultValue={profile.email || ""} /></label><label>Telefone<input defaultValue="(11) 98765-4321" /></label><label>Data de nascimento<input defaultValue="14/03/1996" /></label><label className="profile-settings__field--wide">Endereço<input defaultValue="Rua das Palmeiras, 245 — São Paulo, SP" /></label></div></section>
        <section className="profile-settings__card profile-settings__security"><header className="profile-settings__card-heading"><div><h3>Segurança</h3><p>Proteja o acesso à sua conta.</p></div></header><button type="button" onClick={() => setSecurityModal("password")}><LockKeyhole aria-hidden="true" /><span><b>Alterar senha</b><small>Atualize sua senha de acesso</small></span><ChevronRight aria-hidden="true" /></button><button type="button" onClick={() => setSecurityModal("two-factor")}><ShieldCheck aria-hidden="true" /><span><b>Autenticação em duas etapas</b><small>Adicione uma camada extra de proteção</small></span><ChevronRight aria-hidden="true" /></button><button type="button" onClick={() => setSecurityModal("sessions")}><Smartphone aria-hidden="true" /><span><b>Sessões ativas</b><small>Gerencie os dispositivos conectados</small></span><ChevronRight aria-hidden="true" /></button></section>
      </div>

      {uploadOpen && <div className="profile-settings__modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeUpload(); }}><div className="profile-settings__modal" role="dialog" aria-modal="true" aria-labelledby="profile-upload-title"><header><div><h2 id="profile-upload-title">Editar foto de perfil</h2><p>Escolha uma imagem nítida para sua conta.</p></div><button type="button" aria-label="Fechar" onClick={closeUpload}><X /></button></header><button type="button" className="profile-settings__upload-zone" onClick={() => fileInputRef.current?.click()}><Avatar className="profile-settings__upload-avatar"><AvatarImage src={uploadPreview || avatarSrc} alt="Pré-visualização" /><AvatarFallback>{initials}</AvatarFallback></Avatar><Upload aria-hidden="true" /><b>Selecionar imagem</b><span>PNG, JPG ou WEBP · até 5 MB</span></button><input ref={fileInputRef} className="profile-settings__file-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseImage} />{uploadError && <p className="profile-settings__modal-error">{uploadError}</p>}<footer><button type="button" className="profile-settings__modal-secondary" onClick={closeUpload}>Cancelar</button><button type="button" className="profile-settings__modal-primary" disabled={!uploadPreview} onClick={() => { if (uploadPreview) setAvatarSrc(uploadPreview); closeUpload(); }}><Check aria-hidden="true" />Salvar foto</button></footer></div></div>}
      {activeSecurity && <div className="profile-settings__modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSecurityModal(null); }}><div className="profile-settings__modal" role="dialog" aria-modal="true" aria-labelledby="security-modal-title"><header><div><h2 id="security-modal-title">{activeSecurity.title}</h2><p>{activeSecurity.description}</p></div><button type="button" aria-label="Fechar" onClick={() => setSecurityModal(null)}><X /></button></header>{activeSecurity.body}<footer><button type="button" className="profile-settings__modal-secondary" onClick={() => setSecurityModal(null)}>Fechar</button>{securityModal === "password" && <button type="button" className="profile-settings__modal-primary" onClick={() => setSecurityModal(null)}><Check aria-hidden="true" />Atualizar senha</button>}</footer></div></div>}
    </div>
  );
}
