
import { useState, useEffect } from 'react';

// Placeholder auth hook since audio functionality was removed
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return {
    user,
    isLoading,
    signOut: () => {},
    signIn: () => {}
  };
}
