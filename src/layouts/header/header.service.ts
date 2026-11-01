import { getAccessToken } from "@/services/api/session";

export async function isLoggedIn() {
  return Boolean(await getAccessToken());
}
