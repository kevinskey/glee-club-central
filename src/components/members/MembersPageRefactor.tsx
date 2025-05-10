
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Creates a wrapper function for fetchUsers that returns void
 */
export const createMemberRefreshFunction = (fetchUsers: () => Promise<any>) => {
  return async () => {
    try {
      await fetchUsers();
      console.log("Members refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh members:", error);
      toast.error("Failed to refresh member list");
    }
  };
};
