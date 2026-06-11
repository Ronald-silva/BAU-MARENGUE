'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { useSorteioStore } from '@/store/sorteioStore';

export default function HistoricoPage() {
  const { historico, limparHistorico } = useSorteioStore();
  const [expandido, setExpandido] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const exportarCSV = () => {
    if (historico.length === 0) return;
    const headers = ['Rodada', 'Vencedor', 'Contato', 'Data/Hora', 'Evento', 'Prêmio', 'Hash (Auditoria)'];
    const rows = historico.map((r) => [
      r.rodada,
      r.vencedor.nome,
      r.vencedor.contato,
      new Date(r.dataHora).toLocaleString('pt-BR'),
      r.eventoNome,
      r.premioDescricao,
      r.hash,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bau-merengue-historico-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display font-bold text-2xl text-gold-gradient">Histórico</h1>
          <p className="text-xs text-ouro-600/60">{historico.length} sorteio{historico.length !== 1 ? 's' : ''} registrado{historico.length !== 1 ? 's' : ''}</p>
        </div>
        {historico.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={exportarCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200"
              style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', color: '#FFD700' }}
            >
              <Download size={13} /> CSV
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(220,20,60,0.1)', border: '1px solid rgba(220,20,60,0.2)' }}
            >
              <Trash2 size={14} className="text-vermelho-500/70" />
            </button>
          </div>
        )}
      </div>

      {historico.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-ouro-600/60 text-sm">Nenhum sorteio realizado ainda.</p>
          <p className="text-ouro-700/40 text-xs mt-2">Os registros aparecem aqui após cada sorteio.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {historico.map((registro, i) => {
            const aberto = expandido === registro.id;
            const data = new Date(registro.dataHora);
            return (
              <motion.div
                key={registro.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-bau overflow-hidden"
              >
                <button
                  className="w-full p-4 text-left flex items-center gap-3"
                  onClick={() => setExpandido(aberto ? null : registro.id)}
                >
                  {/* Número da rodada */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#0A0500' }}
                  >
                    #{registro.rodada}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-creme-100 truncate flex items-center gap-2">
                      🏆 {registro.vencedor.nome}
                    </div>
                    <div className="text-xs text-ouro-600/60">
                      {data.toLocaleDateString('pt-BR')} às {data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {aberto ? (
                    <ChevronUp size={16} className="text-ouro-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-ouro-600 flex-shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {aberto && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-2 border-t border-ouro-700/20 pt-3">
                        {registro.vencedor.contato && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-ouro-600/60">Contato</span>
                            <span className="text-creme-100">{registro.vencedor.contato}</span>
                          </div>
                        )}
                        {registro.eventoNome && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-ouro-600/60">Evento</span>
                            <span className="text-creme-100">{registro.eventoNome}</span>
                          </div>
                        )}
                        {registro.premioDescricao && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-ouro-600/60">Prêmio</span>
                            <span className="text-creme-100">{registro.premioDescricao}</span>
                          </div>
                        )}
                        {/* Hash de auditoria */}
                        <div
                          className="mt-2 p-2.5 rounded-lg"
                          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,215,0,0.1)' }}
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Shield size={11} className="text-green-400" />
                            <span className="text-xs text-green-400 font-bold">Hash de Auditoria (SHA-256)</span>
                          </div>
                          <div className="text-xs text-ouro-700/50 font-mono break-all leading-relaxed">
                            {registro.hash}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Legenda de transparência */}
      {historico.length > 0 && (
        <div
          className="mt-6 p-3 rounded-xl text-center"
          style={{ background: 'rgba(0,255,0,0.05)', border: '1px solid rgba(0,255,0,0.1)' }}
        >
          <Shield size={14} className="inline text-green-400 mr-1.5" />
          <span className="text-xs text-green-400/70">
            Cada sorteio possui hash SHA-256 único para verificação de integridade.
          </span>
        </div>
      )}

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
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="font-display font-bold text-lg text-creme-100 mb-2">Limpar histórico?</h3>
              <p className="text-sm text-ouro-700/60 mb-4">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { limparHistorico(); setShowConfirm(false); }}
                  className="btn-red flex-1 py-2.5 text-sm"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
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
