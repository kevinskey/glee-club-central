
import { useState, useEffect } from 'react';

// Placeholder profile hook since audio functionality was removed
export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return {
    profile,
    isAuthenticated,
    loading: false
  };
}
