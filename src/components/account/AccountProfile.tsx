'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, Loader2, Save, Undo2 } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import {
  accountDefaults,
  accountSchema,
  buildDataExport,
  type AccountValues,
} from '@/lib/account';
import { onlyDigits } from '@/lib/authSchemas';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import {
  AccountApiError,
  deleteAccount,
  getDisposalSummary,
  updateProfile,
} from '@/services/account';
import { PASSWORD_CHANGED_REASON } from '@/services/auth';
import type { User } from '@/types/user';
import { AppInfo } from './AppInfo';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { DangerZone } from './DangerZone';
import { NotificationSection } from './NotificationSection';
import { PersonalDataSection } from './PersonalDataSection';
import { PrivacyCard } from './PrivacyCard';
import { ProfileOverview, type SummaryState } from './ProfileOverview';
import { SecuritySection } from './SecuritySection';

const FORM_ID = 'account-form';
const NOTICE_MS = 6000;

type Notice = { message: string; tone: 'success' | 'error' };

type AccountProfileProps = {
  version: string;
};

export function AccountProfile({ version }: AccountProfileProps) {
  const { user } = useAuth();
  if (!user) return null;

  return <AccountProfileContent user={user} version={version} />;
}

function AccountProfileContent({
  user,
  version,
}: {
  user: User;
  version: string;
}) {
  const { token, logout, updateUser } = useAuth();
  const router = useRouter();
  const isCitizen = user.role === 'CITIZEN';
  const form = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    mode: 'onTouched',
    defaultValues: accountDefaults(user),
  });
  const {
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty, isSubmitting },
  } = form;

  const [summary, setSummary] = useState<SummaryState | null>(
    isCitizen ? { status: 'loading' } : null
  );
  const [reloadKey, setReloadKey] = useState(0);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const noticeTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  useEffect(() => {
    if (!isCitizen || !token) return;
    let active = true;

    getDisposalSummary(token)
      .then((data) => {
        if (active) setSummary({ status: 'ready', data });
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof AccountApiError && error.status === 401) {
          logout();
          return;
        }
        setSummary({
          status: 'error',
          message:
            error instanceof AccountApiError
              ? error.message
              : 'Não foi possível carregar seu resumo.',
        });
      });

    return () => {
      active = false;
    };
  }, [isCitizen, token, logout, reloadKey]);

  function showNotice(message: string, tone: Notice['tone'] = 'success') {
    window.clearTimeout(noticeTimer.current);
    setNotice({ message, tone });
    noticeTimer.current = window.setTimeout(() => setNotice(null), NOTICE_MS);
  }

  function showError(error: unknown, fallback: string) {
    if (error instanceof AccountApiError && error.status === 401) {
      logout();
      return;
    }
    showNotice(
      error instanceof AccountApiError ? error.message : fallback,
      'error'
    );
  }

  function retrySummary() {
    setSummary({ status: 'loading' });
    setReloadKey((key) => key + 1);
  }

  async function save(values: AccountValues) {
    if (!token) return;

    try {
      const saved = await updateProfile(token, user, {
        name: values.name.trim(),
        nickname: values.nickname.trim() || null,
        phone: onlyDigits(values.phone),
        city: values.city.trim(),
        preferences: {
          collectionAlerts: values.collectionAlerts,
          monthlyReports: values.monthlyReports,
          cooperativeContact: values.cooperativeContact,
        },
      });
      updateUser(saved);
      reset(accountDefaults(saved));
      showNotice('Alterações salvas.');
    } catch (error) {
      showError(error, 'Não foi possível salvar seus dados.');
    }
  }

  async function removeAccount() {
    if (!token) return;

    try {
      await deleteAccount(token);
      router.replace(ROUTES.login);
      logout();
    } catch (error) {
      showError(error, 'Não foi possível excluir a conta.');
    }
  }

  function passwordChanged() {
    setPasswordOpen(false);
    showNotice('Senha atualizada. Use a nova senha no próximo acesso.');
  }

  function passwordSignedOut() {
    const params = new URLSearchParams({
      reason: PASSWORD_CHANGED_REASON,
      next: ROUTES.account,
    });
    router.replace(`${ROUTES.login}?${params}`);
    logout();
  }

  function discard() {
    reset();
    showNotice('Alterações descartadas.');
  }

  function downloadData() {
    const blob = new Blob([buildDataExport(user, getValues())], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'meus-dados-ecoponto.json';
    link.click();
    URL.revokeObjectURL(url);
    showNotice('Arquivo com seus dados baixado.');
  }

  return (
    <div className="bg-surface">
      <div className="container mx-auto space-y-6 px-4 py-8 md:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="Trilha de navegação"
            className="text-sm text-slate-500"
          >
            <ol className="flex items-center gap-2">
              <li>
                <Link href={ROUTES.home} className="hover:text-brand">
                  Início
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-slate-800">
                Minha conta
              </li>
            </ol>
          </nav>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={discard}
              disabled={!isDirty || isSubmitting}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'select-none'
              )}
            >
              <Undo2 aria-hidden="true" />
              Descartar mudanças
            </button>
            <button
              type="submit"
              form={FORM_ID}
              disabled={!isDirty || isSubmitting}
              aria-busy={isSubmitting}
              className={cn(buttonVariants({ size: 'lg' }), 'select-none')}
            >
              {isSubmitting ? (
                <Loader2 aria-hidden="true" className="animate-spin" />
              ) : (
                <Save aria-hidden="true" />
              )}
              {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
          <div className="space-y-6">
            <ProfileOverview
              user={user}
              summary={summary}
              onRetry={retrySummary}
            />
            <PrivacyCard onDownload={downloadData} />
            <DangerZone onConfirm={removeAccount} />
            <AppInfo version={version} />
          </div>

          <form
            id={FORM_ID}
            onSubmit={(event) => handleSubmit(save)(event)}
            noValidate
            className="space-y-6"
          >
            <PersonalDataSection form={form} email={user.email} />
            <NotificationSection form={form} />
            <SecuritySection onChangePassword={() => setPasswordOpen(true)} />
          </form>
        </div>
      </div>

      {passwordOpen && (
        <ChangePasswordDialog
          onClose={() => setPasswordOpen(false)}
          onChanged={passwordChanged}
          onSignedOut={passwordSignedOut}
        />
      )}

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed right-5 bottom-5 z-40 max-w-[calc(100%-2.5rem)]"
      >
        {notice && (
          <p
            className={cn(
              'flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl',
              notice.tone === 'error' ? 'bg-red-700' : 'bg-brand-deep'
            )}
          >
            {notice.tone === 'error' ? (
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
            ) : (
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            )}
            {notice.message}
          </p>
        )}
      </div>
    </div>
  );
}
