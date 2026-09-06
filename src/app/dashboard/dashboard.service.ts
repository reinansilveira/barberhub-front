import { cookies } from "next/headers";
import type { Role } from "./dashboard.types";

export async function getSessionRole(): Promise<Role | null> {
  const token = (await cookies()).get("barberhub_access_token")?.value;
  if (!token) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8")
    ) as { role?: string; accountType?: string; exp?: number; user?: { role?: string } };

    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      return null;
    }
    const value = (
      payload.role ??
      payload.user?.role ??
      (payload.accountType === "CLIENT" ? "client" : "owner")
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
