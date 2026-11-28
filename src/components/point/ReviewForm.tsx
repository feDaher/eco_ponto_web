'use client';

import { useState, type SubmitEvent } from 'react';
import {
  Info,
  Loader2,
  LogIn,
  MessageSquareText,
  PenLine,
  Star,
} from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { firstName } from '@/lib/account';
import { cn } from '@/lib/utils';
import {
  REVIEW_COMMENT_MAX,
  ReviewApiError,
  publishPointReview,
} from '@/services/reviews';
import type { Review } from '@/types/api';
import { FIELD_CLASS, LABEL_CLASS } from './fieldStyles';

const STARS: Review['rating'][] = [1, 2, 3, 4, 5];

const WRAPPER_CLASS = 'mt-6 border-t border-slate-100 pt-5';

type ReviewFormProps = {
  pointId: string;
  pointName: string;
  live: boolean;
  onPublished: (review: Review) => Promise<void>;
};

export function ReviewForm({
  pointId,
  pointName,
  live,
  onPublished,
}: ReviewFormProps) {
  const { status, user, token, logout } = useAuth();

  if (status === 'loading') return null;

  if (!live) {
    return (
      <Note>
        Este ponto ainda é de demonstração. As avaliações serão liberadas quando
        ele for cadastrado na plataforma.
      </Note>
    );
  }

  if (!user || !token) return <GuestPrompt />;

  if (user.role !== 'CITIZEN') {
    return <Note>Só cidadãos podem avaliar pontos de coleta.</Note>;
  }

  return (
    <CitizenForm
      key={user.id}
      token={token}
      name={firstName(user.nickname || user.name)}
      pointId={pointId}
      pointName={pointName}
      onPublished={onPublished}
      onUnauthorized={logout}
    />
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p
      className={cn(
        WRAPPER_CLASS,
        'flex items-start gap-2 text-sm text-slate-500'
      )}
    >
      <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

function GuestPrompt() {
  const [open, setOpen] = useState(false);

  return (
    <div className={WRAPPER_CLASS}>
      <Button type="button" size="lg" onClick={() => setOpen(true)}>
        <LogIn aria-hidden="true" />
        Entrar para avaliar
      </Button>
      <p className="mt-2 text-xs text-slate-500">
        Só cidadãos cadastrados podem avaliar os pontos de coleta.
      </p>

      {open && (
        <Modal
          title="Entre para avaliar"
          subtitle="Use sua conta de cidadão do EcoPonto."
          icon={LogIn}
          onClose={() => setOpen(false)}
        >
          <LoginForm onSuccess={() => setOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

type CitizenFormProps = {
  token: string;
  name: string;
  pointId: string;
  pointName: string;
  onPublished: (review: Review) => Promise<void>;
  onUnauthorized: () => void;
};

function CitizenForm({
  token,
  name,
  pointId,
  pointName,
  onPublished,
  onUnauthorized,
}: CitizenFormProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<Review['rating']>(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const comment = String(new FormData(form).get('comentario') ?? '');

    setSubmitting(true);
    setError(null);

    try {
      const { review, created } = await publishPointReview(token, pointId, {
        rating,
        comment,
      });
      form.reset();
      setRating(5);
      setOpen(false);
      setNotice(
        created
          ? 'Avaliação enviada. Obrigado por contribuir!'
          : 'Você já tinha avaliado este ponto, então sua avaliação foi atualizada.'
      );
      await onPublished(review);
    } catch (cause) {
      if (cause instanceof ReviewApiError && cause.status === 401) {
        onUnauthorized();
        return;
      }
      setError(
        cause instanceof ReviewApiError
          ? cause.message
          : 'Não foi possível enviar sua avaliação. Tente novamente.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={WRAPPER_CLASS}>
      <Button
        type="button"
        size="lg"
        variant={open ? 'outline' : 'default'}
        onClick={() => {
          setOpen((value) => !value);
          setError(null);
          setNotice(null);
        }}
        aria-expanded={open}
        aria-controls="review-form"
      >
        <PenLine aria-hidden="true" />
        {open ? 'Fechar avaliação' : 'Avaliar este ponto'}
      </Button>

      {notice && (
        <p role="status" className="mt-3 text-sm font-medium text-brand">
          {notice}
        </p>
      )}

      {open && (
        <form
          id="review-form"
          onSubmit={(event) => void submit(event)}
          className="mt-5 grid gap-4 rounded-2xl bg-surface-alt p-4 sm:p-5"
        >
          <div>
            <h3 className="font-semibold text-slate-900">
              Conte sua experiência, {name}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Sua avaliação ajuda outras pessoas a conhecer o {pointName}. Se
              você já avaliou, a nova avaliação substitui a anterior.
            </p>
          </div>

          <fieldset disabled={submitting}>
            <legend className="text-sm font-medium text-slate-800">
              Sua nota
            </legend>
            <div className="mt-2 flex gap-1">
              {STARS.map((star) => (
                <label
                  key={star}
                  className="cursor-pointer rounded-lg p-1 text-amber-500 transition-colors hover:bg-amber-100 has-focus-visible:outline-2 has-focus-visible:outline-amber-700 dark:hover:bg-amber-950/40"
                >
                  <input
                    type="radio"
                    name="nota"
                    value={star}
                    checked={rating === star}
                    onChange={() => setRating(star)}
                    className="sr-only"
                  />
                  <span className="sr-only">
                    {star} {star === 1 ? 'estrela' : 'estrelas'}
                  </span>
                  <Star
                    aria-hidden="true"
                    className={cn(
                      'size-7',
                      star <= rating ? 'fill-current' : 'fill-transparent'
                    )}
                  />
                </label>
              ))}
            </div>
          </fieldset>

          <label className={LABEL_CLASS}>
            Comentário (opcional)
            <textarea
              name="comentario"
              maxLength={REVIEW_COMMENT_MAX}
              rows={4}
              disabled={submitting}
              placeholder="Conte como foi sua experiência neste ponto..."
              className={cn(FIELD_CLASS, 'resize-y')}
            />
            <span className="text-xs font-normal text-slate-500">
              Até {REVIEW_COMMENT_MAX} caracteres. Seu primeiro nome aparece
              junto da avaliação.
            </span>
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300"
            >
              {error}
            </p>
          )}

          <div>
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? (
                <Loader2 aria-hidden="true" className="animate-spin" />
              ) : (
                <MessageSquareText aria-hidden="true" />
              )}
              {submitting ? 'Enviando...' : 'Enviar avaliação'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
