
import * as React from "react";
import { toast as sonnerToast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  duration?: number;
  variant?: "default" | "destructive";
};

type ToastActionElement = React.ReactElement;

export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const showToast = ({ title, description, variant, duration = 3000 }: ToastProps) => {
    const id = Date.now().toString();
    const newToast = { id, title, description, variant, duration };
    
    setToasts((currentToasts) => [...currentToasts, newToast]);
    
    if (variant === "destructive") {
      sonnerToast.error(title, {
        description,
        duration,
      });
    } else {
      sonnerToast(title, {
        description,
        duration,
      });
    }
    
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  };

  return { 
    toast: showToast,
    toasts,
    dismiss: dismissToast
  };
};

export type { ToastActionElement };
