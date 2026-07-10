import ProfessionalsCarousel from "../../components/ProfessionalsCarousel/ProfessionalsCarousel";
import type { Professional } from "../../components/ProfessionalsCarousel/Professionals.types";
import styles from "./Professionals.module.scss";

const PROFESSIONALS: Professional[] = [
  {
    id: "ricardo-santos",
    name: "Ricardo Santos",
    role: "Especialista Premium",
    description:
      "12 anos de experiência. Especializado em cortes clássicos e barba artística.",
    rating: 4.9,
    reviewsCount: 214,
    available: true,
    imageUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "carlos-oliveira",
    name: "Carlos Oliveira",
    role: "Master Barber",
    description:
      "15 anos de carreira. Referência em fade e desenhos personalizados.",
    rating: 5.0,
    reviewsCount: 356,
    available: true,
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "bruno-costa",
    name: "Bruno Costa",
    role: "Barbeiro Premium",
    description:
      "8 anos de experiência. Especialista em cortes modernos e styling.",
    rating: 4.8,
    reviewsCount: 178,
    available: true,
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "andre-silva",
    name: "André Silva",
    role: "Especialista Sênior",
    description:
      "10 anos de expertise. Mestre em cortes executivos e tratamentos.",
    rating: 4.9,
    reviewsCount: 203,
    available: true,
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "ricardo-santos",
    name: "Ricardo Santos",
    role: "Especialista Premium",
    description:
      "12 anos de experiência. Especializado em cortes clássicos e barba artística.",
    rating: 4.9,
    reviewsCount: 214,
    available: true,
    imageUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "carlos-oliveira",
    name: "Carlos Oliveira",
    role: "Master Barber",
    description:
      "15 anos de carreira. Referência em fade e desenhos personalizados.",
    rating: 5.0,
    reviewsCount: 356,
    available: true,
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "bruno-costa",
    name: "Bruno Costa",
    role: "Barbeiro Premium",
    description:
      "8 anos de experiência. Especialista em cortes modernos e styling.",
    rating: 4.8,
    reviewsCount: 178,
    available: true,
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "andre-silva",
    name: "André Silva",
    role: "Especialista Sênior",
    description:
      "10 anos de expertise. Mestre em cortes executivos e tratamentos.",
    rating: 4.9,
    reviewsCount: 203,
    available: true,
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
  },
];

export default function Professionals() {
  return (
    <section className={styles.professionals}>
      <div className={`wrapper ${styles.professionals__inner}`}>
        <div className={styles.professionals__heading}>
          <span className={styles.professionals__label}>Nossa equipe</span>
          <h2 className={styles.professionals__title}>
            Profissionais certificados
          </h2>
          <p className={styles.professionals__subtitle}>
            Especialistas com anos de experiência e paixão pela arte da
            barbearia clássica
          </p>
        </div>

        <ProfessionalsCarousel professionals={PROFESSIONALS} />
      </div>
    </section>
  );
}
