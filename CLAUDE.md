@AGENTS.md

# EcoPonto Web — contexto do projeto

Site público + painel admin do **EcoPonto Digital**: pontos de coleta de recicláveis e eletrônicos em Manhuaçu-MG. Projeto acadêmico (UNIFACIG, ADS). Responder sempre em **pt-BR**.

Projetos irmãos em `../`:

- `ecoponto-api`: backend (Express + Prisma/MySQL, porta 3333, Swagger em `/docs`). Já tem `GET /collection-points` (com `X-Total-Count`), avaliações, relatórios, auditoria, categorias, horários e o proxy do Places (`GET /places/autocomplete`, `GET /places/:placeId`). O CORS expõe só o `X-Total-Count`.
- `ecoponto-mobile`: Expo 57 / RN 0.86, arquitetura em camadas, `react-native-maps`. É a fonte da taxonomia de categorias.
- `../Google Maps no EcoPonto - Web e Mobile.docx`: guia do Maps web → mobile (APIs, custos, REST do Places, checklist).

## Stack e comandos

Next.js 16.3 (App Router, Turbopack) · React 19 · TS strict · Tailwind 4 · lucide-react · `@vis.gl/react-google-maps` + `@googlemaps/markerclusterer` · `date-fns` + `react-day-picker` (período da auditoria). Use somente **npm**.

- `npm run dev` / `npm run build`
- `npm run typecheck` (`next typegen && tsc --noEmit`)
- `npx eslint .` / `npx prettier --write <arquivos>`

Ambiente: Windows (Git Bash / PowerShell). **Python não está instalado**: use node ou perl em scripts. O GitHub CLI (`gh`) está instalado e autenticado: use-o para PRs (`gh pr create`, `gh pr view`).

## Convenções

- **Sem comentários no código-fonte** (preferência do usuário).
- Rotas sempre via `ROUTES` (`src/lib/routes.ts`); detalhes de ponto: `ROUTES.point(slug)`. Nada de `href` escrito à mão.
- Cores pelos tokens da marca em `globals.css` (`bg-brand`, `text-brand-muted`, `bg-surface-alt`…). Ver "Tema claro/escuro".
- `cn` vem do pacote `cn` e **não** resolve classes Tailwind conflitantes: use variantes em vez de sobrescrever classes (ex.: botão principal é o `Button` na variante padrão, não `className="bg-…"`).
- Reaproveite os componentes base: `Button`/`buttonVariants`, `StatCard`, `SectionCard`, `ModerationTabs`, `FIELD_CLASS`/`LABEL_CLASS` (`src/components/point/fieldStyles.ts`).
- Páginas do admin seguem o mesmo cabeçalho: selo (`bg-brand-light`) + `h1` + descrição. Um `h1` por página.
- Tipos em `src/types/`, mocks em `src/data/`, acesso a dados em `src/services/`, regras puras em `src/lib/`. Componentes do admin em `src/components/admin/<módulo>/`.
- Ações que ainda não persistem mostram uma mensagem com `role="status"` terminando em "Demonstração: nada foi salvo."
- Prettier: aspas simples e ponto e vírgula. Textos de UI em pt-BR.
- Commits: Conventional Commits em pt-BR, `tipo(escopo): descrição`. O **`:` é obrigatório**, sem ponto final, até 100 caracteres.
- Hooks: pre-commit roda lint-staged (eslint --fix + prettier nos arquivos em stage) + typecheck; commit-msg roda commitlint.
- Fluxo: branch por feature → PR para `main`.
- Não editar `AGENTS.md`: o `next dev` regenera esse arquivo.

## Serviços que falam com a API

Padrão (`auth.ts`, `places.ts`, `reviews.ts`, `reports.ts`, `pointCategories.ts`):

- Base em `NEXT_PUBLIC_API_URL` (sem barra final), `AbortSignal.timeout` em todo `fetch`.
- Valida o formato da resposta antes de usar (nada de `res.json() as T` sem checar).
- Classe de erro própria com `status` (`AuthError`, `ReviewApiError`, `ReportApiError`) e mensagens pt-BR por status HTTP.
- Rotas autenticadas recebem o `token` de `useAuth()` como parâmetro (não leem o `localStorage` direto). Em 401, a tela chama `logout()`.
- Carregamento em `useEffect` só faz `setState` depois do `await` (regra `react-hooks/set-state-in-effect`). Para recarregar, use uma `reloadKey`.
- Respostas paginadas da API trazem o total no header `X-Total-Count`.

Ainda em mock: `api.ts` (pontos), `audit.ts`, `categories.ts`, `dashboard.ts`, `education.ts`, `moderation.ts` (pontos) e `users.ts`.

## Mapa (Google Maps)

Env (`.env.local`, ignorado pelo git):

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` (`DEMO_MAP_ID` em dev)
- `NEXT_PUBLIC_API_URL`

A chave da web serve **só para desenhar o mapa** (Maps JavaScript API). A busca de endereços (Places) passa pelo `ecoponto-api`, que guarda a chave do Google no servidor. Não use `useMapsLibrary('places')` nem `'geocoding'` no navegador.

Arquivos:

- `src/types/api.ts`: `CollectionPoint`, `Material`, `LatLng`, `MapBounds`, `PointFilters`, `PointDetails` (ficha), `Review`, `ModerationReview`
- `src/services/api.ts`: `getPoints({ bounds, materials, query })` sobre `src/data/mockPoints.ts`. A API já tem `GET /collection-points`, mas a integração ainda não foi feita (ver Pendências). `getPointBySlug(slug)` junta `mockPoints` + `src/data/mockPointDetails.ts` + `src/data/mockReviewReports.ts` (só `approved`).
- `src/services/places.ts`: `suggestPlaces` e `getPlace` chamam o back, com timeout, validação da resposta e conversão de `latitude`/`longitude` para `LatLng`/`MapBounds`. O session token é um `crypto.randomUUID()`: o back só aceita até 36 caracteres `[A-Za-z0-9_-]`.
- `src/lib/geo.ts` (distância, bounds, link de rota) e `src/lib/materials.ts` (nome e ícone)
- `src/components/map/`:
  - `GoogleMapsProvider`: chave, pt-BR, região BR
  - `PointsMap`: mapa, pins, cluster, InfoWindow
  - `PlaceSearch`: campo de busca
  - `useUserLocation`
  - `PointCard`, `FilterChip`
  - `PointsExplorer`: tela `/map`
- `src/components/home/MapExplorer.tsx`: prévia na home

Comportamentos importantes:

- Só pontos com `status: 'approved'` aparecem.
- Busca: sugestões = pontos locais + Places via back, com session token, debounce de 250 ms, mínimo de 3 caracteres (o back recusa menos) e descarte/cancelamento de respostas atrasadas. Enter sem sugestão escolhida resolve a primeira sugestão do back (funciona com CEP).
- "Buscar nesta área": `onIdle` atualiza os bounds. `autoSearchRef` refaz a busca sozinho quando o próprio app moveu o mapa.
- Cluster fica em **refs** (`useRef` + `useEffect`). `useMemo`/`setState` ali causou clusterer duplicado e loop no StrictMode.
- `Map` do vis.gl é importado como `GoogleMap` (conflito com o `Map` do JS).
- Na home, o mapa usa `gestureHandling="cooperative"`.

Custos: cota grátis de 10.000/mês por SKU (Dynamic Maps, Autocomplete Requests, Place Details Essentials, Geocoding). Ilimitados: Autocomplete Session Usage e Maps SDK mobile.

## Ficha do ponto (WEB-05): `/points/[slug]`

- Página SSR com `generateMetadata` + JSON-LD `RecyclingCenter`; `cache()` evita buscar o ponto duas vezes.
- Componentes em `src/components/point/` (base: `SectionCard`, `StarRating`). Mapa: `PointLocationMap` (vis.gl), não iframe.
- Regras em `src/lib/points.ts`: horários estruturados (`OpeningHours` com `weekdays` 0–6) e `isOpenNow` no fuso `America/Sao_Paulo`; aviso quando `updatedAt` passa de 60 dias (`OUTDATED_AFTER_DAYS`); WhatsApp só se `whatsapp.authorized`.
- Avaliações: `Review.hidden` marca as ocultadas pela moderação. `publicReviews()` filtra antes de chegar à lista, ao cabeçalho (nota média) e ao JSON-LD. As ocultas nem vão para o navegador. Datas sempre em ISO.
- **Sem `loading.tsx`** na rota: com streaming, `notFound()` responde 200 em vez de 404.
- Formulários de avaliação e sugestão são só demonstração (não persistem).

## Home

- `HeroSection` e o resto da home são Server Components. Só o painel da direita do hero (`HeroAuthPanel`) é cliente: skeleton enquanto a sessão carrega (`status: 'loading'`, que é o estado no servidor), card por perfil (admin/coletor), card do cidadão e card de visitante.
- `CtaSection` é cliente e muda texto e link conforme o perfil (`HOME_BY_ROLE`).

## Tema claro/escuro (WEB-16)

- Claro é o padrão. A classe `.dark` no `<html>` vem de um script inline no `<head>` (`THEME_INIT_SCRIPT` em `src/lib/theme.ts`), que lê `localStorage['ecoponto-theme']` antes da pintura. O `<html>` tem `suppressHydrationWarning`.
- `ThemeToggle` (`src/components/theme/`) fica no Header. `useTheme()` usa `useSyncExternalStore` (servidor = `light`). `applyTheme` faz revelação circular com View Transitions a partir do botão. Sem suporte, usa fade (`.theme-fading`). Com `prefers-reduced-motion`, troca na hora.
- Os tokens mudam de valor em `.dark` (`globals.css`). **Não use `dark:` para cores da marca nem neutras**:
  - `slate-*` é a escala neutra e **inverte** no escuro (`text-slate-900` fica claro, `bg-slate-100` fica escuro). Não use `gray-*` nem `green-*`.
  - Fundo de card é `bg-card`, de página é `bg-background`/`bg-surface*`. `bg-white` só em elemento que deve continuar branco (ex.: botão branco sobre faixa verde).
  - `brand`, `brand-dark` e `brand-muted` são para texto, ícones e bordas de destaque (clareiam no escuro). `brand-light` é fundo de chip.
  - Preenchimento com texto branco (botão, switch ligado, barra de progresso): `bg-brand-solid` + `hover:bg-brand-solid-hover`. Faixa verde escura: `bg-brand-deep`. Texto sobre essas faixas: `text-brand-pale`/`text-brand-foreground`.
  - Gráficos: `bg-chart-1`…`bg-chart-5`.
  - Vermelho e âmbar (alertas) levam `dark:` explícito (ex.: `bg-red-50 dark:bg-red-950/40`).
- Mapas usam `colorScheme` (`ColorScheme.DARK`/`LIGHT`). Trocar recria o mapa: o `PointsMap` guarda a câmera no `onIdle` para não perder a posição. O InfoWindow é estilizado no escuro via `.gm-style` no `globals.css`.

## Autenticação (WEB-02)

- Login e cadastro falam com `ecoponto-api` (`POST /auth/login`, `POST /auth/register`) em `src/services/auth.ts`, que valida a resposta e converte o status HTTP em mensagem pt-BR (`AuthError`). O cadastro chama o login em seguida, porque a API devolve só o usuário.
- Perfis da API: `CITIZEN`, `COLLECTOR`, `ADMIN` (`src/types/user.ts`). Cadastro só como `CITIZEN`/`COLLECTOR`; admin vem do seed da API.
- Sessão (`token`, `expiresAt`, `user`) em `localStorage['ecoponto-session']` (`src/lib/session.ts`), lida com `useSyncExternalStore` no `AuthContext` (servidor = `loading`). O `token` é o `idToken` do Firebase e expira em 1 h; não há refresh ainda.
- `RequireRole` protege `/admin` (ADMIN), `/collector` (COLLECTOR, ADMIN) e `/account` (qualquer logado), redirecionando para `/login?next=` ou para `HOME_BY_ROLE`. É só UX: quem garante o acesso é a API.
- Validação: React Hook Form + Zod (`@hookform/resolvers` **v5**, a v6 dá conflito de peer). Schemas e mensagens em `src/lib/authSchemas.ts`; `mode: 'onTouched'`; `noValidate` no form. `AuthField`/`PasswordField` recebem `error` (borda vermelha, `aria-invalid`, mensagem com ícone) e `hint`. Erros da API: `AuthError.status` (401 marca a senha, 409 marca o e-mail); o resto vai em `root.server`. Cadastro exige senha com 8+ caracteres, letra e número.
- Contas de teste (seed da API): `admin@`, `coletor@`, `cidadao@ecoponto.dev`, senha `Ecoponto@123`.

## Painel admin (`/admin`)

`AdminSidebar` (`usePathname()`) lista as telas abaixo.

| Rota                | Tela                                                           | Dados                                                                                                                          |
| ------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `/admin`            | Visão geral (KPIs, categorias, impacto, lotação)               | mock (`dashboard.ts`)                                                                                                          |
| `/admin/points`     | Moderação de pontos (WEB-08): solicitações, decisão, histórico | mock (`moderation.ts`); aba "Categorias solicitadas" na **API** (`pointCategories.ts`)                                         |
| `/admin/categories` | Categorias e horários desatualizados (WEB-09)                  | mock (`categories.ts`)                                                                                                         |
| `/admin/reviews`    | Moderação de avaliações (WEB-10)                               | **API**: `GET /admin/reviews`, `PATCH /admin/reviews/:id/hide`, `PATCH /admin/reviews/:id/unhide`, `DELETE /admin/reviews/:id` |
| `/admin/reports`    | Relatórios e exportação (WEB-11)                               | **API**: `/reports/summary`, `by-category`, `by-point`, `manifests`, `filter-options`, `export`                                |
| `/admin/users`      | Gestão de usuários: filtros, ordenação, exportação             | mock (`users.ts`, `mockUsers.ts`)                                                                                              |
| `/admin/audit`      | Trilha de auditoria (WEB-17)                                   | mock (`audit.ts`)                                                                                                              |

Detalhes:

- Avaliações: `/admin/reviews` busca todas as páginas (limite 100) e filtra, ordena e pagina no cliente. Excluir pede confirmação e não pode ser desfeito; prefira ocultar.
- Relatórios: `GET /reports/by-category` e `/by-point` respondem `{ rows, totalWeightKg }`. A tela separa o filtro em edição (`draft`) do aplicado (`applied`), e paginação e exportação usam sempre o aplicado. A API aceita período de no máximo 366 dias e recusa busca vazia (400). Formatos por escopo: `general` csv/pdf, `category` csv, `manifests` csv, `geospatial` geojson/kml. O nome do arquivo é montado no front, porque o CORS não expõe o `Content-Disposition`. O `summary` traz `users: { scope, total, newInPeriod }`: `platform` (ADMIN, usuários cadastrados) ou `collector` (cidadãos com descarte confirmado nos pontos dele). Para COLLECTOR, todos os `/reports/*` já vêm só com os pontos dele.
- Categorias solicitadas (BE-21): `GET /collection-points/admin/pending-categories` e `PATCH /collection-points/:id/categories/:categoryId/review` (`APPROVED`, ou `REJECTED` + `rejectionReason` de até 500 caracteres). Rejeitar apaga o vínculo, então revisar de novo responde 404; 409 quando outra pessoa já decidiu. Nos dois casos a tela recarrega a lista. O histórico por ponto (`GET /collection-points/:id/categories/reviews`) mostra quem decidiu só para o admin. A rejeição usa o `DecisionDialog` com `action="rejectCategory"`.
- Usuários: perfis seguem o `UserRole` da API, e o cargo descritivo fica em `title`. A exportação gera HTML com os valores escapados.

## Painel do coletor (`/collector`)

- `/collector`: painel com recebimento, histórico/MTRs, ponto, horários e categorias (âncoras em `COLLECTOR_SECTIONS`).
- `PointCategories` usa a **API**: `GET /collection-points/mine` (`categoryApprovals` com `approvalStatus`/`isAccepting`), `PUT /collection-points/:id/categories` (as adicionadas ficam `PENDING`; desmarcar remove na hora; o ponto precisa manter uma aprovada, senão 422) e o histórico de decisões. Nomes vêm do `label` de `GET /waste-categories`. Coletor com vários pontos escolhe num `select`.
- `/collector/materials` (WEB-18): capacidade por material, alerta de lotação (≥ 85%), pausar recepção e alterar o limite (validado: inteiro e não menor que o estoque). Mock em `src/data/mockCollector.ts`, porque a API não tem rota de capacidade.
- `CollectorSidebar` usa `usePathname()` para marcar a página ativa.

## Pendências

- Página ainda em `ComingSoon`: `/account`.
- Integrar com a API o que ainda é mock:
  - pontos: `GET /collection-points` (com isso, a ficha passa a usar `GET /collection-points/:id/reviews`)
  - moderação de pontos: `GET /collection-points/admin/pending` e `PATCH /collection-points/:id/review`
  - usuários: `GET /users`, `PATCH /users/:id/block`, `/unblock` e `/role`
  - auditoria: `GET /admin/audit-logs`
  - categorias, horários e conteúdo educativo: `/waste-categories`, `/operating-hours`, `/educational-content`
- O seed da API não cria pontos, descartes nem avaliações. Para testar telas integradas localmente é preciso inserir dados (e removê-los depois).
- Alinhar com mobile/API:
  - materiais: `pilhas`→`batteries`, `eletronicos`→`general-electronics`…, `plastico`→`plastic`, `papel`→`paper`, `vidro`→`glass`, `metal`→`metals`, `oleo`→`cooking-oil`
  - coordenadas: `lat`/`lng` → `latitude`/`longitude`
- Produção:
  - criar um Map ID próprio
  - restringir a chave da web (referrer + só Maps JavaScript API)
  - definir cota diária e alerta de orçamento
- Cadastro de ponto: salvar lat/lng usando `suggestPlaces` + `getPlace`.
- Sessão: não há refresh do token; ao expirar (1 h) o usuário precisa entrar de novo.

## Dicas operacionais

- O usuário costuma deixar `npm run dev` rodando na porta 3000. O Next 16 recusa um segundo servidor na mesma pasta, então use o que já está rodando. Para testar o build sem conflito: `npx next start -p 3100`.
- API local: `npm run dev` em `../ecoponto-api` (porta 3333). O MySQL roda no container Docker `ecoponto-mysql`.
- Erros de servidor e de navegador ficam em `.next/dev/logs/next-development.log`. Após HMR, o code-frame pode apontar para a linha errada.
- Depois de puxar a `main`, rode `npm install` se `package.json` mudou (ex.: `date-fns`/`react-day-picker` vieram com a auditoria). `npm install` costuma mexer no `package-lock.json` só com flags `peer`: esse ruído não deve entrar em PR.
- Validar antes de entregar: `npm run typecheck`, `npx eslint .` e `npm run build`.
