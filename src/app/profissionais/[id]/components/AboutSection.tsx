import type { Professional } from "../professional-profile.types";

export const AboutSection = ({ professional }: { professional: Professional | null }) => {
  if (!professional) {
    return null;
  }

  return (
    <section className="card">
      <h2>Sobre o profissional</h2>
      <p>
        {professional.bio ||
          `${professional.user.name} faz parte da equipe BarberHub e está pronto para cuidar do seu visual.`}
      </p>
      <div className="tags">
        <span>{professional.specialty || "Barbearia"}</span>
        <span>{professional.experience ?? 0}+ anos de experiência</span>
        <span>Atendimento personalizado</span>
      </div>
    </section>
  );
}