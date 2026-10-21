'use client';

import { useState, type SubmitEvent } from 'react';
import { Ban, Check, CircleCheck, Pencil, Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FIELD_CLASS, LABEL_CLASS } from '@/components/point/fieldStyles';
import { categoryNameSchema, findDuplicateName } from '@/lib/categorySchemas';
import { pluralize } from '@/lib/points';
import { cn } from '@/lib/utils';
import type { WasteCategory } from '@/types/api';

type StatusFilter = 'all' | 'active' | 'inactive';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Ativas' },
  { value: 'inactive', label: 'Desativadas' },
];

const DEMO_NOTICE = 'Demonstração: nada foi salvo.';

type EditingState = {
  id: string;
  name: string;
  error?: string;
};

type CategoryTableProps = {
  initialCategories: WasteCategory[];
  pointCounts: Record<string, number>;
};

function validateName(
  name: string,
  categories: WasteCategory[],
  ignoreId?: string
) {
  const parsed = categoryNameSchema.safeParse(name);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  if (findDuplicateName(parsed.data, categories, ignoreId)) {
    return { error: 'Já existe uma categoria com esse nome.' };
  }

  return { value: parsed.data };
}

export function CategoryTable({
  initialCategories,
  pointCounts,
}: CategoryTableProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [message, setMessage] = useState<string | null>(null);

  const search = query.trim().toLocaleLowerCase('pt-BR');
  const visible = categories.filter(
    (category) =>
      (status === 'all' || category.active === (status === 'active')) &&
      (!search || category.name.toLocaleLowerCase('pt-BR').includes(search))
  );

  function createCategory(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const { value, error } = validateName(newName, categories);

    if (!value) {
      setCreateError(error ?? null);
      return;
    }

    setCategories((current) => [
      ...current,
      { id: crypto.randomUUID(), name: value, active: true },
    ]);
    setNewName('');
    setCreateError(null);
    setMessage(`Categoria "${value}" cadastrada. ${DEMO_NOTICE}`);
  }

  function saveEdit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    const { value, error } = validateName(editing.name, categories, editing.id);

    if (!value) {
      setEditing({ ...editing, error });
      return;
    }

    setCategories((current) =>
      current.map((category) =>
        category.id === editing.id ? { ...category, name: value } : category
      )
    );
    setEditing(null);
    setMessage(`Categoria renomeada para "${value}". ${DEMO_NOTICE}`);
  }

  function deactivate(category: WasteCategory) {
    setCategories((current) =>
      current.map((item) =>
        item.id === category.id ? { ...item, active: false } : item
      )
    );
    setConfirmingId(null);
    setMessage(
      `Categoria "${category.name}" desativada: ela sai do mapa e não pode mais ser aplicada a pontos ativos. ${DEMO_NOTICE}`
    );
  }

  return (
    <div className="space-y-5">
      <form
        onSubmit={createCategory}
        noValidate
        className="flex flex-col gap-3 rounded-2xl bg-surface-alt p-4 sm:flex-row sm:items-end"
      >
        <label className={cn(LABEL_CLASS, 'flex-1')}>
          Nova categoria
          <input
            value={newName}
            onChange={(event) => {
              setNewName(event.target.value);
              setCreateError(null);
            }}
            maxLength={191}
            placeholder="Ex.: Lâmpadas fluorescentes"
            aria-invalid={createError ? true : undefined}
            aria-describedby={createError ? 'new-category-error' : undefined}
            className={FIELD_CLASS}
          />
        </label>
        <Button className="cursor-pointer" type="submit" size="lg">
          <Plus aria-hidden="true" />
          Cadastrar
        </Button>
      </form>
      {createError && (
        <p
          id="new-category-error"
          role="alert"
          className="-mt-3 text-sm text-red-700 dark:text-red-300"
        >
          {createError}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar categoria</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar categoria"
            className={cn(FIELD_CLASS, 'w-full pl-9')}
          />
        </label>
        <label className="sm:w-48">
          <span className="sr-only">Filtrar por situação</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            className={cn(FIELD_CLASS, 'w-full')}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {message && (
        <p
          role="status"
          className="rounded-xl bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark"
        >
          {message}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full min-w-xl text-left text-sm">
          <thead className="bg-surface-alt text-[11px] tracking-wider text-slate-500 uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold">
                Categoria
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                Pontos ativos
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                Situação
              </th>
              <th scope="col" className="px-4 py-3 text-right font-bold">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-card">
            {visible.map((category) => {
              const isEditing = editing?.id === category.id;
              const isConfirming = confirmingId === category.id;
              const count = pointCounts[category.id] ?? 0;

              return (
                <tr key={category.id}>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <form
                        id={`edit-${category.id}`}
                        onSubmit={saveEdit}
                        noValidate
                      >
                        <input
                          value={editing.name}
                          onChange={(event) =>
                            setEditing({
                              id: category.id,
                              name: event.target.value,
                            })
                          }
                          maxLength={191}
                          aria-label={`Novo nome de ${category.name}`}
                          aria-invalid={editing.error ? true : undefined}
                          aria-describedby={
                            editing.error
                              ? `edit-${category.id}-error`
                              : undefined
                          }
                          autoFocus
                          className={cn(FIELD_CLASS, 'w-full')}
                        />
                        {editing.error && (
                          <p
                            id={`edit-${category.id}-error`}
                            role="alert"
                            className="mt-1 text-xs text-red-700 dark:text-red-300"
                          >
                            {editing.error}
                          </p>
                        )}
                      </form>
                    ) : (
                      <span className="font-semibold text-slate-900">
                        {category.name}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {pluralize(count, 'ponto', 'pontos')}
                  </td>
                  <td className="px-4 py-3">
                    {category.active ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand-dark">
                        <CircleCheck aria-hidden="true" className="size-3" />
                        Ativa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">
                        <Ban aria-hidden="true" className="size-3" />
                        Desativada
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            className="cursor-pointer"
                            type="submit"
                            form={`edit-${category.id}`}
                            size="sm"
                          >
                            <Check aria-hidden="true" />
                            Salvar
                          </Button>
                          <Button
                            className="cursor-pointer"
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditing(null)}
                          >
                            <X aria-hidden="true" />
                            Cancelar
                          </Button>
                        </>
                      ) : isConfirming ? (
                        <>
                          <span className="text-xs text-slate-600">
                            {count > 0
                              ? `Usada por ${pluralize(count, 'ponto ativo', 'pontos ativos')}. Desativar?`
                              : 'Desativar?'}
                          </span>
                          <Button
                            className="cursor-pointer"
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => deactivate(category)}
                          >
                            Confirmar
                          </Button>
                          <Button
                            className="cursor-pointer"
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirmingId(null)}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            className="cursor-pointer"
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setConfirmingId(null);
                              setEditing({
                                id: category.id,
                                name: category.name,
                              });
                            }}
                          >
                            <Pencil aria-hidden="true" />
                            Editar
                            <span className="sr-only"> {category.name}</span>
                          </Button>
                          {category.active && (
                            <Button
                              className="cursor-pointer"
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setEditing(null);
                                setConfirmingId(category.id);
                              }}
                            >
                              <Ban aria-hidden="true" />
                              Desativar
                              <span className="sr-only"> {category.name}</span>
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visible.length === 0 && (
          <p className="bg-card px-4 py-8 text-center text-sm text-slate-500">
            Nenhuma categoria encontrada com esses filtros.
          </p>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Categorias desativadas deixam de aparecer no mapa e não podem ser
        aplicadas novamente a pontos ativos.
      </p>
    </div>
  );
}
