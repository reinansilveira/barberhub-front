import type { Professional } from "../professional-profile.types";

export const AboutSection = ({
  professional,
}: {
  professional: Professional | null;
}) => {
  if (!professional) {
    return null;
  }

  return (
    <section className="profile__card">
      <h2>Sobre o profissional</h2>
      <p>
        {professional.bio ||
          `${professional.user.name} faz parte da equipe BarberHub e está pronto para cuidar do seu visual.`}
      </p>
      <div className="profile__tags">
        <span>{professional.specialty || "Barbearia"}</span>
        {professional.experience ? (
          <span>{professional.experience}+ anos de experiência</span>
        ) : null}
        <span>Atendimento personalizado</span>
      </div>
    </section>
  );
};
