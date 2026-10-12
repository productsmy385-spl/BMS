'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  CreditCard,
  QrCode,
  CheckCircle2,
  XCircle,
  Save,
  RefreshCw,
  Clock,
  AlertTriangle,
  Building2,
  Phone,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { TenantConsoleNavigation } from '@/components/TenantConsoleNavigation';
import { TenantPaymentSettings, Payment, Order } from '@/types';

export default function TenantPaymentsManagementPage() {
  const params = useParams();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [settings, setSettings] = useState<TenantPaymentSettings | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable settings fields
  const [upiId, setUpiId] = useState('');
  const [accountDisplayName, setAccountDisplayName] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [instructions, setInstructions] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Payment verification action
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const [settingsRes, ordersRes] = await Promise.all([
        fetch(`/api/v1/tenants/${slug}/payments/settings`),
        fetch(`/api/v1/tenants/${slug}/orders`),
      ]);

      const [settingsData, ordersData] = await Promise.all([
        settingsRes.json(),
        ordersRes.json(),
      ]);

      if (settingsData.success && settingsData.data) {
        setSettings(settingsData.data);
        setUpiId(settingsData.data.upiId || '');
        setAccountDisplayName(settingsData.data.accountDisplayName || '');
        setQrImageUrl(settingsData.data.qrImageUrl || '');
        setInstructions(settingsData.data.instructions || '');
        setContactPhone(settingsData.data.contactPhone || '');
      }

      if (ordersData.success) {
        setOrders(ordersData.data);
      }
    } catch (err) {
      console.error('Failed to load payment data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, [slug]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      setSaveSuccess(false);
      const res = await fetch(`/api/v1/tenants/${slug}/payments/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          upiId,
          accountDisplayName,
          qrImageUrl,
          instructions,
          contactPhone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to save payment settings.');
      }
    } catch {
      alert('Error updating payment settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleVerifyPayment = async (paymentId: string, status: 'COMPLETED' | 'FAILED') => {
    let notes: string | undefined = undefined;
    if (status === 'FAILED') {
      const promptNotes = window.prompt('Please provide a mandatory reason for rejecting this payment:');
      if (!promptNotes || !promptNotes.trim()) {
        alert('A rejection reason is required.');
        return;
      }
      notes = promptNotes.trim();
    }

    try {
      setVerifyingId(paymentId);
      const res = await fetch(`/api/v1/tenants/${slug}/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status, notes }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPaymentData();
      } else {
        alert(data.error || 'Failed to verify payment.');
      }
    } catch {
      alert('Error communicating with verification endpoint.');
    } finally {
      setVerifyingId(null);
    }
  };

  // Extract all payment submissions across orders
  const allPaymentSubmissions = orders.flatMap((o) =>
    (o.payments || []).map((p) => ({
      ...p,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      orderTotal: o.totalAmount,
    }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const pendingVerificationCount = allPaymentSubmissions.filter((p) => p.status === 'PENDING_VERIFICATION').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <TenantConsoleNavigation currentSlug={slug} />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-rose-500" />
              <span>UPI Payments &amp; Manual Reconciliation</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Configure your organization-scoped UPI details and review submitted customer transaction UTR numbers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchPaymentData}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Verification Summary Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Manual Reconciliation Required</h4>
              <p className="text-[11px] text-amber-200">
                You have <strong>{pendingVerificationCount}</strong> customer payment(s) awaiting cashier UTR verification.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Column */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5 h-fit">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-rose-400" />
                <span>Tenant UPI Settings</span>
              </h3>
              {saveSuccess && (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Bakery UPI ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. yourbakery@okaxis"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Account Display Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sweet Delights Bakery LLP"
                  value={accountDisplayName}
                  onChange={(e) => setAccountDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">UPI QR Code Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={qrImageUrl}
                  onChange={(e) => setQrImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                {qrImageUrl && (
                  <div className="mt-2 p-2 bg-white rounded-xl border max-w-[140px] mx-auto">
                    <img src={qrImageUrl} alt="Preview QR" className="w-full h-auto object-contain" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Customer Instructions</label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingSettings ? 'Saving Settings...' : 'Save UPI Settings'}</span>
              </button>
            </form>
          </div>

          {/* Submissions Column */}
          <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Customer Payment Submissions</h3>
                <p className="text-[11px] text-slate-400">Review submitted 12-digit UTR numbers against your bakery bank feed.</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {allPaymentSubmissions.length} record(s)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Submitted UTR</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Cashier Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {allPaymentSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No payment submissions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    allPaymentSubmissions.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-white">#{p.orderNumber}</td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-200">{p.customerName}</div>
                          <div className="text-[10px] text-slate-500">{p.customerPhone}</div>
                        </td>
                        <td className="p-3 font-bold text-white">₹{p.amount.toFixed(2)}</td>
                        <td className="p-3 font-mono text-amber-300 font-semibold">
                          {p.transactionReference || <span className="text-slate-500 italic">No UTR</span>}
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              p.status === 'COMPLETED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : p.status === 'PENDING_VERIFICATION'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {p.status === 'PENDING_VERIFICATION' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                disabled={verifyingId === p.id}
                                onClick={() => handleVerifyPayment(p.id, 'COMPLETED')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow-xs cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                disabled={verifyingId === p.id}
                                onClick={() => handleVerifyPayment(p.id, 'FAILED')}
                                className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-[10px] cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-semibold">Reconciled</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
