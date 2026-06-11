'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Maximize, Minimize, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useParticipantesStore } from '@/store/participantesStore';
import { useSorteioStore } from '@/store/sorteioStore';
import { useConfigStore } from '@/store/configStore';
import { sortearVencedores, gerarSeedCripto, gerarHash } from '@/lib/fisher-yates';
import { somEmbaralhando, somRevelacao, somVitoria } from '@/lib/audio';
import Link from 'next/link';

type Estado = 'idle' | 'embaralhando' | 'revelando' | 'vencedor';

function dispararConfetti() {
  const defaults = { spread: 360, ticks: 100, gravity: 0.5, decay: 0.94, startVelocity: 30 };
  const cores = ['#FFD700', '#FFA500', '#FF8C00', '#DC143C', '#FF4444', '#FFE066'];

  confetti({ ...defaults, particleCount: 60, scalar: 1.2, shapes: ['circle'], colors: cores });
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 40, scalar: 0.8, shapes: ['circle'], colors: cores });
  }, 300);
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 50, scalar: 1.0, shapes: ['circle'], colors: cores, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ ...defaults, particleCount: 50, scalar: 1.0, shapes: ['circle'], colors: cores, angle: 120, spread: 55, origin: { x: 1 } });
  }, 600);
}

export default function SorteioPage() {
  const { participantes, marcarSorteado } = useParticipantesStore();
  const { adicionarRegistro, incrementarRodada, rodadaAtual } = useSorteioStore();
  const { eventoNome, premioDescricao, quantidadeVencedores, somAtivo } = useConfigStore();

  const [estado, setEstado] = useState<Estado>('idle');
  const [nomeExibido, setNomeExibido] = useState('');
  const [vencedor, setVencedor] = useState<(typeof participantes)[0] | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stopSoundRef = useRef<(() => void) | null>(null);

  const disponiveis = participantes.filter((p) => p.status === 'disponivel');

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const iniciarSorteio = useCallback(async () => {
    if (disponiveis.length === 0 || estado !== 'idle') return;

    setEstado('embaralhando');
    setVencedor(null);

    // Som de embaralhamento
    if (somAtivo) {
      stopSoundRef.current = somEmbaralhando(4000);
    }

    // Animação de nomes passando
    const embaralhadosFull = [...disponiveis].sort(() => Math.random() - 0.5);
    let idx = 0;
    let velocidade = 60;
    const fimAnimacao = Date.now() + 4000;

    const loop = () => {
      if (Date.now() >= fimAnimacao) return;
      setNomeExibido(embaralhadosFull[idx % embaralhadosFull.length].nome);
      idx++;
      velocidade = Math.min(velocidade * 1.025, 250);
      setTimeout(loop, velocidade);
    };
    loop();

    // Após 4 segundos, revelar
    setTimeout(async () => {
      if (stopSoundRef.current) stopSoundRef.current();
      setEstado('revelando');

      // Sortear vencedor de verdade
      const [sorteado] = sortearVencedores(disponiveis, 1);
      const seed = gerarSeedCripto();
      const hash = await gerarHash(`${sorteado.id}-${seed}-${Date.now()}`);

      setNomeExibido(sorteado.nome);

      setTimeout(async () => {
        setVencedor(sorteado);
        setEstado('vencedor');
        marcarSorteado(sorteado.id);
        adicionarRegistro({
          vencedor: sorteado,
          seed,
          hash,
          dataHora: new Date().toISOString(),
          eventoNome,
          premioDescricao,
        });
        incrementarRodada();

        if (somAtivo) {
          somRevelacao();
          setTimeout(() => somVitoria(), 500);
        }
        setTimeout(dispararConfetti, 300);
      }, 800);
    }, 4000);
  }, [disponiveis, estado, somAtivo, marcarSorteado, adicionarRegistro, incrementarRodada, eventoNome, premioDescricao]);

  const reiniciar = () => {
    setEstado('idle');
    setVencedor(null);
    setNomeExibido('');
    if (stopSoundRef.current) stopSoundRef.current();
  };

  const semParticipantes = disponiveis.length === 0;

  return (
    <div
      ref={containerRef}
      className="page-enter relative min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: isFullscreen
          ? 'radial-gradient(ellipse at center, #3D1A00 0%, #0A0500 70%)'
          : 'transparent',
      }}
    >
      {/* Botão fullscreen */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 p-2 rounded-xl z-20 transition-all duration-200"
        style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}
      >
        {isFullscreen ? <Minimize size={18} className="text-ouro-400" /> : <Maximize size={18} className="text-ouro-400" />}
      </button>

      {/* Header do sorteio */}
      <div className="text-center mb-6 relative z-10">
        <h1 className="font-display font-bold text-xl text-ouro-400 uppercase tracking-widest mb-1">
          {eventoNome}
        </h1>
        <p className="text-xs text-ouro-600/60 uppercase tracking-wider">
          Rodada {rodadaAtual} · {disponiveis.length} participante{disponiveis.length !== 1 ? 's' : ''} disponíve{disponiveis.length !== 1 ? 'is' : 'l'}
        </p>
      </div>

      {/* Arena principal */}
      <div className="relative w-full max-w-sm mx-auto mb-6">
        {/* Raios de fundo */}
        <AnimatePresence>
          {(estado === 'embaralhando' || estado === 'revelando' || estado === 'vencedor') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-[-20px] rays-bg rounded-full"
              style={{ animation: 'raySpin 3s linear infinite' }}
            />
          )}
        </AnimatePresence>

        {/* Card central */}
        <motion.div
          className="relative z-10 rounded-3xl overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at center, #2A1500 0%, #150A00 100%)',
            border: estado === 'vencedor'
              ? '3px solid #FFD700'
              : '2px solid rgba(255,215,0,0.2)',
            boxShadow: estado === 'vencedor'
              ? '0 0 80px rgba(255,215,0,0.6), 0 0 40px rgba(255,165,0,0.4)'
              : '0 0 30px rgba(255,165,0,0.1)',
            minHeight: '320px',
          }}
          animate={estado === 'vencedor' ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center p-8 min-h-[320px]">
            {/* Estado: IDLE */}
            {estado === 'idle' && !semParticipantes && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex justify-center mb-4"
                >
                  <img src="/icons/icon-512.png" alt="Logo" className="w-24 h-24 rounded-2xl" style={{ filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.5))' }} />
                </motion.div>
                <p className="text-ouro-600/60 text-sm">Pronto para sortear!</p>
                {premioDescricao && (
                  <p className="text-ouro-400 font-bold text-sm mt-2">🎁 {premioDescricao}</p>
                )}
              </motion.div>
            )}

            {/* Estado: SEM PARTICIPANTES */}
            {semParticipantes && (
              <div className="text-center">
                <div className="text-6xl mb-4">😔</div>
                <p className="text-ouro-600/60 text-sm mb-4">Sem participantes disponíveis</p>
                <Link href="/participantes">
                  <button className="btn-gold text-sm px-5 py-2">Adicionar Participantes</button>
                </Link>
              </div>
            )}

            {/* Estado: EMBARALHANDO */}
            {estado === 'embaralhando' && (
              <motion.div
                key="embaralhando"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                  className="text-5xl mb-4"
                >
                  🎰
                </motion.div>
                <div className="text-ouro-400 text-xs uppercase tracking-widest mb-3">Embaralhando...</div>
                <motion.div
                  key={nomeExibido}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display font-bold text-2xl text-creme-100 px-4 text-center min-h-[40px]"
                  style={{ textShadow: '0 0 20px rgba(255,215,0,0.4)' }}
                >
                  {nomeExibido}
                </motion.div>
                {/* Barra de progresso */}
                <div className="mt-4 w-full bg-escuro-700 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500)' }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4, ease: 'linear' }}
                  />
                </div>
              </motion.div>
            )}

            {/* Estado: REVELANDO */}
            {estado === 'revelando' && (
              <motion.div
                key="revelando"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="text-center"
              >
                <div className="text-5xl mb-3">✨</div>
                <div className="text-ouro-400 text-xs uppercase tracking-widest mb-3">E o vencedor é...</div>
                <div
                  className="font-display font-bold text-3xl text-ouro-400"
                  style={{ textShadow: '0 0 30px rgba(255,215,0,0.8)' }}
                >
                  {nomeExibido}
                </div>
              </motion.div>
            )}

            {/* Estado: VENCEDOR */}
            {estado === 'vencedor' && vencedor && (
              <motion.div
                key="vencedor"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 150, damping: 12 }}
                className="text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-7xl mb-3"
                  style={{ filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.8))' }}
                >
                  🏆
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-ouro-500 text-xs uppercase tracking-widest mb-2">🎉 VENCEDOR!</div>
                  <div
                    className="font-display font-bold text-4xl text-gold-gradient mb-2 leading-tight"
                    style={{ textShadow: 'none', filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.6))' }}
                  >
                    {vencedor.nome}
                  </div>
                  {vencedor.contato && (
                    <div className="text-ouro-600/70 text-sm mb-2">{vencedor.contato}</div>
                  )}
                  {premioDescricao && (
                    <div
                      className="inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-bold"
                      style={{ background: 'rgba(220,20,60,0.2)', border: '1px solid rgba(220,20,60,0.4)', color: '#FF8888' }}
                    >
                      🎁 {premioDescricao}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Moedas animadas */}
      <div className="absolute left-6 top-1/3 text-2xl animate-coin-float opacity-40 pointer-events-none">🪙</div>
      <div className="absolute right-6 top-1/2 text-xl animate-coin-float-2 opacity-30 pointer-events-none">✨</div>
      <div className="absolute left-10 bottom-1/3 text-lg animate-coin-float-3 opacity-30 pointer-events-none">⭐</div>

      {/* Controles */}
      <div className="relative z-10 w-full max-w-sm space-y-3">
        {(estado === 'idle' || estado === 'vencedor') && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={iniciarSorteio}
            disabled={semParticipantes}
            className="w-full relative overflow-hidden rounded-2xl py-5 font-display font-bold text-xl tracking-widest uppercase text-escuro-900 transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: semParticipantes
                ? 'rgba(139,101,20,0.3)'
                : 'linear-gradient(135deg, #FFE066 0%, #FFD700 30%, #FFA500 60%, #FF8C00 100%)',
              boxShadow: semParticipantes ? 'none' : '0 0 40px rgba(255,215,0,0.5), 0 8px 30px rgba(255,165,0,0.4)',
              border: '2px solid rgba(255,255,255,0.15)',
            }}
          >
            {!semParticipantes && (
              <div className="absolute inset-0 shimmer-effect pointer-events-none" />
            )}
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Play size={22} fill="currentColor" />
              {estado === 'vencedor' ? 'PRÓXIMO SORTEIO' : 'SORTEAR AGORA'}
              <Play size={22} fill="currentColor" />
            </span>
          </motion.button>
        )}

        {estado === 'vencedor' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={reiniciar}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#8B6914',
            }}
          >
            <RotateCcw size={15} /> Voltar ao Início
          </motion.button>
        )}

        {estado === 'idle' && !semParticipantes && (
          <div className="flex items-center justify-center gap-4 text-xs text-ouro-700/50">
            <span>🔒 Fisher-Yates Shuffle</span>
            <span>·</span>
            <span>🔐 Hash SHA-256</span>
          </div>
        )}
      </div>
    </div>
  );
}
