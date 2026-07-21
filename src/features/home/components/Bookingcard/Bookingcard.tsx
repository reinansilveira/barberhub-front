"use client";

import type { BookingProfessional } from "./booking-card.logic";
import { formatSlot, minimumBookingDate, useBookingCard } from "./booking-card.logic";
import styles from "./Bookingcard.module.scss";

export default function BookingCard({ professionals }: { professionals: BookingProfessional[] }) {
  const booking = useBookingCard();
  const { form, professionalId, serviceId, slotId, services, slots, selectedDate, showDatePicker, loadingSlots, error, success, setSelectedDate, setShowDatePicker } = booking;

  return <div className={styles["booking-card"]}>
    <span className={styles["booking-card__label"]}>Agendamento rápido</span>
    <h2 className={styles["booking-card__title"]}>Reserve seu horário</h2>
    <form onSubmit={form.handleSubmit(booking.submit)}>
      <div className={styles["booking-card__field"]}>
        <label className={styles["booking-card__field-label"]} htmlFor="professionalId">Profissional</label>
        <select className={styles["booking-card__select"]} id="professionalId" {...form.register("professionalId", { required: true })}>
          <option value="">Selecione um profissional</option>
          {professionals.map((professional) => <option key={professional.id} value={professional.id}>{professional.name}</option>)}
        </select>
      </div>

      {professionalId && <>
        <div className={styles["booking-card__field"]}>
          <label className={styles["booking-card__field-label"]} htmlFor="serviceId">Serviço</label>
          <select className={styles["booking-card__select"]} id="serviceId" {...form.register("serviceId", { required: true })}>
            <option value="">Selecione um serviço</option>
            {services.map((service) => <option key={service.serviceId} value={service.serviceId}>{service.service.name}</option>)}
          </select>
        </div>
        <div className={styles["booking-card__date-choice"]}>
          {showDatePicker ? <label className={styles["booking-card__field-label"]} htmlFor="booking-date">
            Escolha outra data
            <input className={styles["booking-card__date-input"]} id="booking-date" min={minimumBookingDate()} onChange={(event) => setSelectedDate(event.target.value)} type="date" value={selectedDate} />
          </label> : <>
            <span className={styles["booking-card__field-label"]}>Procurando horários para hoje</span>
            <button className={styles["booking-card__change-date"]} onClick={() => setShowDatePicker(true)} type="button">Escolher outra data</button>
          </>}
        </div>
      </>}

      {serviceId && <div className={styles["booking-card__field"]}>
        <span className={styles["booking-card__field-label"]}>Horário disponível</span>
        <div className={styles["booking-card__slots"]}>
          {slots.map((slot) => <button className={slot.id === slotId ? styles["booking-card__slot--selected"] : styles["booking-card__slot"]} key={slot.id} onClick={() => form.setValue("slotId", slot.id)} type="button">{formatSlot(slot.startsAt)}</button>)}
        </div>
        {!loadingSlots && !slots.length && <div className={styles["booking-card__empty-slots"]}>
          <span>Não há horários disponíveis nesta data.</span>
          {!showDatePicker && <button className={styles["booking-card__change-date"]} onClick={() => setShowDatePicker(true)} type="button">Escolher outra data</button>}
        </div>}
        <input type="hidden" {...form.register("slotId", { required: true })} />
      </div>}

      {slotId && <>
        <div className={styles["booking-card__field"]}><label className={styles["booking-card__field-label"]}>Nome<input className={styles["booking-card__select"]} {...form.register("name")} /></label></div>
        <div className={styles["booking-card__field"]}><label className={styles["booking-card__field-label"]}>Telefone<input className={styles["booking-card__select"]} {...form.register("phone")} /></label></div>
        <div className={styles["booking-card__field"]}><label className={styles["booking-card__field-label"]}>E-mail<input className={styles["booking-card__select"]} type="email" {...form.register("email")} /></label></div>
        <button className={styles["booking-card__submit"]} type="submit">Confirmar agendamento</button>
      </>}
    </form>
    {error && <p className={styles["booking-card__error"]}>{error}</p>}
    {success && <p className={styles["booking-card__success"]}>Agendamento confirmado!</p>}
  </div>;
}
