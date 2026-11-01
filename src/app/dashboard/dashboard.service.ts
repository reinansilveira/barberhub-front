import { decodeTokenPayload, getAccessToken } from "@/services/api/session";
import type { Role } from "./dashboard.types";

type SessionPayload = {
  role?: string;
  activeRole?: string;
  accountType?: string;
  exp?: number;
  user?: { role?: string };
};

export async function getSessionRole(): Promise<Role | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const payload = decodeTokenPayload<SessionPayload>(token);

    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      return null;
    }
    if (payload.accountType === "CLIENT") {
      return "client";
    }

    const value = (
      payload.activeRole ??
      payload.role ??
      payload.user?.role ??
      "owner"
    ).toLowerCase();

    if (value === "client" || value === "professional" || value === "owner") {
      return value;
    }

    if (value === "admin") {
      return "owner";
    }
  } catch {
    // Tokens antigos podem não possuir o payload de papel. Mantemos o painel administrativo.
  }

  return "owner";
}
