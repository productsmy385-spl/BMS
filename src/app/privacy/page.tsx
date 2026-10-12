'use client';

import React from 'react';
import Link from 'next/link';
import { SaaSNavigation } from '@/components/SaaSNavigation';
import { ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy &amp; Data Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Last Updated: October 2026 &bull; FlowDineOS Multi-Tenant Architecture</p>
        </div>

        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
            <p>
              FlowDineOS collects organization details (bakery name, business address, contact numbers, GSTIN, FSSAI numbers), staff credentials for role-based authentication, and order payloads necessary for kitchen preparation and customer delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Strict Multi-Tenant Isolation</h2>
            <p>
              Our database architecture scopes every operational record (orders, customer names, delivery addresses, UPI submission receipts) to its unique <code>tenant_id</code>. We enforce server-side validation to guarantee that Bakery A staff cannot view or query Bakery B customer or order data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Customer Personal Information &amp; Role-Scoped Exposure</h2>
            <p>
              To protect end-customer privacy:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Kitchen chefs viewing Voice KOT only receive order items, variants, and cake messages needed for preparation.</li>
              <li>Delivery drivers only see customer delivery address and phone number for orders assigned directly to them.</li>
              <li>Full order history and export access are restricted to Bakery Admins and Order Managers.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Third-Party Integrations</h2>
            <p>
              When WhatsApp notifications are enabled, order status notifications are transmitted via Interakt WhatsApp BSP APIs using approved message templates. FlowDineOS does not sell or distribute customer phone numbers to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">5. Contact Data Privacy Officer</h2>
            <p>
              For privacy inquiries, audit requests, or data deletion requests, contact our compliance team at <code>privacy@flowdineos.com</code>.
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
