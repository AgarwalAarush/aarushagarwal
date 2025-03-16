// components/ClientOnly.js
import { useEffect, useState } from 'react';

export default function ClientOnly({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Important: Return null on first render to avoid hydration mismatch
  // This means the component will ONLY render on the client
  if (!hasMounted) {
    return fallback;
  }

  return typeof children === 'function' ? children() : children;
}