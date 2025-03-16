import React, { useMemo } from 'react';

// Component to render random particles with a consistent pattern
export default function Particles({ count = 30, color = '#4cc9f0' }) {
  // Generate random dots once when component mounts on client
  const particles = useMemo(() => {
    return [...Array(count)].map((_, i) => ({
      id: `p-${i}`,
      cx: `${Math.random() * 100}%`,
      cy: `${Math.random() * 100}%`,
      r: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2
    }));
  }, [count]);

  return (
    <>
      {particles.map((particle) => (
        <circle 
          key={particle.id} 
          cx={particle.cx} 
          cy={particle.cy} 
          r={particle.r}
          fill={color}
          opacity={particle.opacity}
        />
      ))}
    </>
  );
}