# BarberHub Front

Front do BarberHub em Next.js (App Router) com React Compiler. A API fica em `/home/reverbo/studing/barberhub-backend` (NestJS).

## Comandos

- `npm run dev`: sobe em `http://localhost:3001`
- `npm run build` / `npm start`: build e produção (porta 3001)
- `npm run lint`, `npm run typecheck`, `npm run format:check`
- `npm test` / `npm run test:coverage` (Vitest + Testing Library)
- O CI (`.github/workflows/ci.yml`) roda lint, formatação, tipos, testes, Sass e build. Rode a mesma sequência antes de abrir PR.

## Integração com o back

- A API roda em `http://localhost:3000`. URL base, caminho do proxy e nomes dos cookies ficam só em `src/services/api/config.ts`.
- No browser, as chamadas vão para o proxy `/api/backend/*` (`src/app/api/backend/[...path]/route.ts`). No servidor, `src/services/api/server.ts` usa a URL absoluta.
- Token JWT no cookie httpOnly definido em `ACCESS_TOKEN_COOKIE`. Para ler a sessão no servidor, use `getAccessToken()` e `decodeTokenPayload()` de `src/services/api/session.ts`.
- `src/services/api/axios.ts` roda nos dois lados: lá o `next/headers` é importado dinamicamente, nunca via `session.ts`, senão a build com webpack quebra.

## Convenções

- **Hooks fora do `.tsx`**: componentes só chamam hooks customizados. Estado e efeitos vivem em `use-*.ts` (na pasta `hooks/` da área ou ao lado do componente). Hooks genéricos ficam em `src/hooks/`.
- **Lógica pura em `*.utils.ts`**, com teste ao lado (`*.test.ts`).
- **Zustand só para estado compartilhado entre componentes distantes**: `dashboard-modals.store.ts` (modais do dashboard) e `client-dashboard.store.ts` (dados da conta do cliente). Estado local continua em `useState`, dados do servidor continuam em Server Components ou na URL.
- **Sass com BEM**: `bloco__elemento--modificador`, em kebab-case. Estados também são modificadores (`--active`, `--selected`), nunca `is-*`. Modificador sempre acompanha a classe base. Para classes condicionais, use `cn()` de `src/utils/class-names.ts`.
- Ao renomear classes, mantenha a mesma estrutura de aninhamento no SCSS para não mudar a especificidade.
- Formatadores e helpers compartilhados: `src/utils/format.ts` (moeda, iniciais), `src/utils/phone.ts`, `src/utils/date-utils.ts`.
- Comentários só quando explicam um porquê que o código não mostra.
- Imagens remotas precisam estar em `remotePatterns` no `next.config.ts`.
- Se o dev server servir CSS antigo depois de editar partials Sass, pare o servidor e apague `.next/dev`.
