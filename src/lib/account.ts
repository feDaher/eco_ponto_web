import { z } from 'zod';
import {
  cityField,
  formatPhone,
  nameField,
  phoneField,
} from '@/lib/authSchemas';
import type { User } from '@/types/user';

export const POINTS_PER_LEVEL = 1000;

export const DEMO_NOTICE = 'Demonstração: nada foi salvo.';

export const accountSchema = z.object({
  name: nameField,
  nickname: z
    .string()
    .trim()
    .max(60, 'O apelido pode ter no máximo 60 caracteres.'),
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
    nickname: '',
    phone: formatPhone(user.phone),
    city: user.city,
    cooperativeContact: false,
    collectionAlerts: true,
    monthlyReports: true,
  };
}

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
