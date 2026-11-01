"use client";

import { submitBooking } from "@/features/booking/booking.actions";
import { formatSlot } from "@/utils/booking.utils";
import type {
  BookingServiceItem,
  BookingSlot,
} from "../professional-profile.types";
import { useSlotSelection } from "../hooks/use-slot-selection";
import {
  formatDateLabel,
  formatDuration,
  formatPrice,
} from "../professional-profile.utils";

export const SlotSelector = ({
  id,
  date,
  professionalName,
  selectedService,
  selectedServiceId,
  slots,
}: {
  id: string;
  date: string;
  professionalName: string;
  selectedService: BookingServiceItem;
  selectedServiceId: string;
  slots: BookingSlot[];
}) => {
  const { selectedSlot, selectedSlotId, selectSlot } = useSlotSelection(slots);

  return (
    <form action={submitBooking} className="booking-confirm">
      <input name="returnPath" type="hidden" value={`/profissionais/${id}`} />
      <input name="professionalId" type="hidden" value={id} />
      <input name="serviceId" type="hidden" value={selectedServiceId} />
      <input name="date" type="hidden" value={date} />
      <input name="professionalName" type="hidden" value={professionalName} />
      <input
        name="serviceName"
        type="hidden"
        value={selectedService.service.name}
      />
      <input name="dateLabel" type="hidden" value={formatDateLabel(date)} />
      <input
        name="timeLabel"
        type="hidden"
        value={selectedSlot ? formatSlot(selectedSlot.startsAt) : ""}
      />

      <h3>
        Horários disponíveis ·{" "}
        <span className="booking-confirm__date">{formatDateLabel(date)}</span>
      </h3>

      <div className="booking-confirm__slots">
        {slots.map((slot) => (
          <label key={slot.id} className="booking-confirm__slot">
            <input
              checked={selectedSlotId === slot.id}
              name="slotId"
              onChange={() => selectSlot(slot.id)}
              required
              type="radio"
              value={slot.id}
            />
            <span>{formatSlot(slot.startsAt)}</span>
          </label>
        ))}
      </div>

      {!slots.length && (
        <p className="profile__empty">Nenhum horário disponível nesta data.</p>
      )}

      <div className="booking-confirm__summary">
        <div className="booking-confirm__summary-row">
          <span>Serviço</span>
          <strong>{selectedService.service.name}</strong>
        </div>
        <div className="booking-confirm__summary-row">
          <span>Data</span>
          <strong>{formatDateLabel(date)}</strong>
        </div>
        <div className="booking-confirm__summary-row">
          <span>Horário</span>
          <strong>
            {selectedSlot ? formatSlot(selectedSlot.startsAt) : "—"}
          </strong>
        </div>
        <div className="booking-confirm__summary-row">
          <span>Duração</span>
          <strong>{formatDuration(selectedService.service.duration)}</strong>
        </div>
        <div className="booking-confirm__summary-row booking-confirm__summary-row--total">
          <span>Total</span>
          <strong>
            {formatPrice(
              selectedService.customPrice ?? selectedService.service.price,
            )}
          </strong>
        </div>
      </div>

      <label>
        Nome
        <input name="name" required />
      </label>
      <label>
        Telefone
        <input inputMode="numeric" name="phone" required />
      </label>
      <label>
        E-mail
        <input name="email" required type="email" />
      </label>

      <button className="booking-confirm__button" type="submit">
        <span className="booking-confirm__button-content">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 11V8a5 5 0 0 1 10 0v3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="5"
              y="11"
              width="14"
              height="9"
              rx="1.8"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 14.5v2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span>Confirmar agendamento</span>
        </span>
      </button>
      <p className="booking-confirm__hint">
        Cancelamento gratuito até 2h antes
      </p>
    </form>
  );
};
