import { isAxiosError } from "axios";
import { notFound } from "next/navigation";
import { getBookingViewData } from "@/features/booking/booking.service";
import { todayInBrazil } from "@/utils/booking.utils";
import { findProfessionalById } from "@/services/professional";
import { buildAvatarUrl, extractPortfolioImages } from "./professional-profile.utils";

export async function getProfessionalProfileData(
  id: string,
  query: Record<string, string | undefined>,
) {
  const date = query.date ?? todayInBrazil();

  let professional = null;

  try {
    professional = await findProfessionalById(id, true);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }

    const status = isAxiosError(error) ? error.response?.status : undefined;
    const message = isAxiosError(error) ? error.response?.data?.message : undefined;

    console.error(`[professional-profile] Falha ao buscar profissional ${id}`, {
      status,
      message,
      error,
    });

    return {
      professional: null,
      bookingData: { services: [], slots: [] },
      date,
      selectedServiceId: "",
      selectedService: undefined,
      avatar: "",
      portfolioImages: [],
      profileError: true,
      errorStatus: status,
      errorMessage: message,
    };
  }

  if (!professional) notFound();

  const bookingData = await getBookingViewData(id, date).catch(() => ({ services: [], slots: [] }));
  const selectedServiceId = query.serviceId ?? "";
  const selectedService = bookingData.services.find((item) => item.serviceId === selectedServiceId);

  return {
    professional,
    bookingData,
    date,
    selectedServiceId,
    selectedService,
    avatar: buildAvatarUrl(professional.user.avatar, professional.user.name),
    portfolioImages: extractPortfolioImages(bookingData.services),
    profileError: false,
  };
}