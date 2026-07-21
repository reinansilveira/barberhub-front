import ProfessionalsCarousel from "../../components/ProfessionalsCarousel/ProfessionalsCarousel";
import { findAllProfessionals } from "@/services/professional";
import styles from "./Professionals.module.scss";
export default async function Professionals() {
  const professionals = await findAllProfessionals(true).catch(() => []);
  const cards = professionals.map((professional) => ({ id: professional.id, name: professional.user.name, role: professional.specialty || "Profissional BarberHub", description: professional.bio || (professional.experience ? `${professional.experience} anos de experiência.` : "Profissional da nossa equipe."), rating: 0, reviewsCount: 0, available: professional.active, imageUrl: professional.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(professional.user.name)}&background=1f1f1f&color=d5a72f&size=800` }));

  return <section className={styles.professionals}>
    <div className={`wrapper ${styles.professionals__inner}`}>
      <div className={styles.professionals__heading}>
        <span className={styles.professionals__label}>Nossa equipe</span>
        <h2 className={styles.professionals__title}>Profissionais certificados</h2>
        <p className={styles.professionals__subtitle}>Especialistas com anos de experiência e paixão pela arte da barbearia clássica</p>
      </div>
      {cards.length ? <ProfessionalsCarousel professionals={cards} /> :
        <p className={styles.professionals__subtitle}>Nenhum profissional disponível no momento.</p>}
    </div>
  </section>;
}
