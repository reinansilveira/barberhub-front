import { cookies } from "next/headers";

export async function isLoggedIn() {
  return Boolean((await cookies()).get("barberhub_access_token"));
}