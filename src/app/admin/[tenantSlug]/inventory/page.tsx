'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Boxes, AlertTriangle, ArrowUpDown, Plus, Minus, History, CheckCircle2, RefreshCw } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { InventoryItem, StockMovement, StockMovementReason } from '@/types';

export default function TenantInventoryPage() {
  const params = useParams();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  // Adjustment modal
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [changeAmount, setChangeAmount] = useState<number>(10);
  const [reason, setReason] = useState<StockMovementReason>('PURCHASE_RESTOCK');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/tenants/${slug}/inventory`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data.items);
        setMovements(data.data.movements);
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [slug]);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/v1/tenants/${slug}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventoryItemId: selectedItem.id,
          change: changeAmount,
          reason,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedItem(null);
        setNotes('');
        fetchInventory();
      } else {
        alert(data.error || 'Failed to adjust stock');
      }
    } catch {
      alert('Error updating inventory stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navigation currentSlug={slug} />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Title */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Boxes className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Inventory & Stock Tracking</h1>
              <p className="text-xs text-slate-500 font-medium">
                Live ingredient & retail stock monitoring with immutable audit movements.
              </p>
            </div>
          </div>

          <button
            onClick={fetchInventory}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Stock Overview Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-900">Current Stock Levels</h2>
            <span className="text-xs text-slate-500">{items.length} Tracked SKUs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Threshold</th>
                  <th className="py-3 px-4">Health Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {items.map((item) => {
                  const isLow = item.currentStock <= item.lowStockThreshold;
                  const isOut = item.currentStock <= 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{item.sku}</td>
                      <td className="py-3.5 px-4 text-sm font-black text-slate-900">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {item.lowStockThreshold} {item.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3" />
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            <AlertTriangle className="w-3 h-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Optimal
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setChangeAmount(10);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs shadow-2xs"
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Movement Audit Log */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <h3 className="font-bold text-sm text-slate-900">Recent Stock Movements Log</h3>
            </div>
            <span className="text-xs text-slate-500">Immutable Audit Trail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Change (+/-)</th>
                  <th className="py-3 px-4">Balance After</th>
                  <th className="py-3 px-4">Movement Reason</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-black">
                      <span className={m.quantityChange > 0 ? 'text-emerald-600' : 'text-red-600'}>
                        {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{m.balanceAfter}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px]">
                        {m.reason}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{m.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Adjust Stock Dialog */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Adjust Stock</h3>
                <p className="text-xs text-slate-500">{selectedItem.name} ({selectedItem.sku})</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Quantity Adjustment (positive to add, negative to deduct)
                </label>
                <input
                  type="number"
                  required
                  value={changeAmount}
                  onChange={(e) => setChangeAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Adjustment *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as StockMovementReason)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                >
                  <option value="PURCHASE_RESTOCK">Purchase Restock / Fresh Bake</option>
                  <option value="MANUAL_CORRECTION">Manual Inventory Count Correction</option>
                  <option value="EXPIRED">Expired Ingredients / Out of Date</option>
                  <option value="SPOILED">Damaged / Dropped / Spoiled</option>
                  <option value="RETURN">Customer Return</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes / Batch Number</label>
                <input
                  type="text"
                  placeholder="e.g. Afternoon fresh bake batch #4"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'Recording...' : 'Record Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
