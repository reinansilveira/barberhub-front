import { onlyDigits } from "@/utils/phone";

const env = (value: string | undefined, fallback: string) =>
  value?.trim() || fallback;

const whatsapp = onlyDigits(
  env(process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP, "5579999999999"),
);

export const BUSINESS = {
  name: "BarberHub",
  description: "Agende seu horário com os melhores profissionais",
  email: env(
    process.env.NEXT_PUBLIC_BUSINESS_EMAIL,
    "contato@barberhub.com.br",
  ),
  address: env(
    process.env.NEXT_PUBLIC_BUSINESS_ADDRESS,
    "Av. Paulista, 1000 - São Paulo, SP",
  ),
  openingHours: env(
    process.env.NEXT_PUBLIC_BUSINESS_HOURS,
    "Segunda a sábado, das 9h às 20h",
  ),
  instagram: env(process.env.NEXT_PUBLIC_BUSINESS_INSTAGRAM, "barberhub"),
  facebook: env(process.env.NEXT_PUBLIC_BUSINESS_FACEBOOK, "barberhub"),
  whatsappDigits: whatsapp,
};

export const formatBrazilianPhone = (digits: string) => {
  const local = digits.startsWith("55") ? digits.slice(2) : digits;
  const match = local.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : local;
};

export const whatsappUrl = (message?: string) =>
  `https://wa.me/${BUSINESS.whatsappDigits}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

export const whatsappLabel = formatBrazilianPhone(BUSINESS.whatsappDigits);
export const instagramUrl = `https://instagram.com/${BUSINESS.instagram}`;
export const facebookUrl = `https://facebook.com/${BUSINESS.facebook}`;
