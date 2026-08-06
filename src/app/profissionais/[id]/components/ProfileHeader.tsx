import Image from "next/image";
import Link from "next/link";
import type { Professional } from "../professional-profile.types";
import { ShareProfileButton } from "./ShareProfileButton";

export const ProfileHeader = ({ professional, avatar }: { professional: Professional | null; avatar: string }) => {
  if (!professional) {
    return null;
  }

  return (
    <header className="profileHeader">
      <Image className="avatar" src={avatar} alt={professional.user.name} width={120} height={120} />

      <div className="profileInfo">
        <div className="nameRow">
          <h1>{professional.user.name}</h1>
          <span className="available">Disponível</span>
        </div>
        <p>{professional.specialty || "Profissional BarberHub"}</p>
        <div className="meta">
          <span>★ Novo profissional</span>
          <span>•</span>
          <span>{professional.experience ?? 0} anos de experiência</span>
        </div>
      </div>

      <div className="profileActions">
        <ShareProfileButton name={professional.user.name} />
        <Link className="bookLink" href="#agendar">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="5" width="16" height="16" rx="2" fill="currentColor" />
            <path d="M7 3v4M17 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 9h16" stroke="#d6b34e" strokeWidth="2" />
            <path d="m9 14 2 2 4-4" stroke="#d6b34e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Agendar Agora
        </Link>
      </div>
    </header>
  );
}
