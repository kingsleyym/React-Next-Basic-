'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2, Info, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/cn';

export type ToastVariant = 'info' | 'success' | 'error' | 'warning';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
}

export type ToastInput = Omit<Toast, 'id' | 'variant' | 'duration'> &
  Partial<Pick<Toast, 'variant' | 'duration'>>;

interface ToastContextValue {
  toast: (input: ToastInput) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Wrap your app once with <ToastProvider> (already done in apps/web). Then call
 * `const { toast } = useToast()` anywhere. See docs/COMPONENTS.md.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [
      ...prev,
      { id, variant: 'info', duration: 4000, ...input },
    ]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

const ICONS: Record<ToastVariant, ReactNode> = {
  info: <Info size={18} />,
  success: <CheckCircle2 size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
};

const STYLES: Record<ToastVariant, string> = {
  info: 'border-border',
  success: 'border-success text-success',
  error: 'border-destructive text-destructive',
  warning: 'border-border',
};

function Toaster({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border-l-4 bg-card p-4 shadow-lg animate-slide-up',
        STYLES[toast.variant],
      )}
      role="status"
    >
      <span className="mt-0.5">{ICONS[toast.variant]}</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-card-foreground">{toast.title}</p>
        {toast.description && (
          <p className="text-sm text-muted-foreground">{toast.description}</p>
        )}
      </div>
    </div>
  );
}
