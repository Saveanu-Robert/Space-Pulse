'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'info' | 'warning' | 'success';
}

// Global toast state
let addToastFn: ((toast: Omit<ToastMessage, 'id'>) => void) | null = null;

export function showToast(toast: Omit<ToastMessage, 'id'>) {
  addToastFn?.(toast);
}

const typeColors = {
  info: 'border-nebula-blue/30 bg-nebula-blue/5',
  warning: 'border-status-warning/30 bg-status-warning/5',
  success: 'border-status-safe/30 bg-status-safe/5',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]); // Keep max 5
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => { addToastFn = null; };
  }, [addToast]);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col gap-2 max-w-sm" aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`glass-card border p-3 ${typeColors[toast.type ?? 'info']}`}
          >
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-nebula-blue shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white">{toast.title}</p>
                {toast.description && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">{toast.description}</p>
                )}
              </div>
              <button onClick={() => dismiss(toast.id)} className="text-muted-foreground hover:text-white shrink-0">
                <X className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
