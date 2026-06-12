'use client';
import { useEffect } from 'react';

export function PwaRegistry() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Desregistrar service workers antigos
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });

      // Registrar o novo — o evento 'load' já disparou antes da hidratação do React,
      // então registramos diretamente (readyState sempre é 'complete' aqui).
      const registrar = () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(
          (registration) => {
            console.log('PWA Service Worker registered:', registration.scope);
          },
          (err) => {
            console.error('PWA Service Worker registration failed:', err);
          }
        );
      };

      if (document.readyState === 'complete') {
        registrar();
      } else {
        window.addEventListener('load', registrar, { once: true });
      }
    }
  }, []);

  return null;
}
