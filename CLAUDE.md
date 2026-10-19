@AGENTS.md

# EcoPonto Web — contexto do projeto

Site público + painel admin do **EcoPonto Digital**: pontos de coleta de recicláveis e eletrônicos em Manhuaçu-MG. Projeto acadêmico (UNIFACIG, ADS). Responder sempre em **pt-BR**.

Projetos irmãos em `../`:

- `ecoponto-api`: backend. Ainda **não** tem `GET /points`. Já tem o proxy do Places: `GET /places/autocomplete` e `GET /places/:placeId`.
- `ecoponto-mobile`: Expo 57 / RN 0.86, arquitetura em camadas, `react-native-maps`. É a fonte da taxonomia de categorias.
- `../Google Maps no EcoPonto - Web e Mobile.docx`: guia do Maps web → mobile (APIs, custos, REST do Places, checklist).

## Stack e comandos

Next.js 16.3 (App Router, Turbopack) · React 19 · TS strict · Tailwind 4 · lucide-react · `@vis.gl/react-google-maps` + `@googlemaps/markerclusterer`. Use somente **npm**.

- `npm run dev` / `npm run build`
- `npm run typecheck` (`next typegen && tsc --noEmit`)
- `npx eslint .` / `npx prettier --write <arquivos>`

Ambiente: Windows (Git Bash / PowerShell). **Python não está instalado**: use node ou perl em scripts.

## Convenções

- **Sem comentários no código-fonte** (preferência do usuário).
- Rotas sempre via `ROUTES` (`src/lib/routes.ts`); detalhes de ponto: `ROUTES.point(id)`.
- Cores pelos tokens da marca em `globals.css` (`bg-brand`, `text-brand-muted`, `bg-surface-alt`…).
- `cn` vem do pacote `cn` e **não** resolve classes Tailwind conflitantes: use variantes em vez de sobrescrever classes.
- Prettier: aspas simples e ponto e vírgula. Textos de UI em pt-BR.
- Commits: Conventional Commits em pt-BR, `tipo(escopo): descrição`. O **`:` é obrigatório**, sem ponto final, até 100 caracteres.
- Hooks: pre-commit roda lint-staged + typecheck; commit-msg roda commitlint.
- Fluxo: branch por feature → PR para `main`.
- Não editar `AGENTS.md`: o `next dev` regenera esse arquivo.

## Mapa (Google Maps): já em `main` (PR #9)

Env (`.env.local`, ignorado pelo git):

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` (`DEMO_MAP_ID` em dev)
- `NEXT_PUBLIC_API_URL`

A chave da web serve **só para desenhar o mapa** (Maps JavaScript API). A busca de endereços (Places) passa pelo `ecoponto-api`, que guarda a chave do Google no servidor. Não use `useMapsLibrary('places')` nem `'geocoding'` no navegador.

Arquivos:

- `src/types/api.ts`: `CollectionPoint`, `Material`, `LatLng`, `MapBounds`, `PointFilters`
- `src/services/api.ts`: `getPoints({ bounds, materials, query })` sobre `src/data/mockPoints.ts`. Quando a API tiver a rota, trocar por `fetch(${NEXT_PUBLIC_API_URL}/points?...)`.
- `src/services/places.ts`: `suggestPlaces` e `getPlace` chamam o back (`NEXT_PUBLIC_API_URL`), com timeout, validação da resposta e conversão de `latitude`/`longitude` para `LatLng`/`MapBounds`. O session token é um `crypto.randomUUID()`: o back só aceita até 36 caracteres `[A-Za-z0-9_-]`.
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

## Pendências

- Páginas ainda em `ComingSoon`:
  - `/account`, `/login`, `/register`
  - `/admin`, `/admin/points`, `/admin/users`
  - `/education`, `/education/[category]`
  - `/points/[id]`
- Alinhar com mobile/API:
  - materiais: `pilhas`→`batteries`, `eletronicos`→`general-electronics`…, `plastico`→`plastic`, `papel`→`paper`, `vidro`→`glass`, `metal`→`metals`, `oleo`→`cooking-oil`
  - coordenadas: `lat`/`lng` → `latitude`/`longitude`
- Produção:
  - criar um Map ID próprio
  - restringir a chave da web (referrer + só Maps JavaScript API)
  - definir cota diária e alerta de orçamento
- Cadastro de ponto: salvar lat/lng usando `suggestPlaces` + `getPlace`.

## Dicas operacionais

- O usuário costuma deixar `npm run dev` rodando na porta 3000. O Next 16 recusa um segundo servidor na mesma pasta, então use o que já está rodando.
- Erros de servidor e de navegador ficam em `.next/dev/logs/next-development.log`. Após HMR, o code-frame pode apontar para a linha errada.
- Validar antes de entregar: `npm run typecheck`, `npx eslint .` e `npm run build`.
