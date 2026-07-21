import { BookingForm } from "@/features/booking/BookingForm";
import { bookingFiltersSchema } from "@/features/booking/booking.schemas";
import { getBookingViewData } from "@/features/booking/booking.service";
import { findAllProfessionals } from "@/services/professional";
import styles from "@/features/app/AppPage.module.scss";

interface BookingPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams;
  const filters = bookingFiltersSchema.safeParse(params).data ?? {};
  const [professionals, data] = await Promise.all([
    findAllProfessionals(true),
    getBookingViewData(filters.professionalId, filters.date),
  ]);
  return (
    <main className={styles.page}>
      <section className={styles.wide}>
        <span className={styles.eyebrow}>Reserva online</span>
        <h1>Agende seu horário</h1>
        <p>Escolha o profissional, serviço e horário disponíveis.</p>
        <BookingForm
          data={data}
          error={params.error}
          filters={filters}
          professionals={professionals}
          success={params.success === "1"}
        />
      </section>
    </main>
  );
}
