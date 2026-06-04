# A Procura de Gelo e Fogo — Frontend

**Thematic search interface** for *A Song of Ice and Fire*. Immersive experience with a medieval theme, cinematic animations, instant search, and contextual book exploration — plus a built-in **RAG chatbot** powered by the [RAG microservice](https://github.com/FelipeAraujoBS/search).

> ⚔️ Showcase of modern frontend architecture: hybrid SSR + CSR, URL-driven state, granular componentization, dark/light theme, accessibility.

---

## Table of Contents

- [Architecture](#architecture)
- [Data Flow](#data-flow)
- [Components](#components)
- [RAG Chat Widget](#rag-chat-widget)
- [Performance](#performance)
- [Theming](#theming)
- [Analytics & Error Tracking](#analytics--error-tracking)
- [Accessibility](#accessibility)
- [Deploy & CI/CD](#deploy--cicd)

---

## Architecture

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
│  │  │ POV     │ │ Chapter  │ │ ChatWidget     │     │   │
│  │  │FilterBar│ │  Modal   │ │ (RAG FAB +     │     │   │
│  │  │         │ │          │ │  slide panel)  │     │   │
│  │  └─────────┘ └──────────┘ └────────────────┘     │   │
│  │  ┌─────────┐ ┌──────────────────────────────┐    │   │
│  │  │ Theme   │ │  Navbar (fixed header)        │    │   │
│  │  │ Toggle  │ │  + Footer                     │    │   │
│  │  └─────────┘ └──────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         │                           │
         ▼                           ▼
    API (Fastify)              Sentry / Plausible
    (REST + FTS5)              (error/analytics)
         │
         ▼
    RAG Microservice
    (Hybrid Search + Groq LLM)
```

### Architecture Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Hybrid SSR/CSR** | `Providers.tsx` | Initial layout with SSR, search with CSR (dynamic) |
| **Suspense boundary** | `Home()` → `<Suspense>` + `HomeContent` | Loading fallback while hydrating |
| **URL-driven state** | `useSearchParams` + `useRouter.push` | Results are linkable and shareable |
| **Custom hooks** | `useSearch`, `useTheme` | Separates state logic from presentation |
| **Pure components** | `SearchBar`, `Filters`, `ResultsList` | Props in, JSX out — testable and predictable |
| **Hydration guard** | `mounted` state in `useTheme`, `useSearch` | Prevents render until hydration is complete |
| **Controlled forms** | SearchBar value + onChange | Centralized state in hook, not DOM |

---

## Data Flow

### Search Flow

```
User types "Dracarys" ──▶ SearchBar onChange
                               │
                               ▼
                        HomeContent: setQuery()
                               │
                               ▼
                        executeSearch()
                               │
                        router.push(?q=Dracarys)
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
                        ResultsList renders
                               │
                               ├── ResultItem (snippet + metadata)
                               │
                               ├── ContextPanel (neighboring paragraphs)
                               │
                               └── PovFilterBar updates
```

### URL State Sync

```
/search?q=Dracarys&book=3&povs=Daenerys
```

The `useSearch` hook reads `searchParams` on initialization and updates the URL via `router.push()` on each search. This guarantees:

- **Shareable links**: copying the URL copies the search state
- **Native Back/Forward**: browser navigation works
- **Deep linking**: opening a URL with parameters already executes the search (`useEffect` on mount)

---

## Components

### Component Tree

```
<Providers>                          ← ThemeProvider + Navbar + ChatWidget
  <Suspense fallback={<Loader />}>
    <HomeContent>                    ← Central state, orchestration
      <SearchBar />                  ← Input + search button
      <PovFilterBar />              ← Quick POV character filter
        └── pov_chips grid
            └── selected tags
      <Filters />                   ← Book + POV selectors (after search)
        ├── BookFilter dropdown
        └── PovFilter dropdown with search
      <ResultsList>                 ← Paginated results
        ├── ResultItem              ← Clickable card with snippet
        │   └── ContextPanel        ← Neighboring paragraphs (±3)
        ├── Load More button
        └── Empty state
      <Footer />                    ← Credits
    </HomeContent>
  </Suspense>
  <ChatWidget />                    ← FAB button + slide-in panel
    ├── ChatPanel                   ← Messages + sources
    │   ├── Message bubbles
    │   ├── Source references
    │   └── Loading state
    └── Overlay (mobile)
</Providers>
```

### Responsibilities

| Component | Responsibility | State |
|-----------|---------------|-------|
| `Providers` | Theme + Layout + Navbar + ChatWidget | None (render prop) |
| `HomeContent` | Orchestration, scroll, suggestions | `mounted`, `openIndex`, `shouldScroll` |
| `SearchBar` | Controlled input + submit | `value` (controlled) |
| `PovFilterBar` | Quick POV selection with chip grid | `selectedPovs` (props), fetched from API |
| `Filters` | Book select + POV dropdown with search | `book`, `povs` (props) |
| `ResultsList` | Results render + load more + empty state | `openIndex` (props) |
| `ResultItem` | Card with snippet + metadata + click | None (stateless) |
| `ContextPanel` | Fetch neighboring paragraphs ±3 | `paragraphs`, `isLoading`, `error` |
| `ChapterModal` | Full chapter content modal | `isOpen` (props), fetches chapter data |
| `ChatWidget` | FAB button + slide-in panel + mobile keyboard handling | `isOpen`, supports Escape key |
| `ChatPanel` | Chat messages + send + sources display | `messages`, `input`, `isLoading` |
| `ThemeToggle` | Dark/light switch | `theme` (context) |
| `Navbar` | Fixed header with title + theme toggle | None |

### ContextPanel: Contextual Search

When the user clicks a result, the `ContextPanel` fetches **±3 neighboring paragraphs** via `/context?book=&chapter=&index=` and displays:

1. Previous paragraph (context/tone)
2. Match paragraph (highlighted with query terms)
3. Next paragraph (continuity)

This lets the reader understand context without opening the entire chapter.

### ChapterModal: Full Chapter View

The `ChapterModal` fetches the full chapter content via `/books/:id/chapters/:number` and displays it in an accessible dialog:

- Framer Motion enter/exit animations
- Backdrop blur overlay
- Escape key to close
- Body scroll lock when open
- Highlights the matched paragraph

---

## RAG Chat Widget

The **ChatWidget** provides a ChatGPT-like interface for asking natural language questions about the books:

```
FAB button "Pergunte aos Meistres"
  → Opens slide-in ChatPanel
    → User asks "Who is Jon Snow's father?"
      → POST /api/chat to Fastify backend
        → Proxies to RAG microservice
          → Hybrid search + Groq LLM
      → Returns { answer, sources[] }
        → Displays answer + cited book chapters
```

### Features

- **FAB (Floating Action Button)** with label
- **Slide-in panel** from right side
- **Mobile keyboard handling**: `visualViewport` + `ResizeObserver` + polling to handle mobile keyboard resize
- **Auto-scroll** to latest message via `ResizeObserver`
- **Source citations**: shows `book_title` and `chapter_title` for each source
- **Loading state**: "Consultando os pergaminhos..." with spinner
- **Error fallback**: graceful message if RAG is unavailable
- **Escape key** closes the panel
- **Enter key** sends message
- **Overlay** on mobile

### Chat Response Format

```json
{
  "reply": {
    "id": "chat_1717000000000",
    "role": "assistant",
    "content": "Jaime Lannister.",
    "sources": [
      {
        "book_title": "A Tormenta de Espadas",
        "chapter_title": "Jaime VIII",
        "pov": "Jaime Lannister"
      }
    ],
    "timestamp": 1717000000000
  }
}
```

---

## Performance

### Strategies

| Technique | Implementation |
|-----------|---------------|
| **Suspense + fallback** | Loader while component hydrates |
| **Optimized animations** | Framer Motion with `layout="position"` — no reflow |
| **Native CSS** | Tailwind CSS 4 + CSS custom properties — zero runtime CSS-in-JS |
| **Font loading** | Static fonts, no FOUT/FOIT |
| **Code splitting** | Each route lazy-loads its components |
| **Smaller bundle** | Lucide React with natural tree-shaking |

### Render Optimizations

```tsx
// ResultItem is implicitly memoized by unique map key
safeResults.map((result, i) => (
  <ResultItem
    key={`${result.book_number}-${result.chapter_number}-${result.paragraph_index}`}
    // unique key prevents unnecessary re-rendering
  />
))
```

---

## Theming

### Dark / Light Theme

Implemented via **CSS custom properties** + **React Context**:

```css
:root, [data-theme="light"] {
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

The theme is persisted in `localStorage` and respects system preference (`prefers-color-scheme`).

### Palette

| Color | Light | Dark | Usage |
|-------|-------|------|-------|
| Background | `#f8f6f0` (parchment) | `#0f0f1a` (night) | Main background |
| Text | `#1a1a2e` | `#e8e6e3` | Body text |
| Accent | `#8b0000` (Targaryen red) | `#c41e3a` | Links, highlights, POV |
| Borders | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.1)` | Subtle separation |

### Theme Provider

The `useTheme` hook provides:
- `theme`: current theme (`'light'` | `'dark'`)
- `toggleTheme()`: switch between themes
- `setTheme(theme)`: set a specific theme

Theme is applied via class on `<html>` element — no flash of unstyled content.

---

## Analytics & Error Tracking

### Plausible Analytics (optional)

- Custom events: `search`, `filter`, `pov_click`
- Cookie-free — LGPD compliant
- Dashboard for most popular search terms
- Configured via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env variable

### Sentry (optional)

- Captures unhandled errors
- User action breadcrumbs
- Source maps for production debugging
- Configured via `sentry.client.config.ts`

### Programmatic Tracking

```ts
import { trackError, trackEvent } from "@/lib/tracking";

trackEvent("search", { query: "lobos", results: 42 });
trackError(err, { query: "Dracarys" });
```

---

## Accessibility

| Practice | Implementation |
|----------|---------------|
| **ARIA labels** | `aria-label` on result cards, buttons, FAB |
| **Keyboard navigation** | `tabIndex`, `onKeyDown` (Enter/Space), Escape for modals |
| **Focus management** | Auto-scroll to results after search, auto-focus chat input |
| **Contrast** | Palette with WCAG AA+ contrast |
| **Semantics** | `article`, `button`, `footer` — semantic HTML |
| **Reduced motion** | `prefers-reduced-motion` respected via Framer Motion |
| **Body scroll lock** | Chat panel and modal lock background scroll |

---

## Deploy & CI/CD

### Vercel (Recommended)

```bash
vercel --prod
```

- Auto-deploy on every push to `main`
- Environment: `NEXT_PUBLIC_API_URL=https://backend-url.com`
- Preview deployments for each PR

### GitHub Actions

```yaml
- npm ci
- npm run lint
- npm run build
- Validates build doesn't break before deploy
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

The Dockerfile uses **multi-stage build** with `standalone` output for optimal image size.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:5000` | Backend API URL |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | — | Plausible analytics domain |

---

## Stack

| Technology | Version | Role |
|-----------|---------|------|
| **Next.js** | 16.2.6 | Framework SSR/SSG |
| **React** | 19.2.4 | UI |
| **TypeScript** | 5.x | Typing |
| **Tailwind CSS** | 4 | Utility-first styling |
| **Framer Motion** | 12.38 | Declarative animations |
| **Radix UI** | — | Dialog, Select (accessible) |
| **Lucide React** | 1.16 | Icons |
| **Sentry** | 10.53 | Error tracking |
| **class-variance-authority** | 0.7 | Component variants |

---

## Related Projects

- [A-Procura-de-Gelo-e-Fogo-Backend](https://github.com/FelipeAraujoBS/search) — Fastify + SQLite FTS5 search API
- [Uma-RAG-de-Gelo-e-Fogo](https://github.com/FelipeAraujoBS/search) — RAG microservice for LLM-powered answers

---

> Designed and developed by [FelipeAraujoBS](https://github.com/FelipeAraujoBS)
