import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Entrar | EcoPonto Digital',
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="flex bg-background">
      <div className="flex w-full shrink-0 items-center px-6 py-12 md:w-[480px] lg:w-[520px] lg:px-12">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
      <AuthPanel
        title="Transformando descartes em impacto sustentável."
        description="Acesse seu painel para acompanhar seus descartes, gerenciar seu ponto de coleta ou administrar a rede de pontos da cidade."
      />
    </div>
  );
}
