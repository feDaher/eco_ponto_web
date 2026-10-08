'use client';

import { APIProvider } from '@vis.gl/react-google-maps';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

export function GoogleMapsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!API_KEY || API_KEY === 'coloque_sua_chave_aqui') {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Defina <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> no{' '}
        <code>.env.local</code> e reinicie o <code>npm run dev</code> para ver o
        mapa.
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} language="pt-BR" region="BR">
      {children}
    </APIProvider>
  );
}
