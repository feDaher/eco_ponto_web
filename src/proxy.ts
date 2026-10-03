import { NextResponse, type NextRequest } from 'next/server';

import { findPointBySlug } from '@/utils/pontos';

const notFoundPageHtml = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Ponto não encontrado | EcoPonto</title>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; background: #f8faf9; color: #18352b; font-family: system-ui, sans-serif; }
      main { display: flex; min-height: 100vh; flex-direction: column; align-items: flex-start; justify-content: center; margin: 0 auto; padding: 48px 24px; max-width: 720px; }
      p { color: #53665e; line-height: 1.65; }
      .eyebrow { border-radius: 999px; background: #e7f3ec; padding: 7px 12px; color: #155b3d; font-size: 14px; font-weight: 600; }
      h1 { margin: 24px 0 0; font-size: clamp(30px, 6vw, 42px); line-height: 1.15; }
      a { display: inline-flex; align-items: center; min-height: 42px; margin-top: 24px; border-radius: 6px; background: #155b3d; padding: 0 16px; color: white; font-size: 14px; font-weight: 600; text-decoration: none; }
      a:hover { background: #104b32; }
      a:focus-visible { outline: 2px solid #155b3d; outline-offset: 3px; }
    </style>
  </head>
  <body>
    <main>
      <span class="eyebrow">Erro 404 · Ponto não encontrado</span>
      <h1>Não encontramos esse ponto de coleta.</h1>
      <p>O endereço pode estar incorreto ou o ponto não está mais disponível. Confira o link ou volte ao início para continuar navegando.</p>
      <a href="/">Voltar ao início</a>
    </main>
  </body>
</html>`;

function createNotFoundResponse(request: NextRequest) {
  return new Response(request.method === 'HEAD' ? null : notFoundPageHtml, {
    status: 404,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'x-robots-tag': 'noindex',
    },
  });
}

export async function proxy(request: NextRequest) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return NextResponse.next();
  }

  if (
    request.nextUrl.searchParams.has('_rsc') ||
    request.headers.has('rsc') ||
    request.headers.has('next-router-prefetch') ||
    request.headers.get('accept')?.includes('text/x-component') ||
    request.headers.get('purpose') === 'prefetch'
  ) {
    return NextResponse.next();
  }

  const encodedSlug = request.nextUrl.pathname.split('/').filter(Boolean)[1];

  if (!encodedSlug) {
    return NextResponse.next();
  }

  let slug: string;

  try {
    slug = decodeURIComponent(encodedSlug);
  } catch {
    return createNotFoundResponse(request);
  }

  const point = await findPointBySlug(slug);

  return point ? NextResponse.next() : createNotFoundResponse(request);
}

export const config = {
  matcher: '/points/:id',
};
