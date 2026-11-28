'use client';

import { useState, type SubmitEvent } from 'react';
import { Loader2, MessageSquareText, PenLine, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { ReviewApiError, createPointReview } from '@/services/reviews';
import type { Review } from '@/types/api';
import { FIELD_CLASS, LABEL_CLASS } from './fieldStyles';
import { LoginModalReviews } from './LoginModalReviews';

const STARS: Review['rating'][] = [1, 2, 3, 4, 5];

type ReviewFormProps = {
  pointId: string;
  pointName: string;
  onAddReview: (review: Review) => void;
};

export function ReviewForm({
  pointId,
  pointName,
  onAddReview,
}: ReviewFormProps) {
  const { status, user, token, logout } = useAuth();

  if (status === 'loading') {
    return null;
  }

  if (status === 'authenticated' && user && token && user.role === 'CITIZEN') {
    return (
      <CitizenReviewForm
        key={user.id}
        token={token}
        firstName={user.name.split(' ')[0]}
        pointId={pointId}
        pointName={pointName}
        onAddReview={onAddReview}
        onUnauthorized={logout}
      />
    );
  }

  if (status === 'authenticated') {
    return null;
  }

  return <GuestReviewPrompt />;
}

function GuestReviewPrompt() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <Button type="button" size="lg" onClick={() => setIsLoginModalOpen(true)}>
        Cadastre-se como usuário para comentar
      </Button>

      <LoginModalReviews
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

type CitizenReviewFormProps = {
  token: string;
  firstName: string;
  pointId: string;
  pointName: string;
  onAddReview: (review: Review) => void;
  onUnauthorized: () => void;
};

function CitizenReviewForm({
  token,
  firstName,
  pointId,
  pointName,
  onAddReview,
  onUnauthorized,
}: CitizenReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<Review['rating']>(5);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submitReview(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const comment = String(formData.get('comentario') ?? '').trim();

    if (comment.length > 0 && comment.length < 5) {
      setErrorMessage(
        'Se escrever um comentário, use pelo menos 5 caracteres.'
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const created = await createPointReview(token, pointId, {
        rating,
        comment,
      });
      onAddReview(created);
      form.reset();
      setRating(5);
      setIsOpen(false);
    } catch (error) {
      if (error instanceof ReviewApiError && error.status === 401) {
        onUnauthorized();
        return;
      }
      setErrorMessage(
        error instanceof ReviewApiError
          ? error.message
          : 'Não foi possível enviar sua avaliação. Tente novamente.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <Button
        type="button"
        size="lg"
        variant={isOpen ? 'outline' : 'default'}
        onClick={() => {
          setIsOpen((open) => !open);
          setErrorMessage(null);
        }}
        aria-expanded={isOpen}
        aria-controls="review-form"
      >
        <PenLine aria-hidden="true" />
        {isOpen ? 'Fechar avaliação' : 'Avaliar este ponto'}
      </Button>

      {isOpen && (
        <form
          id="review-form"
          onSubmit={(e) => void submitReview(e)}
          className="mt-5 grid gap-4 rounded-2xl bg-surface-alt p-4 sm:p-5"
        >
          <div>
            <h3 className="font-semibold text-slate-900">
              Conte sua experiência, {firstName}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Sua avaliação nos ajuda a melhorar o {pointName}.
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
                  className="cursor-pointer rounded-lg p-1 text-amber-500 transition-colors hover:bg-amber-100 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-amber-700"
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
              maxLength={80}
              rows={4}
              disabled={submitting}
              placeholder="Conte como foi sua experiência neste ponto..."
              className={cn(FIELD_CLASS, 'resize-y')}
            />
          </label>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300"
            >
              {errorMessage}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="lg" disabled={submitting}>
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
