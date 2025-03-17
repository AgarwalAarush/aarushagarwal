// components/ClientOnly.js
import { useEffect, useState } from 'react';

export default function ClientOnly({ children, fallback = null }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // this forces a rerender
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // this returns null on first render, so the client and server match
    return null;
  }

  return typeof children === 'function' ? children() : children;
}