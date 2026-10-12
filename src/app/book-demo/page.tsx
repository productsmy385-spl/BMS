'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SaaSNavigation } from '@/components/SaaSNavigation';
import { ArrowLeft, Calendar, CheckCircle2, Sparkles, Store, Volume2, ShieldCheck } from 'lucide-react';

export default function BookDemoDedicatedPage() {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    outletsCount: 1,
    requirements: '',
    preferredContact: 'PHONE' as 'EMAIL' | 'PHONE' | 'WHATSAPP',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const res = await fetch('/api/v1/demo-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(
          `Thank you, ${formData.name}! Your demo request has been recorded (ID: ${data.data.id}). Our technical onboarding specialist will reach out shortly.`
        );
        setFormData({
          name: '',
          businessName: '',
          email: '',
          phone: '',
          outletsCount: 1,
          requirements: '',
          preferredContact: 'PHONE',
        });
      } else {
        setSubmitError(data.error || 'Failed to submit request.');
      }
    } catch {
      setSubmitError('Unable to connect to the FlowDineOS server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <SaaSNavigation />

      <main className="max-w-4xl mx-auto px-4 py-16 flex-1 w-full space-y-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to FlowDineOS Home</span>
        </Link>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-300 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule an Interactive Platform Walkthrough</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">Book a FlowDineOS Demonstration</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Experience Bilingual Voice KOT in action, test our custom 3D cake studio, and see how our driver dispatch portal streamlines daily bakery operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-2">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <Volume2 className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white">Voice KOT Test</h3>
            <p className="text-slate-400">Hear real-time announcements in English &amp; Telugu on your own speakers or tablet.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <Store className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-white">Storefront Sandbox</h3>
            <p className="text-slate-400">We provision a dedicated demo tenant with your bakery logo and sample menu items.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white">Zero Commitment</h3>
            <p className="text-slate-400">No payment gateway or card needed. Direct manual UPI instructions configured in minutes.</p>
          </div>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          {submitSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">Demonstration Requested!</h4>
              <p className="text-xs text-emerald-200 leading-relaxed max-w-lg mx-auto">{submitSuccess}</p>
              <button
                type="button"
                onClick={() => setSubmitSuccess(null)}
                className="mt-4 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {submitError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {submitError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Varma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Bakery Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Confectionery"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="anand@royalbakery.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 99999"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Number of Outlets</label>
                  <select
                    value={formData.outletsCount}
                    onChange={(e) => setFormData({ ...formData, outletsCount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-rose-500 transition-colors"
                  >
                    <option value={1}>1 Outlet (Single location)</option>
                    <option value={2}>2 - 4 Outlets</option>
                    <option value={5}>5 - 10 Outlets</option>
                    <option value={11}>10+ Outlets (Chain)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Preferred Contact Method</label>
                  <select
                    value={formData.preferredContact}
                    onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-rose-500 transition-colors"
                  >
                    <option value="PHONE">Phone Call</option>
                    <option value="WHATSAPP">WhatsApp Message</option>
                    <option value="EMAIL">Email</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Specific Questions or Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Tell us what challenges you are facing with your current POS or kitchen setup."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-sm shadow-xl shadow-rose-950/40 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Demo Request'}
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="bg-slate-950 text-slate-400 py-8 px-4 border-t border-slate-900 text-xs text-center">
        <p>&copy; 2026 FlowDineOS SaaS Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
