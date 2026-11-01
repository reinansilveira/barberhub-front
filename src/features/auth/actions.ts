"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from "@/services/api/config";
import type { SessionTokens } from "@/services/auth";

export async function saveSession(tokens: SessionTokens) {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, tokens.access_token, SESSION_COOKIE_OPTIONS);
  store.set(REFRESH_TOKEN_COOKIE, tokens.refresh_token, SESSION_COOKIE_OPTIONS);
}

export async function logoutSession() {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
  redirect("/login");
}
