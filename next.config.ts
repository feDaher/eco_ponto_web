import type { NextConfig } from 'next';

if (process.env.VERCEL && !process.env.NEXT_PUBLIC_API_URL?.trim()) {
  throw new Error(
    'NEXT_PUBLIC_API_URL não está definida na Vercel. Cadastre o endereço da API ' +
      '(ex.: https://ecoponto-api.onrender.com) em Settings → Environment Variables, ' +
      'marcando o ambiente do deploy, e faça Redeploy.'
  );
}

const nextConfig: NextConfig = {};

export default nextConfig;
