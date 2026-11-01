import Image from "next/image";
import Link from "next/link";
import type { Professional } from "../professional-profile.types";
import { ShareProfileButton } from "./ShareProfileButton";

export const ProfileHeader = ({
  professional,
  avatar,
  reviewCount,
}: {
  professional: Professional | null;
  avatar: string;
  reviewCount: number;
}) => {
  if (!professional) {
    return null;
  }

  return (
    <header className="profile__header">
      <Image
        className="profile__avatar"
        src={avatar}
        alt={professional.user.name}
        width={120}
        height={120}
      />

      <div className="profile__info">
        <div className="profile__name-row">
          <h1>{professional.user.name}</h1>
          <span className="profile__availability">Agenda online</span>
        </div>
        <p>{professional.specialty || "Profissional BarberHub"}</p>
        <p className="profile__meta">
          <span>
            {reviewCount
              ? `★ ${reviewCount} ${reviewCount === 1 ? "avaliação" : "avaliações"}`
              : "★ Novo na equipe"}
          </span>
          {professional.experience ? (
            <>
              <span aria-hidden="true">•</span>
              <span>{professional.experience} anos de experiência</span>
            </>
          ) : null}
        </p>
      </div>

      <div className="profile__actions">
        <ShareProfileButton name={professional.user.name} />
        <Link className="profile__book-link" href="#agendar">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect
              x="4"
              y="5"
              width="16"
              height="16"
              rx="2"
              fill="currentColor"
            />
            <path
              d="M7 3v4M17 3v4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M4 9h16" stroke="#d6b34e" strokeWidth="2" />
            <path
              d="m9 14 2 2 4-4"
              stroke="#d6b34e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Agendar agora
        </Link>
      </div>
    </header>
  );
};
