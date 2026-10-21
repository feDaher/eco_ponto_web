import { z } from 'zod';

const LETTERS = /^[\p{L}\s'.-]+$/u;

export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export const PASSWORD_RULES = [
  {
    label: 'Pelo menos 8 caracteres',
    test: (value: string) => value.length >= 8,
  },
  {
    label: 'Pelo menos uma letra',
    test: (value: string) => /\p{L}/u.test(value),
  },
  {
    label: 'Pelo menos um número',
    test: (value: string) => /\d/.test(value),
  },
];

const email = z
  .string()
  .trim()
  .min(1, 'Informe seu e-mail.')
  .max(191, 'O e-mail pode ter no máximo 191 caracteres.')
  .pipe(z.email('Digite um e-mail válido, como nome@email.com.'));

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Informe sua senha.'),
});

export const registerSchema = z
  .object({
    role: z.enum(['CITIZEN', 'COLLECTOR']),
    name: z
      .string()
      .trim()
      .min(1, 'Informe seu nome.')
      .max(191, 'O nome pode ter no máximo 191 caracteres.')
      .regex(LETTERS, 'Use apenas letras no nome, sem números ou símbolos.')
      .refine(
        (value) => value.split(/\s+/).filter(Boolean).length >= 2,
        'Digite nome e sobrenome, como "João Silva".'
      ),
    email,
    phone: z
      .string()
      .min(1, 'Informe seu telefone com DDD.')
      .refine(
        (value) => [10, 11].includes(onlyDigits(value).length),
        'Digite o telefone completo com DDD, como (33) 99999-9999.'
      ),
    city: z
      .string()
      .trim()
      .min(1, 'Informe sua cidade.')
      .min(2, 'Digite o nome completo da cidade.')
      .max(191, 'O nome da cidade pode ter no máximo 191 caracteres.')
      .regex(LETTERS, 'Use apenas letras no nome da cidade.'),
    password: z
      .string()
      .min(1, 'Crie uma senha.')
      .max(128, 'A senha pode ter no máximo 128 caracteres.')
      .refine(
        (value) => PASSWORD_RULES.every((rule) => rule.test(value)),
        'A senha precisa ter pelo menos 8 caracteres, com letras e números.'
      ),
    confirmPassword: z.string().min(1, 'Repita a senha para confirmar.'),
    terms: z.boolean().refine(Boolean, {
      error:
        'Para criar a conta, aceite os Termos de Uso e a Política de Privacidade.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'As senhas não coincidem. Digite a mesma senha nos dois campos.',
    path: ['confirmPassword'],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
