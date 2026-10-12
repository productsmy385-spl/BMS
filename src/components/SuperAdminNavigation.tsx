'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Store, Package, Calendar, Activity, ArrowLeft } from 'lucide-react';

interface SuperAdminNavigationProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function SuperAdminNavigation({ activeTab, setActiveTab }: SuperAdminNavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'organizations', label: 'Organizations', icon: Store },
    { key: 'packages', label: 'Packages & Entitlements', icon: Package },
    { key: 'demos', label: 'Demo Requests', icon: Calendar },
    { key: 'audit', label: 'Platform Audit Logs', icon: ShieldAlert },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Brand & Super Admin Shield */}
        <div className="flex items-center gap-3">
          <Link href="/super-admin" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black shadow-md">
              <ShieldAlert className="w-4 h-4 text-white" />
            </span>
            <div>
              <span className="font-black text-sm tracking-tight text-white block">FlowDineOS Platform Owner</span>
              <span className="text-[10px] text-rose-400 font-semibold tracking-wide uppercase">Super Admin Portal</span>
            </div>
          </Link>
        </div>

        {/* Tab / Route Links */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;

            if (setActiveTab) {
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveTab(item.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.key}
                href={`/super-admin?tab=${item.key}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Return to Public SaaS Site */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Public SaaS</span>
        </Link>
      </div>
    </header>
  );
}
