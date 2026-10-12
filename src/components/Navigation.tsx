'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Store,
  Monitor,
  UtensilsCrossed,
  Truck,
  Palette,
  Boxes,
  BarChart3,
  Users,
  ShieldCheck,
  ShieldAlert,
  Database,
  LayoutDashboard,
  MessageSquare
} from 'lucide-react';

interface NavigationProps {
  currentSlug?: string;
}

export function Navigation({ currentSlug = 'sweet-delights' }: NavigationProps) {
  const pathname = usePathname();

  const mainNavLinks = [
    { label: 'Storefront', href: `/${currentSlug}`, icon: Store },
    { label: 'POS', href: `/pos/${currentSlug}`, icon: Monitor },
    { label: 'Kitchen KOT', href: `/kitchen/${currentSlug}`, icon: UtensilsCrossed },
    { label: 'Delivery', href: `/delivery/${currentSlug}`, icon: Truck },
    { label: 'Tenant Console', href: `/admin/${currentSlug}`, icon: LayoutDashboard },
    { label: 'Staff', href: `/admin/${currentSlug}/staff`, icon: Users },
    { label: 'Roles', href: `/admin/${currentSlug}/roles`, icon: ShieldCheck },
    { label: 'Brand Kit', href: `/admin/${currentSlug}/settings`, icon: Palette },
    { label: 'Inventory', href: `/admin/${currentSlug}/inventory`, icon: Boxes },
    { label: 'Reports', href: `/admin/${currentSlug}/reports`, icon: BarChart3 },
    { label: 'Outbox', href: `/admin/${currentSlug}/notifications`, icon: MessageSquare },
    { label: 'Data', href: `/admin/${currentSlug}/data`, icon: Database },
    { label: 'Super Admin', href: `/super-admin`, icon: ShieldAlert, highlight: true },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Brand Logo & Tenant Switcher */}
        <div className="flex items-center gap-3">
          <Link href={`/${currentSlug}`} className="flex items-center gap-2 font-black text-base tracking-tight text-white">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-black shadow-md">
              FD
            </span>
            <span>FlowDineOS</span>
          </Link>

          <div className="flex items-center gap-1.5 bg-slate-800 rounded-full px-2.5 py-1 text-xs font-medium text-slate-300 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <select
              value={currentSlug}
              onChange={(e) => {
                const newSlug = e.target.value;
                if (pathname.startsWith('/pos/')) {
                  window.location.href = `/pos/${newSlug}`;
                } else if (pathname.startsWith('/kitchen/')) {
                  window.location.href = `/kitchen/${newSlug}`;
                } else if (pathname.startsWith('/delivery/')) {
                  window.location.href = `/delivery/${newSlug}`;
                } else if (pathname.startsWith('/admin/') && pathname.includes('/staff')) {
                  window.location.href = `/admin/${newSlug}/staff`;
                } else if (pathname.startsWith('/admin/') && pathname.includes('/roles')) {
                  window.location.href = `/admin/${newSlug}/roles`;
                } else if (pathname.startsWith('/admin/') && pathname.includes('/settings')) {
                  window.location.href = `/admin/${newSlug}/settings`;
                } else if (pathname.startsWith('/admin/') && pathname.includes('/inventory')) {
                  window.location.href = `/admin/${newSlug}/inventory`;
                } else if (pathname.startsWith('/admin/') && pathname.includes('/reports')) {
                  window.location.href = `/admin/${newSlug}/reports`;
                } else if (pathname.startsWith('/admin/') && pathname.includes('/notifications')) {
                  window.location.href = `/admin/${newSlug}/notifications`;
                } else if (pathname.startsWith('/admin/') && pathname.includes('/data')) {
                  window.location.href = `/admin/${newSlug}/data`;
                } else if (pathname.startsWith('/admin/')) {
                  window.location.href = `/admin/${newSlug}`;
                } else {
                  window.location.href = `/${newSlug}`;
                }
              }}
              className="bg-transparent border-0 focus:outline-hidden font-semibold cursor-pointer text-slate-200 text-xs"
            >
              <option value="sweet-delights" className="bg-slate-900 text-white">Sweet Delights (Rose)</option>
              <option value="crumb-crust" className="bg-slate-900 text-white">Crumb & Crust (Amber)</option>
            </select>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 text-xs font-semibold">
          {mainNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href || (link.href !== `/${currentSlug}` && pathname.startsWith(link.href));

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  link.highlight
                    ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600 hover:text-white'
                    : isActive
                    ? 'bg-slate-800 text-white font-bold shadow-xs border border-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
