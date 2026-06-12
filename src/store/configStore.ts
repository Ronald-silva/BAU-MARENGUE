import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Config {
  eventoNome: string;
  premioDescricao: string;
  quantidadeVencedores: number;
  somAtivo: boolean;
  animacaoAtiva: boolean;
  mostrarTodasTentativas: boolean; // true = mostra todas, false = só vencedores
}

interface ConfigState extends Config {
  atualizar: (config: Partial<Config>) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      eventoNome: 'Baú Merengue',
      premioDescricao: 'Grande Prêmio',
      quantidadeVencedores: 1,
      somAtivo: true,
      animacaoAtiva: true,
      mostrarTodasTentativas: false,
      atualizar: (config) => set((state) => ({ ...state, ...config })),
    }),
    { name: 'bau-merengue-config' }
  )
);
