import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'FlowDineOS | Multi-Tenant Bakery Management SaaS',
  description: 'Enterprise cloud operating platform for artisan bakeries, patisseries, and custom cake studios.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
