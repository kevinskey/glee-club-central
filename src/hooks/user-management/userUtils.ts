
// Format date for display
export const formatDate = (dateString?: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

// Open edit user dialog
export const openEditUserDialog = (
  user: any, 
  setSelectedUser: (user: any) => void, 
  setIsEditUserOpen: (open: boolean) => void
) => {
  setSelectedUser(user);
  setIsEditUserOpen(true);
};
