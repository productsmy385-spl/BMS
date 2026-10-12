'use client';

import React from 'react';
import Link from 'next/link';
import {
  Store,
  Monitor,
  UtensilsCrossed,
  Truck,
  Palette,
  Boxes,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Volume2,
  Printer,
  Check,
  ArrowRight,
  Database,
  Users,
  MessageSquare
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';

export default function SaaSPlatformPortalPage() {
  const bakeries = [
    {
      name: 'Sweet Delights Bakery',
      slug: 'sweet-delights',
      city: 'Hyderabad, Jubilee Hills',
      theme: 'Vibrant Rose & Cream (#e11d48)',
      tagline: 'Artisanal Breads, Viennoiserie & Custom Celebration Cakes',
      badgeColor: 'bg-rose-500 text-white',
      borderColor: 'border-rose-200 hover:border-rose-400',
    },
    {
      name: 'Crumb & Crust Patisserie',
      slug: 'crumb-crust',
      city: 'Bengaluru, Indiranagar',
      theme: 'Warm French Amber & Slate (#d97706)',
      tagline: 'Gourmet French Bakery, Sourdough & Classic Gateaux',
      badgeColor: 'bg-amber-500 text-white',
      borderColor: 'border-amber-200 hover:border-amber-400',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-rose-300 border border-white/10 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>FlowDineOS &mdash; Complete Multi-Tenant Bakery SaaS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            The Autonomous Operating System for{' '}
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              Modern Bakery Organizations.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            As Super Admin, provision multiple isolated bakery organizations. Each receives its own dynamic public website,
            tenant console, staff accounts, kitchen view with bilingual voice KOT, delivery dashboard, and WhatsApp notifications.
          </p>

          <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
            <Link
              href="/super-admin"
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Super Admin Platform Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/sweet-delights"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              <Store className="w-4 h-4 text-rose-300" />
              <span>View Dynamic Public Storefront</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Active Bakery Tenants Showcase */}
      <main className="max-w-6xl mx-auto px-4 py-12 flex-1 w-full space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
            Isolated Organizations in FlowDineOS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Choose a Bakery Organization to Operate
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Each organization possesses completely isolated database records, individual catalog items, orders, KOT tickets,
            delivery pipelines, and independent public website brand kits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bakeries.map((b) => (
            <div
              key={b.slug}
              className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${b.borderColor}`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${b.badgeColor}`}>
                      Active Tenant
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-2">{b.name}</h3>
                    <p className="text-xs text-slate-500">{b.city}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                    /{b.slug}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{b.tagline}</p>

                <div className="space-y-1.5 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-slate-400" />
                    <span>Brand Theme: <strong>{b.theme}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Data Scoping: <strong>Strict Multi-Tenant Isolation</strong></span>
                  </div>
                </div>
              </div>

              {/* Portal Links */}
              <div className="pt-5 mt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <Link
                  href={`/${b.slug}`}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Store className="w-3.5 h-3.5 text-rose-500" />
                  <span>Storefront</span>
                </Link>

                <Link
                  href={`/admin/${b.slug}`}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tenant Console</span>
                </Link>

                <Link
                  href={`/pos/${b.slug}`}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Monitor className="w-3.5 h-3.5 text-blue-600" />
                  <span>POS</span>
                </Link>

                <Link
                  href={`/kitchen/${b.slug}`}
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-slate-950" />
                  <span>Kitchen (Voice)</span>
                </Link>

                <Link
                  href={`/delivery/${b.slug}`}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Truck className="w-3.5 h-3.5 text-white" />
                  <span>Delivery Agent</span>
                </Link>

                <Link
                  href={`/admin/${b.slug}/settings`}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Palette className="w-3.5 h-3.5 text-slate-500" />
                  <span>Brand Kit</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Highlights Grid */}
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Core Architecture</span>
            <h2 className="text-2xl font-black text-slate-900">Enterprise Capabilities in FlowDineOS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Dynamic Public Storefront</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Single shared renderer driven by database records. Each bakery configures custom hero headers, brand colors,
                interactive customized cake designer, and Staff Login.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Bilingual Voice KOT (EN + TE)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kitchen display updates in real-time over Socket.IO and speaks ticket announcements in English and Telugu
                via Web Speech API with duplicate suppression.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Delivery Dashboard & WhatsApp</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dedicated driver portal. Chef marks READY &rarr; queues customer WhatsApp and alerts driver.
                Driver marks PICKED_UP &rarr; queues customer WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-4 border-t border-slate-800 text-xs text-center">
        <p className="font-semibold text-slate-300">FlowDineOS &mdash; Complete Multi-Tenant Bakery Management SaaS Platform</p>
        <p className="text-[11px] text-slate-500 mt-1">Railway PostgreSQL &bull; Next.js App Router &bull; Socket.IO &bull; Interakt WhatsApp</p>
      </footer>
    </div>
  );
}
