'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Search, Monitor, Printer, CreditCard, Banknote, QrCode, Plus, Minus, Trash2, CheckCircle, Sparkles } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { ReceiptPrinter } from '@/components/ReceiptPrinter';
import { Tenant, BakeryProfile, ProductCategory, Product, Order, PaymentMethod } from '@/types';

interface POSCartItem {
  productId: string;
  itemName: string;
  unitPrice: number;
  quantity: number;
}

export default function CounterPOSPage() {
  const params = useParams();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [profile, setProfile] = useState<BakeryProfile | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('9876543210');

  // Checkout & Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [tenderedCash, setTenderedCash] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    async function loadPOSData() {
      try {
        setLoading(true);
        const [settingsRes, productsRes] = await Promise.all([
          fetch(`/api/v1/tenants/${slug}/settings`),
          fetch(`/api/v1/tenants/${slug}/products`),
        ]);

        const settingsData = await settingsRes.json();
        const productsData = await productsRes.json();

        if (settingsData.success) {
          setTenant(settingsData.data.tenant);
          setProfile(settingsData.data.profile);
        }
        if (productsData.success) {
          setCategories(productsData.data.categories);
          setProducts(productsData.data.products);
        }
      } catch (err) {
        console.error('POS load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPOSData();
  }, [slug]);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.productId === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [
        ...prev,
        {
          productId: product.id,
          itemName: product.name,
          unitPrice: product.basePrice,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as POSCartItem[]
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const handleCompleteOrder = async () => {
    if (cart.length === 0) return;
    try {
      setIsProcessing(true);
      const res = await fetch(`/api/v1/tenants/${slug}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'POS',
          deliveryType: 'PICKUP',
          customerName: customerName || 'Walk-in Guest',
          customerPhone: customerPhone || '+91 9999999999',
          items: cart,
          payment: {
            method: paymentMethod,
            amount: total,
            transactionReference: paymentMethod === 'UPI' ? `UPI-${Date.now().toString().slice(-6)}` : null,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCompletedOrder(data.data.order);
        setCart([]);
        setIsPaymentModalOpen(false);
        setShowReceipt(true);
      } else {
        alert(data.error || 'Failed to complete order.');
      }
    } catch {
      alert('Error communicating with POS backend.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = products
    .filter((p) => (selectedCategory === 'all' ? true : p.categoryId === selectedCategory))
    .filter((p) =>
      searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
    );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-sm font-semibold text-slate-500">Initializing Counter POS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navigation currentSlug={slug} />

      {/* POS Top Action Bar */}
      <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight">{tenant?.name} • Counter POS</h1>
            <p className="text-[11px] text-slate-400">Terminal 01 • Active Cashier</p>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search items by name, barcode or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800 text-white text-xs rounded-xl border border-slate-700 focus:outline-hidden focus:border-emerald-500 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
            {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* POS Two-Column Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Product Touch Catalog */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              All Items ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 flex-1 overflow-y-auto">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => handleAddToCart(p)}
                className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 text-left flex flex-col justify-between transition-all group active:scale-98"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        p.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    />
                    {p.isCustomCake && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-sm">
                        Custom
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {p.name}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">₹{p.basePrice.toFixed(2)}</span>
                  <span className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center text-xs transition-colors">
                    +
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: POS Cart & Counter Checkout */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
          {/* Cart Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-slate-900">Current Sale Ticket</h2>
              <p className="text-[11px] text-slate-500">{cart.length} items in cart</p>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-[11px] font-semibold text-red-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Customer Quick Input */}
          <div className="p-3 bg-slate-100/60 border-b border-slate-200 grid grid-cols-2 gap-2 text-xs">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            />
            <input
              type="text"
              placeholder="Phone (WhatsApp)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            />
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Monitor className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-semibold">Ready for items</p>
                <p className="text-[11px] text-slate-400">Tap items on the left to add to sale</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{item.itemName}</h4>
                    <span className="text-[11px] text-slate-500">₹{item.unitPrice.toFixed(2)} each</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, -1)}
                      className="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100"
                    >
                      <Minus className="w-3 h-3 text-slate-600" />
                    </button>
                    <span className="w-5 text-center font-bold text-xs text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, 1)}
                      className="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100"
                    >
                      <Plus className="w-3 h-3 text-slate-600" />
                    </button>
                  </div>

                  <div className="text-right w-16">
                    <span className="font-extrabold text-xs text-slate-900">
                      ₹{(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Calculation Breakdown & Action Bar */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
            <div className="text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (5%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 text-base pt-1 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-emerald-700">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={cart.length === 0}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
            >
              <CreditCard className="w-4 h-4" />
              <span>Charge ₹{total.toFixed(2)} (Pay & Print)</span>
            </button>
          </div>
        </div>
      </div>

      {/* POS Payment Selection Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900">Record Payment</h3>
                <p className="text-xs text-slate-500">Order Total: ₹{total.toFixed(2)}</p>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-2xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <QrCode className="w-5 h-5 text-emerald-600" />
                <span>UPI QR</span>
              </button>

              <button
                onClick={() => setPaymentMethod('CASH')}
                className={`p-3 rounded-2xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'CASH'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-600" />
                <span>Cash</span>
              </button>

              <button
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-2xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'CARD'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Card</span>
              </button>
            </div>

            {/* Method Details */}
            {paymentMethod === 'UPI' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="w-32 h-32 bg-white rounded-xl border border-slate-200 mx-auto flex items-center justify-center shadow-xs">
                  <QrCode className="w-24 h-24 text-slate-800" />
                </div>
                <p className="text-xs font-semibold text-slate-700">Scan UPI QR to Pay ₹{total.toFixed(2)}</p>
                <p className="text-[10px] text-slate-400">Auto-matched with Storefront UPI ID</p>
              </div>
            )}

            {paymentMethod === 'CASH' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Tendered Cash Amount</label>
                <input
                  type="number"
                  placeholder={`e.g. ${Math.ceil(total / 100) * 100}`}
                  value={tenderedCash}
                  onChange={(e) => setTenderedCash(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
                {Number(tenderedCash) >= total && (
                  <div className="p-2 bg-emerald-50 rounded-lg text-xs text-emerald-800 font-semibold flex justify-between">
                    <span>Change Due to Customer:</span>
                    <span>₹{(Number(tenderedCash) - total).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Submit Action */}
            <button
              onClick={handleCompleteOrder}
              disabled={isProcessing}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98"
            >
              <Printer className="w-4 h-4" />
              <span>{isProcessing ? 'Processing...' : 'Confirm Payment & Print Receipt'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Thermal Receipt Print Modal */}
      {showReceipt && completedOrder && (
        <ReceiptPrinter
          order={completedOrder}
          profile={profile}
          onClose={() => {
            setShowReceipt(false);
            setCompletedOrder(null);
          }}
        />
      )}
    </div>
  );
}
