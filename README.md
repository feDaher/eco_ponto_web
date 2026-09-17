# EcoPonto Web

Aplicação web (site público + painel administrativo) do projeto **EcoPonto Digital**, desenvolvida com Next.js (App Router), TypeScript, Tailwind CSS e shadcn/ui.

Consulte pontos de coleta de resíduos recicláveis e eletrônicos, com painel administrativo para aprovação de pontos, gestão de usuários e relatórios.

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Clonando o repositório](#clonando-o-repositório)
- [Instalando as dependências](#instalando-as-dependências)
- [Configurando variáveis de ambiente](#configurando-variáveis-de-ambiente)
- [Rodando o projeto em desenvolvimento](#rodando-o-projeto-em-desenvolvimento)
- [Gerando o build de produção](#gerando-o-build-de-produção)
- [Scripts disponíveis](#scripts-disponíveis)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Problemas comuns](#problemas-comuns)

## Pré-requisitos

Antes de começar, instale na sua máquina:

| Ferramenta | Versão mínima | Link |
| --- | --- | --- |
| Node.js | 18.18 LTS ou superior | https://nodejs.org |
| npm | 9 ou superior (já vem com o Node.js) | — |
| Git | qualquer versão recente | https://git-scm.com |

Para conferir se já tem tudo instalado, abra o terminal e rode:

```bash
node -v
npm -v
git --version
```

Se algum comando não for reconhecido, instale a ferramenta correspondente antes de continuar.

## Clonando o repositório

1. Abra o terminal na pasta onde você quer salvar o projeto (ex.: Área de Trabalho, Documentos).
2. Copie a URL do repositório no GitHub/GitLab (botão verde **Code** → **HTTPS**).
3. Rode o comando abaixo, substituindo pela URL real do repositório:

```bash
git clone https://github.com/feDaher/eco_ponto_web.git
```

4. Entre na pasta do projeto que acabou de ser criada:

```bash
cd eco_ponto_web
```

> Se preferir, pode dar outro nome à pasta local: `git clone <url> nome-que-eu-quiser`.

## Instalando as dependências

Este projeto usa **npm** como gerenciador de pacotes (não use `yarn` nem `pnpm` aqui, para não gerar conflito de lockfile). Dentro da pasta do projeto, rode:

```bash
npm install
```

Isso vai ler o `package.json` e o `package-lock.json` e baixar todas as dependências (Next.js, Tailwind, shadcn/ui, etc.) na pasta `node_modules/`. Pode levar alguns minutos na primeira vez.

## Configurando variáveis de ambiente

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

*(No Windows, se o comando `cp` não funcionar, copie e cole o arquivo manualmente pelo explorador de arquivos, ou use `copy .env.example .env.local` no Prompt de Comando.)*

2. Abra o `.env.local` e preencha as variáveis necessárias, por exemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=coloque_sua_chave_aqui
```

> O `.env.local` **nunca** deve ser commitado no Git (ele já está no `.gitignore`) — cada pessoa do time usa suas próprias chaves/URLs locais.

## Rodando o projeto em desenvolvimento

Com as dependências instaladas e o `.env.local` configurado, suba o servidor de desenvolvimento:

```bash
npm run dev
```

Depois de aparecer a mensagem `Ready` no terminal, abra o navegador em:

```
http://localhost:3000
```

O servidor de desenvolvimento tem **hot reload**: qualquer alteração salva no código atualiza a página automaticamente, sem precisar reiniciar nada.

Para parar o servidor, use `Ctrl + C` no terminal.

## Gerando o build de produção

Para simular como o projeto roda em produção (útil antes de publicar ou entregar uma versão):

```bash
npm run build
npm run start
```

- `npm run build` compila e otimiza todo o projeto (gera a pasta `.next/`).
- `npm run start` sobe o servidor já com esse build otimizado, também em `http://localhost:3000`.

Se o `npm run build` terminar sem erros, o critério de aceite de "projeto builda em dev/prod" está atendido.

## Scripts disponíveis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Roda o projeto em modo desenvolvimento (hot reload) |
| `npm run build` | Gera o build de produção |
| `npm run start` | Roda o build de produção já gerado |
| `npm run lint` | Roda o ESLint para checar problemas no código |

## Tecnologias utilizadas

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- ESLint + Prettier

## Problemas comuns

- **`npm install` falha ou trava**: apague a pasta `node_modules` e o arquivo `package-lock.json`, depois rode `npm install` de novo.
- **Porta 3000 já em uso**: rode `npm run dev -- -p 3001` para subir em outra porta.
- **Erro de variável de ambiente indefinida**: confirme que o arquivo se chama exatamente `.env.local` (e não `.env.local.txt`) e que está na raiz do projeto.
- **`git clone` pede usuário/senha**: se o repositório for privado, configure autenticação via SSH ou um Personal Access Token do GitHub.
