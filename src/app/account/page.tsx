import type { Metadata } from 'next';
import { AccountProfile } from '@/components/account/AccountProfile';
import packageInfo from '../../../package.json';

export const metadata: Metadata = {
  title: 'Minha conta | EcoPonto Digital',
  robots: { index: false },
};

export default function AccountPage() {
  return <AccountProfile version={packageInfo.version} />;
}
