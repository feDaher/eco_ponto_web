'use client';

import { useState, type SubmitEvent } from 'react';
import { FilePenLine, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { FIELD_CLASS, LABEL_CLASS } from './fieldStyles';

const TOPICS = [
  { value: 'endereco', label: 'Endereço ou localização' },
  { value: 'horarios', label: 'Horários de funcionamento' },
  { value: 'itens', label: 'Itens aceitos' },
  { value: 'capacidade', label: 'Capacidade ou regras' },
  { value: 'contato', label: 'Contato' },
  { value: 'outros', label: 'Outra informação' },
];

type SuggestionFormProps = {
  pointName: string;
};

export function SuggestionForm({ pointName }: SuggestionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function submitSuggestion(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  return (
    <section
      aria-labelledby="suggestion-heading"
      className="rounded-3xl border border-slate-100 bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="suggestion-heading" className="font-semibold text-slate-900">
            Informações desatualizadas?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Envie uma sugestão de correção para {pointName}.
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          variant={isOpen ? 'outline' : 'secondary'}
          onClick={() => {
            setIsOpen((open) => !open);
            setIsSubmitted(false);
          }}
          aria-expanded={isOpen}
          aria-controls="suggestion-form"
        >
          <FilePenLine aria-hidden="true" />
          {isOpen ? 'Fechar formulário' : 'Sugerir atualização cadastral'}
        </Button>
      </div>

      {isOpen && (
        <form
          id="suggestion-form"
          onSubmit={submitSuggestion}
          onChange={() => setIsSubmitted(false)}
          className="mt-5 grid gap-4 border-t border-slate-100 pt-5"
        >
          <label className={LABEL_CLASS}>
            Qual informação precisa ser atualizada?
            <select
              name="categoria"
              required
              defaultValue=""
              className={FIELD_CLASS}
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>
              {TOPICS.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
          </label>

          <label className={LABEL_CLASS}>
            Descreva a sugestão
            <textarea
              name="sugestao"
              required
              minLength={5}
              maxLength={1000}
              rows={4}
              className={cn(FIELD_CLASS, 'resize-y')}
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="lg">
              <Send aria-hidden="true" />
              Enviar sugestão de demonstração
            </Button>
            <p className="text-xs text-slate-500">
              Demonstração: a sugestão não será salva nem enviada.
            </p>
          </div>

          {isSubmitted && (
            <p role="status" className="text-sm font-medium text-brand">
              Demonstração concluída. Nenhuma sugestão foi salva.
            </p>
          )}
        </form>
      )}
    </section>
  );
}
