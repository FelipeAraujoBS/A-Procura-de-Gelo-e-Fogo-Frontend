# Uma Busca de Gelo e Fogo — Frontend

**Interface de busca temática** para *As Crônicas de Gelo e Fogo*. Experiência imersiva com tema medieval, animações cinematográficas, busca instantânea e exploração contextual dos livros.

> ⚔️ Vitrine de arquitetura frontend: SSR + CSR híbrido, estado sincronizado com URL, componentização granular, tema claro/escuro, acessibilidade.

---

## Índice

- [Arquitetura](#arquitetura)
- [Fluxo de Dados](#fluxo-de-dados)
- [Componentes](#componentes)
- [Performance](#performance)
- [Tematização](#tematização)
- [Analytics & Error Tracking](#analytics--error-tracking)
- [Acessibilidade](#acessibilidade)
- [Deploy & CI/CD](#deploy--cicd)

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                      Next.js 16                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              App Router (SSR/SSG)                │   │
│  │  layout.tsx ← globals.css ← Providers.tsx        │   │
│  │  page.tsx  ← HomeContent.tsx ← Suspense          │   │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                                │
│  ┌──────────────────────▼───────────────────────────┐   │
│  │              Client Components                    │   │
│  │                                                   │   │
│  │  ┌─────────┐ ┌──────────┐ ┌────────────────┐     │   │
│  │  │ Search  │ │ Filters  │ │ ResultsList    │     │   │
│  │  │  Bar    │ │(Book/POV)│ │ → ResultItem   │     │   │
│  │  └─────────┘ └──────────┘ │ → ContextPanel │     │   │
│  │                           └────────────────┘     │   │
│  │  ┌─────────┐ ┌──────────┐ ┌────────────────┐     │   │
│  │  │ POV     │ │ Chapter  │ │ ThemeToggle    │     │   │
│  │  │FilterBar│ │  Modal   │ │ (claro/escuro) │     │   │
│  │  └─────────┘ └──────────┘ └────────────────┘     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         │                           │
         ▼                           ▼
    API (Fastify)              Sentry / Plausible
    (REST + FTS5)              (error/analytics)
```

### Padrões de Arquitetura

| Padrão | Onde | Por que |
|--------|------|---------|
| **SSR/CSR híbrido** | `Providers.tsx` | Layout inicial com SSR, busca com CSR (dinâmica) |
| **Suspense boundary** | `Home()` → `<Suspense>` + `HomeContent` | Fallback de loading enquanto hidrata |
| **URL-driven state** | `useSearchParams` + `useRouter.push` | Resultados são linkáveis e compartilháveis |
| **Custom hooks** | `useSearch`, `useTheme` | Separa lógica de estado da apresentação |
| **Componentes puros** | `SearchBar`, `Filters`, `ResultsList` | Props in, JSX out — testáveis e previsíveis |
| **Renderização condicional** | `hasSearched` → mostra resultados | Evita flash de conteúdo vazio |
| **Controlled forms** | SearchBar value + onChange | Estado centralizado no hook, não no DOM |

---

## Fluxo de Dados

```
Usuário digita "Dracarys" ──▶ SearchBar onChange
                                   │
                                   ▼
                            HomeContent: setQuery()
                                   │
                                   ▼
                            executeSearch()
                                   │
                                   ▼
                            useSearch: performSearch()
                                   │
                                   ▼
                            services/search.ts: fetchApi()
                                   │
                                   ▼
                            API /search?q=Dracarys
                                   │
                                   ▼
                            response.json()
                                   │
                                   ▼
                            setResults([...])
                            setTotal(42)
                                   │
                                   ▼
                            ResultsList renderiza
                                   │
                                   ├── ResultItem (snippet + metadados)
                                   │
                                   └── PovFilterBar atualiza
```

### Estado Sincronizado com URL

```
/search?q=Dracarys&book=3&povs=Daenerys
```

O hook `useSearch` lê `searchParams` na inicialização e atualiza a URL via `router.push()` a cada busca. Isso garante:

- **Links compartilháveis**: copiar URL = copiar estado da busca
- **Back/Forward nativos**: navegação do browser funciona
- **Deep linking**: abrir URL com parâmetros já executa a busca (`useEffect` no mount)

---

## Componentes

### Árvore de Componentes

```
<Providers>                          ← ThemeProvider + Navbar
  <Suspense fallback={<Loader />}>
    <HomeContent>                    ← Estado central, orquestração
      <SearchBar />                  ← Input + botão de busca
      <PovFilterBar />              ← Filtro rápido de personagens
      <Filters />                   ← Filtro por livro + POV (após busca)
      <ResultsList>                 ← Lista paginada
        <ResultItem />              ← Card de resultado
        <ContextPanel />            ← Parágrafos vizinhos (±3)
      </ResultsList>
      <Footer />                    ← Créditos
    </HomeContent>
  </Suspense>
</Providers>
```

### Responsabilidades

| Componente | Responsabilidade | Estado |
|------------|-----------------|--------|
| `Providers` | Tema + Layout base + Navbar fixa | Nenhum (render prop) |
| `HomeContent` | Orquestração, scroll, sugestões | `mounted`, `openIndex`, `shouldScroll` |
| `SearchBar` | Input controlado + submit | `value` (controlled) |
| `PovFilterBar` | Seleção rápida de POVs | `selectedPovs` (props) |
| `Filters` | Select de livro + POV | `book`, `povs` (props) |
| `ResultsList` | Renderização dos resultados + load more | `openIndex` (props) |
| `ResultItem` | Card com snippet + metadados + clique | Nenhum (stateless) |
| `ContextPanel` | Fetch de parágrafos vizinhos | `paragraphs`, `isLoading`, `error` |
| `ChapterModal` | Modal de capítulo completo | `isOpen` (props) |

### ContextPanel: Busca de Contexto

Quando o usuário clica em um resultado, o `ContextPanel` busca **±3 parágrafos vizinhos** via `/context?book=&chapter=&index=` e exibe:

1. Parágrafo anterior (tom)
2. Parágrafo do match (destacado)
3. Parágrafo seguinte (continuidade)

Isso permite que o leitor entenda o contexto sem abrir o capítulo inteiro.

---

## Performance

### Estratégias

| Técnica | Implementação |
|---------|--------------|
| **Suspense + fallback** | Loader enquanto o componente hidrata |
| **Animações otimizadas** | Framer Motion com `layout="position"` — sem reflow |
| **CSS nativo** | Tailwind CSS 4 + variáveis CSS — zero runtime CSS-in-JS |
| **Font loading** | Fontes estáticas, sem FOUT/FOIT |
| **Code splitting** | Cada rota Next.js lazy-loads seus componentes |
| **Bundle menor** | Lucide React com tree-shaking natural |

### Otimizações de Renderização

```tsx
// ResultItem é memoizado implicitamente pelo map key único
safeResults.map((result, i) => (
  <ResultItem
    key={`${result.book_number}-${result.chapter_number}-${result.paragraph_index}`}
    // key único previne re-renderização desnecessária
  />
))
```

---

## Tematização

### Tema Claro / Escuro

Implementado via **CSS custom properties** + **React Context**:

```css
:root {
  --bg-primary: #f8f6f0;
  --text-primary: #1a1a2e;
  --accent: #8b0000;
}

[data-theme="dark"] {
  --bg-primary: #0f0f1a;
  --text-primary: #e8e6e3;
  --accent: #c41e3a;
}
```

O tema é persistido em `localStorage` e respeita a preferência do sistema (`prefers-color-scheme`).

### Paleta

| Cor | Claro | Escuro | Uso |
|-----|-------|--------|-----|
| Fundo | `#f8f6f0` (pergaminho) | `#0f0f1a` (noite) | Background principal |
| Texto | `#1a1a2e` | `#e8e6e3` | Corpo do texto |
| Acento | `#8b0000` (vermelho Targaryen) | `#c41e3a` | Links, destaques, POV |
| Bordas | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.1)` | Separação sutil |

---

## Analytics & Error Tracking

### Plausible Analytics (opcional)

- Eventos customizados: `search`, `filter`, `pov_click`
- Sem cookies — compatível com LGPD
- Dashboard para ver termos de busca mais populares

### Sentry (opcional)

- Captura de erros não tratados
- Breadcrumbs de ação do usuário
- Source maps para debug em produção

### Tracking Programático

```ts
import { trackError, trackEvent } from "@/lib/tracking";

trackEvent("search", { query: "lobos", results: 42 });
trackError(err, { query: "Dracarys" });
```

---

## Acessibilidade

| Prática | Implementação |
|---------|--------------|
| **ARIA labels** | `aria-label` em cards de resultado |
| **Keyboard navigation** | `tabIndex`, `onKeyDown` (Enter/Space) |
| **Focus management** | Scroll automático para resultados após busca |
| **Contraste** | Paleta com contraste WCAG AA+ |
| **Semântica** | `article`, `button`, `footer` — HTML semântico |
| **Motion reduzido** | `prefers-reduced-motion` respeitado via Framer Motion |

---

## Deploy & CI/CD

### Vercel (Recomendado)

```bash
vercel --prod
```

- Deploy automático a cada push na `main`
- Environment: `NEXT_PUBLIC_API_URL=https://backend-url.com`
- Preview deployments para cada PR

### GitHub Actions

```yaml
- npm ci
- npm run lint
- npm run build
- Valida que o build não quebra antes do deploy
```

### Docker Compose (VPS)

```yaml
services:
  frontend:
    build: ./A-Procura-de-Gelo-e-Fogo-Frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000
```

---

## Stack

| Tecnologia | Versão | Função |
|-----------|--------|--------|
| **Next.js** | 16.2.6 | Framework SSR/SSG |
| **React** | 19.2.4 | UI |
| **Tailwind CSS** | 4 | Estilização utilitária |
| **Framer Motion** | 12.38 | Animações declarativas |
| **Radix UI** | — | Dialog, Select (acessíveis) |
| **Lucide React** | 1.16 | Ícones |
| **Sentry** | 10.53 | Error tracking |

---

> Projetado e desenvolvido por [FelipeAraujoBS](https://github.com/FelipeAraujoBS)
