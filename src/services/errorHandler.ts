import type { AxiosError } from "axios";

export type ApiErrorType =
  | "validation"
  | "not-found"
  | "permission"
  | "state"
  | "rate-limit"
  | "unsupported-type"
  | "network"
  | "error";

export interface HandledApiError {
  type: ApiErrorType;
  code?: string;
  field?: string;
  message: string;
  details?: {
    attempted?: string;
    reason?: string;
    suggestion?: string;
    [key: string]: unknown;
  };
  retryAfterMs?: number;
}

const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

export function handleApiError(error: unknown): HandledApiError {
  const normalized = error as {
    status?: number;
    code?: string;
    field?: string;
    message?: string;
    details?: Record<string, unknown>;
    errors?: any[];
    raw?: {
      code?: string;
      field?: string;
      message?: string;
      details?: Record<string, unknown>;
    };
  };

  const status = normalized?.status;
  const code = normalized?.code || normalized?.raw?.code;
  const field = normalized?.field || normalized?.raw?.field;
  const details = normalized?.details || normalized?.raw?.details;

  // Prefer detail.message (backend structured envelope) over generic message
  const message =
    normalized?.message || normalized?.raw?.message || DEFAULT_MESSAGE;

  if (!status) {
    return {
      type: "network",
      code,
      field,
      message: message || "Network error. Check your connection and retry.",
      details,
    };
  }

  switch (code) {
    case "VALIDATION_ERROR":
    case "INVALID_JSON":
      return { type: "validation", code, field, message, details };
    case "NOT_FOUND":
      return { type: "not-found", code, field, message, details };
    case "PERMISSION_ERROR":
      return { type: "permission", code, field, message, details };
    case "STATE_ERROR":
      return { type: "state", code, field, message, details };
    case "UNSUPPORTED_TYPE":
      return { type: "unsupported-type", code, field, message, details };
    case "RATE_LIMIT_EXCEEDED":
      return {
        type: "rate-limit",
        code,
        field,
        message,
        details,
        retryAfterMs: 5000,
      };
    default:
      break;
  }

  if (status === 404)
    return { type: "not-found", code, field, message, details };
  if (status === 403)
    return { type: "permission", code, field, message, details };
  if (status === 409) return { type: "state", code, field, message, details };
  if (status === 429) {
    return {
      type: "rate-limit",
      code,
      field,
      message,
      details,
      retryAfterMs: 5000,
    };
  }

  return { type: "error", code, field, message, details };
}

export function toHandledApiError(error: AxiosError): HandledApiError {
  return handleApiError(error);
}
