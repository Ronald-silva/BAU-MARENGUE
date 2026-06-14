# Widescreen Responsive Layout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar todas as páginas utilizáveis em TV e widescreen com layout de duas colunas em `lg:` (≥1024px), sem alterar o layout mobile.

**Architecture:** Tailwind `lg:` breakpoint para ativar grids de duas colunas em cada página. Sorteio usa card expandido centralizado (Opção B). Background fix no `html` element para cobrir viewport completo em qualquer tela.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS 3, Framer Motion

---

## File Map

| Arquivo | Mudança |
|---|---|
| `src/app/globals.css` | Adicionar `html { background-color: #0A0500 }` |
| `src/app/layout.tsx` | `max-w-4xl` → `max-w-6xl` |
| `src/app/sorteio/page.tsx` | Card expandido em `lg:`, texto e botões maiores |
| `src/app/page.tsx` | `lg:grid-cols-2` — hero+botão esq, stats+vencedores dir |
| `src/app/participantes/page.tsx` | `lg:grid-cols-[380px_1fr]` — form esq, lista dir |
| `src/app/historico/page.tsx` | `lg:grid-cols-[280px_1fr]` — painel esq, registros dir |
| `src/app/configuracoes/page.tsx` | `lg:grid-cols-2` — evento esq, sons+salvar dir |

---

## Task 1: Background e container global

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Passo 1: Corrigir background do `html`**

Em `src/app/globals.css`, logo após `@tailwind utilities;` e antes de `:root`, adicionar:

```css
html {
  background-color: #0A0500;
}
```

Isso garante que o fundo escuro cobre o viewport inteiro mesmo em TV/widescreen, onde o `body` pode não preencher 100% da área visível.

- [ ] **Passo 2: Expandir container principal**

Em `src/app/layout.tsx`, linha 41, trocar `max-w-4xl` por `max-w-6xl`:

```tsx
<main className="min-h-screen pt-4 sm:pt-6 pb-16 px-4 sm:px-6">
  <div className="max-w-6xl mx-auto w-full">
    {children}
  </div>
</main>
```

- [ ] **Passo 3: Verificar build**

```bash
cd /home/ronald/BAU-MERENGUE && npm run build 2>&1 | tail -20
```

Esperado: `✓ Compiled successfully`

- [ ] **Passo 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "fix: fundo escuro cobre viewport completo e expande container para 6xl"
```

---

## Task 2: Página de Sorteio — card expandido no widescreen

**Files:**
- Modify: `src/app/sorteio/page.tsx`

A página de sorteio é a mais crítica para TV. O card precisa crescer (max-w-sm → lg:max-w-2xl), o texto do nome precisa ficar legível de longe e os botões SIM/NÃO maiores.

- [ ] **Passo 1: Expandir arena e controles**

Em `src/app/sorteio/page.tsx`, linha 226, trocar a classe do div da arena:

```tsx
{/* Arena principal */}
<div className="relative w-full max-w-sm lg:max-w-2xl mx-auto mb-6">
```

Linha 513, trocar a classe dos controles:

```tsx
<div className="relative z-10 w-full max-w-sm lg:max-w-2xl space-y-3">
```

- [ ] **Passo 2: Aumentar padding e altura mínima do card interno**

Linha 260, trocar o div interno do card:

```tsx
<div className="flex flex-col items-center justify-center p-8 lg:p-14 min-h-[320px] lg:min-h-[500px]">
```

- [ ] **Passo 3: Escalar estado REVELANDO**

Bloco do estado `revelando` (volta de linha 332). Ajustar as classes de texto do nome:

```tsx
{/* Estado: REVELANDO */}
{estado === 'revelando' && selecionado && (
  <motion.div
    key="revelando"
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    className="text-center"
  >
    {fotoUrl ? (
      <motion.div
        animate={{ scale: [0.8, 1], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
        className="mb-4 mx-auto w-24 h-24 lg:w-36 lg:h-36 rounded-full border-4 border-ouro-400 overflow-hidden shadow-[0_0_30px_rgba(255,215,0,0.8)] flex items-center justify-center bg-escuro-900"
      >
        <img src={fotoUrl} alt={selecionado.nome} className="w-full h-full object-cover" />
      </motion.div>
    ) : (
      <div className="text-5xl lg:text-7xl mb-3">🔑</div>
    )}
    <div className="text-ouro-400 text-xs lg:text-sm uppercase tracking-widest mb-3">Selecionado!</div>
    <div
      className="font-display font-bold text-3xl lg:text-6xl text-ouro-400"
      style={{ textShadow: '0 0 30px rgba(255,215,0,0.8)' }}
    >
      {selecionado.nome}
    </div>
  </motion.div>
)}
```

- [ ] **Passo 4: Escalar estado TENTANDO**

Bloco do estado `tentando` (volta de linha 362). Substituir o bloco inteiro por:

```tsx
{/* Estado: TENTANDO ABRIR O BAÚ */}
{estado === 'tentando' && selecionado && (
  <motion.div
    key="tentando"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center w-full"
  >
    {fotoUrl && (
      <div className="mb-3 mx-auto w-20 h-20 lg:w-28 lg:h-28 rounded-full border-3 border-ouro-400 overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.6)] flex items-center justify-center bg-escuro-900">
        <img src={fotoUrl} alt={selecionado.nome} className="w-full h-full object-cover" />
      </div>
    )}
    <div className="font-bold text-lg lg:text-3xl text-creme-100 mb-1">{selecionado.nome}</div>
    <div className="text-ouro-600/70 text-xs lg:text-base mb-4">vai tentar abrir o baú</div>

    <motion.div
      animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 10, 0] }}
      transition={{ duration: 1, repeat: Infinity }}
      className="text-6xl lg:text-9xl mb-6"
    >
      🗝️
    </motion.div>

    <div className="text-ouro-500 text-sm lg:text-xl uppercase tracking-wider mb-4 font-bold">
      A chave abriu o baú?
    </div>

    <div className="flex gap-3 lg:gap-6 px-4">
      <button
        onClick={() => tentarAbrirBau(true)}
        className="flex-1 flex flex-col items-center gap-2 py-4 lg:py-8 rounded-xl font-bold transition-all duration-200 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(22,163,74,0.15))',
          border: '2px solid rgba(34,197,94,0.5)',
        }}
      >
        <CheckCircle size={28} className="text-green-400 lg:hidden" />
        <CheckCircle size={48} className="text-green-400 hidden lg:block" />
        <span className="text-green-400 text-sm lg:text-2xl">SIM</span>
        <span className="text-green-600/60 text-xs lg:text-base">Vencedor!</span>
      </button>

      <button
        onClick={() => tentarAbrirBau(false)}
        className="flex-1 flex flex-col items-center gap-2 py-4 lg:py-8 rounded-xl font-bold transition-all duration-200 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, rgba(220,20,60,0.2), rgba(185,28,28,0.15))',
          border: '2px solid rgba(220,20,60,0.5)',
        }}
      >
        <XCircle size={28} className="text-red-400 lg:hidden" />
        <XCircle size={48} className="text-red-400 hidden lg:block" />
        <span className="text-red-400 text-sm lg:text-2xl">NÃO</span>
        <span className="text-red-600/60 text-xs lg:text-base">Tente outro</span>
      </button>
    </div>
  </motion.div>
)}
```

- [ ] **Passo 5: Escalar estado SUCESSO**

No bloco `sucesso` (linha ~420), ajustar nome e foto:

```tsx
{fotoUrl ? (
  <motion.div
    ...
    className="mb-4 mx-auto w-32 h-32 lg:w-44 lg:h-44 rounded-full border-4 border-ouro-400 overflow-hidden shadow-[0_0_30px_rgba(255,215,0,0.8)] flex items-center justify-center bg-escuro-900"
  >
    <img src={fotoUrl} alt={selecionado.nome} className="w-full h-full object-cover" />
  </motion.div>
) : (
  <motion.div
    ...
    className="text-7xl lg:text-9xl mb-3"
    style={{ filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.8))' }}
  >
    🏆
  </motion.div>
)}
{/* nome */}
<div
  className="font-display font-bold text-4xl lg:text-6xl text-gold-gradient mb-2 leading-tight"
  style={{ textShadow: 'none', filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.6))' }}
>
  {selecionado.nome}
</div>
```

- [ ] **Passo 6: Escalar botão SORTEAR**

No bloco dos controles (linha ~514), ajustar o botão principal:

```tsx
<motion.button
  ...
  className="w-full relative overflow-hidden rounded-2xl py-5 lg:py-7 font-display font-bold text-xl lg:text-2xl tracking-widest uppercase text-escuro-900 transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
  ...
>
```

- [ ] **Passo 7: Verificar build**

```bash
cd /home/ronald/BAU-MERENGUE && npm run build 2>&1 | tail -20
```

Esperado: `✓ Compiled successfully`

- [ ] **Passo 8: Commit**

```bash
git add src/app/sorteio/page.tsx
git commit -m "feat: sorteio com card expandido e texto escalado para TV/widescreen (lg+)"
```

---

## Task 3: Home / Dashboard — grid de duas colunas

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Passo 1: Envolver conteúdo em grid lg+**

Substituir o conteúdo após `<div className="page-enter">` para criar duas colunas. O arquivo atual tem: Hero → Stats → Botão Sortear → Ações secundárias → Últimos sorteios. Reorganizar assim:

```tsx
export default function DashboardPage() {
  // ... estado igual ao atual ...

  return (
    <div className="page-enter">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">

        {/* ── COLUNA ESQUERDA: Hero + Sortear + Ações ── */}
        <div>
          {/* Hero — igual ao atual */}
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
            <div className="absolute inset-0 rays-bg opacity-30 animate-ray-spin" style={{ transformOrigin: 'center' }} />
            <div className="absolute top-3 right-4 text-2xl animate-coin-float opacity-70">🪙</div>
            <div className="absolute top-8 left-4 text-xl animate-coin-float-2 opacity-60">✨</div>
            <div className="absolute bottom-4 right-8 text-lg animate-coin-float-3 opacity-50">⭐</div>
            <div className="relative z-10 px-6 py-8 text-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="flex justify-center mb-4"
              >
                <img src="/icons/icon-512.png" alt="Logo" className="w-24 h-24 rounded-2xl" style={{ filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.6))' }} />
              </motion.div>
              <h1 className="font-display font-bold text-3xl mb-1 text-gold-gradient">
                {eventoNome.toUpperCase()}
              </h1>
              <p className="text-ouro-500/80 text-sm mb-1">AQUI 2 É 1</p>
              {premioDescricao && (
                <div
                  className="inline-flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full text-sm font-bold"
                  style={{ background: 'rgba(220,20,60,0.2)', border: '1px solid rgba(220,20,60,0.4)', color: '#FF6B6B' }}
                >
                  🎁 {premioDescricao}
                </div>
              )}
            </div>
          </motion.div>

          {/* Botão SORTEAR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <Link href="/sorteio">
              <button
                className="w-full relative overflow-hidden rounded-2xl py-5 font-display font-bold text-2xl tracking-widest uppercase text-escuro-900 transition-all duration-300 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #FFE066 0%, #FFD700 30%, #FFA500 60%, #FF8C00 100%)',
                  boxShadow: '0 0 40px rgba(255,215,0,0.5), 0 8px 30px rgba(255,165,0,0.4), 0 2px 8px rgba(0,0,0,0.5)',
                  border: '2px solid rgba(255,255,255,0.2)',
                }}
              >
                <div className="absolute inset-0 shimmer-effect pointer-events-none" style={{ backgroundSize: '200% 100%' }} />
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
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
                style={{ background: 'rgba(220,20,60,0.15)', border: '1px solid rgba(220,20,60,0.4)', color: '#FF6B6B' }}
              >
                <Users size={16} />
                Participantes
              </button>
            </Link>
            <Link href="/historico">
              <button
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
                style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}
              >
                <History size={16} />
                Histórico
              </button>
            </Link>
          </motion.div>
        </div>

        {/* ── COLUNA DIREITA: Stats + Últimos vencedores + CTA ── */}
        <div>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            <StatCard label="Total" value={total} sub="cadastrados" color="#FFD700" icon={Users} />
            <StatCard label="Disponíveis" value={disponiveis} sub="podem tentar" color="#4ADE80" icon={Star} />
            <StatCard label="Tentaram" value={tentaram} sub="sem sucesso" color="#FFA500" icon={Users} />
            <StatCard label="Vencedores" value={vencedores} sub="premiados" color="#DC143C" icon={Trophy} />
          </div>

          {/* Últimos vencedores */}
          {ultimosSorteios.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="card-bau p-4 mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold text-sm text-ouro-400 uppercase tracking-wider">
                  Últimos Vencedores
                </h2>
                <Link href="/historico" className="text-xs text-ouro-600 flex items-center gap-1 hover:text-ouro-400">
                  Ver todos <ChevronRight size={12} />
                </Link>
              </div>
              <div className="space-y-2">
                {ultimosSorteios.map((registro) => (
                  <div
                    key={registro.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl"
                    style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.1)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#0A0500' }}
                    >
                      {registro.participante.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-creme-100 truncate">{registro.participante.nome}</div>
                      <div className="text-xs text-ouro-600/60">
                        Rodada {registro.rodada} · {new Date(registro.dataHora).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <span className="text-ouro-400 text-lg">🏆</span>
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
              <p className="text-ouro-600/80 text-sm mb-3">Nenhum participante cadastrado ainda.</p>
              <Link href="/participantes">
                <button className="btn-gold text-sm px-5 py-2">Adicionar Participantes</button>
              </Link>
            </motion.div>
          )}
        </div>

      </div>

      {/* PWA hint — fora do grid */}
      <div className="mt-6 text-center">
        <p className="text-xs text-ouro-700/50">
          💡 Instale como app: toque em "Adicionar à tela inicial"
        </p>
      </div>
    </div>
  );
}
```

> Nota: o `StatCard` perde o `col-span-2 sm:col-span-1` que havia em mobile — agora são sempre 4 cards em 2×2 dentro da coluna direita.

- [ ] **Passo 2: Verificar build**

```bash
cd /home/ronald/BAU-MERENGUE && npm run build 2>&1 | tail -20
```

Esperado: `✓ Compiled successfully`

- [ ] **Passo 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: home em grid 2 colunas para lg+ (hero esq, stats dir)"
```

---

## Task 4: Participantes — formulário + lista lado a lado

**Files:**
- Modify: `src/app/participantes/page.tsx`

- [ ] **Passo 1: Adicionar wrapper de grid e reorganizar JSX**

Substituir o `return` de `ParticipantesPage` pelo seguinte (mantendo todos os handlers e state exatamente iguais — só o JSX muda):

```tsx
return (
  <div className="page-enter">
    <div className="lg:grid lg:grid-cols-[400px_1fr] lg:gap-8 lg:items-start">

      {/* ── COLUNA ESQUERDA: título + form + ações ── */}
      <div>
        <div className="mb-5">
          <h1 className="font-display font-bold text-2xl text-gold-gradient mb-1">Participantes</h1>
          <p className="text-xs text-ouro-600/60">
            {total} total · {disponiveis} disponíveis · {tentaram} tentaram · {vencedores} vencedores
          </p>
        </div>

        {/* Formulário de adição — igual ao atual */}
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
            <div className="flex items-center gap-2 mt-2 mb-2">
              <button
                type="button"
                onClick={() => fotoInputRef.current?.click()}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all ${
                  fotoFile
                    ? 'bg-ouro-500/20 text-ouro-400 border border-ouro-500/50'
                    : 'bg-escuro-800/50 text-ouro-700/60 border border-ouro-700/20'
                }`}
              >
                <Camera size={16} />
                {fotoFile ? 'Foto Selecionada' : 'Adicionar Foto'}
              </button>
              {fotoFile && (
                <button
                  type="button"
                  onClick={() => setFotoFile(null)}
                  className="p-2 rounded-xl bg-vermelho-900/30 text-vermelho-500 border border-vermelho-900/50"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <input
                ref={fotoInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) setFotoFile(e.target.files[0]); }}
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-gold flex-1 py-2.5 text-sm">
                + Adicionar
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95"
                style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)', color: '#FFD700' }}
                title="Importar CSV"
              >
                <Upload size={15} />
                CSV
              </button>
              <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleCSV} />
            </div>
          </div>
          <p className="text-xs text-ouro-700/40 mt-2">CSV: colunas "nome" e "contato" (opcional)</p>
        </motion.form>

        {/* Ações em massa */}
        {total > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm('resetar')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
              style={{ background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.2)', color: '#FFA500' }}
            >
              <RefreshCw size={13} /> Resetar Sorteio
            </button>
            <button
              onClick={() => setShowConfirm('limpar')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
              style={{ background: 'rgba(220,20,60,0.08)', border: '1px solid rgba(220,20,60,0.2)', color: '#DC143C' }}
            >
              <Trash2 size={13} /> Limpar Todos
            </button>
          </div>
        )}
      </div>

      {/* ── COLUNA DIREITA: busca + filtros + lista ── */}
      <div>
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
                { key: 'tentou', label: `Tentaram (${tentaram})` },
                { key: 'vencedor', label: `Vencedores (${vencedores})` },
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
      </div>

    </div>

    {/* Modals — fora do grid */}
    {/* Modal de edição — igual ao atual */}
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
              <input className="input-bau" value={nomeEdit} onChange={(e) => setNomeEdit(e.target.value)} placeholder="Nome" />
              <input className="input-bau" value={contatoEdit} onChange={(e) => setContatoEdit(e.target.value)} placeholder="Contato" />
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

    {/* Modal de confirmação — igual ao atual */}
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
                onClick={() => { if (showConfirm === 'limpar') limparTodos(); else resetarTodos(); setShowConfirm(null); }}
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
```

- [ ] **Passo 2: Verificar build**

```bash
cd /home/ronald/BAU-MERENGUE && npm run build 2>&1 | tail -20
```

Esperado: `✓ Compiled successfully`

- [ ] **Passo 3: Commit**

```bash
git add src/app/participantes/page.tsx
git commit -m "feat: participantes em grid 2 colunas para lg+ (form esq, lista dir)"
```

---

## Task 5: Histórico — painel lateral + lista

**Files:**
- Modify: `src/app/historico/page.tsx`

- [ ] **Passo 1: Reorganizar JSX com grid lg+**

Substituir o `return` de `HistoricoPage` por:

```tsx
return (
  <div className="page-enter">
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 lg:items-start">

      {/* ── COLUNA ESQUERDA: título + ações + badge ── */}
      <div className="mb-5 lg:mb-0">
        <div className="mb-4">
          <h1 className="font-display font-bold text-2xl text-gold-gradient">Histórico</h1>
          <p className="text-xs text-ouro-600/60">
            {historicoFiltrado.length} {mostrarTodasTentativas ? 'registro' : 'vencedor'}{historicoFiltrado.length !== 1 ? (mostrarTodasTentativas ? 's' : 'es') : ''}
          </p>
        </div>

        {historico.length > 0 && (
          <div className="flex gap-2 mb-4">
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

        {historicoFiltrado.length > 0 && (
          <div
            className="p-3 rounded-xl text-center"
            style={{ background: 'rgba(0,255,0,0.05)', border: '1px solid rgba(0,255,0,0.1)' }}
          >
            <Shield size={14} className="inline text-green-400 mr-1.5" />
            <span className="text-xs text-green-400/70">
              Cada {mostrarTodasTentativas ? 'tentativa' : 'vitória'} possui hash SHA-256 único para verificação de integridade.
            </span>
          </div>
        )}
      </div>

      {/* ── COLUNA DIREITA: lista ── */}
      <div>
        {historicoFiltrado.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-ouro-600/60 text-sm">
              {historico.length === 0
                ? 'Nenhum sorteio realizado ainda.'
                : 'Nenhum vencedor ainda. Alterne a visualização nas configurações.'}
            </p>
            <p className="text-ouro-700/40 text-xs mt-2">Os registros aparecem aqui após cada sorteio.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {historicoFiltrado.map((registro, i) => (
              <HistoricoItem
                key={registro.id}
                registro={registro}
                aberto={expandido === registro.id}
                onToggle={() => setExpandido(expandido === registro.id ? null : registro.id)}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

    </div>

    {/* Modal de confirmação — igual ao atual */}
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
```

- [ ] **Passo 2: Verificar build**

```bash
cd /home/ronald/BAU-MERENGUE && npm run build 2>&1 | tail -20
```

Esperado: `✓ Compiled successfully`

- [ ] **Passo 3: Commit**

```bash
git add src/app/historico/page.tsx
git commit -m "feat: histórico em grid 2 colunas para lg+ (painel esq, lista dir)"
```

---

## Task 6: Configurações — dois grupos lado a lado

**Files:**
- Modify: `src/app/configuracoes/page.tsx`

- [ ] **Passo 1: Envolver cards em grid lg+**

Substituir o conteúdo do `<form>` pelo seguinte (handlers e state idênticos ao atual):

```tsx
<form onSubmit={handleSalvar} className="space-y-4">
  <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 space-y-4">

    {/* ── COLUNA ESQUERDA ── */}
    <div className="space-y-4">
      {/* Evento */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-bau p-5">
        <h2 className="font-bold text-sm text-ouro-400 uppercase tracking-wider mb-4">🎪 Evento</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-ouro-600/70 mb-1.5 font-medium">Nome do Evento</label>
            <input className="input-bau" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Baú Merengue" maxLength={50} />
          </div>
          <div>
            <label className="block text-xs text-ouro-600/70 mb-1.5 font-medium">Descrição do Prêmio</label>
            <input className="input-bau" value={premio} onChange={(e) => setPremio(e.target.value)} placeholder="Ex: Grande Prêmio, Desconto 50%..." maxLength={80} />
          </div>
          <div>
            <label className="block text-xs text-ouro-600/70 mb-1.5 font-medium">Vencedores por rodada</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setQtd(Math.max(1, qtd - 1))} className="w-10 h-10 rounded-xl font-bold text-lg transition-all duration-150 active:scale-90" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', color: '#FFD700' }}>−</button>
              <div className="flex-1 text-center py-2.5 rounded-xl font-display font-bold text-2xl" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}>{qtd}</div>
              <button type="button" onClick={() => setQtd(Math.min(10, qtd + 1))} className="w-10 h-10 rounded-xl font-bold text-lg transition-all duration-150 active:scale-90" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', color: '#FFD700' }}>+</button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* PWA Info */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-bau p-5">
        <h2 className="font-bold text-sm text-ouro-400 uppercase tracking-wider mb-3">📱 Instalar App (PWA)</h2>
        <p className="text-xs text-ouro-600/60 mb-3">Instale o Baú Merengue na sua tela inicial para acesso rápido, mesmo sem internet!</p>
        <div className="space-y-1.5 text-xs text-ouro-700/50">
          <p>📲 <strong className="text-ouro-600/70">Android:</strong> Menu do Chrome → "Adicionar à tela inicial"</p>
          <p>🍎 <strong className="text-ouro-600/70">iOS:</strong> Botão Compartilhar → "Adicionar à Tela de Início"</p>
          <p>💻 <strong className="text-ouro-600/70">Desktop:</strong> Ícone na barra de endereços do Chrome</p>
        </div>
      </motion.div>

      {/* Sobre */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-bau p-5">
        <h2 className="font-bold text-sm text-ouro-400 uppercase tracking-wider mb-3">ℹ️ Sobre</h2>
        <div className="space-y-1 text-xs text-ouro-700/50">
          <p>🏆 <strong className="text-ouro-600/70">Baú Merengue</strong> · Aqui 2 é 1</p>
          <p>🗝️ Sistema de sorteio para tentativa de abertura do baú</p>
          <p>🔒 Sorteio com algoritmo Fisher-Yates + seed criptográfico</p>
          <p>🔐 Auditável via hash SHA-256 por tentativa</p>
          <p>💾 Dados salvos localmente no seu dispositivo</p>
        </div>
      </motion.div>
    </div>

    {/* ── COLUNA DIREITA ── */}
    <div className="space-y-4">
      {/* Sons e Efeitos */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-bau p-5">
        <h2 className="font-bold text-sm text-ouro-400 uppercase tracking-wider mb-4">🔊 Sons e Efeitos</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm text-creme-100">Sons do Sorteio</div>
              <div className="text-xs text-ouro-600/50">Fanfarra, embaralhamento, celebração</div>
            </div>
            <button type="button" onClick={toggleSom} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200" style={{ background: somAtivo ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${somAtivo ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.1)'}`, color: somAtivo ? '#FFD700' : '#666' }}>
              {somAtivo ? <Volume2 size={16} /> : <VolumeX size={16} />}
              {somAtivo ? 'Ativo' : 'Mudo'}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm text-creme-100">Animações</div>
              <div className="text-xs text-ouro-600/50">Partículas, confetti, efeitos visuais</div>
            </div>
            <button type="button" onClick={() => atualizar({ animacaoAtiva: !animacaoAtiva })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200" style={{ background: animacaoAtiva ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${animacaoAtiva ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.1)'}`, color: animacaoAtiva ? '#FFD700' : '#666' }}>
              {animacaoAtiva ? <Zap size={16} /> : <ZapOff size={16} />}
              {animacaoAtiva ? 'Ativo' : 'Parado'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Histórico */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-bau p-5">
        <h2 className="font-bold text-sm text-ouro-400 uppercase tracking-wider mb-4">📋 Histórico</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm text-creme-100">Visualização</div>
              <div className="text-xs text-ouro-600/50">O que mostrar no histórico</div>
            </div>
            <button type="button" onClick={() => atualizar({ mostrarTodasTentativas: !mostrarTodasTentativas })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200" style={{ background: mostrarTodasTentativas ? 'rgba(255,215,0,0.15)' : 'rgba(34,197,94,0.15)', border: `1px solid ${mostrarTodasTentativas ? 'rgba(255,215,0,0.4)' : 'rgba(34,197,94,0.4)'}`, color: mostrarTodasTentativas ? '#FFD700' : '#4ADE80' }}>
              {mostrarTodasTentativas ? '📜 Todas' : '🏆 Vencedores'}
            </button>
          </div>
          <p className="text-xs text-ouro-700/50">
            {mostrarTodasTentativas ? 'Mostrando todas as tentativas (sucessos e falhas)' : 'Mostrando apenas os vencedores'}
          </p>
        </div>
      </motion.div>

      {/* Salvar */}
      <motion.button
        type="submit"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full relative overflow-hidden rounded-xl py-4 font-display font-bold text-lg tracking-wider uppercase text-escuro-900 transition-all duration-300 active:scale-95"
        style={{
          background: salvo ? 'linear-gradient(135deg, #4ADE80, #22C55E)' : 'linear-gradient(135deg, #FFE066 0%, #FFD700 40%, #FFA500 100%)',
          boxShadow: salvo ? '0 0 30px rgba(74,222,128,0.4)' : '0 0 30px rgba(255,215,0,0.4)',
        }}
      >
        <Save size={18} className="inline mr-2 mb-0.5" />
        {salvo ? '✓ Salvo!' : 'Salvar Configurações'}
      </motion.button>
    </div>

  </div>
</form>
```

- [ ] **Passo 2: Verificar build**

```bash
cd /home/ronald/BAU-MERENGUE && npm run build 2>&1 | tail -20
```

Esperado: `✓ Compiled successfully`

- [ ] **Passo 3: Commit**

```bash
git add src/app/configuracoes/page.tsx
git commit -m "feat: configurações em grid 2 colunas para lg+ (evento esq, sons+salvar dir)"
```

---

## Task 7: Verificação final

- [ ] **Passo 1: Build limpo**

```bash
cd /home/ronald/BAU-MERENGUE && npm run build 2>&1
```

Esperado: zero erros TypeScript, zero warnings de compilação.

- [ ] **Passo 2: Checar lint**

```bash
cd /home/ronald/BAU-MERENGUE && npm run lint 2>&1
```

- [ ] **Passo 3: Adicionar .superpowers ao .gitignore**

```bash
echo '.superpowers/' >> /home/ronald/BAU-MERENGUE/.gitignore
git add .gitignore
git commit -m "chore: ignorar arquivos de brainstorming do superpowers"
```
