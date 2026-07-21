import { notFound } from "next/navigation";
import { BookingForm } from "@/features/booking/BookingForm";
import { bookingFiltersSchema } from "@/features/booking/booking.schemas";
import { getBookingViewData } from "@/features/booking/booking.service";
import { findProfessionalById } from "@/services/professional";
import styles from "@/features/app/AppPage.module.scss";

interface ProfessionalSchedulePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ProfessionalSchedulePage({
  params,
  searchParams,
}: ProfessionalSchedulePageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const parsedFilters = bookingFiltersSchema.safeParse(query).data ?? {};
  const professional = await findProfessionalById(id, true).catch(() => null);

  if (!professional) notFound();

  const filters = { ...parsedFilters, professionalId: id };
  const data = await getBookingViewData(id, filters.date);
  const bookingPath = `/profissionais/${id}`;

  return (
    <main className={styles.page}>
      <section className={styles.wide}>
        <span className={styles.eyebrow}>Agenda do profissional</span>
        <h1>Agende com {professional.user.name}</h1>
        <p>
          Escolha um horário para hoje ou selecione outra data no calendário.
        </p>
        <BookingForm
          bookingPath={bookingPath}
          data={data}
          error={query.error}
          filters={filters}
          lockProfessional
          professionals={[professional]}
          success={query.success === "1"}
        />
      </section>
    </main>
  );
}
