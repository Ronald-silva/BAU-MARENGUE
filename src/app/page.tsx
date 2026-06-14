'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Users, Star, History, ChevronRight, Zap } from 'lucide-react';
import { useParticipantesStore } from '@/store/participantesStore';
import { useSorteioStore } from '@/store/sorteioStore';
import { useConfigStore } from '@/store/configStore';

function StatCard({
  label, value, sub, color, icon: Icon,
}: {
  label: string; value: number | string; sub: string;
  color: string; icon: React.ElementType;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-bau p-5 lg:p-7 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: `${color}99` }}>
          {label}
        </span>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-xs lg:text-sm text-ouro-600/60">{sub}</div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { participantes } = useParticipantesStore();
  const { historico } = useSorteioStore();
  const { eventoNome, premioDescricao } = useConfigStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = participantes.length;
  const vencedores = participantes.filter((p) => p.status === 'vencedor').length;
  const tentaram = participantes.filter((p) => p.status === 'tentou').length;
  const disponiveis = participantes.filter((p) => p.status === 'disponivel').length;

  const ultimosSorteios = historico.filter((r) => r.sucesso).slice(0, 3);

  return (
    <div className="page-enter">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden mb-6 mt-2"
        style={{
          background: 'radial-gradient(ellipse at top, #3D1A00 0%, #150A00 70%)',
          border: '2px solid rgba(255,215,0,0.2)',
          boxShadow: '0 0 60px rgba(255,165,0,0.15)',
        }}
      >
        {/* Raios de fundo */}
        <div
          className="absolute inset-0 rays-bg opacity-30 animate-ray-spin"
          style={{ transformOrigin: 'center' }}
        />

        {/* Moedas decorativas */}
        <div className="absolute top-3 right-4 text-2xl animate-coin-float opacity-70">🪙</div>
        <div className="absolute top-8 left-4 text-xl animate-coin-float-2 opacity-60">✨</div>
        <div className="absolute bottom-4 right-8 text-lg animate-coin-float-3 opacity-50">⭐</div>

        <div className="relative z-10 px-6 py-8 lg:py-14 text-center">
          {/* Logo imagem como hero */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex justify-center mb-4"
          >
            <img src="/icons/icon-512.png" alt="Logo" className="w-24 h-24 lg:w-40 lg:h-40 rounded-2xl" style={{ filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.6))' }} />
          </motion.div>

          <h1 className="font-display font-bold text-3xl lg:text-6xl mb-1 text-gold-gradient">
            {eventoNome.toUpperCase()}
          </h1>
          <p className="text-ouro-500/80 text-sm lg:text-xl mb-1">AQUI 2 É 1</p>
          {premioDescricao && (
            <div
              className="inline-flex items-center gap-2 mt-2 px-4 lg:px-7 py-1.5 lg:py-3 rounded-full text-sm lg:text-lg font-bold"
              style={{
                background: 'rgba(220,20,60,0.2)',
                border: '1px solid rgba(220,20,60,0.4)',
                color: '#FF6B6B',
              }}
            >
              🎁 {premioDescricao}
            </div>
          )}
        </div>
      </motion.div>

      {/* Cards de estatística */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="col-span-2 sm:col-span-1">
          <StatCard label="Total" value={total} sub="cadastrados" color="#FFD700" icon={Users} />
        </div>
        <StatCard label="Disponíveis" value={disponiveis} sub="podem tentar" color="#4ADE80" icon={Star} />
        <StatCard label="Tentaram" value={tentaram} sub="sem sucesso" color="#FFA500" icon={Users} />
        <StatCard label="Vencedores" value={vencedores} sub="premiados" color="#DC143C" icon={Trophy} />
      </div>

      {/* Botão principal — SORTEAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <Link href="/sorteio">
          <button
            className="w-full relative overflow-hidden rounded-2xl py-5 lg:py-8 font-display font-bold text-2xl lg:text-4xl tracking-widest uppercase text-escuro-900 transition-all duration-300 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #FFE066 0%, #FFD700 30%, #FFA500 60%, #FF8C00 100%)',
              boxShadow: '0 0 40px rgba(255,215,0,0.5), 0 8px 30px rgba(255,165,0,0.4), 0 2px 8px rgba(0,0,0,0.5)',
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          >
            {/* Shimmer */}
            <div
              className="absolute inset-0 shimmer-effect pointer-events-none"
              style={{ backgroundSize: '200% 100%' }}
            />
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Zap size={24} fill="currentColor" />
              REALIZAR SORTEIO
              <Zap size={24} fill="currentColor" />
            </span>
          </button>
        </Link>
      </motion.div>

      {/* Ações secundárias */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <Link href="/participantes">
          <button
            className="w-full py-3 lg:py-5 rounded-xl font-bold text-sm lg:text-base flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
            style={{
              background: 'rgba(220,20,60,0.15)',
              border: '1px solid rgba(220,20,60,0.4)',
              color: '#FF6B6B',
            }}
          >
            <Users size={16} className="lg:hidden" />
            <Users size={22} className="hidden lg:block" />
            Participantes
          </button>
        </Link>
        <Link href="/historico">
          <button
            className="w-full py-3 lg:py-5 rounded-xl font-bold text-sm lg:text-base flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
            style={{
              background: 'rgba(255,215,0,0.08)',
              border: '1px solid rgba(255,215,0,0.2)',
              color: '#FFD700',
            }}
          >
            <History size={16} className="lg:hidden" />
            <History size={22} className="hidden lg:block" />
            Histórico
          </button>
        </Link>
      </motion.div>

      {/* Últimos sorteios */}
      {ultimosSorteios.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card-bau p-4 lg:p-7"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-sm lg:text-base text-ouro-400 uppercase tracking-wider">
              Últimos Vencedores
            </h2>
            <Link href="/historico" className="text-xs lg:text-sm text-ouro-600 flex items-center gap-1 hover:text-ouro-400">
              Ver todos <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-2 lg:space-y-3">
            {ultimosSorteios.map((registro) => (
              <div
                key={registro.id}
                className="flex items-center gap-3 p-2.5 lg:p-4 rounded-xl"
                style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.1)' }}
              >
                <div
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-bold text-sm lg:text-xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#0A0500' }}
                >
                  {registro.participante.nome.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm lg:text-lg text-creme-100 truncate">{registro.participante.nome}</div>
                  <div className="text-xs lg:text-sm text-ouro-600/60">
                    Rodada {registro.rodada} · {new Date(registro.dataHora).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <span className="text-ouro-400 text-lg lg:text-2xl">🏆</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* CTA se não há participantes */}
      {total === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-4 rounded-xl text-center"
          style={{ background: 'rgba(255,215,0,0.05)', border: '1px dashed rgba(255,215,0,0.2)' }}
        >
          <div className="text-3xl mb-2">👥</div>
          <p className="text-ouro-600/80 text-sm mb-3">
            Nenhum participante cadastrado ainda.
          </p>
          <Link href="/participantes">
            <button className="btn-gold text-sm px-5 py-2">
              Adicionar Participantes
            </button>
          </Link>
        </motion.div>
      )}

      {/* Aviso de PWA instalável */}
      <div className="mt-6 text-center">
        <p className="text-xs text-ouro-700/50">
          💡 Instale como app: toque em "Adicionar à tela inicial"
        </p>
      </div>
    </div>
  );
}
