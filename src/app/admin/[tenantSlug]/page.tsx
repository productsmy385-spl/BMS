'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Truck,
  Monitor,
  Boxes,
  Users,
  Shield,
  Palette,
  Database,
  BarChart3,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { TenantConsoleNavigation } from '@/components/TenantConsoleNavigation';
import { Order, InventoryItem, DeliveryAssignment, AuditLog } from '@/types';

export default function TenantDashboardOverviewPage() {
  const params = useParams();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, invRes, delivRes] = await Promise.all([
        fetch(`/api/v1/tenants/${slug}/orders`),
        fetch(`/api/v1/tenants/${slug}/inventory`),
        fetch(`/api/v1/tenants/${slug}/delivery/assignments`),
      ]);

      const [ordersData, invData, delivData] = await Promise.all([
        ordersRes.json(),
        invRes.json(),
        delivRes.json(),
      ]);

      if (ordersData.success && Array.isArray(ordersData.data)) {
        setOrders(ordersData.data);
      }
      if (invData.success) {
        const items = Array.isArray(invData.data)
          ? invData.data
          : (invData.data?.items || []);
        setInventory(items);
      }
      if (delivData.success && Array.isArray(delivData.data)) {
        setDeliveries(delivData.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [slug]);

  // Aggregate metrics
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeDeliveries = Array.isArray(deliveries) ? deliveries : [];
  const safeInventory = Array.isArray(inventory) ? inventory : [];

  const totalSales = safeOrders.reduce((sum, o) => sum + (o.paymentStatus === 'COMPLETED' ? o.totalAmount : 0), 0);
  const activeOrders = safeOrders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  const preparingOrders = safeOrders.filter((o) => o.status === 'PREPARING');
  const readyOrders = safeOrders.filter((o) => o.status === 'READY_FOR_PICKUP');
  const activeDeliveries = safeDeliveries.filter((d) => d.status !== 'DELIVERED');
  const lowStockItems = safeInventory.filter((i) => i.currentStock <= i.lowStockThreshold);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <TenantConsoleNavigation currentSlug={slug} />

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                Tenant Operations Console
              </span>
              <span className="text-xs text-slate-400">FlowDineOS</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Bakery Dashboard — {slug.replace('-', ' ').toUpperCase()}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs"
              title="Refresh metrics"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href={`/pos/${slug}`}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <Monitor className="w-4 h-4" />
              <span>Launch POS</span>
            </Link>
          </div>
        </div>

        {/* Operational Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Gross Sales Today</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">₹{totalSales.toFixed(2)}</div>
            <div className="text-[11px] text-emerald-600 font-medium">Reconciled via Cash/UPI/Card</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Active Kitchen Tickets</span>
              <UtensilsCrossed className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{activeOrders.length}</div>
            <div className="text-[11px] text-amber-600 font-medium">
              {preparingOrders.length} preparing, {readyOrders.length} ready
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Delivery Assignments</span>
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{activeDeliveries.length}</div>
            <div className="text-[11px] text-blue-600 font-medium">Out for delivery / Assigned</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Low-Stock Alerts</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">{lowStockItems.length}</div>
            <div className="text-[11px] text-red-500 font-medium">Items require restock</div>
          </div>
        </div>

        {/* Operational Modules Navigation Tiles */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-xs">
            Operational Management Modules
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Link
              href={`/pos/${slug}`}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-rose-50 text-rose-600 flex items-center justify-center">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Counter POS</h3>
                <p className="text-[11px] text-slate-500">Fast cashier terminal & receipts</p>
              </div>
            </Link>

            <Link
              href={`/kitchen/${slug}`}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-amber-50 text-amber-600 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Kitchen View</h3>
                <p className="text-[11px] text-slate-500">Live KOT & bilingual voice queue</p>
              </div>
            </Link>

            <Link
              href={`/delivery/${slug}`}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-blue-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Delivery Dashboard</h3>
                <p className="text-[11px] text-slate-500">Driver assignments & pickups</p>
              </div>
            </Link>

            <Link
              href={`/admin/${slug}/inventory`}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-purple-50 text-purple-600 flex items-center justify-center">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Inventory</h3>
                <p className="text-[11px] text-slate-500">Stock movements & adjustments</p>
              </div>
            </Link>

            <Link
              href={`/admin/${slug}/staff`}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Staff Roster</h3>
                <p className="text-[11px] text-slate-500">Team members & role assignments</p>
              </div>
            </Link>

            <Link
              href={`/admin/${slug}/roles`}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-amber-50 text-amber-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Roles & Permissions</h3>
                <p className="text-[11px] text-slate-500">RBAC security matrix</p>
              </div>
            </Link>

            <Link
              href={`/admin/${slug}/settings`}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-rose-50 text-rose-600 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Brand Kit & Colors</h3>
                <p className="text-[11px] text-slate-500">Custom theme styling</p>
              </div>
            </Link>

            <Link
              href={`/admin/${slug}/notifications`}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">WhatsApp Outbox</h3>
                <p className="text-[11px] text-slate-500">Interakt delivery logs & retry</p>
              </div>
            </Link>

            <Link
              href={`/admin/${slug}/data`}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-blue-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Import & Export</h3>
                <p className="text-[11px] text-slate-500">CSV/JSON catalogs and backups</p>
              </div>
            </Link>

            <Link
              href={`/admin/${slug}/reports`}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Sales Reports</h3>
                <p className="text-[11px] text-slate-500">Revenue channels & audit ledger</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Live Orders Pipeline */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Recent Customer & POS Orders</h2>
            <Link
              href={`/admin/${slug}/reports`}
              className="text-xs font-semibold text-rose-600 hover:text-rose-500 flex items-center gap-1"
            >
              <span>View full ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">No orders placed yet.</div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">#{order.orderNumber}</span>
                      <span className="text-slate-600 font-medium">{order.customerName}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {order.deliveryType}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {order.items.length} items &middot; {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-slate-900">₹{order.totalAmount.toFixed(2)}</div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : order.status === 'READY_FOR_PICKUP'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
