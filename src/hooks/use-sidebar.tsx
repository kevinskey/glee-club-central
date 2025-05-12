
import { useSidebar as useSidebarComponent } from "@/components/ui/sidebar";

// Redirect to the canonical sidebar implementation
export function useSidebar() {
  const sidebarContext = useSidebarComponent();
  
  return {
    isOpen: sidebarContext.open,
    onOpen: sidebarContext.setOpen,
    onClose: () => sidebarContext.setOpen(false),
    onToggle: () => sidebarContext.setOpen(!sidebarContext.open),
  };
}
