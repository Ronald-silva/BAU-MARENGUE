import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Participante } from './participantesStore';

export interface RegistroSorteio {
  id: string;
  rodada: number;
  vencedor: Participante;
  seed: string;
  hash: string;
  dataHora: string;
  eventoNome: string;
  premioDescricao: string;
}

interface SorteioState {
  historico: RegistroSorteio[];
  rodadaAtual: number;
  adicionarRegistro: (registro: Omit<RegistroSorteio, 'id' | 'rodada'>) => void;
  limparHistorico: () => void;
  incrementarRodada: () => void;
  resetarRodada: () => void;
}

export const useSorteioStore = create<SorteioState>()(
  persist(
    (set) => ({
      historico: [],
      rodadaAtual: 1,

      adicionarRegistro: (registro) =>
        set((state) => ({
          historico: [
            {
              ...registro,
              id: crypto.randomUUID(),
              rodada: state.rodadaAtual,
            },
            ...state.historico,
          ],
        })),

      limparHistorico: () => set({ historico: [], rodadaAtual: 1 }),

      incrementarRodada: () =>
        set((state) => ({ rodadaAtual: state.rodadaAtual + 1 })),

      resetarRodada: () => set({ rodadaAtual: 1 }),
    }),
    { name: 'bau-merengue-historico' }
  )
);
