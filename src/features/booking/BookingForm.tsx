import { submitBooking } from "./actions";
import { formatSlot, todayInBrazil } from "./booking.utils";
import type { BookingFilters, BookingViewData } from "./booking.types";
import type { ProfessionalResponseDto } from "@/services/professional";
import styles from "@/features/app/AppPage.module.scss";

interface BookingFormProps {
  filters: BookingFilters;
  professionals: ProfessionalResponseDto[];
  data: BookingViewData;
  error?: string;
  success?: boolean;
  bookingPath?: string;
  lockProfessional?: boolean;
}

export function BookingForm({
  filters,
  professionals,
  data,
  error,
  success,
  bookingPath = "/agendar",
  lockProfessional = false,
}: BookingFormProps) {
  const selectedDate = filters.date ?? todayInBrazil();
  const selectedProfessional = professionals.find(
    (professional) => professional.id === filters.professionalId,
  );

  return (
    <>
      <form action={bookingPath} className={styles.form}>
        <div className={styles.grid}>
          {lockProfessional ? (
            <>
              <input name="professionalId" type="hidden" value={filters.professionalId} />
              <div className={styles.selectedProfessional}>
                <span>Profissional</span>
                <strong>{selectedProfessional?.user.name}</strong>
              </div>
              <div className={styles.dateChoice}>
                <span>Data selecionada</span>
                <strong>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" }).format(new Date(`${selectedDate}T12:00:00`))}</strong>
                <details>
                  <summary>Agendar outro dia</summary>
                  <label>
                    Escolha uma data
                    <input
                      defaultValue={selectedDate}
                      min={todayInBrazil()}
                      name="date"
                      type="date"
                    />
                  </label>
                  <small>Use o calendário para navegar pelos próximos meses disponíveis.</small>
                </details>
              </div>
            </>
          ) : (
            <>
              <label>
                Profissional
                <select defaultValue={filters.professionalId ?? ""} name="professionalId">
                  <option value="">Selecione</option>
                  {professionals.map((professional) => (
                    <option key={professional.id} value={professional.id}>
                      {professional.user.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Data
                <input defaultValue={selectedDate} min={todayInBrazil()} name="date" type="date" />
              </label>
            </>
          )}
          <input
            name="serviceId"
            type="hidden"
            value={filters.serviceId ?? ""}
          />
        </div>
        <button type="submit">Buscar disponibilidade</button>
      </form>
      {filters.professionalId && (
        <form action={bookingPath} className={styles.form}>
          <input
            name="professionalId"
            type="hidden"
            value={filters.professionalId}
          />
          <input
            name="date"
            type="hidden"
            value={selectedDate}
          />
          <label>
            Serviço
            <select defaultValue={filters.serviceId ?? ""} name="serviceId">
              <option value="">Selecione um serviço</option>
              {data.services.map((item) => (
                <option key={item.serviceId} value={item.serviceId}>
                  {item.service.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Ver horários</button>
        </form>
      )}
      {filters.serviceId && (
        <form action={submitBooking} className={styles.form}>
          <input name="returnPath" type="hidden" value={bookingPath} />
          <input
            name="professionalId"
            type="hidden"
            value={filters.professionalId}
          />
          <input name="serviceId" type="hidden" value={filters.serviceId} />
          <input
            name="date"
            type="hidden"
            value={selectedDate}
          />
          <section className={styles.slotSection}>
            <h2>Horários disponíveis</h2>
            <div className={styles.slotGrid}>
              {data.slots.map((slot) => (
                <label className={styles.slot} key={slot.id}>
                  <input name="slotId" required type="radio" value={slot.id} />
                  {formatSlot(slot.startsAt)}
                </label>
              ))}
            </div>
            {!data.slots.length && <p>Nenhum horário disponível nesta data.</p>}
          </section>
          <div className={styles.grid}>
            <label>
              Nome
              <input autoComplete="name" name="name" required />
            </label>
            <label>
              Telefone
              <input autoComplete="tel" name="phone" required />
            </label>
            <label>
              E-mail
              <input autoComplete="email" name="email" required type="email" />
            </label>
          </div>
          <button type="submit">Confirmar agendamento</button>
        </form>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {success && (
        <p className={styles.success}>Agendamento confirmado com sucesso.</p>
      )}
    </>
  );
}
