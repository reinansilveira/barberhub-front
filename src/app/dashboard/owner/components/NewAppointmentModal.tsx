"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, CheckCircle2, ChevronDown, Clock3, LoaderCircle, Scissors, UserPlus, UsersRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Appointment } from "@/services/appointment";
import { createAppointment } from "@/services/appointment";
import { createClient } from "@/services/client";
import type { ProfessionalResponseDto } from "@/services/professional";
import { findAllProfessionals } from "@/services/professional";
import type { ProfessionalService, Service } from "@/services/service";
import { findProfessionalServices } from "@/services/service";
import { findAvailableSlots, type Slot } from "@/services/slot";
import { apiErrorMessage } from "@/services/api/api-error";
import { todayInBrazil } from "@/utils/booking.utils";

type NewAppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  appointments: Appointment[];
};

type ClientOption = { id: string; name: string };

const emptyClient = { name: "", phone: "", email: "" };

function slotLabel(startsAt: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(startsAt));
}

export function NewAppointmentModal({ isOpen, onClose, services, appointments }: NewAppointmentModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [professionals, setProfessionals] = useState<ProfessionalResponseDto[]>([]);
  const [professionalServices, setProfessionalServices] = useState<ProfessionalService[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [professionalId, setProfessionalId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(todayInBrazil());
  const [slotId, setSlotId] = useState("");
  const [clientId, setClientId] = useState("");
  const [client, setClient] = useState(emptyClient);
  const [loadingProfessionals, setLoadingProfessionals] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const clients = useMemo<ClientOption[]>(() => {
    const unique = new Map<string, ClientOption>();
    appointments.forEach((appointment) => {
      if (appointment.client.id) unique.set(appointment.client.id, { id: appointment.client.id, name: appointment.client.name });
    });
    return [...unique.values()].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }, [appointments]);

  const availableServices = professionalId
    ? professionalServices.map((item) => item.service)
    : services.filter((service) => service.active);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    void Promise.resolve().then(() => setLoadingProfessionals(true));
    findAllProfessionals(true)
      .then(setProfessionals)
      .catch(() => setError("Não foi possível carregar os profissionais. Tente novamente."))
      .finally(() => setLoadingProfessionals(false));
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!professionalId) return;
    findProfessionalServices(professionalId)
      .then((items) => setProfessionalServices(items.filter((item) => item.active && item.service.active)))
      .catch(() => setError("Não foi possível carregar os serviços deste profissional."));
  }, [professionalId]);

  useEffect(() => {
    if (!professionalId || !date) return;
    findAvailableSlots(professionalId, date)
      .then(setSlots)
      .catch(() => setError("Não foi possível carregar os horários disponíveis."))
      .finally(() => setLoadingSlots(false));
  }, [professionalId, date]);

  if (!isOpen) return null;

  function selectProfessional(id: string) {
    setProfessionalId(id);
    setProfessionalServices([]);
    setServiceId("");
    setSlots([]);
    setSlotId("");
    setLoadingSlots(Boolean(id));
    setError("");
  }

  function selectDate(value: string) {
    setDate(value);
    setSlots([]);
    setSlotId("");
    setLoadingSlots(Boolean(professionalId && value));
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!professionalId || !serviceId || !slotId) {
      setError("Selecione o profissional, serviço e horário para continuar.");
      return;
    }
    if (!clientId && (!client.name.trim() || !client.phone.trim())) {
      setError("Informe o nome e o telefone do novo cliente.");
      return;
    }
    setSubmitting(true);
    try {
      const finalClientId = clientId || (await createClient({ name: client.name.trim(), phone: client.phone.trim(), email: client.email.trim() || undefined })).id;
      await createAppointment({ clientId: finalClientId, professionalId, serviceId, slotId });
      setSuccess(true);
      window.setTimeout(() => { onClose(); router.refresh(); }, 900);
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Não foi possível criar o agendamento."));
    } finally { setSubmitting(false); }
  }

  return (
    <div className="appointment-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="appointment-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="new-appointment-title" tabIndex={-1} ref={dialogRef}>
        <header className="appointment-modal__header">
          <div className="appointment-modal__heading">
            <span className="appointment-modal__heading-icon"><CalendarDays aria-hidden="true" /></span>
            <div><p>NOVA RESERVA</p><h2 id="new-appointment-title">Novo agendamento</h2></div>
          </div>
          <button className="appointment-modal__close" type="button" onClick={onClose} aria-label="Fechar modal"><X aria-hidden="true" /></button>
        </header>
        {success ? (
          <div className="appointment-modal__success"><CheckCircle2 aria-hidden="true" /><h3>Agendamento confirmado!</h3><p>A agenda foi atualizada com o novo horário.</p></div>
        ) : (
          <form className="appointment-modal__form" onSubmit={handleSubmit}>
            <section className="appointment-modal__section">
              <div className="appointment-modal__section-title"><Scissors aria-hidden="true" /><div><h3>Detalhes do atendimento</h3><p>Escolha quem irá realizar o serviço e quando.</p></div></div>
              <div className="appointment-modal__grid">
                <label className="appointment-modal__field"><span>Profissional</span><div className="appointment-modal__select-wrap"><select value={professionalId} onChange={(event) => selectProfessional(event.target.value)} required disabled={loadingProfessionals}><option value="">{loadingProfessionals ? "Carregando profissionais..." : "Selecione o profissional"}</option>{professionals.map((professional) => <option value={professional.id} key={professional.id}>{professional.user.name}</option>)}</select><ChevronDown aria-hidden="true" /></div></label>
                <label className="appointment-modal__field"><span>Serviço</span><div className="appointment-modal__select-wrap"><select value={serviceId} onChange={(event) => setServiceId(event.target.value)} required disabled={!professionalId}><option value="">Selecione o serviço</option>{availableServices.map((service) => <option value={service.id} key={service.id}>{service.name} · R$ {Number(service.price).toFixed(2).replace(".", ",")}</option>)}</select><ChevronDown aria-hidden="true" /></div></label>
                <label className="appointment-modal__field appointment-modal__field--date"><span>Data</span><div className="appointment-modal__input-wrap"><CalendarDays aria-hidden="true" /><input type="date" min={todayInBrazil()} value={date} onChange={(event) => selectDate(event.target.value)} required /></div></label>
              </div>
              <div className="appointment-modal__slots"><div><span>Horários disponíveis</span>{loadingSlots && <small><LoaderCircle aria-hidden="true" /> Atualizando</small>}</div>{!professionalId ? <p>Selecione um profissional para ver a agenda.</p> : !loadingSlots && !slots.length ? <p>Nenhum horário livre nesta data.</p> : <div className="appointment-modal__slots-grid">{slots.map((slot) => <label key={slot.id} className={slotId === slot.id ? "is-selected" : ""}><input type="radio" name="slot" value={slot.id} checked={slotId === slot.id} onChange={() => setSlotId(slot.id)} /><Clock3 aria-hidden="true" />{slotLabel(slot.startsAt)}</label>)}</div>}</div>
            </section>
            <section className="appointment-modal__section appointment-modal__section--client">
              <div className="appointment-modal__section-title"><UsersRound aria-hidden="true" /><div><h3>Cliente</h3><p>Use um cliente existente ou cadastre um novo.</p></div></div>
              <label className="appointment-modal__field"><span>Cliente já cadastrado <em>opcional</em></span><div className="appointment-modal__select-wrap"><select value={clientId} onChange={(event) => setClientId(event.target.value)}><option value="">Cadastrar novo cliente</option>{clients.map((existingClient) => <option key={existingClient.id} value={existingClient.id}>{existingClient.name}</option>)}</select><ChevronDown aria-hidden="true" /></div></label>
              {!clientId && <div className="appointment-modal__grid appointment-modal__grid--client"><label className="appointment-modal__field"><span>Nome completo</span><div className="appointment-modal__input-wrap"><UserPlus aria-hidden="true" /><input value={client.name} onChange={(event) => setClient({ ...client, name: event.target.value })} placeholder="Nome do cliente" required /></div></label><label className="appointment-modal__field"><span>Telefone</span><div className="appointment-modal__input-wrap"><input value={client.phone} onChange={(event) => setClient({ ...client, phone: event.target.value })} placeholder="(00) 00000-0000" required /></div></label><label className="appointment-modal__field appointment-modal__field--wide"><span>E-mail <em>opcional</em></span><div className="appointment-modal__input-wrap"><input type="email" value={client.email} onChange={(event) => setClient({ ...client, email: event.target.value })} placeholder="cliente@email.com" /></div></label></div>}
            </section>
            {error && <p className="appointment-modal__error" role="alert">{error}</p>}
            <footer className="appointment-modal__footer"><button type="button" className="appointment-modal__cancel" onClick={onClose}>Cancelar</button><button type="submit" className="appointment-modal__submit" disabled={submitting}>{submitting && <LoaderCircle aria-hidden="true" />}{submitting ? "Confirmando..." : "Confirmar agendamento"}</button></footer>
          </form>
        )}
      </div>
    </div>
  );
}
