"use client";

import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  LoaderCircle,
  Scissors,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";
import {
  useNewAppointmentModal,
  type NewAppointmentModalProps,
} from "../hooks/use-new-appointment-modal";
import { todayInBrazil } from "@/utils/date-utils";
import { cn } from "@/utils/class-names";

const slotLabel = (startsAt: string) => {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(startsAt));
};

export const NewAppointmentModal = (props: NewAppointmentModalProps) => {
  const { isOpen, clientId: currentClientId } = props;
  const {
    dialogRef,
    professionals,
    availableServices,
    slots,
    professionalId,
    serviceId,
    date,
    slotId,
    clientId,
    client,
    clients,
    loadingProfessionals,
    loadingSlots,
    submitting,
    error,
    success,
    isRescheduling,
    canSubmit,
    closeModal,
    selectProfessional,
    selectDate,
    setServiceId,
    setSlotId,
    setClientId,
    setClient,
    handleSubmit,
  } = useNewAppointmentModal(props);

  if (!isOpen) return null;

  return (
    <div
      className="appointment-modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div
        className="appointment-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-appointment-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <header className="appointment-modal__header">
          <div className="appointment-modal__heading">
            <span className="appointment-modal__heading-icon">
              <CalendarDays aria-hidden="true" />
            </span>
            <div>
              <p>{isRescheduling ? "REAGENDAMENTO" : "NOVA RESERVA"}</p>
              <h2 id="new-appointment-title">
                {isRescheduling ? "Remarcar agendamento" : "Novo agendamento"}
              </h2>
            </div>
          </div>
          <button
            className="appointment-modal__close"
            type="button"
            onClick={closeModal}
            aria-label="Fechar modal"
          >
            <X aria-hidden="true" />
          </button>
        </header>
        {success ? (
          <div className="appointment-modal__success">
            <CheckCircle2 aria-hidden="true" />
            <h3>
              {isRescheduling
                ? "Agendamento remarcado!"
                : "Agendamento confirmado!"}
            </h3>
            <p>A agenda foi atualizada com o novo horário.</p>
          </div>
        ) : (
          <form className="appointment-modal__form" onSubmit={handleSubmit}>
            <section className="appointment-modal__section">
              <div className="appointment-modal__section-title">
                <Scissors aria-hidden="true" />
                <div>
                  <h3>
                    {isRescheduling
                      ? "Novo horário"
                      : "Detalhes do atendimento"}
                  </h3>
                  <p>
                    {isRescheduling
                      ? "Escolha o novo profissional, serviço e horário."
                      : "Escolha quem irá realizar o serviço e quando."}
                  </p>
                </div>
              </div>
              <div className="appointment-modal__grid">
                <label className="appointment-modal__field">
                  <span>Profissional</span>
                  <div className="appointment-modal__select-wrap">
                    <select
                      value={professionalId}
                      onChange={(event) =>
                        selectProfessional(event.target.value)
                      }
                      required
                      disabled={loadingProfessionals}
                    >
                      <option value="">
                        {loadingProfessionals
                          ? "Carregando profissionais..."
                          : "Selecione o profissional"}
                      </option>
                      {professionals.map((professional) => (
                        <option value={professional.id} key={professional.id}>
                          {professional.user.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown aria-hidden="true" />
                  </div>
                </label>
                <label className="appointment-modal__field">
                  <span>Serviço</span>
                  <div className="appointment-modal__select-wrap">
                    <select
                      value={serviceId}
                      onChange={(event) => setServiceId(event.target.value)}
                      required
                      disabled={!professionalId}
                    >
                      <option value="">Selecione o serviço</option>
                      {availableServices.map((service) => (
                        <option value={service.id} key={service.id}>
                          {service.name} · R${" "}
                          {Number(service.price).toFixed(2).replace(".", ",")}
                        </option>
                      ))}
                    </select>
                    <ChevronDown aria-hidden="true" />
                  </div>
                </label>
                <label className="appointment-modal__field appointment-modal__field--date">
                  <span>Data</span>
                  <div className="appointment-modal__input-wrap">
                    <CalendarDays aria-hidden="true" />
                    <input
                      type="date"
                      min={todayInBrazil()}
                      value={date}
                      onChange={(event) => selectDate(event.target.value)}
                      required
                    />
                  </div>
                </label>
              </div>
              <div className="appointment-modal__slots">
                <div>
                  <span>Horários disponíveis</span>
                  {loadingSlots && (
                    <small>
                      <LoaderCircle aria-hidden="true" /> Atualizando
                    </small>
                  )}
                </div>
                {!professionalId ? (
                  <p>Selecione um profissional para ver a agenda.</p>
                ) : !loadingSlots && !slots.length ? (
                  <p>Nenhum horário livre nesta data.</p>
                ) : (
                  <div className="appointment-modal__slots-grid">
                    {slots.map((slot) => (
                      <label
                        key={slot.id}
                        className={cn(
                          "appointment-modal__slot",
                          slotId === slot.id &&
                            "appointment-modal__slot--selected",
                        )}
                      >
                        <input
                          type="radio"
                          name="slot"
                          value={slot.id}
                          checked={slotId === slot.id}
                          onChange={() => setSlotId(slot.id)}
                        />
                        <Clock3 aria-hidden="true" />
                        {slotLabel(slot.startsAt)}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </section>
            {!currentClientId && (
              <section className="appointment-modal__section appointment-modal__section--client">
                <div className="appointment-modal__section-title">
                  <UsersRound aria-hidden="true" />
                  <div>
                    <h3>Cliente</h3>
                    <p>Use um cliente existente ou cadastre um novo.</p>
                  </div>
                </div>
                <label className="appointment-modal__field">
                  <span>
                    Cliente já cadastrado <em>opcional</em>
                  </span>
                  <div className="appointment-modal__select-wrap">
                    <select
                      value={clientId}
                      onChange={(event) => setClientId(event.target.value)}
                    >
                      <option value="">Cadastrar novo cliente</option>
                      {clients.map((existingClient) => (
                        <option
                          key={existingClient.id}
                          value={existingClient.id}
                        >
                          {existingClient.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown aria-hidden="true" />
                  </div>
                </label>
                {!clientId && (
                  <div className="appointment-modal__grid appointment-modal__grid--client">
                    <label className="appointment-modal__field">
                      <span>Nome completo</span>
                      <div className="appointment-modal__input-wrap">
                        <UserPlus aria-hidden="true" />
                        <input
                          value={client.name}
                          onChange={(event) =>
                            setClient({ ...client, name: event.target.value })
                          }
                          placeholder="Nome do cliente"
                          required
                        />
                      </div>
                    </label>
                    <label className="appointment-modal__field">
                      <span>Telefone</span>
                      <div className="appointment-modal__input-wrap">
                        <input
                          value={client.phone}
                          onChange={(event) =>
                            setClient({ ...client, phone: event.target.value })
                          }
                          placeholder="(00) 00000-0000"
                          required
                        />
                      </div>
                    </label>
                    <label className="appointment-modal__field appointment-modal__field--wide">
                      <span>E-mail</span>
                      <div className="appointment-modal__input-wrap">
                        <input
                          type="email"
                          value={client.email}
                          onChange={(event) =>
                            setClient({ ...client, email: event.target.value })
                          }
                          placeholder="cliente@email.com"
                          required
                        />
                      </div>
                    </label>
                  </div>
                )}
              </section>
            )}
            {error && (
              <p className="appointment-modal__error" role="alert">
                {error}
              </p>
            )}
            <footer className="appointment-modal__footer">
              <button
                type="button"
                className="appointment-modal__cancel"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="appointment-modal__submit"
                disabled={submitting || !canSubmit}
              >
                {submitting && <LoaderCircle aria-hidden="true" />}
                {submitting
                  ? "Confirmando..."
                  : isRescheduling
                    ? "Confirmar remarcação"
                    : "Confirmar agendamento"}
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
};
