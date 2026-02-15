import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
} from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import "./Toast.css";

/* ── Types ─────────────────────────────────────────────────────── */
export type ToastLevel = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  level: ToastLevel;
  exiting?: boolean;
}

interface ToastContextValue {
  showToast: (message: string, level?: ToastLevel, duration?: number) => void;
}

/* ── Context ───────────────────────────────────────────────────── */
const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

/* ── Icon map ──────────────────────────────────────────────────── */
const ICONS: Record<ToastLevel, React.ReactNode> = {
  success: <CheckCircle size={16} />,
  error: <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
};

/* Duration defaults per level (ms) */
const DEFAULT_DURATION: Record<ToastLevel, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3500,
};

/* ── Provider ──────────────────────────────────────────────────── */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const removeToast = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    // Remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 220);
  }, []);

  const showToast = useCallback(
    (message: string, level: ToastLevel = "info", duration?: number) => {
      const id = `toast-${++counterRef.current}`;
      const ms = duration ?? DEFAULT_DURATION[level];

      setToasts((prev) => [...prev.slice(-4), { id, message, level }]); // keep max 5
      setTimeout(() => removeToast(id), ms);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Render layer */}
      {toasts.length > 0 && (
        <div className="toast-container" role="status" aria-live="polite">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`toast toast--${t.level}${t.exiting ? " toast--exiting" : ""}`}
            >
              <span className="toast__icon">{ICONS[t.level]}</span>
              <span className="toast__content">
                <span className="toast__message">{t.message}</span>
              </span>
              <button
                className="toast__close"
                onClick={() => removeToast(t.id)}
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
