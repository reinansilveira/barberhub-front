import axios, { type AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./config";
import { getAccessToken } from "./session";

export async function serverApi<T>(config: AxiosRequestConfig): Promise<T> {
  const token = await getAccessToken();
  const { data } = await axios.request<T>({
    baseURL: API_BASE_URL,
    ...config,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...config.headers,
    },
  });

  return data;
}
