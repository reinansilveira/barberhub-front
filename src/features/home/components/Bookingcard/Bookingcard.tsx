"use client";

import "./Bookingcard.scss";

import { AvailabilityCalendar } from "@/features/booking/calendar/AvailabilityCalendar";
import { formatSlot } from "@/utils/booking.utils";
import { cn } from "@/utils/class-names";
import { type BookingProfessional, useBookingCard } from "./use-booking-card";

export default function BookingCard({
  professionals,
}: {
  professionals: BookingProfessional[];
}) {
  const booking = useBookingCard(professionals);
  const {
    form,
    professionalId,
    serviceId,
    slotId,
    services,
    slots,
    selectedDate,
    showDatePicker,
    loadingSlots,
    error,
  } = booking;

  return (
    <div className="booking-card">
      <span className="booking-card__label">Agendamento rápido</span>
      <h2 className="booking-card__title">Reserve seu horário</h2>

      <form onSubmit={form.handleSubmit(booking.submit)}>
        <div className="booking-card__field">
          <label className="booking-card__field-label" htmlFor="professionalId">
            Profissional
          </label>
          <select
            className="booking-card__select"
            id="professionalId"
            {...booking.registerProfessional()}
          >
            <option value="">Selecione um profissional</option>
            {professionals.map((professional) => (
              <option key={professional.id} value={professional.id}>
                {professional.name}
              </option>
            ))}
          </select>
        </div>

        {professionalId && (
          <>
            <div className="booking-card__field">
              <label className="booking-card__field-label" htmlFor="serviceId">
                Serviço
              </label>
              <select
                className="booking-card__select"
                id="serviceId"
                {...booking.registerService()}
              >
                <option value="">Selecione um serviço</option>
                {services.map((service) => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.service.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="booking-card__date-choice">
              {showDatePicker ? (
                <AvailabilityCalendar
                  key={professionalId}
                  professionalId={professionalId}
                  value={selectedDate}
                  onChange={booking.changeDate}
                />
              ) : (
                <>
                  <span className="booking-card__field-label">
                    Procurando horários para hoje
                  </span>
                  <button
                    className="booking-card__change-date"
                    onClick={booking.showDateOptions}
                    type="button"
                  >
                    Escolher outra data
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {serviceId && (
          <div className="booking-card__field">
            <span className="booking-card__field-label">
              Horário disponível
            </span>

            <div className="booking-card__slots">
              {slots.map((slot) => (
                <button
                  className={cn(
                    "booking-card__slot",
                    slot.id === slotId && "booking-card__slot--selected",
                  )}
                  key={slot.id}
                  onClick={() => form.setValue("slotId", slot.id)}
                  type="button"
                >
                  {formatSlot(slot.startsAt)}
                </button>
              ))}
            </div>

            {!loadingSlots && !slots.length && (
              <div className="booking-card__empty-slots">
                <span>Não há horários disponíveis nesta data.</span>
                {!showDatePicker && (
                  <button
                    className="booking-card__change-date"
                    onClick={booking.showDateOptions}
                    type="button"
                  >
                    Escolher outra data
                  </button>
                )}
              </div>
            )}

            <input
              type="hidden"
              {...form.register("slotId", { required: true })}
            />
          </div>
        )}

        {slotId && (
          <>
            <div className="booking-card__field">
              <label className="booking-card__field-label">
                Nome
                <input
                  className="booking-card__select"
                  {...form.register("name")}
                />
              </label>
            </div>

            <div className="booking-card__field">
              <label className="booking-card__field-label">
                Telefone
                <input
                  className="booking-card__select"
                  {...form.register("phone")}
                />
              </label>
            </div>

            <div className="booking-card__field">
              <label className="booking-card__field-label">
                E-mail
                <input
                  className="booking-card__select"
                  type="email"
                  {...form.register("email")}
                />
              </label>
            </div>

            <button className="booking-card__submit" type="submit">
              Confirmar agendamento
            </button>
          </>
        )}
      </form>

      {error && <p className="booking-card__error">{error}</p>}
    </div>
  );
}
