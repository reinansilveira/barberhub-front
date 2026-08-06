import { cookies } from "next/headers";
import type { Role } from "./dashboard.types";

export async function getSessionRole(): Promise<Role | null> {
  const token = (await cookies()).get("barberhub_access_token");
  if (!token) return null;

  return "owner";
}