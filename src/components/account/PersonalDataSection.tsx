'use client';

import type { UseFormReturn } from 'react-hook-form';
import { IdCard } from 'lucide-react';
import { AuthField } from '@/components/auth/AuthField';
import { SectionCard } from '@/components/point/SectionCard';
import type { AccountValues } from '@/lib/account';
import { formatPhone } from '@/lib/authSchemas';

type PersonalDataSectionProps = {
  form: UseFormReturn<AccountValues>;
  email: string;
};

export function PersonalDataSection({ form, email }: PersonalDataSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;
  const phoneField = register('phone');

  return (
    <SectionCard
      id="personal"
      title="Dados pessoais"
      description="Informações usadas no seu cadastro e nos comprovantes de descarte."
      icon={IdCard}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField
          id="account-name"
          label="Nome completo"
          autoComplete="name"
          maxLength={191}
          error={errors.name?.message}
          {...register('name')}
        />
        <AuthField
          id="account-nickname"
          label="Nome social ou apelido"
          autoComplete="nickname"
          maxLength={60}
          placeholder="Opcional"
          hint="Como você prefere ser chamado(a)."
          error={errors.nickname?.message}
          {...register('nickname')}
        />
        <AuthField
          id="account-email"
          label="E-mail"
          type="email"
          value={email}
          readOnly
          aria-readonly="true"
          hint="É o seu login e não pode ser alterado por aqui."
        />
        <AuthField
          id="account-phone"
          label="Telefone / WhatsApp"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="(33) 99999-9999"
          maxLength={15}
          error={errors.phone?.message}
          {...phoneField}
          onChange={(event) => {
            event.target.value = formatPhone(event.target.value);
            return phoneField.onChange(event);
          }}
        />
        <AuthField
          id="account-city"
          label="Cidade"
          autoComplete="address-level2"
          maxLength={191}
          error={errors.city?.message}
          {...register('city')}
        />
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-sm text-slate-700 select-none">
        <input
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 cursor-pointer accent-brand-solid"
          {...register('cooperativeContact')}
        />
        Permitir que cooperativas parceiras entrem em contato para agendar
        coletas.
      </label>
    </SectionCard>
  );
}
