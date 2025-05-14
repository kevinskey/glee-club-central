
// Export the useToast and toast functions from the shadcn/ui toast library
import { useToast, type ToastProps, type ToastActionElement } from "@/hooks/use-toast";
import { toast } from "sonner";

export { useToast, toast };
export type { ToastProps, ToastActionElement };
