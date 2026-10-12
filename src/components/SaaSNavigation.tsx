'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Store } from 'lucide-react';

export function SaaSNavigation() {
  return (
    <header className="bg-slate-950/90 text-white backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* FlowDineOS Platform Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 text-white flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform">
            FD
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-white">FlowDineOS</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                SaaS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Bakery Management Operating System</p>
          </div>
        </Link>

        {/* Marketing Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs font-semibold overflow-x-auto py-1">
          <Link
            href="/#features"
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/#voice-kot"
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            Voice KOT
          </Link>
          <Link
            href="/#packages"
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            Packages
          </Link>
          <Link
            href="/#bakeries"
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1"
          >
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span>Live Bakeries</span>
          </Link>
          <Link
            href="/#contact"
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Right Action: Book a Demo */}
        <div className="flex items-center gap-3">
          <Link
            href="/book-demo"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-900/30 flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book a Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
