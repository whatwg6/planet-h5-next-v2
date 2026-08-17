import axios from "axios";
import { env } from "@/shared/config";
import { normalizeError } from "@/shared/errors";

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: { Accept: "application/json" },
});

httpClient.interceptors.request.use((config) => {
  config.headers.set("X-Request-Id", crypto.randomUUID());
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeError(error)),
);
