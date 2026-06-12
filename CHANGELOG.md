# Changelog - Baú Merengue

## 🔑 v2.0.0 - Sistema de Tentativa do Baú

### 🎯 Conceito Atualizado

**ANTES:** O sorteio escolhia diretamente o vencedor.

**AGORA:** O sorteio escolhe quem vai **tentar abrir o baú**. O vencedor só é definido quando a chave abre o baú.

---

### ✨ Mudanças Principais

#### 1. **Novos Status de Participantes**
- ✅ `disponivel` - Pode ser sorteado
- 🔑 `tentou` - Foi sorteado mas não abriu o baú
- 🏆 `vencedor` - Conseguiu abrir o baú

#### 2. **Fluxo de Sorteio Reformulado**

**Etapas:**
1. **Embaralhando** (4s) - Animação de nomes passando
2. **Revelando** (1.5s) - Mostra quem foi selecionado
3. **Tentando** - Usuário decide: a chave abriu? ✅ SIM / ❌ NÃO
4. **Resultado:**
   - ✅ **SIM** → Status `vencedor` + confetti + incrementa rodada
   - ❌ **NÃO** → Status `tentou` + volta para novo sorteio

#### 3. **Histórico Dual**

Agora o histórico registra **TODAS as tentativas**:
- ✅ Sucessos (vencedores)
- ❌ Falhas (tentaram mas não abriram)

**Nova configuração:**
- 🏆 **Mostrar só vencedores** (padrão)
- 📜 **Mostrar todas tentativas**

Configurável em: **Configurações → Histórico → Visualização**

#### 4. **Estatísticas Atualizadas**

**Dashboard:**
- 👥 Total
- ⭐ Disponíveis
- 🔑 Tentaram (sem sucesso)
- 🏆 Vencedores

**Participantes:**
- Filtros: Todos / Disponíveis / Tentaram / Vencedores
- Badges coloridos por status

#### 5. **Registro de Auditoria**

Cada tentativa (sucesso ou falha) gera:
- Seed criptográfico único
- Hash SHA-256 para auditoria
- Registro no histórico com flag `sucesso: true/false`

---

### 🎨 Melhorias Visuais

- Nova tela de **"Tentando Abrir o Baú"** com animação de chave 🗝️
- Botões grandes e claros: **SIM** (verde) / **NÃO** (vermelho)
- Badges diferenciados:
  - 🏆 Vencedor (dourado com gradiente)
  - 🔑 Tentou (laranja)
  - ● Disponível (verde)
- Animações específicas para sucesso/falha

---

### 📊 Dados Mantidos

✅ **Compatibilidade:** Participantes antigos com status `sorteado` serão automaticamente migrados para o novo sistema na primeira carga.

---

### 🔧 Configurações Novas

**Em Configurações → Histórico:**
- Toggle: **Vencedores** ↔ **Todas as tentativas**
- Padrão: mostra apenas vencedores

---

### 🚀 Como Usar

1. **Sortear:** Clique em "SORTEAR PARTICIPANTE"
2. **Aguardar:** Animação de 4s + revelação
3. **Decidir:** A pessoa tentou abrir o baú?
   - ✅ **SIM** → Celebração! 🎉 É o vencedor!
   - ❌ **NÃO** → Marca como "tentou" e sorteia outro
4. **Repetir:** Continue até encontrar o vencedor!

---

### 🔐 Segurança e Transparência

- Cada tentativa possui hash SHA-256 único
- Seed criptográfico por tentativa
- Histórico imutável e auditável
- Export CSV inclui coluna "Resultado" (VENCEDOR/Tentou)

---

### 📝 Termos Atualizados

| Antigo | Novo |
|--------|------|
| "Sorteado" | "Tentou" (não venceu) |
| "Vencedor automático" | "Vencedor" (abriu o baú) |
| "Realizar sorteio" | "Sortear participante" |
| "E o vencedor é..." | "Vai tentar abrir o baú" |

---

### ⚙️ Arquivos Modificados

**Stores:**
- `src/store/participantesStore.ts` - Novos status e métodos
- `src/store/sorteioStore.ts` - Campo `sucesso` no histórico
- `src/store/configStore.ts` - Nova config `mostrarTodasTentativas`

**Páginas:**
- `src/app/page.tsx` - Estatísticas atualizadas
- `src/app/participantes/page.tsx` - Filtros e badges novos
- `src/app/sorteio/page.tsx` - Fluxo completo reformulado
- `src/app/historico/page.tsx` - Visualização dual
- `src/app/configuracoes/page.tsx` - Nova seção de histórico

**Estilos:**
- `src/app/globals.css` - Novos badges (`.badge-tentou`, `.badge-vencedor`)

---

### 🎯 Benefícios

✅ Mais fiel ao conceito do evento "Baú Merengue"  
✅ Maior suspense e interatividade  
✅ Transparência total com histórico de tentativas  
✅ Flexibilidade na visualização do histórico  
✅ Mantém segurança criptográfica  

---

**Versão:** 2.0.0  
**Data:** 2026-06-12  
**Compatibilidade:** Next.js 14.2.5 | TypeScript 5.5.3
