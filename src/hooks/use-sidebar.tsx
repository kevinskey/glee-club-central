
import { useSidebar as useSidebarComponent } from "@/components/ui/sidebar";
import { useMedia } from "@/hooks/use-mobile";

// Redirect to the canonical sidebar implementation
export function useSidebar() {
  const sidebarContext = useSidebarComponent();
  const isMobile = useMedia("(max-width: 768px)");
  
  return {
    isOpen: isMobile ? false : sidebarContext.open,
    onOpen: sidebarContext.setOpen,
    onClose: () => sidebarContext.setOpen(false),
    onToggle: () => {
      if (!isMobile) {
        sidebarContext.setOpen(!sidebarContext.open);
      }
    },
    isMobile,
  };
}
