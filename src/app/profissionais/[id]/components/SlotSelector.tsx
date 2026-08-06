"use client";

import { useState } from "react";
import { submitBooking } from "@/features/booking/booking.actions";
import { formatSlot } from "@/utils/booking.utils";
import type { BookingServiceItem, BookingSlot } from "../professional-profile.types";
import { formatDuration, formatPrice } from "../professional-profile.utils";

const formatDateLabel = (date: string) =>
    new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(`${date}T00:00:00`));

export const SlotSelector = ({
    id,
    date,
    selectedService,
    selectedServiceId,
    slots,
}: {
    id: string;
    date: string;
    selectedService: BookingServiceItem;
    selectedServiceId: string;
    slots: BookingSlot[];
}) => {
    const [selectedSlotId, setSelectedSlotId] = useState("");
    const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);

    return (
        <form action={submitBooking} className="confirmForm">
            <input name="returnPath" type="hidden" value={`/profissionais/${id}`} />
            <input name="professionalId" type="hidden" value={id} />
            <input name="serviceId" type="hidden" value={selectedServiceId} />
            <input name="date" type="hidden" value={date} />

            <h3>
                Horários disponíveis · <span className="availableDate">{formatDateLabel(date)}</span>
            </h3>

            <div className="slots">
                {slots.map((slot) => (
                    <label key={slot.id} className="slotOption">
                        <input
                            checked={selectedSlotId === slot.id}
                            name="slotId"
                            onChange={() => setSelectedSlotId(slot.id)}
                            required
                            type="radio"
                            value={slot.id}
                        />
                        <span>{formatSlot(slot.startsAt)}</span>
                    </label>
                ))}
            </div>

            {!slots.length && <p className="empty">Nenhum horário disponível nesta data.</p>}

            <div className="bookingSummary">
                <div className="summaryRow">
                    <span>Serviço</span>
                    <strong>{selectedService.service.name}</strong>
                </div>
                <div className="summaryRow">
                    <span>Data</span>
                    <strong>{formatDateLabel(date)}</strong>
                </div>
                <div className="summaryRow">
                    <span>Horário</span>
                    <strong>{selectedSlot ? formatSlot(selectedSlot.startsAt) : "—"}</strong>
                </div>
                <div className="summaryRow">
                    <span>Duração</span>
                    <strong>{formatDuration(selectedService.service.duration)}</strong>
                </div>
                <div className="summaryRow summaryTotal">
                    <span>Total</span>
                    <strong>{formatPrice(selectedService.customPrice ?? selectedService.service.price)}</strong>
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

            <button className="confirmButton" type="submit">
                <span className="confirmButtonContent">
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
                        <path d="M12 14.5v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>Confirmar agendamento</span>
                </span>
            </button>
            <p className="confirmHint">Cancelamento gratuito até 2h antes</p>
        </form>
    );
};
