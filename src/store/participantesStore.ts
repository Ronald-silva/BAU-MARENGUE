import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { deletarFotoParticipante } from '@/lib/imageStorage';

export interface Participante {
  id: string;
  nome: string;
  contato: string;
  status: 'disponivel' | 'tentou' | 'vencedor';
  dataCadastro: string;
  dataTentativa?: string;
  dataVitoria?: string;
  temFoto?: boolean;
}

interface ParticipantesState {
  participantes: Participante[];
  addParticipante: (nome: string, contato: string, temFoto?: boolean) => string;
  removeParticipante: (id: string) => void;
  editarParticipante: (id: string, nome: string, contato: string, temFoto?: boolean) => void;
  importarParticipantes: (lista: Omit<Participante, 'id' | 'status' | 'dataCadastro'>[]) => void;
  marcarTentou: (id: string) => void;
  marcarVencedor: (id: string) => void;
  resetarTodos: () => void;
  limparTodos: () => void;
}

export const useParticipantesStore = create<ParticipantesState>()(
  persist(
    (set) => ({
      participantes: [],

      addParticipante: (nome, contato, temFoto) => {
        const novoId = crypto.randomUUID();
        set((state) => ({
          participantes: [
            ...state.participantes,
            {
              id: novoId,
              nome: nome.trim(),
              contato: contato.trim(),
              status: 'disponivel',
              dataCadastro: new Date().toISOString(),
              temFoto,
            },
          ],
        }));
        return novoId;
      },

      removeParticipante: (id) =>
        set((state) => {
          const participante = state.participantes.find(p => p.id === id);
          if (participante?.temFoto) {
            deletarFotoParticipante(id).catch(console.error);
          }
          return { participantes: state.participantes.filter((p) => p.id !== id) };
        }),

      editarParticipante: (id, nome, contato, temFoto) =>
        set((state) => ({
          participantes: state.participantes.map((p) =>
            p.id === id 
              ? { ...p, nome: nome.trim(), contato: contato.trim(), ...(temFoto !== undefined ? { temFoto } : {}) } 
              : p
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

      marcarTentou: (id) =>
        set((state) => ({
          participantes: state.participantes.map((p) =>
            p.id === id
              ? { ...p, status: 'tentou', dataTentativa: new Date().toISOString() }
              : p
          ),
        })),

      marcarVencedor: (id) =>
        set((state) => ({
          participantes: state.participantes.map((p) =>
            p.id === id
              ? { ...p, status: 'vencedor', dataVitoria: new Date().toISOString() }
              : p
          ),
        })),

      resetarTodos: () =>
        set((state) => ({
          participantes: state.participantes.map((p) => ({
            ...p,
            status: 'disponivel',
            dataTentativa: undefined,
            dataVitoria: undefined,
          })),
        })),

      limparTodos: () => set((state) => {
        state.participantes.forEach((p) => {
          if (p.temFoto) deletarFotoParticipante(p.id).catch(console.error);
        });
        return { participantes: [] };
      }),
    }),
    { name: 'bau-merengue-participantes' }
  )
);
