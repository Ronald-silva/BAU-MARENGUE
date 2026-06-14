'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Volume2, VolumeX, Zap, ZapOff } from 'lucide-react';
import { useConfigStore } from '@/store/configStore';
import { somVitoria } from '@/lib/audio';

export default function ConfiguracoesPage() {
  const [mounted, setMounted] = useState(false);
  const [nome, setNome] = useState('');
  const [premio, setPremio] = useState('');
  const [qtd, setQtd] = useState(1);
  const [salvo, setSalvo] = useState(false);
  
  const { eventoNome, premioDescricao, quantidadeVencedores, somAtivo, animacaoAtiva, mostrarTodasTentativas, atualizar } = useConfigStore();

  useEffect(() => {
    setNome(eventoNome);
    setPremio(premioDescricao);
    setQtd(quantidadeVencedores);
    setMounted(true);
  }, [eventoNome, premioDescricao, quantidadeVencedores]);

  if (!mounted) return null;

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    atualizar({ eventoNome: nome, premioDescricao: premio, quantidadeVencedores: qtd });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  const toggleSom = () => {
    atualizar({ somAtivo: !somAtivo });
    if (!somAtivo) setTimeout(somVitoria, 100);
  };

  return (
    <div className="page-enter">
      <div className="mb-5">
        <h1 className="font-display font-bold text-2xl lg:text-4xl text-gold-gradient mb-1">Configurações</h1>
        <p className="text-xs lg:text-sm text-ouro-600/60">Personalize o seu sorteio</p>
      </div>

      <form onSubmit={handleSalvar} className="space-y-4">
        {/* Configurações do evento */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-bau p-5 lg:p-8"
        >
          <h2 className="font-bold text-sm lg:text-base text-ouro-400 uppercase tracking-wider mb-4">🎪 Evento</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs lg:text-sm text-ouro-600/70 mb-1.5 font-medium">Nome do Evento</label>
              <input
                className="input-bau lg:py-4 lg:text-lg"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Baú Merengue"
                maxLength={50}
              />
            </div>
            <div>
              <label className="block text-xs lg:text-sm text-ouro-600/70 mb-1.5 font-medium">Descrição do Prêmio</label>
              <input
                className="input-bau lg:py-4 lg:text-lg"
                value={premio}
                onChange={(e) => setPremio(e.target.value)}
                placeholder="Ex: Grande Prêmio, Desconto 50%, Brinde..."
                maxLength={80}
              />
            </div>
            <div>
              <label className="block text-xs lg:text-sm text-ouro-600/70 mb-1.5 font-medium">
                Vencedores por rodada
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQtd(Math.max(1, qtd - 1))}
                  className="w-10 h-10 rounded-xl font-bold text-lg transition-all duration-150 active:scale-90"
                  style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', color: '#FFD700' }}
                >
                  −
                </button>
                <div
                  className="flex-1 text-center py-2.5 rounded-xl font-display font-bold text-2xl"
                  style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}
                >
                  {qtd}
                </div>
                <button
                  type="button"
                  onClick={() => setQtd(Math.min(10, qtd + 1))}
                  className="w-10 h-10 rounded-xl font-bold text-lg transition-all duration-150 active:scale-90"
                  style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', color: '#FFD700' }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sons e animações */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-bau p-5 lg:p-8"
        >
          <h2 className="font-bold text-sm lg:text-base text-ouro-400 uppercase tracking-wider mb-4">🔊 Sons e Efeitos</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm lg:text-base text-creme-100">Sons do Sorteio</div>
                <div className="text-xs lg:text-sm text-ouro-600/50">Fanfarra, embaralhamento, celebração</div>
              </div>
              <button
                type="button"
                onClick={toggleSom}
                className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-sm lg:text-base font-bold transition-all duration-200"
                style={{
                  background: somAtivo ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${somAtivo ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  color: somAtivo ? '#FFD700' : '#666',
                }}
              >
                {somAtivo ? <Volume2 size={16} /> : <VolumeX size={16} />}
                {somAtivo ? 'Ativo' : 'Mudo'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm lg:text-base text-creme-100">Animações</div>
                <div className="text-xs lg:text-sm text-ouro-600/50">Partículas, confetti, efeitos visuais</div>
              </div>
              <button
                type="button"
                onClick={() => atualizar({ animacaoAtiva: !animacaoAtiva })}
                className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-sm lg:text-base font-bold transition-all duration-200"
                style={{
                  background: animacaoAtiva ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${animacaoAtiva ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  color: animacaoAtiva ? '#FFD700' : '#666',
                }}
              >
                {animacaoAtiva ? <Zap size={16} /> : <ZapOff size={16} />}
                {animacaoAtiva ? 'Ativo' : 'Parado'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Histórico */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-bau p-5 lg:p-8"
        >
          <h2 className="font-bold text-sm lg:text-base text-ouro-400 uppercase tracking-wider mb-4">📋 Histórico</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm lg:text-base text-creme-100">Visualização</div>
                <div className="text-xs lg:text-sm text-ouro-600/50">O que mostrar no histórico</div>
              </div>
              <button
                type="button"
                onClick={() => atualizar({ mostrarTodasTentativas: !mostrarTodasTentativas })}
                className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-sm lg:text-base font-bold transition-all duration-200"
                style={{
                  background: mostrarTodasTentativas ? 'rgba(255,215,0,0.15)' : 'rgba(34,197,94,0.15)',
                  border: `1px solid ${mostrarTodasTentativas ? 'rgba(255,215,0,0.4)' : 'rgba(34,197,94,0.4)'}`,
                  color: mostrarTodasTentativas ? '#FFD700' : '#4ADE80',
                }}
              >
                {mostrarTodasTentativas ? '📜 Todas' : '🏆 Vencedores'}
              </button>
            </div>
            <p className="text-xs text-ouro-700/50">
              {mostrarTodasTentativas 
                ? 'Mostrando todas as tentativas (sucessos e falhas)'
                : 'Mostrando apenas os vencedores'}
            </p>
          </div>
        </motion.div>

        {/* PWA Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-bau p-5 lg:p-8"
        >
          <h2 className="font-bold text-sm text-ouro-400 uppercase tracking-wider mb-3">📱 Instalar App (PWA)</h2>
          <p className="text-xs text-ouro-600/60 mb-3">
            Instale o Baú Merengue na sua tela inicial para acesso rápido, mesmo sem internet!
          </p>
          <div className="space-y-1.5 text-xs text-ouro-700/50">
            <p>📲 <strong className="text-ouro-600/70">Android:</strong> Menu do Chrome → "Adicionar à tela inicial"</p>
            <p>🍎 <strong className="text-ouro-600/70">iOS:</strong> Botão Compartilhar → "Adicionar à Tela de Início"</p>
            <p>💻 <strong className="text-ouro-600/70">Desktop:</strong> Ícone na barra de endereços do Chrome</p>
          </div>
        </motion.div>

        {/* Sobre */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-bau p-5 lg:p-8"
        >
          <h2 className="font-bold text-sm text-ouro-400 uppercase tracking-wider mb-3">ℹ️ Sobre</h2>
          <div className="space-y-1 text-xs text-ouro-700/50">
            <p>🏆 <strong className="text-ouro-600/70">Baú Merengue</strong> · Aqui 2 é 1</p>
            <p>🗝️ Sistema de sorteio para tentativa de abertura do baú</p>
            <p>🔒 Sorteio com algoritmo Fisher-Yates + seed criptográfico</p>
            <p>🔐 Auditável via hash SHA-256 por tentativa</p>
            <p>💾 Dados salvos localmente no seu dispositivo</p>
          </div>
        </motion.div>

        {/* Salvar */}
        <motion.button
          type="submit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full relative overflow-hidden rounded-xl py-4 lg:py-6 font-display font-bold text-lg lg:text-2xl tracking-wider uppercase text-escuro-900 transition-all duration-300 active:scale-95"
          style={{
            background: salvo
              ? 'linear-gradient(135deg, #4ADE80, #22C55E)'
              : 'linear-gradient(135deg, #FFE066 0%, #FFD700 40%, #FFA500 100%)',
            boxShadow: salvo ? '0 0 30px rgba(74,222,128,0.4)' : '0 0 30px rgba(255,215,0,0.4)',
          }}
        >
          <Save size={18} className="inline mr-2 mb-0.5" />
          {salvo ? '✓ Salvo!' : 'Salvar Configurações'}
        </motion.button>
      </form>
    </div>
  );
}
