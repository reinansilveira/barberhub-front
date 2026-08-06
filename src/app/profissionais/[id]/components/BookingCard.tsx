import { ProfileAvailabilityCalendar } from "@/features/booking/calendar/ProfileAvailabilityCalendar";
import type { BookingServiceItem, BookingSlot } from "../professional-profile.types";
import { formatPrice, formatDuration } from "../professional-profile.utils";
import { SlotSelector } from "./SlotSelector";

export const BookingCard = ({
  id,
  professionalName,
  slots,
  selectedServiceId,
  selectedService,
  date,
  error,
  success,
}: {
  id: string;
  professionalName: string;
  slots: BookingSlot[];
  selectedServiceId: string;
  selectedService: BookingServiceItem | undefined;
  date: string;
  error?: string;
  success?: string;
}) => {
  return (
    <aside className="bookingCard" id="agendar">
      <div className="bookingHeader">
        <div className="bookingHeaderTop">
          <span className="bookingHeaderIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="16" rx="3" fill="currentColor" />
              <path d="M7 3v4M17 3v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M3 9.5h18" stroke="#17150f" strokeWidth="2" />
              <path
                d="m8.5 14.5 2.2 2.2 4.8-4.8"
                stroke="#17150f"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h2>Agendar horário</h2>
        </div>
        <p className="bookingHeaderSubtitle">Escolha o serviço, data e hora</p>
      </div>

      <span className="fieldLabel">Serviço selecionado</span>
      {selectedService ? (
        <div className="selectedService">
          <div className="selectedServiceInfo">
            <strong>{selectedService.service.name}</strong>
            <span className="selectedServiceDuration">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span>{formatDuration(selectedService.service.duration)}</span>
            </span>
          </div>
          <strong className="selectedServicePrice">
            {formatPrice(selectedService.customPrice ?? selectedService.service.price)}
          </strong>
        </div>
      ) : (
        <div className="selectedServiceEmpty">Escolha um serviço na lista ao lado</div>
      )}

      <form action={`/profissionais/${id}`} className="filterForm">
        <input name="serviceId" type="hidden" value={selectedServiceId} />

        <span className="fieldLabel">Escolha a data</span>
        <input name="date" type="hidden" value={date} />
        <ProfileAvailabilityCalendar date={date} professionalId={id} />
      </form>

      {selectedService && (
        <SlotSelector
          id={id}
          date={date}
          selectedService={selectedService}
          selectedServiceId={selectedServiceId}
          slots={slots}
        />
      )}

      {error && <p className="error">{error}</p>}
      {success === "1" && <p className="success">Agendamento confirmado com sucesso.</p>}
    </aside>
  );
};
