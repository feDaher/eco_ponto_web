'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Loader2 } from 'lucide-react';
import {
  FormError,
  PasswordChecklist,
  PasswordField,
} from '@/components/auth/AuthField';
import { buttonVariants } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { changePasswordSchema, type ChangePasswordValues } from '@/lib/account';
import { PASSWORD_RULES } from '@/lib/authSchemas';
import { cn } from '@/lib/utils';
import { AccountApiError, changePassword } from '@/services/account';

type ChangePasswordDialogProps = {
  onClose: () => void;
  onChanged: () => void;
  onSignedOut: () => void;
};

export function ChangePasswordDialog({
  onClose,
  onChanged,
  onSignedOut,
}: ChangePasswordDialogProps) {
  const { token, logout, replaceSession } = useAuth();
  const {
    register,
    control,
    handleSubmit,
    setError,
    trigger,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const newPassword = useWatch({ control, name: 'newPassword' });

  async function submit({
    currentPassword,
    newPassword,
  }: ChangePasswordValues) {
    if (!token) return;

    try {
      const session = await changePassword(token, currentPassword, newPassword);
      replaceSession(session);
      onChanged();
    } catch (error) {
      if (!(error instanceof AccountApiError)) {
        setError('root.server', {
          message: 'Não foi possível trocar a senha. Tente novamente.',
        });
        return;
      }
      if (error.signedOut) {
        onSignedOut();
        return;
      }
      if (error.status === 401) {
        logout();
        return;
      }
      if (error.status === 422) {
        setError(
          'currentPassword',
          { type: 'server', message: error.message },
          { shouldFocus: true }
        );
        return;
      }
      setError('root.server', { message: error.message });
    }
  }

  return (
    <Modal
      title="Atualizar senha"
      subtitle="Senha de acesso"
      icon={KeyRound}
      onClose={onClose}
    >
      <form
        onSubmit={(event) => handleSubmit(submit)(event)}
        noValidate
        className="mt-5 space-y-4"
      >
        <p className="text-sm leading-6 text-slate-600">
          Você continua conectado neste aparelho. Nos outros, será preciso
          entrar de novo com a nova senha.
        </p>
        <PasswordField
          id="current-password"
          label="Senha atual"
          autoComplete="current-password"
          maxLength={128}
          autoFocus
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />
        <PasswordField
          id="new-password"
          label="Nova senha"
          autoComplete="new-password"
          maxLength={128}
          error={errors.newPassword?.message}
          hint={
            <PasswordChecklist value={newPassword} rules={PASSWORD_RULES} />
          }
          {...register('newPassword', {
            onChange: () => {
              if (touchedFields.confirmPassword) {
                void trigger('confirmPassword');
              }
            },
          })}
        />
        <PasswordField
          id="confirm-new-password"
          label="Confirmar nova senha"
          autoComplete="new-password"
          maxLength={128}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <FormError message={errors.root?.server?.message} />

        <div className="flex flex-col-reverse justify-end gap-2 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'lg' }),
              'select-none'
            )}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className={cn(buttonVariants({ size: 'lg' }), 'select-none')}
          >
            {isSubmitting && (
              <Loader2 aria-hidden="true" className="animate-spin" />
            )}
            {isSubmitting ? 'Atualizando...' : 'Atualizar senha'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
