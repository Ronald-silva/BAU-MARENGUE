'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Trophy, History, Settings, Sparkles } from 'lucide-react';
import { useParticipantesStore } from '@/store/participantesStore';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', icon: Sparkles, label: 'Início' },
  { href: '/participantes', icon: Users, label: 'Participantes' },
  { href: '/sorteio', icon: Trophy, label: 'Sortear' },
  { href: '/historico', icon: History, label: 'Histórico' },
  { href: '/configuracoes', icon: Settings, label: 'Config' },
];

export function Header() {
  const pathname = usePathname();
  const { participantes } = useParticipantesStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const disponiveis = mounted ? participantes.filter((p) => p.status === 'disponivel').length : 0;

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col items-center shadow-2xl">
      {/* Barra superior */}
      <div
        className="w-full"
        style={{
          background: 'linear-gradient(90deg, #150A00 0%, #2A1500 50%, #150A00 100%)',
          borderBottom: '2px solid',
          borderImage: 'linear-gradient(90deg, #FFD700, #FFA500, #DC143C, #FFA500, #FFD700) 1',
          boxShadow: '0 4px 24px rgba(255,165,0,0.2)',
        }}
      >
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between px-4 py-2.5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="/icons/icon-192.png" 
                alt="Baú Merengue" 
                className="w-10 h-10 rounded-xl animate-bounce-slow drop-shadow-md"
              />
            </div>
          <div className="flex flex-col justify-center">
            <span
              className="font-display font-bold text-xl sm:text-2xl leading-none tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #FFE066, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.5))',
              }}
            >
              BAÚ MERENGUE
            </span>
            <span className="text-[10px] sm:text-xs text-ouro-500/80 font-body tracking-widest uppercase mt-0.5 leading-none">
              AQUI 2 É 1
            </span>
          </div>
        </Link>

        {/* Badge de participantes disponíveis */}
        <div className="hidden sm:flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold"
            style={{
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.3)',
            }}
          >
            <span className="text-green-400">●</span>
            <span className="text-creme-100">{disponiveis} {disponiveis === 1 ? 'disponível' : 'disponíveis'}</span>
          </div>
        </div>
        </div>
      </div>

      {/* Barra de navegação */}
      <nav
        className="w-full"
        style={{
          background: 'rgba(10,5,0,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,215,0,0.1)',
        }}
      >
        <div className="max-w-4xl mx-auto w-full flex items-center justify-around sm:justify-center sm:gap-12 px-2 py-1.5">
          {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 group"
              style={{
                background: active ? 'rgba(255,215,0,0.15)' : 'transparent',
                border: active ? '1px solid rgba(255,215,0,0.3)' : '1px solid transparent',
              }}
            >
              <Icon
                size={18}
                style={{ color: active ? '#FFD700' : '#8B6914' }}
                className="transition-colors duration-200 group-hover:text-ouro-400"
              />
              <span
                className="text-xs font-medium transition-colors duration-200"
                style={{ color: active ? '#FFD700' : '#8B6914', fontSize: '10px' }}
              >
                {label}
              </span>
              {active && (
                <div
                  className="absolute bottom-0 w-8 h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500)' }}
                />
              )}
            </Link>
          );
        })}
        </div>
      </nav>
    </header>
  );
}
