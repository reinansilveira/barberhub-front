import { ownerNav } from "./owner.nav";
import type {
  DashboardOverviewStats,
  OwnerDashboardData,
  OwnerView,
  Payment,
} from "./owner.types";

const dayKey = (value: string | Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));

export const paymentProfessionalName = (payment: Payment) =>
  payment.appointment?.professional?.name ??
  payment.appointment?.professional?.user?.name ??
  "";

export const paymentServiceName = (payment: Payment) =>
  payment.appointment?.service?.name ?? "";

export const buildDashboardOverviewStats = (
  appointments: OwnerDashboardData["appointments"],
  payments: OwnerDashboardData["payments"],
  reviews: OwnerDashboardData["reviews"],
): DashboardOverviewStats => {
  const today = dayKey(new Date());
  const activeAppointments = appointments.filter(
    (item) => !/cancel/i.test(item.status),
  );
  const todayAppointments = activeAppointments.filter(
    (item) => dayKey(item.scheduledAt) === today,
  );
  const firstAppointmentByClient = new Map<string, string>();

  activeAppointments.forEach((item) => {
    const clientKey = item.client.id ?? item.client.name;
    const first = firstAppointmentByClient.get(clientKey);
    if (!first || new Date(item.scheduledAt) < new Date(first)) {
      firstAppointmentByClient.set(clientKey, item.scheduledAt);
    }
  });

  const activeReviews = reviews.filter((review) => review.active);
  const averageRating = activeReviews.length
    ? activeReviews.reduce((total, review) => total + review.rating, 0) /
      activeReviews.length
    : null;
  const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    rating: String(rating),
    count: activeReviews.filter(
      (review) => Math.round(review.rating) === rating,
    ).length,
  }));

  return {
    todayEarnings: payments
      .filter((payment) => payment.paidAt && dayKey(payment.paidAt) === today)
      .reduce((total, payment) => total + Number(payment.finalAmount), 0),
    todayAppointments: todayAppointments.length,
    completedToday: todayAppointments.filter((item) =>
      /complete/i.test(item.status),
    ).length,
    newClientsToday: Array.from(firstAppointmentByClient.values()).filter(
      (scheduledAt) => dayKey(scheduledAt) === today,
    ).length,
    satisfaction:
      averageRating === null ? null : Math.round((averageRating / 5) * 100),
    reviewCount: activeReviews.length,
    ratingDistribution,
  };
};

export function resolveTitle(view: OwnerView) {
  return (
    ownerNav.find((item) => item[1].includes(`view=${view}`))?.[0] ?? "Painel"
  );
}
