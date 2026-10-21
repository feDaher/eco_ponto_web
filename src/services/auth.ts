import type { RegisterInput, Session, User, UserRole } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '';
const TIMEOUT_MS = 10000;
const ROLES: UserRole[] = ['CITIZEN', 'COLLECTOR', 'ADMIN'];

export class AuthError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

const MESSAGES: Record<number, string> = {
  400: 'Confira os dados informados.',
  401: 'E-mail ou senha inválidos.',
  409: 'Este e-mail já está cadastrado.',
  429: 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.',
  502: 'Serviço de autenticação indisponível. Tente novamente em instantes.',
  503: 'Serviço de autenticação indisponível. Tente novamente em instantes.',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toUser(value: unknown): User | null {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.name !== 'string' ||
    typeof value.email !== 'string' ||
    !ROLES.includes(value.role as UserRole)
  ) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    email: value.email,
    phone: typeof value.phone === 'string' ? value.phone : '',
    city: typeof value.city === 'string' ? value.city : '',
    role: value.role as UserRole,
  };
}

async function post(path: string, body: unknown): Promise<unknown> {
  if (!API_URL) {
    throw new AuthError('API não configurada (NEXT_PUBLIC_API_URL).');
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new AuthError(
      'Não foi possível conectar ao servidor. Tente novamente.'
    );
  }

  if (!response.ok) {
    throw new AuthError(
      MESSAGES[response.status] ??
        'Não foi possível concluir. Tente novamente.',
      response.status
    );
  }

  return response.json();
}

export async function loginRequest(
  email: string,
  password: string
): Promise<Session> {
  const data = await post('/auth/login', { email, password });
  const user = isRecord(data) ? toUser(data.user) : null;
  const expiresIn = isRecord(data) ? Number(data.expiresIn) : NaN;

  if (
    !isRecord(data) ||
    typeof data.idToken !== 'string' ||
    !user ||
    !Number.isFinite(expiresIn)
  ) {
    throw new AuthError('Resposta inesperada do servidor.');
  }

  return {
    token: data.idToken,
    expiresAt: Date.now() + expiresIn * 1000,
    user,
  };
}

export async function registerRequest(input: RegisterInput): Promise<void> {
  await post('/auth/register', input);
}
