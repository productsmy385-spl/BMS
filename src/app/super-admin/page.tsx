'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Plus,
  Store,
  Check,
  ExternalLink,
  Activity,
  Users,
  DollarSign,
  Palette,
  RefreshCw,
  Truck,
  Monitor,
  UtensilsCrossed,
  LayoutDashboard,
  Power,
  X
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Tenant } from '@/types';

export default function SuperAdminDashboardPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Tenant Provisioning Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [primaryColor, setPrimaryColor] = useState('#e11d48');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/tenants');
      const data = await res.json();
      if (data.success) {
        setTenants(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/v1/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          tagline,
          phone,
          email,
          address,
          city,
          primaryColor,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsCreateOpen(false);
        setName('');
        setSlug('');
        setTagline('');
        setPhone('');
        setEmail('');
        setAddress('');
        fetchTenants();
      } else {
        alert(data.error || 'Failed to provision organization.');
      }
    } catch {
      alert('Error communicating with provisioning API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Platform Owner Portal
                </span>
                <span className="text-xs text-rose-600 font-bold">FlowDineOS</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Super Admin Organization Engine
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchTenants}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 shadow-xs"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Provision New Bakery Organization</span>
            </button>
          </div>
        </div>

        {/* Global SaaS Platform Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total Organizations
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{tenants.length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Active Tenants
              </span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">
                {tenants.filter((t) => t.isActive).length}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Isolation Architecture
              </span>
              <span className="text-sm font-black text-slate-900 mt-1 block">Strict Tenant Scoping</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Real-Time & Voice
              </span>
              <span className="text-sm font-black text-slate-900 mt-1 block">Socket.IO & EN/TE TTS</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Bakery Tenants Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900">Provisioned Bakery Organizations</h2>
              <p className="text-xs text-slate-500">
                Each organization possesses independent catalog, orders, KOT, delivery dashboard, staff roster, and public website.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Organization Name</th>
                  <th className="py-3 px-4">Storefront Route</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Operational Portals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-black">
                        FD
                      </span>
                      <div>
                        <div>{t.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{t.id}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">/{t.slug}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${t.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {t.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <Link
                          href={`/${t.slug}`}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                          title="Open Dynamic Public Storefront"
                        >
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                          <span>Storefront</span>
                        </Link>
                        <Link
                          href={`/admin/${t.slug}`}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-[11px] font-semibold flex items-center gap-1"
                          title="Open Tenant Admin Console"
                        >
                          <LayoutDashboard className="w-3 h-3 text-rose-400" />
                          <span>Console</span>
                        </Link>
                        <Link
                          href={`/pos/${t.slug}`}
                          className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold"
                          title="Open Counter POS"
                        >
                          POS
                        </Link>
                        <Link
                          href={`/kitchen/${t.slug}`}
                          className="px-2 py-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 text-[11px] font-bold"
                          title="Open Kitchen View & Voice KOT"
                        >
                          KOT
                        </Link>
                        <Link
                          href={`/delivery/${t.slug}`}
                          className="px-2 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-[11px] font-bold"
                          title="Open Delivery Dashboard"
                        >
                          Delivery
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Provision New Bakery Organization Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Provision Bakery Organization</h3>
                <p className="text-xs text-slate-500">
                  Provisions PostgreSQL records, dynamic storefront route, brand kit, and admin account.
                </p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Saffron Patisserie"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Storefront URL Slug *</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-500 font-mono text-[11px]">
                    /
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="royal-saffron"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-r-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="Artisanal Breads, Patisserie & Custom Celebration Cakes"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="contact@royalsaffron.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Business Address</label>
                  <input
                    type="text"
                    placeholder="Road No. 10, Banjara Hills"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Hyderabad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Brand Theme Primary Colour</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer p-0.5 border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-1.5 font-mono border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting ? 'Provisioning...' : 'Provision Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
