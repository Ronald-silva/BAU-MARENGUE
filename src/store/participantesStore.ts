import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Participante {
  id: string;
  nome: string;
  contato: string;
  status: 'disponivel' | 'sorteado';
  dataCadastro: string;
  dataSorteio?: string;
}

interface ParticipantesState {
  participantes: Participante[];
  addParticipante: (nome: string, contato: string) => void;
  removeParticipante: (id: string) => void;
  editarParticipante: (id: string, nome: string, contato: string) => void;
  importarParticipantes: (lista: Omit<Participante, 'id' | 'status' | 'dataCadastro'>[]) => void;
  marcarSorteado: (id: string) => void;
  resetarTodos: () => void;
  limparTodos: () => void;
}

export const useParticipantesStore = create<ParticipantesState>()(
  persist(
    (set) => ({
      participantes: [],

      addParticipante: (nome, contato) =>
        set((state) => ({
          participantes: [
            ...state.participantes,
            {
              id: crypto.randomUUID(),
              nome: nome.trim(),
              contato: contato.trim(),
              status: 'disponivel',
              dataCadastro: new Date().toISOString(),
            },
          ],
        })),

      removeParticipante: (id) =>
        set((state) => ({
          participantes: state.participantes.filter((p) => p.id !== id),
        })),

      editarParticipante: (id, nome, contato) =>
        set((state) => ({
          participantes: state.participantes.map((p) =>
            p.id === id ? { ...p, nome: nome.trim(), contato: contato.trim() } : p
          ),
        })),

      importarParticipantes: (lista) =>
        set((state) => {
          const novos: Participante[] = lista.map((p) => ({
            id: crypto.randomUUID(),
            nome: p.nome.trim(),
            contato: p.contato?.trim() ?? '',
            status: 'disponivel',
            dataCadastro: new Date().toISOString(),
          }));
          return { participantes: [...state.participantes, ...novos] };
        }),

      marcarSorteado: (id) =>
        set((state) => ({
          participantes: state.participantes.map((p) =>
            p.id === id
              ? { ...p, status: 'sorteado', dataSorteio: new Date().toISOString() }
              : p
          ),
        })),

      resetarTodos: () =>
        set((state) => ({
          participantes: state.participantes.map((p) => ({
            ...p,
            status: 'disponivel',
            dataSorteio: undefined,
          })),
        })),

      limparTodos: () => set({ participantes: [] }),
    }),
    { name: 'bau-merengue-participantes' }
  )
);
