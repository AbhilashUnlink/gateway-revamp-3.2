import { toast as hotToast } from 'react-hot-toast';
import { createElement } from 'react';
import { ToastCard } from '@/components/ui/Toast';
import type { ToastVariant } from '@/components/ui/Toast';

interface ToastOptions {
  description?: string;
  duration?: number;
  id?: string;
  action?: { label: string; onClick: () => void };
}

function show(variant: ToastVariant, title: string, options?: ToastOptions) {
  return hotToast.custom(
    (t) =>
      createElement(ToastCard, {
        t,
        variant,
        title,
        description: options?.description,
        action: options?.action,
      }),
    { duration: options?.duration ?? 4000, id: options?.id }
  );
}

export const showToast = {
  success: (title: string, options?: ToastOptions) => show('success', title, options),
  error: (title: string, options?: ToastOptions) => show('error', title, options),
  warning: (title: string, options?: ToastOptions) => show('warning', title, options),
  info: (title: string, options?: ToastOptions) => show('info', title, options),
  dismiss: hotToast.dismiss,
  dismissAll: () => hotToast.dismiss(),
};
