# Search Frontend

Frontend Next.js para sistema de busca de livros, com filtros por livro e personagem (POV).

## Tecnologias

- **Next.js** 16.2.6
- **React** 19.2.4
- **Tailwind CSS** 4
- **Radix UI** (Dialog, Select)
- **Framer Motion** (animações)
- **Lucide React** (ícones)

## Estrutura

```
├── app/                    # Páginas e layout Next.js
├── components/
│   ├── filters/           # Filtros de busca
│   ├── modal/             # Modal de capítulo
│   ├── results/           # Lista de resultados
│   ├── search/            # Componentes de busca
│   └── theme/             # Toggle de tema e navbar
├── hooks/                 # Custom hooks (useSearch, useTheme)
├── services/              # Integração com API
└── types/                 # TypeScript types
```

## Configuração

Crie um arquivo `.env.local` com a URL da API:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Scripts

```bash
npm run dev      # Iniciar servidor de desenvolvimento
npm run build   # Build de produção
npm run start   # Iniciar servidor de produção
npm run lint    # Verificar código
```

## Funcionalidades

- Busca por texto em livros
- Filtros por livro e personagem (POV)
- Paginação com "load more"
- Modal de visualização de capítulos
- Theme toggle (claro/escuro)
- Animações com Framer Motion

## Deploy

### Vercel (Recomendado)

1. Conecte o repositório à Vercel
2. Defina o diretório raiz como `A-Procura-de-Gelo-e-Fogo-Frontend`
3. Adicione a variável de ambiente:
   - `NEXT_PUBLIC_API_URL=https://backend-url.com`
4. Deploy automático a cada push na `main`

```bash
# Ou via CLI
vercel --prod
```

### Docker

```bash
docker build -t search-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://backend-url.com \
  search-frontend
```

### Railway

1. Conecte o repositório ao Railway
2. Defina o diretório raiz como `A-Procura-de-Gelo-e-Fogo-Frontend`
3. Adicione a variável de ambiente:
   - `NEXT_PUBLIC_API_URL=https://backend-url.com`

### VPS com Docker Compose

Veja `docker-compose.yml` na raiz do projeto para subir backend + frontend juntos.

## Analytics e Error Tracking

### Plausible Analytics (opcional)

Analytics leve, sem cookies, compatível com LGPD.

1. Crie uma conta em [plausible.io](https://plausible.io)
2. Adicione seu domínio (ex: `geloefogo.com`)
3. Adicione ao `.env.local`:
   ```env
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=geloefogo.com
   ```

Para ver os dados:
- Acesse o dashboard do Plausible em `plausible.io`
- Veja visitantes, páginas mais vistas, fontes de tráfego, etc.

### Sentry (opcional)

Rastreamento de erros em tempo real.

1. Crie uma conta em [sentry.io](https://sentry.io)
2. Crie um projeto Next.js
3. Copie o DSN e adicione ao `.env.local`:
   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   ```
4. Instale o pacote: `npm install @sentry/nextjs`

Para ver os erros:
- Acesse o dashboard do Sentry em `sentry.io`
- Veja stack traces, frequência de erros, sessões afetadas, etc.

### Uso programático

```ts
import { trackError, trackEvent } from "@/lib/tracking";

// Track erro customizado
trackError(err, { query: "lobos", book: "1" });

// Track evento (Plausible)
trackEvent("search", { query: "lobos", results: 42 });
```

Este projeto usa GitHub Actions para:
- Rodar lint e build automaticamente em cada PR
- Validar que o código está pronto para deploy

O workflow é disparado quando há mudanças em `A-Procura-de-Gelo-e-Fogo-Frontend/`.
