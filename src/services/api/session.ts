import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "./config";

export async function getAccessToken() {
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
}

export function decodeTokenPayload<T>(token: string | undefined): T {
  return JSON.parse(
    Buffer.from(token?.split(".")[1] ?? "", "base64url").toString("utf8"),
  ) as T;
}
