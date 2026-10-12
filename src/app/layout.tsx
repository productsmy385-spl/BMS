import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Crumb & Co. | Bakery', description: 'Fresh bakery ordering and kitchen management' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
