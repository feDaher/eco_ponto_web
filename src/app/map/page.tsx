import type { Metadata } from 'next';
import { GoogleMapsProvider } from '@/components/map/GoogleMapsProvider';
import { PointsExplorer } from '@/components/map/PointsExplorer';

export const metadata: Metadata = {
  title: 'Locais de Coleta | EcoPonto Digital',
  description:
    'Encontre no mapa os pontos de coleta de recicláveis e eletrônicos mais próximos.',
};

export default function MapPage() {
  return (
    <section className="container mx-auto space-y-6 px-4 py-8 pb-24 md:px-6 lg:pb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Locais de Coleta
        </h1>
        <p className="text-sm text-slate-600 sm:text-base">
          Busque por endereço, CEP ou bairro e veja os pontos no mapa.
        </p>
      </div>

      <GoogleMapsProvider>
        <PointsExplorer />
      </GoogleMapsProvider>
    </section>
  );
}
