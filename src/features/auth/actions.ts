"use server";

import { cookies } from "next/headers";
import type { SessionTokens } from "@/services/auth";

export async function saveSession(tokens: SessionTokens) {
  const store = await cookies();
  const options = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/" };
  store.set("barberhub_access_token", tokens.access_token, options);
  store.set("barberhub_refresh_token", tokens.refresh_token, options);
}
