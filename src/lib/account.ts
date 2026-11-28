import { z } from 'zod';
import {
  LETTERS,
  cityField,
  formatPhone,
  nameField,
  newPasswordField,
  phoneField,
} from '@/lib/authSchemas';
import type { User, UserPreferences } from '@/types/user';

export const POINTS_PER_LEVEL = 1000;

export const DEFAULT_PREFERENCES: UserPreferences = {
  collectionAlerts: true,
  monthlyReports: true,
  cooperativeContact: false,
};

export const accountSchema = z.object({
  name: nameField,
  nickname: z
    .string()
    .trim()
    .max(60, 'O apelido pode ter no máximo 60 caracteres.')
    .refine(
      (value) => value === '' || LETTERS.test(value),
      "Use apenas letras, espaços e os caracteres ' . - no apelido."
    ),
  phone: phoneField,
  city: cityField,
  cooperativeContact: z.boolean(),
  collectionAlerts: z.boolean(),
  monthlyReports: z.boolean(),
});

export type AccountValues = z.infer<typeof accountSchema>;

export function accountDefaults(user: User): AccountValues {
  return {
    name: user.name,
    nickname: user.nickname ?? '',
    phone: formatPhone(user.phone),
    city: user.city,
    ...DEFAULT_PREFERENCES,
    ...user.preferences,
  };
}

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe sua senha atual.'),
    newPassword: newPasswordField,
    confirmPassword: z.string().min(1, 'Repita a nova senha para confirmar.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: 'As senhas não coincidem. Digite a mesma senha nos dois campos.',
    path: ['confirmPassword'],
  })
  .refine(
    (data) =>
      !data.currentPassword || data.newPassword !== data.currentPassword,
    {
      error: 'A nova senha deve ser diferente da senha atual.',
      path: ['newPassword'],
    }
  );

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export function getLevel(points: number) {
  const safe = Math.max(0, Math.floor(points));
  const level = Math.floor(safe / POINTS_PER_LEVEL) + 1;
  const current = safe % POINTS_PER_LEVEL;

  return {
    level,
    current,
    target: POINTS_PER_LEVEL,
    percent: Math.floor((current / POINTS_PER_LEVEL) * 100),
  };
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters =
    parts.length > 1
      ? [parts[0][0], parts[parts.length - 1][0]]
      : [parts[0]?.[0]];
  return letters.filter(Boolean).join('').toLocaleUpperCase('pt-BR');
}

const kgFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

export function formatKg(value: number) {
  return kgFormat.format(value);
}

export function buildDataExport(user: User, values: AccountValues) {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      account: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
        nickname: values.nickname.trim() || null,
      },
      preferences: {
        cooperativeContact: values.cooperativeContact,
        collectionAlerts: values.collectionAlerts,
        monthlyReports: values.monthlyReports,
      },
    },
    null,
    2
  );
}
