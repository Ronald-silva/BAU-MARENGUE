# 🗝️ Guia Rápido - Novo Fluxo do Baú Merengue

## 🎯 O que mudou?

Antes, o app sorteava e a pessoa **já era vencedora**.

Agora, o app sorteia quem vai **tentar abrir o baú** com uma chave. Se a chave abrir = vencedor! Se não = sorteia outro!

---

## 🎮 Novo Fluxo de Sorteio

### 1️⃣ Clique em "SORTEAR PARTICIPANTE"
```
Botão dourado grande → Inicia o sorteio
```

### 2️⃣ Animação de Embaralhamento (4 segundos)
```
🎰 Nomes passando rapidamente
📊 Barra de progresso
🔊 Som de embaralhamento
```

### 3️⃣ Revelação do Selecionado
```
🔑 Mostra quem foi sorteado
✨ Animação de revelação
📸 Foto (se cadastrada)
```

### 4️⃣ Momento da Decisão ⭐
```
┌─────────────────────────────────┐
│   [NOME DO PARTICIPANTE]        │
│   vai tentar abrir o baú        │
│                                 │
│         🗝️                      │
│    A chave abriu o baú?        │
│                                 │
│  ┌──────────┐  ┌──────────┐   │
│  │ ✅  SIM  │  │ ❌  NÃO  │   │
│  │ Vencedor!│  │Tente outro│   │
│  └──────────┘  └──────────┘   │
└─────────────────────────────────┘
```

### 5️⃣ Resultado

**SE CLICAR "SIM" ✅:**
- 🎉 Confetti explode
- 🏆 Status vira "Vencedor"
- 🔢 Rodada incrementa
- 📝 Registra no histórico como sucesso
- 🔊 Som de vitória

**SE CLICAR "NÃO" ❌:**
- 🔒 Aparece cadeado
- 🔑 Status vira "Tentou"
- 📝 Registra no histórico como tentativa
- ➡️ Botão "PRÓXIMO SORTEIO" aparece

---

## 📊 Novos Status dos Participantes

### ● Disponível (verde)
Pode ser sorteado normalmente

### 🔑 Tentou (laranja)
Foi sorteado mas a chave não abriu o baú  
Não participa mais dos sorteios

### 🏆 Vencedor (dourado)
Conseguiu abrir o baú!  
É o ganhador do prêmio

---

## 📋 Histórico - 2 Modos de Visualização

### 🏆 Modo Vencedores (padrão)
Mostra apenas quem conseguiu abrir o baú

```
🏆 João Silva
   Rodada 3 · 12/06/2026
   [Venceu]
```

### 📜 Modo Todas Tentativas
Mostra todas as pessoas que tentaram

```
🏆 João Silva
   Rodada 3 · 12/06/2026 15:30
   [Venceu]

🔑 Maria Santos
   Tentativa · 12/06/2026 15:25
   [Tentou]

🔑 Pedro Costa
   Tentativa · 12/06/2026 15:20
   [Tentou]
```

**Como trocar:** Configurações → Histórico → Visualização

---

## 🎨 Onde Ver as Estatísticas

### Dashboard (Tela Inicial)
```
┌────────────┬──────────────┬─────────────┬──────────────┐
│ 👥 Total   │ ⭐ Disponíveis│ 🔑 Tentaram │ 🏆 Vencedores│
│    50      │      35       │     12      │      3       │
└────────────┴──────────────┴─────────────┴──────────────┘
```

### Participantes
Filtros: **Todos** | **Disponíveis** | **Tentaram** | **Vencedores**

---

## 🔧 Configurações Importantes

### 📋 Histórico
- **Visualização:**  
  🏆 Vencedores (limpo) ↔ 📜 Todas tentativas (completo)

### 🔊 Sons
- ✅ Ativo: fanfarra, embaralhamento, celebração
- 🔇 Mudo: sem sons

### ✨ Animações
- ✅ Ativo: confetti, partículas, efeitos
- 🚫 Parado: interface simples

---

## 💡 Dicas de Uso

### ✅ Recomendado
1. Deixe o histórico no modo "Vencedores" para clareza
2. Use fullscreen durante o sorteio (botão no canto)
3. Ative os sons para mais dramaticidade
4. Fotografe os participantes para mais emoção

### ⚠️ Atenção
- Marque "NÃO" apenas se a chave realmente não abriu
- Uma vez marcado como "Tentou", não volta para disponível
- Use "Resetar Sorteio" para recomeçar do zero

---

## 🗝️ Exemplo Real de Uso

**Cenário:** 10 participantes, 1 baú com 1 chave que funciona

1. **Sorteio 1:**  
   🎰 Sorteia → 🔑 Maria → Tenta abrir → ❌ Não abriu → Status: Tentou

2. **Sorteio 2:**  
   🎰 Sorteia → 🔑 João → Tenta abrir → ❌ Não abriu → Status: Tentou

3. **Sorteio 3:**  
   🎰 Sorteia → 🔑 Pedro → Tenta abrir → ✅ ABRIU! → 🏆 VENCEDOR!

**Resultado:**
- Pedro = Vencedor 🏆
- Maria e João = Tentaram 🔑
- Outros 7 = Disponíveis ●

---

## 📤 Exportar Dados

**CSV inclui:**
- Nome do participante
- Resultado: "VENCEDOR" ou "Tentou"
- Data e hora da tentativa
- Rodada (só vencedores têm rodada)
- Hash de auditoria

---

## 🔐 Transparência e Auditoria

Cada tentativa gera:
- ✅ Seed criptográfico único
- ✅ Hash SHA-256 para verificação
- ✅ Registro imutável no histórico
- ✅ Timestamp preciso

**Impossível manipular resultados!**

---

## ❓ FAQ

**P: O que acontece com participantes que "Tentaram"?**  
R: Ficam marcados e não participam mais dos sorteios. Use "Resetar" para limpar.

**P: Como limpar e recomeçar?**  
R: Participantes → "Resetar Sorteio" (volta todos para Disponível)

**P: Posso ver quem tentou e falhou?**  
R: Sim! Configurações → Histórico → Ative "Todas tentativas"

**P: A rodada incrementa sempre?**  
R: Não! Só incrementa quando alguém vence. Tentativas falhas não mudam a rodada.

**P: Posso editar quem já tentou?**  
R: Só pode editar participantes "Disponíveis". Tentou/Vencedor são imutáveis.

---

## 🎯 Resumo em 3 Passos

1. 🎲 **Sortear** → Escolhe quem tenta
2. 🗝️ **Tentar** → Clica SIM ou NÃO
3. 🏆 **Repetir** → Até achar o vencedor!

---

**Dúvidas?** Todas as telas têm tooltips e explicações! 🎉
