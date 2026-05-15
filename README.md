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
│   ├── hero/              # Hero section com busca
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