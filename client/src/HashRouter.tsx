import { Router } from "wouter";
import { useState, useEffect } from "react";

function HashRouter({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState(() => window.location.hash.slice(1) || "/");

  useEffect(() => {
    const onHashChange = () => setLocation(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return (
    <Router hook={[() => location, navigate]}>
      {children}
    </Router>
  );
}

export default HashRouter;
