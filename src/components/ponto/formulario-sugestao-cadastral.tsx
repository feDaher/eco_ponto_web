'use client';

import { useState, type SubmitEvent } from 'react';
import { FilePenLine, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';

type RegistrationSuggestionFormProps = {
  pointName: string;
};
// formulário de sugestão de atualização cadastral do ponto de coleta
export function RegistrationSuggestionForm({
  pointName,
}: RegistrationSuggestionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function submitSuggestion(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  return (
    <section
      aria-labelledby="sugestao-heading"
      className="rounded-lg border bg-card p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="sugestao-heading" className="font-semibold">
            Informações desatualizadas?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Envie uma sugestão de correção para {pointName}.
          </p>
        </div>
        <Button
          type="button"
          variant={isOpen ? 'outline' : 'secondary'}
          onClick={() => {
            setIsOpen((currentValue) => !currentValue);
            setIsSubmitted(false);
          }}
          aria-expanded={isOpen}
          className="gap-2"
        >
          <FilePenLine aria-hidden="true" className="size-4" />
          {isOpen ? 'Fechar formulário' : 'Sugerir atualização cadastral'}
        </Button>
      </div>

      {isOpen && (
        <form
          onSubmit={submitSuggestion}
          className="mt-5 grid gap-4 border-t pt-5"
        >
          <label className="grid gap-1.5 text-sm font-medium">
            Qual informação precisa ser atualizada?
            <select
              name="categoria"
              required
              defaultValue=""
              onChange={() => setIsSubmitted(false)}
              className="min-h-10 rounded-md border bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>
              <option value="endereco">Endereço ou localização</option>
              <option value="horarios">Horários de funcionamento</option>
              <option value="itens">Itens aceitos</option>
              <option value="capacidade">Capacidade ou regras</option>
              <option value="contato">Contato</option>
              <option value="outros">Outra informação</option>
            </select>
          </label>

          <label className="grid gap-1.5 text-sm font-medium">
            Descreva a sugestão
            <textarea
              name="sugestao"
              required
              minLength={5}
              maxLength={1000}
              rows={4}
              onChange={() => setIsSubmitted(false)}
              className="resize-y rounded-md border bg-background px-3 py-2 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" className="gap-2">
              <Send aria-hidden="true" className="size-4" />
              Enviar sugestão de demonstração
            </Button>
            <p className="text-xs text-muted-foreground">
              Demonstração: a sugestão não será salva nem enviada por e-mail.
            </p>
          </div>

          {isSubmitted && (
            <p role="status" className="text-sm font-medium text-emerald-800">
              Demonstração concluída. Nenhuma sugestão foi persistida.
            </p>
          )}
        </form>
      )}
    </section>
  );
}
