'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MessageSquare, RefreshCw, CheckCircle2, Clock, AlertCircle, Phone, ArrowUpRight } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Notification } from '@/types';

export default function TenantNotificationsPage() {
  const params = useParams();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/tenants/${slug}/notifications`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [slug]);

  const handleRetry = async (notificationId: string) => {
    try {
      setRetryingId(notificationId);
      const res = await fetch(`/api/v1/tenants/${slug}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchNotifications();
      }
    } catch {
      alert('Failed to retry notification');
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navigation currentSlug={slug} />

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Interakt WhatsApp Engine
                </span>
                <span className="text-xs text-slate-400">FlowDineOS</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">Notification History & Outbox</h1>
            </div>
          </div>

          <button
            onClick={fetchNotifications}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-xs"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span>Refresh Outbox</span>
          </button>
        </div>

        {/* Notifications Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Transactional WhatsApp Messages ({notifications.length})</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading outbox records...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No WhatsApp messages dispatched yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Recipient</th>
                    <th className="px-4 py-3">Event Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Retries</th>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{n.recipientPhone}</span>
                        </div>
                        {n.orderId && <div className="text-[11px] text-slate-400 font-mono">Order: {n.orderId}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                          {n.type}
                        </span>
                        {Boolean(n.payload && (n.payload as Record<string, any>).message) && (
                          <div className="text-[11px] text-slate-500 mt-1 max-w-xs truncate">
                            {String((n.payload as Record<string, any>).message)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            n.status === 'DELIVERED' || n.status === 'SENT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              n.status === 'DELIVERED' || n.status === 'SENT' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {n.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500">{n.retryCount}</td>
                      <td className="px-4 py-3 text-slate-400 text-[11px]">
                        {new Date(n.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleRetry(n.id)}
                          disabled={retryingId === n.id}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors disabled:opacity-50"
                        >
                          {retryingId === n.id ? 'Retrying...' : 'Retry'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
