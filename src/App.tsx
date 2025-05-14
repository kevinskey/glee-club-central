
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useAuth } from "@/contexts/AuthContext";

function App() {
  const { isLoading } = useAuth();

  useEffect(() => {
    document.body.className = "dark"; // Force dark mode
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <RouterProvider router={router} />;
}

export default App;
