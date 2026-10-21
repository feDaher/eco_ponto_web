import type { Metadata } from 'next';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Cadastrar-se | EcoPonto Digital',
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <div className="flex bg-background">
      <AuthPanel
        title="Faça parte da rede de descarte consciente."
        description="Cidadãos encontram onde descartar cada material. Pontos de coleta mantêm horários e categorias sempre atualizados."
      />
      <div className="flex w-full shrink-0 items-center px-6 py-12 md:w-[480px] lg:w-[520px] lg:px-12">
        <RegisterForm />
      </div>
    </div>
  );
}
