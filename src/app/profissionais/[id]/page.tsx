import type { Metadata } from "next";
import { findProfessionalById } from "@/services/professional";
import Link from "next/link";
import "./page.scss";
import heroBg from "@/assets/images/hero.png";
import { getProfessionalProfileData } from "./professional-profile.service";
import { ProfileHeader } from "./components/ProfileHeader";
import { AboutSection } from "./components/AboutSection";
import { ServicesSection } from "./components/ServicesSection";
import { PortfolioSection } from "./components/PortfolioSection";
import { ReviewsSection } from "./components/ReviewsSection";
import { BookingCard } from "./components/BookingCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const professional = await findProfessionalById(id, true).catch(() => null);
  if (!professional) return { title: "Profissional" };

  return {
    title: `${professional.user.name} | Agende seu horário`,
    description:
      professional.bio ||
      `Veja serviços, preços e horários livres de ${professional.user.name}.`,
  };
}

interface ProfessionalPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ProfessionalPage({
  params,
  searchParams,
}: ProfessionalPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);

  const {
    professional,
    bookingData,
    date,
    selectedServiceId,
    selectedService,
    avatar,
    portfolioImages,
    reviews,
    profileError,
  } = await getProfessionalProfileData(id, query);

  return (
    <section className="profile">
      <div className="profile__topbar">
        <Link href="/" className="profile__brand">
          BarberHub
        </Link>
        <nav aria-label="Você está em">
          <Link href="/">Início</Link> /{" "}
          <Link href="/profissionais">Profissionais</Link> /{" "}
          <strong aria-current="page">
            {professional?.user.name ?? "Perfil"}
          </strong>
        </nav>
      </div>

      <div
        className="profile__cover"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(5,5,5,.9), rgba(5,5,5,.45)), url(${heroBg.src})`,
        }}
      />

      <div className="profile__container">
        {profileError && (
          <div className="profile__card profile__error" role="alert">
            <h1>Não foi possível carregar este perfil</h1>
            <p>
              Tente novamente em alguns instantes ou{" "}
              <Link href="/profissionais">veja outros profissionais</Link>.
            </p>
          </div>
        )}
        <ProfileHeader
          professional={professional}
          avatar={avatar}
          reviewCount={reviews.filter((review) => review.active).length}
        />

        <div className="profile__layout">
          <div className="profile__content">
            <AboutSection professional={professional} />
            <ServicesSection
              services={bookingData.services}
              selectedServiceId={selectedServiceId}
            />
            <PortfolioSection
              images={portfolioImages}
              professionalName={professional?.user.name ?? "Profissional"}
            />
            <ReviewsSection reviews={reviews} />
          </div>

          <BookingCard
            id={id}
            professionalName={professional?.user.name ?? "Profissional"}
            slots={bookingData.slots}
            selectedServiceId={selectedServiceId}
            selectedService={selectedService}
            date={date}
            error={query.error}
          />
        </div>
      </div>
    </section>
  );
}
