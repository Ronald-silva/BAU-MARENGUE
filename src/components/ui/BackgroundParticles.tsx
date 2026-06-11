'use client';
import { useEffect, useRef } from 'react';

export function BackgroundParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const coins = ['🪙', '✨', '⭐', '💛'];
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        pointer-events: none;
        font-size: ${Math.random() * 16 + 10}px;
        left: ${Math.random() * 100}vw;
        bottom: -50px;
        z-index: 0;
        opacity: 0;
        animation: particle-rise ${Math.random() * 8 + 6}s ${Math.random() * 8}s linear infinite;
        filter: blur(0.5px);
      `;
      particle.textContent = coins[Math.floor(Math.random() * coins.length)];
      container.appendChild(particle);
      particles.push(particle);
    }

    return () => particles.forEach((p) => p.remove());
  }, []);

  return <div ref={containerRef} className="pointer-events-none" aria-hidden="true" />;
}
