// Web Audio API — sons sintetizados no browser, sem arquivos externos

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function tocar(fn: (ctx: AudioContext) => void) {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    fn(ctx);
  } catch {
    // silently fail se browser bloquear
  }
}

// Som de clique (tick curto)
export function somTick() {
  tocar((ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  });
}

// Som de embaralhando (loop de ticks rápidos)
export function somEmbaralhando(duracaoMs: number): () => void {
  let ativo = true;
  let intervalo = 80;

  const loop = () => {
    if (!ativo) return;
    somTick();
    intervalo = Math.min(intervalo * 1.04, 300); // vai ficando mais lento
    setTimeout(loop, intervalo);
  };

  loop();
  const timeout = setTimeout(() => { ativo = false; }, duracaoMs);

  return () => {
    ativo = false;
    clearTimeout(timeout);
  };
}

// Som de revelação (fanfarra sintetizada)
export function somRevelacao() {
  tocar((ctx) => {
    const notas = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
    notas.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.5);
    });
  });
}

// Som de vitória (celebração completa)
export function somVitoria() {
  tocar((ctx) => {
    // Fanfarra
    const sequencia = [
      { freq: 523.25, t: 0 }, { freq: 659.25, t: 0.1 },
      { freq: 783.99, t: 0.2 }, { freq: 1046.50, t: 0.3 },
      { freq: 1318.51, t: 0.4 }, { freq: 1046.50, t: 0.55 },
      { freq: 1318.51, t: 0.65 },
    ];
    sequencia.forEach(({ freq, t }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + t);
      gain.gain.setValueAtTime(0, ctx.currentTime + t);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.35);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.4);
    });
  });
}

// Som de erro/aviso
export function somErro() {
  tocar((ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  });
}
