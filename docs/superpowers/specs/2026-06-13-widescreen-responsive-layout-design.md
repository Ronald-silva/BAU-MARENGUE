# Widescreen Responsive Layout — Baú Merengue

**Date:** 2026-06-13  
**Status:** Approved  
**Goal:** Tornar todas as páginas utilizáveis em TV (via screen mirror) e em desktops widescreen, sem degradar a experiência mobile.

---

## Problema

Quando o app é espelhado numa TV, o layout mobile fica estreito no centro com bordas brancas nas laterais, textos pequenos demais e o card de sorteio pouco visível. O fundo escuro também pode falhar em cobrir o viewport inteiro em alguns contextos.

---

## Solução: Two-column layout em `lg:` (≥ 1024 px)

Abaixo de 1024 px o layout permanece idêntico ao atual (mobile-first). Acima disso, cada página ativa um layout de duas colunas via Tailwind `lg:` breakpoint.

### Background fix

Adicionar `background-color: #0A0500` ao seletor `html` em `globals.css` para garantir cobertura total do viewport, independente do tamanho da tela ou do browser.

---

## Layout por página (lg+)

### Sorteio — Opção B: Card central expandido

```
┌──────────────────────────────────────────────────┐
│  Header  ·  Nav                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│   ┌──────────────────────────────────────────┐   │
│   │  🗝️  SHEYLA                              │   │
│   │  vai tentar abrir o baú                  │   │
│   │                                          │   │
│   │   [  ✓ SIM  ]     [  ✗ NÃO  ]          │   │
│   └──────────────────────────────────────────┘   │
│                                                  │
│   [ ▶  SORTEAR PARTICIPANTE  ]                   │
└──────────────────────────────────────────────────┘
```

- Card `max-w-2xl` (de `max-w-sm`) em lg+
- Nome do sorteado: `text-5xl` (de `text-3xl`)
- Botões SIM/NÃO maiores com `py-8 text-xl`
- Botão SORTEAR `text-2xl py-6`

### Home / Dashboard

```
┌──────────────┬───────────────────────────────┐
│  Hero + Logo  │  Stats (grid 2×2)             │
│  [SORTEAR]   │  Últimos vencedores            │
└──────────────┴───────────────────────────────┘
```

- `grid-cols-2` em lg+: col esquerda hero (1fr), col direita stats (1fr)

### Participantes

```
┌──────────────┬───────────────────────────────┐
│  Form add    │  Busca + filtros               │
│  Resumo      │  Lista de participantes        │
│  [Resetar]   │                               │
└──────────────┴───────────────────────────────┘
```

- `grid-cols-[380px_1fr]` em lg+

### Histórico

```
┌──────────────┬───────────────────────────────┐
│  Título       │  Lista de registros           │
│  [CSV] [Lixo] │                               │
│  Badge SHA256 │                               │
└──────────────┴───────────────────────────────┘
```

- `grid-cols-[280px_1fr]` em lg+

### Configurações

```
┌──────────────┬───────────────────────────────┐
│  Evento       │  Sons e Efeitos               │
│  (nome, prêmio│  Histórico                    │
│   vencedores) │  [Salvar]                     │
└──────────────┴───────────────────────────────┘
```

- `grid-cols-2` em lg+

---

## Regras de escala

| Elemento | Mobile | lg+ (TV) |
|---|---|---|
| Card sorteio max-w | `max-w-sm` | `max-w-2xl` |
| Nome sorteado | `text-3xl` | `text-5xl` |
| Botão SORTEAR | `text-xl py-5` | `text-2xl py-6` |
| Botões SIM/NÃO | `py-4 text-sm` | `py-8 text-xl` |
| Ícone 🗝️ | `text-6xl` | `text-8xl` |
| Container principal | `max-w-4xl` | `max-w-6xl` |

---

## Arquivos a modificar

1. `src/app/globals.css` — adicionar `html { background-color: #0A0500; }`
2. `src/app/layout.tsx` — `max-w-4xl` → `max-w-6xl`
3. `src/app/sorteio/page.tsx` — card expandido em lg+
4. `src/app/page.tsx` — grid 2 cols em lg+
5. `src/app/participantes/page.tsx` — grid 2 cols em lg+
6. `src/app/historico/page.tsx` — grid 2 cols em lg+
7. `src/app/configuracoes/page.tsx` — grid 2 cols em lg+

---

## Fora de escopo

- Mudança de cores ou tema
- Animações novas
- Alteração da lógica de sorteio
- Suporte a resoluções abaixo de mobile (< 375 px)
