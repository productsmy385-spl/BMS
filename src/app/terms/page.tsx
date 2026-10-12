'use client';

import React from 'react';
import Link from 'next/link';
import { SaaSNavigation } from '@/components/SaaSNavigation';
import { ArrowLeft, Shield } from 'lucide-react';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <SaaSNavigation />

      <main className="max-w-4xl mx-auto px-4 py-16 flex-1 w-full space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to FlowDineOS Home</span>
        </Link>

        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Terms &amp; Conditions</h1>
          <p className="text-xs text-slate-400">Effective Date: October 2026 &bull; FlowDineOS Multi-Tenant SaaS Platform</p>
        </div>

        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Platform Overview &amp; Acceptance</h2>
            <p>
              FlowDineOS provides cloud-native software-as-a-service (SaaS) tools for independent bakery organizations, including online storefront hosting, voice-assisted kitchen order displays, delivery tracking, and manual payment verification. By registering an organization or accessing tenant workspaces, you agree to these Terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Multi-Tenant Isolation &amp; Data Rights</h2>
            <p>
              Each bakery organization is granted a logically partitioned workspace. FlowDineOS enforces strict database isolation: no organization can access or export another tenant&apos;s product catalogs, customer phone numbers, recipe notes, or financial metrics. Tenant data remains the exclusive property of the respective tenant.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Direct UPI Payments &amp; Zero Gateway Liability</h2>
            <p>
              FlowDineOS does not act as a payment aggregator or bank. Tenants configure their own manual UPI IDs and QR codes. Customers pay directly to the bakery&apos;s external account and submit transaction reference numbers (UTR). Tenant staff are solely responsible for manually verifying transaction references before fulfilling orders.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Voice KOT &amp; Real-Time Notifications</h2>
            <p>
              Voice KOT utilizes standard browser Web Speech APIs. Delivery WhatsApp messages are delivered via official Interakt Business Solution Providers. FlowDineOS employs durable queue outboxes with retries; however, actual delivery is subject to the recipient device&apos;s network connection and WhatsApp Business platform availability.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">5. Account Security &amp; RBAC Scopes</h2>
            <p>
              Tenants must maintain confidentiality of staff credentials. Roles (Admin, Manager, Chef, Delivery Agent) have strict access limits. Staff must only access modules authorized under their role. Super Admin privileges are reserved solely for platform operations.
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-slate-950 text-slate-400 py-8 px-4 border-t border-slate-900 text-xs text-center">
        <p>&copy; 2026 FlowDineOS SaaS. All rights reserved.</p>
      </footer>
    </div>
  );
}
