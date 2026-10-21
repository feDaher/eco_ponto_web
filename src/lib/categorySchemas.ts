import { z } from 'zod';

export const categoryNameSchema = z
  .string()
  .trim()
  .min(1, 'Informe o nome da categoria.')
  .max(191, 'O nome pode ter no máximo 191 caracteres.');

export function findDuplicateName(
  name: string,
  categories: { id: string; name: string }[],
  ignoreId?: string
) {
  const target = name.toLocaleLowerCase('pt-BR');

  return categories.some(
    (category) =>
      category.id !== ignoreId &&
      category.name.toLocaleLowerCase('pt-BR') === target
  );
}
