'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Truck,
  Monitor,
  Boxes,
  Users,
  ShieldCheck,
  Palette,
  Database,
  BarChart3,
  CreditCard,
  ShoppingBag,
  Store,
  MessageSquare,
  UserCheck,
  ExternalLink
} from 'lucide-react';

interface TenantConsoleNavigationProps {
  currentSlug: string;
  tenantName?: string;
  staffRole?: string;
}

export function TenantConsoleNavigation({
  currentSlug = 'sweet-delights',
  tenantName,
  staffRole = 'BAKERY_ADMIN',
}: TenantConsoleNavigationProps) {
  const pathname = usePathname();

  const links = [
    { label: 'Overview', href: `/admin/${currentSlug}`, icon: LayoutDashboard },
    { label: 'Orders', href: `/admin/${currentSlug}/orders`, icon: ShoppingBag },
    { label: 'Menu', href: `/admin/${currentSlug}/menu`, icon: Store },
    { label: 'Kitchen (Voice)', href: `/kitchen/${currentSlug}`, icon: UtensilsCrossed },
    { label: 'Delivery', href: `/delivery/${currentSlug}`, icon: Truck },
    { label: 'Payments & UPI', href: `/admin/${currentSlug}/payments`, icon: CreditCard },
    { label: 'Customers', href: `/admin/${currentSlug}/customers`, icon: UserCheck },
    { label: 'Staff', href: `/admin/${currentSlug}/staff`, icon: Users },
    { label: 'Roles', href: `/admin/${currentSlug}/roles`, icon: ShieldCheck },
    { label: 'Brand Kit', href: `/admin/${currentSlug}/settings`, icon: Palette },
    { label: 'Inventory', href: `/admin/${currentSlug}/inventory`, icon: Boxes },
    { label: 'Reports', href: `/admin/${currentSlug}/reports`, icon: BarChart3 },
    { label: 'Data', href: `/admin/${currentSlug}/data`, icon: Database },
    { label: 'Outbox', href: `/admin/${currentSlug}/notifications`, icon: MessageSquare },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Tenant Organization Brand & Console Badge */}
        <div className="flex items-center gap-3">
          <Link href={`/admin/${currentSlug}`} className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-black shadow-md text-xs">
              FD
            </span>
            <div>
              <span className="font-black text-sm tracking-tight text-white block">
                {tenantName || (currentSlug === 'crumb-crust' ? 'Crumb & Crust Patisserie' : 'Sweet Delights Bakery')}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                <span>Tenant Console</span>
                <span className="w-1 h-1 rounded-full bg-slate-500" />
                <span className="text-emerald-400 font-mono">/{currentSlug}</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Tenant Console Navigation Links */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 text-xs font-semibold">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === `/admin/${currentSlug}`
                ? pathname === `/admin/${currentSlug}`
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* View Public Storefront Link */}
        <div className="flex items-center gap-2">
          <Link
            href={`/${currentSlug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors shadow-xs"
          >
            <Store className="w-3.5 h-3.5 text-rose-400" />
            <span>Public Storefront</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </div>
    </header>
  );
}
