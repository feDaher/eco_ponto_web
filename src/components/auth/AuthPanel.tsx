import { MapPin, Recycle, ShieldCheck, type LucideIcon } from 'lucide-react';

const FEATURES: { icon: LucideIcon; text: string }[] = [
  { icon: MapPin, text: 'Encontre pontos de coleta perto de você' },
  { icon: Recycle, text: 'Descarte recicláveis e eletrônicos do jeito certo' },
  {
    icon: ShieldCheck,
    text: 'Pontos revisados pela administração antes de entrar no mapa',
  },
];

type AuthPanelProps = {
  title: string;
  description: string;
};

export function AuthPanel({ title, description }: AuthPanelProps) {
  return (
    <aside className="hidden flex-1 flex-col justify-center bg-linear-to-br from-brand-solid to-brand-deep p-12 text-brand-foreground md:flex lg:p-16 xl:p-20">
      <div className="max-w-lg space-y-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand-pale">
          <span className="size-2 rounded-full bg-brand-pale" />
          EcoPonto Digital · Manhuaçu-MG
        </span>
        <h2 className="text-4xl leading-tight font-extrabold tracking-tight lg:text-5xl">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-brand-pale/90">
          {description}
        </p>
        <ul className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
