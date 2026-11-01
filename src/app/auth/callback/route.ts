import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  API_BASE_URL,
  REFRESH_TOKEN_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from "@/services/api/config";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=google", request.url));
  }

  const response = await fetch(
    `${process.env.BACKEND_URL ?? API_BASE_URL}/clients/google/exchange`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return NextResponse.redirect(new URL("/login?error=google", request.url));
  }

  const session = await response.json();

  const redirectResponse = NextResponse.redirect(
    new URL("/dashboard", request.url),
  );

  redirectResponse.cookies.set(
    ACCESS_TOKEN_COOKIE,
    session.access_token,
    SESSION_COOKIE_OPTIONS,
  );
  redirectResponse.cookies.set(
    REFRESH_TOKEN_COOKIE,
    session.refresh_token,
    SESSION_COOKIE_OPTIONS,
  );

  return redirectResponse;
}
