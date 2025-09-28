import { Router } from "wouter";
import { useState, useEffect } from "react";

interface HashRouterProps {
  children: React.ReactNode;
}

export default function HashRouter({ children }: HashRouterProps) {
  const [location, setLocation] = useState(() => window.location.hash.slice(1) || "/");

  useEffect(() => {
    const onHashChange = () => setLocation(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const hook: [() => string, (to: string) => void] = [
    () => location,
    (to) => {
      if (to !== location) window.location.hash = to;
    },
  ];

  return <Router hook={hook}>{children}</Router>;
}
