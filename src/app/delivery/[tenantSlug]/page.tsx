'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Truck, CheckCircle2, Clock, MapPin, Phone, User, Package, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { DeliveryAssignment } from '@/types';

export default function DeliveryAgentDashboardPage() {
  const params = useParams();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [assignments, setAssignments] = useState<DeliveryAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`/api/v1/tenants/${slug}/delivery/assignments`);
      const data = await res.json();
      if (data.success) {
        setAssignments(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch delivery assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    const interval = setInterval(fetchAssignments, 3000);
    return () => clearInterval(interval);
  }, [slug]);

  const handleUpdateStatus = async (assignmentId: string, status: 'PICKED_UP' | 'DELIVERED') => {
    try {
      setUpdatingId(assignmentId);
      const res = await fetch(`/api/v1/tenants/${slug}/delivery/assignments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAssignments();
      } else {
        alert(data.error || 'Failed to update delivery status');
      }
    } catch {
      alert('Error updating delivery status');
    } finally {
      setUpdatingId(null);
    }
  };

  const activeDeliveries = assignments.filter((a) => a.status !== 'DELIVERED');
  const completedDeliveries = assignments.filter((a) => a.status === 'DELIVERED');
  const currentList = activeTab === 'ACTIVE' ? activeDeliveries : completedDeliveries;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <Navigation currentSlug={slug} />

      {/* Driver Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Delivery Agent Portal
                </span>
                <span className="text-xs text-slate-400">FlowDineOS</span>
              </div>
              <h1 className="text-xl font-black text-white">Delivery Dashboard — {slug.replace('-', ' ').toUpperCase()}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'ACTIVE'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Active Orders ({activeDeliveries.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'COMPLETED'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed ({completedDeliveries.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Scope Banner */}
      <div className="bg-blue-950/40 border-b border-blue-900/50 px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-blue-300">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-400" />
            <span>
              <strong>Driver Role Scope:</strong> Strictly restricted to assigned delivery routes and customer contact info. Admin & menu consoles are restricted.
            </span>
          </div>
          <span className="text-[11px] text-blue-400/80">Real-time sync active</span>
        </div>
      </div>

      {/* Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full space-y-4">
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
            <span>Loading delivery assignments...</span>
          </div>
        ) : currentList.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/40 border border-slate-800 rounded-3xl p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No {activeTab.toLowerCase()} delivery orders</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {activeTab === 'ACTIVE'
                ? 'When kitchen marks orders READY for delivery, they will appear here automatically.'
                : 'Delivered orders will be archived in this view.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentList.map((assignment) => {
              const order = assignment.order;
              return (
                <div
                  key={assignment.id}
                  className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-600 transition-colors"
                >
                  <div className="space-y-3">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            Order #{order?.orderNumber || '---'}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              assignment.status === 'DELIVERED'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : assignment.status === 'PICKED_UP'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {assignment.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-white mt-1 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-slate-400" />
                          <span>{order?.customerName || 'Customer'}</span>
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">Total Bill</span>
                        <div className="text-sm font-black text-emerald-400">
                          ₹{order?.totalAmount.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    </div>

                    {/* Customer Contact & Address */}
                    <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 text-xs">
                      <div className="flex items-start gap-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white">Delivery Address:</span>
                          <p className="text-slate-300 mt-0.5 leading-relaxed">
                            {order?.customerAddress || 'Customer pickup requested'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{order?.customerPhone}</span>
                        </div>
                        <a
                          href={`tel:${order?.customerPhone}`}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Customer</span>
                        </a>
                      </div>

                      {order?.specialNotes && (
                        <div className="pt-1 border-t border-slate-800 text-[11px] text-amber-300 flex items-start gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>Note: {order.specialNotes}</span>
                        </div>
                      )}
                    </div>

                    {/* Ordered Items Summary */}
                    {order?.items && order.items.length > 0 && (
                      <div className="space-y-1 text-xs">
                        <span className="text-slate-400 font-semibold text-[11px]">Items in Order:</span>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-slate-300 text-[11px]">
                              <span>
                                {item.quantity}x {item.itemName}
                              </span>
                              <span className="text-slate-400">₹{item.totalPrice.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions according to Delivery Workflow */}
                  <div className="pt-2 border-t border-slate-700/60">
                    {assignment.status === 'ASSIGNED' && (
                      <button
                        onClick={() => handleUpdateStatus(assignment.id, 'PICKED_UP')}
                        disabled={updatingId === assignment.id}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs transition-transform shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Package className="w-4 h-4" />
                        <span>Pick Up Order (Notify Customer via WhatsApp)</span>
                      </button>
                    )}

                    {assignment.status === 'PICKED_UP' && (
                      <button
                        onClick={() => handleUpdateStatus(assignment.id, 'DELIVERED')}
                        disabled={updatingId === assignment.id}
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs transition-transform shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Delivered to Customer</span>
                      </button>
                    )}

                    {assignment.status === 'DELIVERED' && (
                      <div className="text-center py-1 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Successfully Delivered</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
