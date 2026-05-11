/**
 * HTTP Client Factory — shared Axios instance.
 *
 * Single source of truth for base URL, interceptors, timeouts.
 * All service modules import this instead of creating their own.
 */

import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:8000/api/v1";

function createHttpClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30_000,
    headers: { "Content-Type": "application/json" },
  });

  // Request logging (dev only)
  client.interceptors.request.use((config) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  });

  // Response error normalisation
  client.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      const status = error.response?.status;
      const data = error.response?.data as any;

      // FastAPI returns `detail` as either a string or a validation-error array.
      // Normalise both so downstream consumers always get a string message.
      let detailMessage: string | undefined;
      let detailField: string | undefined;
      if (Array.isArray(data?.detail)) {
        const first = data.detail[0];
        detailMessage = first?.msg ?? String(data.detail);
        // loc is ['body', 'field', ...] — join the path parts after 'body'
        if (Array.isArray(first?.loc) && first.loc.length > 1) {
          detailField = first.loc.slice(1).join(".");
        }
      } else if (typeof data?.detail === "string") {
        detailMessage = data.detail;
      }

      const normalised = {
        status,
        code: data?.code,
        field: data?.field ?? detailField,
        message: data?.message ?? detailMessage ?? error.message,
        details: data?.details,
        errors:
          data?.errors ?? (Array.isArray(data?.detail) ? data.detail : []),
        raw: data,
      };

      return Promise.reject(normalised);
    },
  );

  return client;
}

export const httpClient = createHttpClient();
export { API_BASE_URL };
