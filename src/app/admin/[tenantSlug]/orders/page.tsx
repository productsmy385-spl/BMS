'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ShoppingBag,
  Volume2,
  CheckSquare,
  Square,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Store,
  DollarSign,
  Printer,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { TenantConsoleNavigation } from '@/components/TenantConsoleNavigation';
import { Order, OrderStatus } from '@/types';

export default function TenantOrdersManagementPage() {
  const params = useParams();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [voiceLang, setVoiceLang] = useState<'en' | 'te'>('en');
  const [sharingVoice, setSharingVoice] = useState(false);
  const [voiceShareMessage, setVoiceShareMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/tenants/${slug}/orders`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [slug]);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.orderNumber.toString().includes(searchQuery);

    const matchesStatus = filterStatus === 'ALL' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleToggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  };

  const handleToggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleShareToVoiceKOT = async () => {
    if (selectedOrderIds.length === 0) return;

    try {
      setSharingVoice(true);
      setVoiceShareMessage(null);
      const res = await fetch(`/api/v1/tenants/${slug}/voice/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderIds: selectedOrderIds,
          language: voiceLang,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setVoiceShareMessage(
          `Announced ${data.data.queuedCount} order(s) to Kitchen Voice Queue in ${voiceLang === 'te' ? 'Telugu (తెలుగు)' : 'English'}!`
        );
        setSelectedOrderIds([]);
      } else {
        alert(data.error || 'Failed to share orders to Voice KOT');
      }
    } catch {
      alert('Error communicating with Voice KOT server.');
    } finally {
      setSharingVoice(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <TenantConsoleNavigation currentSlug={slug} />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Header & Share to Voice KOT Action Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-rose-500" />
              <span>Orders Management</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select orders to trigger real-time Bilingual Voice KOT kitchen announcements.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400 font-semibold">Voice:</span>
              <button
                type="button"
                onClick={() => setVoiceLang('en')}
                className={`px-2 py-0.5 rounded-lg font-bold text-xs ${
                  voiceLang === 'en' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setVoiceLang('te')}
                className={`px-2 py-0.5 rounded-lg font-bold text-xs ${
                  voiceLang === 'te' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                తెలుగు (Telugu)
              </button>
            </div>

            {/* MANDATORY: Share Selected Orders to Voice KOT Button */}
            <button
              type="button"
              disabled={selectedOrderIds.length === 0 || sharingVoice}
              onClick={handleShareToVoiceKOT}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-transform active:scale-95 disabled:opacity-40 flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>
                {sharingVoice
                  ? 'Queuing Speech...'
                  : `Share to Voice KOT (${selectedOrderIds.length})`}
              </span>
            </button>

            <button
              type="button"
              onClick={fetchOrders}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {voiceShareMessage && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{voiceShareMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setVoiceShareMessage(null)}
              className="text-amber-400 hover:text-white text-xs font-bold"
            >
              &times;
            </button>
          </div>
        )}

        {/* Filters & Search */}
        <div className="flex items-center justify-between gap-3 flex-wrap bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by order #, customer name, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
            {['ALL', 'NEW', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  filterStatus === st
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Selection Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <button
            type="button"
            onClick={handleToggleSelectAll}
            className="flex items-center gap-2 hover:text-white font-semibold cursor-pointer"
          >
            {selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length ? (
              <CheckSquare className="w-4 h-4 text-rose-500" />
            ) : (
              <Square className="w-4 h-4 text-slate-500" />
            )}
            <span>Select All on Page ({filteredOrders.length})</span>
          </button>
          <span>{selectedOrderIds.length} order(s) selected</span>
        </div>

        {/* Orders Table */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4 w-10">Select</th>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total &amp; Payment</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No orders found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const isSelected = selectedOrderIds.includes(ord.id);
                    return (
                      <tr
                        key={ord.id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          isSelected ? 'bg-rose-950/20' : ''
                        }`}
                      >
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => handleToggleSelectOrder(ord.id)}
                            className="text-slate-400 hover:text-white cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-rose-500" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-600" />
                            )}
                          </button>
                        </td>
                        <td className="p-4 font-mono font-bold text-white">#{ord.orderNumber}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-200">{ord.customerName}</div>
                          <div className="text-[11px] text-slate-400">{ord.customerPhone}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-200">
                            {ord.items.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                          </div>
                          {ord.items.some((i) => i.customization) && (
                            <span className="text-[10px] text-amber-400 font-semibold">Custom Cake</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white">₹{ord.totalAmount.toFixed(2)}</div>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                              ord.paymentStatus === 'COMPLETED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : ord.paymentStatus === 'PENDING_VERIFICATION'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-300">{ord.deliveryType}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-slate-800 text-slate-200 border border-slate-700">
                            {ord.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-[11px] text-slate-400">
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
