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

interface ProfessionalPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ProfessionalPage({ params, searchParams }: ProfessionalPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);

  const { professional, bookingData, date, selectedServiceId, selectedService, avatar, portfolioImages } =
    await getProfessionalProfileData(id, query);

  return (
    <section className="profile">
      <div className="topbar">
        <Link href="/" className="brand">
          BarberHub
        </Link>
        <span>
          Início / Profissionais / <strong>{professional?.user.name ?? "Perfil"}</strong>
        </span>
      </div>

      <div
        className="cover"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(5,5,5,.9), rgba(5,5,5,.45)), url(${heroBg.src})`,
        }}
      />

      <div className="container">
        <ProfileHeader professional={professional} avatar={avatar} />

        <div className="layout">
          <div className="content">
            <AboutSection professional={professional} />
            <ServicesSection services={bookingData.services} selectedServiceId={selectedServiceId} />
            <PortfolioSection images={portfolioImages} professionalName={professional?.user.name ?? "Profissional"} />
            <ReviewsSection />
          </div>

          <BookingCard
            id={id}
            professionalName={professional?.user.name ?? "Profissional"}
            slots={bookingData.slots}
            selectedServiceId={selectedServiceId}
            selectedService={selectedService}
            date={date}
            error={query.error}
            success={query.success}
          />
        </div>
      </div>
    </section>
  );
}
