import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=google", request.url));
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/clients/google/exchange`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return NextResponse.redirect(new URL("/login?error=google", request.url));
  }

  const session = await response.json();

  const redirectResponse = NextResponse.redirect(
    new URL("/dashboard", request.url)
  );

  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };

  redirectResponse.cookies.set(
    "barberhub_access_token",
    session.access_token,
    cookieOptions
  );
  redirectResponse.cookies.set(
    "barberhub_refresh_token",
    session.refresh_token,
    cookieOptions
  );

  return redirectResponse;
}
