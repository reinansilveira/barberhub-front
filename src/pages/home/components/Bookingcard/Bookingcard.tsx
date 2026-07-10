"use client";

import { useState } from "react";
import styles from "./Bookingcard.module.scss";

interface ProfessionalOption {
  value: string;
  label: string;
}

const PROFESSIONAL_OPTIONS: ProfessionalOption[] = [
  { value: "any", label: "Qualquer profissional disponível" },
  { value: "carlos-silva", label: "Carlos Silva" },
  { value: "rafael-souza", label: "Rafael Souza" },
  { value: "bruno-costa", label: "Bruno Costa" },
];

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export default function BookingCard() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <form className={styles["booking-card"]}>
      <span className={styles["booking-card__label"]}>Agendamento rápido</span>
      <h2 className={styles["booking-card__title"]}>Reserve seu horário</h2>

      <div className={styles["booking-card__field"]}>
        <label
          htmlFor="professional"
          className={styles["booking-card__field-label"]}
        >
          Profissional
        </label>
        <select
          id="professional"
          name="professional"
          className={styles["booking-card__select"]}
          defaultValue={PROFESSIONAL_OPTIONS[0].value}
        >
          {PROFESSIONAL_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles["booking-card__field"]}>
        <label htmlFor="date" className={styles["booking-card__field-label"]}>
          Data
        </label>
        <input
          id="date"
          name="date"
          type="date"
          className={styles["booking-card__date-input"]}
        />
      </div>

      <div className={styles["booking-card__field"]}>
        <span className={styles["booking-card__field-label"]}>Horário</span>
        <div className={styles["booking-card__slots"]}>
          {TIME_SLOTS.map((slot) => {
            const isSelected = slot === selectedTime;

            return (
              <button
                key={slot}
                type="button"
                name="time"
                value={slot}
                aria-pressed={isSelected}
                onClick={() => setSelectedTime(slot)}
                className={`${styles["booking-card__slot"]} ${
                  isSelected ? styles["booking-card__slot--active"] : ""
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      <button type="submit" className={styles["booking-card__submit"]}>
        Ver disponibilidade
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </form>
  );
}
