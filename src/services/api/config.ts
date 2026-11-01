export const API_BASE_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_API ??
  "http://localhost:3000";

export const API_PROXY_PATH = "/api/backend";

export const ACCESS_TOKEN_COOKIE = "barberhub_access_token";
export const REFRESH_TOKEN_COOKIE = "barberhub_refresh_token";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
} as const;
