export default function PointPageLoading() {
  //A tela de loading do ponto de coleta
  return (
    <div
      role="status"
      aria-live="polite"
      className="space-y-8 motion-reduce:animate-none"
    >
      {/* Marca o conteúdo como estado de carregamento. */}
      <span className="sr-only">Carregando ficha do ponto de coleta...</span>

      {/* Cria o esqueleto pulsante do cabeçalho. */}
      <section className="space-y-6">
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        <div className="h-16 animate-pulse rounded-lg bg-emerald-50" />
        <div className="space-y-3">
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
          <div className="flex gap-3">
            <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
            <div className="h-9 w-40 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </section>

      {/* Reserva espaço para localização e imagem. */}
      <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <div className="min-h-[300px] animate-pulse rounded-lg bg-muted sm:min-h-[360px]" />
        <div className="min-h-[300px] animate-pulse rounded-lg bg-muted" />
      </section>

      {/* Simula dois blocos de conteúdo lado a lado. */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="min-h-72 animate-pulse rounded-lg bg-muted" />
        <div className="min-h-72 animate-pulse rounded-lg bg-muted" />
      </section>

      {/* Reserva espaço para as demais seções da ficha. */}
      <section className="min-h-64 animate-pulse rounded-lg bg-muted" />
      <section className="min-h-64 animate-pulse rounded-lg bg-emerald-100" />
      <section className="min-h-80 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
