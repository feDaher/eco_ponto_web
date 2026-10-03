'use client';

import { useState, type SubmitEvent } from 'react';
import { MessageSquareText, PenLine, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ReviewFormProps = {
  pointName: string;
};
// formulário de avaliação do ponto de coleta
export function ReviewForm({ pointName }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function submitReview(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  return (
    <div className="mt-6 border-t pt-5">
      <Button
        type="button"
        variant={isOpen ? 'outline' : 'default'}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-expanded={isOpen}
        className="gap-2"
      >
        <PenLine aria-hidden="true" className="size-4" />
        {isOpen ? 'Fechar avaliação' : 'Avaliar este ponto'}
      </Button>

      {isOpen && (
        <form
          onSubmit={submitReview}
          className="mt-5 grid gap-4 rounded-md bg-muted/50 p-4 sm:p-5"
        >
          <div>
            <h3 className="font-semibold">Conte sua experiência</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Avaliação demonstrativa para {pointName}.
            </p>
          </div>

          <fieldset>
            <legend className="text-sm font-medium">Sua nota</legend>
            <div
              role="radiogroup"
              aria-label="Nota de 1 a 5 estrelas"
              className="mt-2 flex gap-1"
            >
              {[1, 2, 3, 4, 5].map((starValue) => (
                <button
                  key={starValue}
                  type="button"
                  role="radio"
                  aria-checked={rating === starValue}
                  aria-label={`${starValue} ${starValue === 1 ? 'estrela' : 'estrelas'}`}
                  onClick={() => {
                    setRating(starValue);
                    setIsSubmitted(false);
                  }}
                  className="rounded-sm p-1 text-amber-500 transition-colors hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                >
                  <Star
                    aria-hidden="true"
                    className={`size-7 ${starValue <= rating ? 'fill-current' : 'fill-transparent'}`}
                  />
                </button>
              ))}
            </div>
          </fieldset>

          <label className="grid gap-1.5 text-sm font-medium">
            Seu nome
            <input
              name="nome"
              required
              maxLength={80}
              autoComplete="name"
              className="min-h-10 rounded-md border bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium">
            Comentário
            <textarea
              name="comentario"
              required
              minLength={5}
              maxLength={1000}
              rows={4}
              className="resize-y rounded-md border bg-background px-3 py-2 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" className="gap-2">
              <MessageSquareText aria-hidden="true" className="size-4" />
              Enviar avaliação de demonstração
            </Button>
            <p className="text-xs text-muted-foreground">
              Não será salva nem enviada a um servidor.
            </p>
          </div>

          {isSubmitted && (
            <p role="status" className="text-sm font-medium text-emerald-800">
              Demonstração concluída. A avaliação não foi persistida.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
