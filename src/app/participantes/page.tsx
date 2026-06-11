'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, Upload, Trash2, Edit3, Check, X, Filter, RefreshCw } from 'lucide-react';
import Papa from 'papaparse';
import { useParticipantesStore, Participante } from '@/store/participantesStore';
import { somTick, somErro } from '@/lib/audio';
import { useConfigStore } from '@/store/configStore';

function ParticipantCard({
  participante,
  onEdit,
  onDelete,
}: {
  participante: Participante;
  onEdit: (p: Participante) => void;
  onDelete: (id: string) => void;
}) {
  const sorteado = participante.status === 'sorteado';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, scale: 0.9 }}
      className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
      style={{
        background: sorteado
          ? 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.05) 100%)'
          : 'rgba(255,255,255,0.03)',
        border: sorteado ? '1px solid rgba(255,215,0,0.25)' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg flex-shrink-0"
        style={{
          background: sorteado
            ? 'linear-gradient(135deg, #FFD700, #FFA500)'
            : 'linear-gradient(135deg, #2A1500, #3D2000)',
          color: sorteado ? '#0A0500' : '#FFA500',
          border: sorteado ? '2px solid #FFD700' : '2px solid rgba(255,165,0,0.3)',
        }}
      >
        {sorteado ? '🏆' : participante.nome.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div
          className="font-bold text-sm truncate"
          style={{ color: sorteado ? '#FFD700' : '#FFF8DC' }}
        >
          {participante.nome}
        </div>
        {participante.contato && (
          <div className="text-xs text-ouro-700/60 truncate">{participante.contato}</div>
        )}
      </div>

      {/* Badge status */}
      <span className={sorteado ? 'badge-sorteado' : 'badge-disponivel'}>
        {sorteado ? '🏆 Sorteado' : '● Disponível'}
      </span>

      {/* Ações */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {!sorteado && (
          <button
            onClick={() => onEdit(participante)}
            className="p-1.5 rounded-lg transition-all duration-150 hover:bg-ouro-600/10"
            title="Editar"
          >
            <Edit3 size={14} className="text-ouro-600" />
          </button>
        )}
        <button
          onClick={() => onDelete(participante.id)}
          className="p-1.5 rounded-lg transition-all duration-150 hover:bg-vermelho-600/20"
          title="Remover"
        >
          <Trash2 size={14} className="text-vermelho-500/60" />
        </button>
      </div>
    </motion.div>
  );
}

export default function ParticipantesPage() {
  const { participantes, addParticipante, removeParticipante, editarParticipante,
    importarParticipantes, resetarTodos, limparTodos } = useParticipantesStore();
  const { somAtivo } = useConfigStore();

  const [nome, setNome] = useState('');
  const [contato, setContato] = useState('');
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<'todos' | 'disponivel' | 'sorteado'>('todos');
  const [editando, setEditando] = useState<Participante | null>(null);
  const [nomeEdit, setNomeEdit] = useState('');
  const [contatoEdit, setContatoEdit] = useState('');
  const [showConfirm, setShowConfirm] = useState<'limpar' | 'resetar' | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    addParticipante(nome, contato);
    if (somAtivo) somTick();
    setNome('');
    setContato('');
  };

  const handleDelete = (id: string) => {
    if (somAtivo) somTick();
    removeParticipante(id);
  };

  const handleStartEdit = (p: Participante) => {
    setEditando(p);
    setNomeEdit(p.nome);
    setContatoEdit(p.contato);
  };

  const handleSaveEdit = () => {
    if (!editando || !nomeEdit.trim()) return;
    editarParticipante(editando.id, nomeEdit, contatoEdit);
    if (somAtivo) somTick();
    setEditando(null);
  };

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const lista = (result.data as Record<string, string>[])
          .filter((row) => row.nome || row.Nome || row.NOME)
          .map((row) => ({
            nome: (row.nome || row.Nome || row.NOME || '').trim(),
            contato: (row.contato || row.Contato || row.telefone || row.Telefone || '').trim(),
          }))
          .filter((p) => p.nome);
        if (lista.length > 0) {
          importarParticipantes(lista);
          if (somAtivo) somTick();
        } else {
          if (somAtivo) somErro();
          alert('Nenhum participante encontrado no arquivo. Verifique se há coluna "nome".');
        }
      },
    });
    e.target.value = '';
  };

  const filtered = participantes
    .filter((p) => {
      if (filtro === 'disponivel') return p.status === 'disponivel';
      if (filtro === 'sorteado') return p.status === 'sorteado';
      return true;
    })
    .filter((p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.contato.toLowerCase().includes(busca.toLowerCase())
    );

  const total = participantes.length;
  const disponiveis = participantes.filter((p) => p.status === 'disponivel').length;
  const sorteados = participantes.filter((p) => p.status === 'sorteado').length;

  return (
    <div className="page-enter">
      <div className="mb-5">
        <h1 className="font-display font-bold text-2xl text-gold-gradient mb-1">
          Participantes
        </h1>
        <p className="text-xs text-ouro-600/60">
          {total} total · {disponiveis} disponíveis · {sorteados} sorteados
        </p>
      </div>

      {/* Formulário de adição */}
      <motion.form
        onSubmit={handleAdd}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-bau p-4 mb-4"
      >
        <h2 className="font-bold text-sm text-ouro-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <UserPlus size={15} /> Adicionar Participante
        </h2>
        <div className="space-y-2">
          <input
            className="input-bau"
            placeholder="Nome completo *"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            className="input-bau"
            placeholder="Telefone / Contato (opcional)"
            value={contato}
            onChange={(e) => setContato(e.target.value)}
          />
          <div className="flex gap-2">
            <button type="submit" className="btn-gold flex-1 py-2.5 text-sm">
              + Adicionar
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95"
              style={{
                background: 'rgba(255,215,0,0.08)',
                border: '1px solid rgba(255,215,0,0.25)',
                color: '#FFD700',
              }}
              title="Importar CSV"
            >
              <Upload size={15} />
              CSV
            </button>
            <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleCSV} />
          </div>
        </div>
        <p className="text-xs text-ouro-700/40 mt-2">
          CSV: colunas "nome" e "contato" (opcional)
        </p>
      </motion.form>

      {/* Barra de busca e filtros */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-3 space-y-2"
        >
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ouro-600/50" />
            <input
              className="input-bau pl-9 text-sm"
              placeholder="Buscar participante..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { key: 'todos', label: `Todos (${total})` },
              { key: 'disponivel', label: `Disponíveis (${disponiveis})` },
              { key: 'sorteado', label: `Sorteados (${sorteados})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFiltro(key as typeof filtro)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150"
                style={{
                  background: filtro === key ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.04)',
                  border: filtro === key ? '1px solid rgba(255,215,0,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  color: filtro === key ? '#FFD700' : '#8B6914',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Lista */}
      <div className="space-y-2 mb-4">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10"
            >
              <div className="text-4xl mb-2">👥</div>
              <p className="text-ouro-700/60 text-sm">
                {total === 0 ? 'Adicione participantes acima' : 'Nenhum resultado encontrado'}
              </p>
            </motion.div>
          ) : (
            filtered.map((p) => (
              <ParticipantCard
                key={p.id}
                participante={p}
                onEdit={handleStartEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Ações em massa */}
      {total > 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => setShowConfirm('resetar')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
            style={{
              background: 'rgba(255,165,0,0.08)',
              border: '1px solid rgba(255,165,0,0.2)',
              color: '#FFA500',
            }}
          >
            <RefreshCw size={13} /> Resetar Sorteio
          </button>
          <button
            onClick={() => setShowConfirm('limpar')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
            style={{
              background: 'rgba(220,20,60,0.08)',
              border: '1px solid rgba(220,20,60,0.2)',
              color: '#DC143C',
            }}
          >
            <Trash2 size={13} /> Limpar Todos
          </button>
        </div>
      )}

      {/* Modal de edição */}
      <AnimatePresence>
        {editando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
            onClick={() => setEditando(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="card-bau p-5 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display font-bold text-lg text-ouro-400 mb-4">Editar Participante</h3>
              <div className="space-y-3">
                <input
                  className="input-bau"
                  value={nomeEdit}
                  onChange={(e) => setNomeEdit(e.target.value)}
                  placeholder="Nome"
                />
                <input
                  className="input-bau"
                  value={contatoEdit}
                  onChange={(e) => setContatoEdit(e.target.value)}
                  placeholder="Contato"
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveEdit} className="btn-gold flex-1 py-2.5 text-sm">
                    <Check size={15} className="inline mr-1" /> Salvar
                  </button>
                  <button
                    onClick={() => setEditando(null)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#8B6914', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <X size={15} className="inline mr-1" /> Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmação */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="card-bau p-6 w-full max-w-xs text-center"
            >
              <div className="text-4xl mb-3">{showConfirm === 'limpar' ? '🗑️' : '🔄'}</div>
              <h3 className="font-display font-bold text-lg text-creme-100 mb-2">
                {showConfirm === 'limpar' ? 'Limpar todos?' : 'Resetar sorteio?'}
              </h3>
              <p className="text-sm text-ouro-700/60 mb-4">
                {showConfirm === 'limpar'
                  ? 'Todos os participantes serão removidos permanentemente.'
                  : 'Todos voltarão para o status "Disponível".'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (showConfirm === 'limpar') limparTodos();
                    else resetarTodos();
                    setShowConfirm(null);
                  }}
                  className="btn-red flex-1 py-2.5 text-sm"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#8B6914', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
