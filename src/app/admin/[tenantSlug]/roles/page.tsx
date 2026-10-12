'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Shield, KeyRound, Plus, Check, RefreshCw, X } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { CustomRole } from '@/types';
import { ROLE_PERMISSIONS } from '@/lib/auth';

const ALL_PERMISSIONS = [
  { id: 'dashboard.view', label: 'View Dashboard Analytics', group: 'Analytics' },
  { id: 'menu.view', label: 'View Catalog Items', group: 'Menu' },
  { id: 'menu.manage', label: 'Create & Edit Menu Items', group: 'Menu' },
  { id: 'orders.view', label: 'View Customer Orders', group: 'Orders' },
  { id: 'orders.create', label: 'Create POS Orders', group: 'Orders' },
  { id: 'kitchen.view', label: 'Access Kitchen Display', group: 'Kitchen' },
  { id: 'kitchen.update', label: 'Update KOT Statuses', group: 'Kitchen' },
  { id: 'delivery.view', label: 'Access Delivery Orders', group: 'Delivery' },
  { id: 'delivery.assign', label: 'Assign Orders to Drivers', group: 'Delivery' },
  { id: 'delivery.update_status', label: 'Update Delivery Progress', group: 'Delivery' },
  { id: 'staff.view', label: 'View Staff Members', group: 'Staff' },
  { id: 'staff.manage', label: 'Invite & Manage Staff', group: 'Staff' },
  { id: 'inventory.view', label: 'View Inventory Levels', group: 'Inventory' },
  { id: 'inventory.manage', label: 'Adjust Stock Counts', group: 'Inventory' },
  { id: 'reports.view', label: 'View Financial & Sales Reports', group: 'Reports' },
  { id: 'data.export', label: 'Export Data (CSV/JSON)', group: 'Data' },
  { id: 'data.import', label: 'Import Product Catalogs', group: 'Data' },
  { id: 'payments.manage', label: 'Record & Manage Payments', group: 'Finance' },
  { id: 'settings.manage', label: 'Update Store Settings', group: 'Settings' },
];

export default function TenantRolesAndPermissionsPage() {
  const params = useParams();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/tenants/${slug}/roles`);
      const data = await res.json();
      if (data.success) {
        setRoles(data.data);
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [slug]);

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedPermissions.length === 0) {
      alert('Please enter a role name and select at least one permission.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/v1/tenants/${slug}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, permissions: selectedPermissions }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateOpen(false);
        setName('');
        setDescription('');
        setSelectedPermissions([]);
        fetchRoles();
      } else {
        alert(data.error || 'Failed to create role');
      }
    } catch {
      alert('Error creating role');
    } finally {
      setIsSubmitting(false);
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
              <KeyRound className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Access Control
                </span>
                <span className="text-xs text-slate-400">FlowDineOS</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">Roles & Granular Permissions</h1>
            </div>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Create Custom Role</span>
          </button>
        </div>

        {/* Built-in System Roles Reference Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-600" />
            <span>Standard Built-in System Roles</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900">Bakery Admin</span>
              <p className="text-slate-500 text-[11px]">Unrestricted access to all tenant operational modules.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900">Chef / Kitchen</span>
              <p className="text-slate-500 text-[11px]">Restricted strictly to live KOT orders and prep updates.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900">Delivery Agent</span>
              <p className="text-slate-500 text-[11px]">Restricted strictly to assigned deliveries and pickups.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900">POS Cashier</span>
              <p className="text-slate-500 text-[11px]">Counter order entry, payments, and receipt printing.</p>
            </div>
          </div>
        </div>

        {/* Custom Roles List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Tenant Custom Roles ({roles.length})</h2>
            <button onClick={fetchRoles} className="text-slate-400 hover:text-slate-600">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading custom roles...</div>
          ) : roles.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No custom roles created yet. Click "Create Custom Role" to define tailor-made permissions.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {roles.map((r) => (
                <div key={r.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{r.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                        {r.id}
                      </span>
                    </div>
                    {r.description && <p className="text-xs text-slate-500">{r.description}</p>}
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-w-lg">
                    {r.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Role Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Define Custom Role</h3>
                <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRole} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Role Title</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Afternoon Shift Supervisor"
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of role responsibilities"
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">
                    Granted Permissions ({selectedPermissions.length} selected)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                    {ALL_PERMISSIONS.map((perm) => {
                      const checked = selectedPermissions.includes(perm.id);
                      return (
                        <label
                          key={perm.id}
                          className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer border text-xs transition-colors ${
                            checked
                              ? 'bg-rose-50 border-rose-300 text-rose-900'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePermission(perm.id)}
                            className="mt-0.5 rounded text-rose-600"
                          />
                          <div>
                            <div className="font-semibold">{perm.label}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{perm.id}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving Role...' : 'Save Custom Role'}
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
