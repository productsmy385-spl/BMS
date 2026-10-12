'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Users, UserPlus, Shield, Check, X, Mail, Phone, RefreshCw } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { StaffUser, Role } from '@/types';

export default function TenantStaffManagementPage() {
  const params = useParams();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('POS_STAFF');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/tenants/${slug}/staff`);
      const data = await res.json();
      if (data.success) {
        setStaff(data.data);
      }
    } catch (err) {
      console.error('Failed to load staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [slug]);

  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/v1/tenants/${slug}/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, role }),
      });
      const data = await res.json();
      if (data.success) {
        setIsInviteOpen(false);
        setName('');
        setEmail('');
        setPhone('');
        fetchStaff();
      } else {
        alert(data.error || 'Failed to register staff');
      }
    } catch {
      alert('Error registering staff');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (staffId: string) => {
    try {
      const res = await fetch(`/api/v1/tenants/${slug}/staff`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchStaff();
      }
    } catch {
      alert('Error updating staff status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navigation currentSlug={slug} />

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Users className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Tenant Administration
                </span>
                <span className="text-xs text-slate-400">FlowDineOS</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">Staff Members & Roster</h1>
            </div>
          </div>

          <button
            onClick={() => setIsInviteOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>Invite Team Member</span>
          </button>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Active Staff Directory ({staff.length})</h2>
            <button onClick={fetchStaff} className="text-slate-400 hover:text-slate-600">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading staff members...</div>
          ) : staff.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No staff members configured.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Assigned Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staff.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{m.name}</div>
                        <div className="text-[11px] text-slate-400">{m.id}</div>
                      </td>
                      <td className="px-4 py-3 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{m.email}</span>
                        </div>
                        {m.phone && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{m.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                            m.role === 'BAKERY_ADMIN'
                              ? 'bg-rose-100 text-rose-700'
                              : m.role === 'KITCHEN_STAFF'
                              ? 'bg-amber-100 text-amber-700'
                              : m.role === 'DELIVERY_STAFF'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {m.role.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            m.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${m.isActive ? 'bg-emerald-500' : 'bg-red-400'}`} />
                          {m.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleToggleStatus(m.id)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                            m.isActive
                              ? 'bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-700'
                              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          }`}
                        >
                          {m.isActive ? 'Deactivate' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Invite Staff Modal */}
        {isInviteOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Invite New Staff Member</h3>
                <button onClick={() => setIsInviteOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleInviteStaff} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@bakery.com"
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Mobile Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Role & Scope</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="BAKERY_ADMIN">Bakery Admin (Full Store Access)</option>
                    <option value="ORDER_MANAGER">Order & Inventory Manager</option>
                    <option value="POS_STAFF">POS Staff / Cashier</option>
                    <option value="KITCHEN_STAFF">Chef / Kitchen Staff (Kitchen View Only)</option>
                    <option value="DELIVERY_STAFF">Delivery Agent (Delivery Portal Only)</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(false)}
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Registering...' : 'Add Team Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
