'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { UserCheck, Search, RefreshCw, Phone, Mail, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
import { TenantConsoleNavigation } from '@/components/TenantConsoleNavigation';
import { Customer } from '@/types';

export default function TenantCustomersPage() {
  const params = useParams();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/tenants/${slug}/customers`);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [slug]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <TenantConsoleNavigation currentSlug={slug} />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-rose-500" />
              <span>Customer Directory &amp; History</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Tenant-isolated customer relationships, order frequencies, and lifetime value.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchCustomers}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by customer name, phone or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
          />
        </div>

        {/* Table */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Total Orders</th>
                  <th className="p-4">Lifetime Spent</th>
                  <th className="p-4">Last Order</th>
                  <th className="p-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No customer records found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white">{c.name}</td>
                      <td className="p-4 font-mono text-slate-300">{c.phone}</td>
                      <td className="p-4 text-slate-400">{c.email || '—'}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 font-semibold text-[11px]">
                          {c.totalOrdersCount} orders
                        </span>
                      </td>
                      <td className="p-4 font-bold text-rose-400">₹{c.totalSpentAmount.toFixed(2)}</td>
                      <td className="p-4 text-slate-400 text-[11px]">
                        {c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="p-4 text-slate-400 text-[11px] italic">{c.notes || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
