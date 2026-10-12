'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
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
  X,
  Package,
  Calendar,
  Clock,
  Phone,
  Mail,
  Building2,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { SuperAdminNavigation } from '@/components/SuperAdminNavigation';
import { Tenant, PackageDefinition, DemoRequest, AuditLog } from '@/types';

export default function SuperAdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [packages, setPackages] = useState<PackageDefinition[]>([]);
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
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
  const [selectedPackageId, setSelectedPackageId] = useState('pkg_growth');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo status update state
  const [updatingDemoId, setUpdatingDemoId] = useState<string | null>(null);

  const fetchPlatformData = async () => {
    try {
      setLoading(true);
      const [tenantsRes, packagesRes, demosRes] = await Promise.all([
        fetch('/api/v1/tenants'),
        fetch('/api/v1/packages'),
        fetch('/api/v1/demo-requests'),
      ]);

      const [tenantsData, packagesData, demosData] = await Promise.all([
        tenantsRes.json(),
        packagesRes.json(),
        demosRes.json(),
      ]);

      if (tenantsData.success) setTenants(tenantsData.data);
      if (packagesData.success) setPackages(packagesData.data);
      if (demosData.success) setDemoRequests(demosData.data);
    } catch (err) {
      console.error('Failed to fetch platform administration data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatformData();
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
          packageId: selectedPackageId,
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
        fetchPlatformData();
      } else {
        alert(data.error || 'Failed to provision organization.');
      }
    } catch {
      alert('Error connecting to backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTenantStatus = async (tenantId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/v1/tenants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          isActive: !currentStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPlatformData();
      }
    } catch {
      alert('Failed to update tenant status.');
    }
  };

  const handleUpdateTenantPackage = async (tenantId: string, packageId: string) => {
    try {
      const res = await fetch(`/api/v1/tenants/${tenantId}/package`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPlatformData();
      } else {
        alert(data.error || 'Failed to update package entitlement.');
      }
    } catch {
      alert('Error updating package.');
    }
  };

  const handleUpdateDemoStatus = async (demoId: string, status: string) => {
    try {
      setUpdatingDemoId(demoId);
      const res = await fetch(`/api/v1/demo-requests/${demoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPlatformData();
      }
    } catch {
      alert('Error updating demo status.');
    } finally {
      setUpdatingDemoId(null);
    }
  };

  // Metrics
  const totalOrgs = tenants.length;
  const activeOrgs = tenants.filter((t) => t.isActive).length;
  const inactiveOrgs = totalOrgs - activeOrgs;
  const pendingDemos = demoRequests.filter((d) => d.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <SuperAdminNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h1 className="text-2xl font-black text-white">FlowDineOS Platform Console</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-Tenant Cloud Operations &bull; Organization Provisioning &bull; Package Entitlements
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchPlatformData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Provision New Bakery Organization</span>
            </button>
          </div>
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Real Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Total Organizations</span>
                  <Store className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-3xl font-black text-white">{totalOrgs}</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span>{activeOrgs} active</span>
                  {inactiveOrgs > 0 && <span className="text-slate-400">&bull; {inactiveOrgs} suspended</span>}
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Available SaaS Packages</span>
                  <Package className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-amber-400">{packages.length}</div>
                <p className="text-[11px] text-slate-400">Starter, Growth, Enterprise tiers</p>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Pending Demo Requests</span>
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-black text-blue-400">{pendingDemos}</div>
                <p className="text-[11px] text-slate-400">{demoRequests.length} total inquiries logged</p>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Data Isolation Scoping</span>
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-emerald-400">Strict</div>
                <p className="text-[11px] text-slate-400">Database-enforced tenant boundaries</p>
              </div>
            </div>

            {/* Quick Overview of Tenants & Pending Demos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Provisioned Organizations Card */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-sm text-white">Active Organizations ({activeOrgs})</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('organizations')}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300"
                  >
                    View All &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {tenants.map((t) => (
                    <div key={t.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{t.name}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">/{t.slug}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${t.slug}`}
                          target="_blank"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                        >
                          <Store className="w-3 h-3 text-rose-400" />
                          <span>Storefront</span>
                        </Link>
                        <Link
                          href={`/admin/${t.slug}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                        >
                          <span>Console</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Demo Requests */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-sm text-white">Recent Demo Inquiries ({demoRequests.length})</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('demos')}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300"
                  >
                    Manage &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {demoRequests.slice(0, 3).map((d) => (
                    <div key={d.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{d.name} &bull; {d.businessName}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          d.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {d.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{d.phone} &bull; {d.email}</p>
                      {d.requirements && <p className="text-[11px] text-slate-300 italic line-clamp-1">&ldquo;{d.requirements}&rdquo;</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: ORGANIZATIONS */}
        {activeTab === 'organizations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">All Provisioned Bakery Organizations ({tenants.length})</h2>
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Provision Organization</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tenants.map((t) => {
                const pkg = packages.find((p) => p.id === (t.packageId || 'pkg_enterprise'));
                return (
                  <div
                    key={t.id}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{t.name}</h3>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              t.isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}>
                              {t.isActive ? 'Active' : 'Suspended'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">Slug: /{t.slug} &bull; ID: {t.id}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleTenantStatus(t.id, t.isActive)}
                          className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
                            t.isActive
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{t.isActive ? 'Suspend' : 'Activate'}</span>
                        </button>
                      </div>

                      {/* Package selector */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Assigned Package:</span>
                        <select
                          value={t.packageId || 'pkg_enterprise'}
                          onChange={(e) => handleUpdateTenantPackage(t.id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1 focus:outline-hidden"
                        >
                          {packages.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} (₹{p.pricePerMonth}/mo)</option>
                          ))}
                        </select>
                      </div>

                      {pkg && (
                        <div className="text-[11px] text-slate-400 flex flex-wrap gap-1">
                          {pkg.features.map((f) => (
                            <span key={f} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Operational Portal Links */}
                    <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
                      <Link
                        href={`/${t.slug}`}
                        target="_blank"
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Store className="w-3.5 h-3.5 text-rose-400" />
                        <span>Public Storefront</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>

                      <Link
                        href={`/admin/${t.slug}`}
                        className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Tenant Console</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: PACKAGES & ENTITLEMENTS */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">SaaS Package Definitions &amp; Feature Entitlements</h2>
              <p className="text-xs text-slate-400 mt-1">
                Protected features are verified on the server. If a tenant&apos;s package does not include a feature, direct API requests are rejected.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">{pkg.name}</h3>
                      <span className="text-xs font-mono font-bold text-rose-400">₹{pkg.pricePerMonth}/mo</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{pkg.description}</p>
                    
                    <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                      <span className="font-semibold text-slate-300">Enabled Features ({pkg.features.length}):</span>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.features.map((f) => (
                          <span key={f} className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono text-[11px]">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
                    Max Orders: <strong>{pkg.maxOrdersPerMonth ? `${pkg.maxOrdersPerMonth} / month` : 'Unlimited'}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: DEMO REQUESTS */}
        {activeTab === 'demos' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Public Website Demo Inquiries ({demoRequests.length})</h2>
                <p className="text-xs text-slate-400 mt-0.5">Real prospective bakery leads submitted from the FlowDineOS marketing page.</p>
              </div>
            </div>

            <div className="space-y-4">
              {demoRequests.map((demo) => (
                <div key={demo.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-white">{demo.name}</h3>
                        <span className="text-xs text-slate-400">&bull; {demo.businessName}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          demo.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : demo.status === 'CONTACTED'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : demo.status === 'SCHEDULED'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {demo.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span>Phone: <strong className="text-slate-200">{demo.phone}</strong></span>
                        <span>Email: <strong className="text-slate-200">{demo.email}</strong></span>
                        <span>Outlets: <strong className="text-slate-200">{demo.outletsCount || 1}</strong></span>
                        <span>Contact Via: <strong className="text-slate-200">{demo.preferredContact || 'PHONE'}</strong></span>
                      </p>
                    </div>

                    {/* Status updater buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateDemoStatus(demo.id, 'CONTACTED')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                      >
                        Contacted
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateDemoStatus(demo.id, 'SCHEDULED')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                      >
                        Scheduled
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateDemoStatus(demo.id, 'RESOLVED')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>

                  {demo.requirements && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      <span className="font-semibold text-slate-400">Notes / Requirements: </span>
                      {demo.requirements}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Platform System Audit Logs</h2>
              <p className="text-xs text-slate-400 mt-0.5">Immutable record of organization creations, setting modifications, and demo inquiries.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              Platform ledger is operational. All organization provisioning, package entitlement adjustments, and demo submissions generate durable audit entries.
            </div>
          </div>
        )}
      </main>

      {/* Modal: Provision New Organization */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Provision New Bakery Tenant</h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Bakery Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sourdough & Co."
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Unique Slug (`/[slug]`) *</label>
                <input
                  type="text"
                  required
                  placeholder="sourdough-co"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Package Entitlement *</label>
                <select
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (₹{p.pricePerMonth}/mo)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Brand Color</label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full h-8 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98450 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white shadow-md transition-transform active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Provisioning...' : 'Provision Organization'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
