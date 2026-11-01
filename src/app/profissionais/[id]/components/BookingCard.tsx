import { ProfileAvailabilityCalendar } from "@/features/booking/calendar/ProfileAvailabilityCalendar";
import type {
  BookingServiceItem,
  BookingSlot,
} from "../professional-profile.types";
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
}: {
  id: string;
  professionalName: string;
  slots: BookingSlot[];
  selectedServiceId: string;
  selectedService: BookingServiceItem | undefined;
  date: string;
  error?: string;
}) => {
  return (
    <aside className="profile-booking" id="agendar">
      <div className="profile-booking__header">
        <div className="profile-booking__header-top">
          <span className="profile-booking__header-icon" aria-hidden="true">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="3"
                fill="currentColor"
              />
              <path
                d="M7 3v4M17 3v4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
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
        <p className="profile-booking__header-subtitle">
          Escolha o serviço, data e hora
        </p>
      </div>

      <span className="profile-booking__field-label">Serviço selecionado</span>
      {selectedService ? (
        <div className="profile-booking__service">
          <div className="profile-booking__service-info">
            <strong>{selectedService.service.name}</strong>
            <span className="profile-booking__service-duration">
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
          <strong className="profile-booking__service-price">
            {formatPrice(
              selectedService.customPrice ?? selectedService.service.price,
            )}
          </strong>
        </div>
      ) : (
        <div className="profile-booking__service-empty">
          Escolha um serviço na lista ao lado
        </div>
      )}

      <form action={`/profissionais/${id}`} className="profile-booking__filter">
        <input name="serviceId" type="hidden" value={selectedServiceId} />

        <span className="profile-booking__field-label">Escolha a data</span>
        <input name="date" type="hidden" value={date} />
        <ProfileAvailabilityCalendar date={date} professionalId={id} />
      </form>

      {selectedService && (
        <SlotSelector
          id={id}
          professionalName={professionalName}
          date={date}
          selectedService={selectedService}
          selectedServiceId={selectedServiceId}
          slots={slots}
        />
      )}

      {error && (
        <p className="profile-booking__error" role="alert">
          {error}
        </p>
      )}
    </aside>
  );
};
