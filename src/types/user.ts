export type UserRole = 'CITIZEN' | 'COLLECTOR' | 'ADMIN';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: UserRole;
};

export type Session = {
  token: string;
  expiresAt: number;
  user: User;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  role: Exclude<UserRole, 'ADMIN'>;
};
