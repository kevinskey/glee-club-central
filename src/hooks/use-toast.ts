
import * as React from "react";
import { toast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  duration?: number;
  variant?: "default" | "destructive";
};

export const useToast = () => {
  const showToast = ({ title, description, variant, duration = 3000 }: ToastProps) => {
    if (variant === "destructive") {
      toast.error(title, {
        description,
        duration,
      });
    } else {
      toast(title, {
        description,
        duration,
      });
    }
  };

  return { toast: showToast };
};
