/**
 * Structured Logger Utility
 * Provides lightweight structured logging with level, timestamp, and context.
 */

export type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
  event: string;
  message?: string;
  context?: Record<string, any>;
  error?: unknown;
}

const format = (level: LogLevel, payload: LogPayload) => {
  return {
    ts: new Date().toISOString(),
    level,
    ...payload,
  };
};

const emit = (level: LogLevel, payload: LogPayload) => {
  const entry = format(level, payload);
  switch (level) {
    case "error":
      console.error(entry);
      break;
    case "warn":
      console.warn(entry);
      break;
    case "debug":
      if (process.env.NODE_ENV !== "production") console.debug(entry);
      break;
    default:
      console.info(entry);
  }
};

export const logger = {
  info: (payload: LogPayload) => emit("info", payload),
  warn: (payload: LogPayload) => emit("warn", payload),
  error: (payload: LogPayload) => emit("error", payload),
  debug: (payload: LogPayload) => emit("debug", payload),
};

export default logger;
