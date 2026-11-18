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

export type ManagedUserStatus = 'active' | 'pending' | 'blocked';

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  identification: string;
  role: UserRole;
  title: string;
  roleDetail: string;
  unit: string;
  unitDetail: string;
  status: ManagedUserStatus;
  level?: number;
  createdAt: string;
};
