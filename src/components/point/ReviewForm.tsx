'use client';

import { useState, type SubmitEvent } from 'react';
import { MessageSquareText, PenLine, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { FIELD_CLASS, LABEL_CLASS } from './fieldStyles';

const STARS = [1, 2, 3, 4, 5];

type ReviewFormProps = {
  pointName: string;
};

export function ReviewForm({ pointName }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function submitReview(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <Button
        type="button"
        size="lg"
        variant={isOpen ? 'outline' : 'default'}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="review-form"
      >
        <PenLine aria-hidden="true" />
        {isOpen ? 'Fechar avaliação' : 'Avaliar este ponto'}
      </Button>

      {isOpen && (
        <form
          id="review-form"
          onSubmit={submitReview}
          onChange={() => setIsSubmitted(false)}
          className="mt-5 grid gap-4 rounded-2xl bg-surface-alt p-4 sm:p-5"
        >
          <div>
            <h3 className="font-semibold text-slate-900">
              Conte sua experiência
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Avaliação demonstrativa para {pointName}.
            </p>
          </div>

          <fieldset>
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
            Seu nome
            <input
              name="nome"
              required
              maxLength={80}
              autoComplete="name"
              className={FIELD_CLASS}
            />
          </label>

          <label className={LABEL_CLASS}>
            Comentário
            <textarea
              name="comentario"
              required
              minLength={5}
              maxLength={1000}
              rows={4}
              className={cn(FIELD_CLASS, 'resize-y')}
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="lg">
              <MessageSquareText aria-hidden="true" />
              Enviar avaliação de demonstração
            </Button>
            <p className="text-xs text-slate-500">
              Não será salva nem enviada a um servidor.
            </p>
          </div>

          {isSubmitted && (
            <p role="status" className="text-sm font-medium text-brand">
              Demonstração concluída. A avaliação não foi salva.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
