'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, CreditCard, RefreshCw } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Order, Tenant, BakeryProfile } from '@/types';

export default function TenantReportsPage() {
  const params = useParams();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tenant, setTenant] = useState<Tenant | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [ordersRes, settingsRes] = await Promise.all([
        fetch(`/api/v1/tenants/${slug}/orders`),
        fetch(`/api/v1/tenants/${slug}/settings`),
      ]);

      const ordersData = await ordersRes.json();
      const settingsData = await settingsRes.json();

      if (ordersData.success) {
        setOrders(ordersData.data);
      }
      if (settingsData.success) {
        setTenant(settingsData.data.tenant);
      }
    } catch (err) {
      console.error('Reports load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [slug]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPaid = orders.reduce((sum, o) => sum + o.paidAmount, 0);
  const outstandingBalance = orders.reduce((sum, o) => sum + o.balanceAmount, 0);

  const posOrdersCount = orders.filter((o) => o.source === 'POS').length;
  const webOrdersCount = orders.filter((o) => o.source === 'PUBLIC_WEBSITE').length;
  const whatsappOrdersCount = orders.filter((o) => o.source === 'WHATSAPP').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navigation currentSlug={slug} />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Business Reports & Sales</h1>
              <p className="text-xs text-slate-500 font-medium">
                Authoritative revenue, order channels, and payment reconciliation for {tenant?.name}.
              </p>
            </div>
          </div>

          <button
            onClick={fetchReports}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Gross Sales</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">₹{totalRevenue.toFixed(2)}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Collected Payments</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">₹{totalPaid.toFixed(2)}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Outstanding Due</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">₹{outstandingBalance.toFixed(2)}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Orders</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{orders.length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Channel Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Counter POS Orders</span>
            <span className="text-xl font-black text-slate-900 mt-1 block">{posOrdersCount} Orders</span>
            <p className="text-[11px] text-slate-400 mt-1">Walk-in counter traffic</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Online Website Store</span>
            <span className="text-xl font-black text-slate-900 mt-1 block">{webOrdersCount} Orders</span>
            <p className="text-[11px] text-slate-400 mt-1">Direct public storefront checkout</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">WhatsApp Inquiries</span>
            <span className="text-xl font-black text-slate-900 mt-1 block">{whatsappOrdersCount} Orders</span>
            <p className="text-[11px] text-slate-400 mt-1">Interakt bot catalog flows</p>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-900">Recent Customer Orders</h2>
            <span className="text-xs text-slate-500">Authoritative Ledger</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Delivery</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date/Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-900">#{o.orderNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {o.customerName}
                      <span className="block text-[10px] font-normal text-slate-400">{o.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px]">
                        {o.source}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{o.deliveryType}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">₹{o.totalAmount.toFixed(2)}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.paymentStatus === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.paymentStatus === 'PARTIALLY_PAID'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{o.status}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
