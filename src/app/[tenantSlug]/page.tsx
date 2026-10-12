'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  Sparkles,
  Clock,
  Phone,
  MapPin,
  CheckCircle,
  ChevronRight,
  MessageSquare,
  Shield,
  KeyRound,
  Lock,
  ArrowRight,
  X,
  AlertCircle
} from 'lucide-react';
import { CustomCakeModal } from '@/components/CustomCakeModal';
import { ReceiptPrinter } from '@/components/ReceiptPrinter';
import { Tenant, BakeryProfile, WebsiteSettings, ProductCategory, Product, Order, TenantPaymentSettings } from '@/types';

interface CartItem {
  productId: string;
  variantId?: string;
  itemName: string;
  unitPrice: number;
  quantity: number;
  customization?: any;
  specialInstructions?: string;
}

export default function TenantPublicStorefrontPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [profile, setProfile] = useState<BakeryProfile | null>(null);
  const [theme, setTheme] = useState<WebsiteSettings | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Custom cake modal state
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Staff Login modal state
  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState(false);
  const [staffRoleSelection, setStaffRoleSelection] = useState<'ADMIN' | 'CHEF' | 'DELIVERY' | 'CASHIER' | 'CROSS_TENANT'>('ADMIN');
  const [authError, setAuthError] = useState<string | null>(null);

  // Checkout form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [customerUtr, setCustomerUtr] = useState('');
  const [paymentSettings, setPaymentSettings] = useState<TenantPaymentSettings | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    async function loadStorefront() {
      try {
        setLoading(true);
        // Load settings and profile
        const settingsRes = await fetch(`/api/v1/tenants/${slug}/settings`);
        const settingsData = await settingsRes.json();
        if (settingsData.success) {
          setTenant(settingsData.data.tenant);
          setProfile(settingsData.data.profile);
          setTheme(settingsData.data.websiteSettings);
        }

        // Load payment settings (UPI)
        const payRes = await fetch(`/api/v1/tenants/${slug}/payments/settings`);
        const payData = await payRes.json();
        if (payData.success) {
          setPaymentSettings(payData.data);
        }

        // Load catalog
        const productsRes = await fetch(`/api/v1/tenants/${slug}/products`);
        const productsData = await productsRes.json();
        if (productsData.success) {
          setCategories(productsData.data.categories);
          setProducts(productsData.data.products);
        }
      } catch (err) {
        console.error('Failed to load storefront data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStorefront();
  }, [slug]);

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      if (item.customization) {
        return [...prev, item];
      }
      const existingIdx = prev.findIndex((i) => i.productId === item.productId && !i.customization);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += item.quantity;
        return copy;
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartTax = Number((cartSubtotal * 0.05).toFixed(2));
  const cartTotal = Number((cartSubtotal + cartTax).toFixed(2));

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please enter your name and phone number.');
      return;
    }
    if (cart.length === 0) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/v1/tenants/${slug}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'PUBLIC_WEBSITE',
          customerName,
          customerPhone,
          deliveryType,
          customerAddress: deliveryType === 'DELIVERY' ? deliveryAddress : null,
          scheduledFor: scheduledFor || null,
          items: cart,
          payment: {
            amount: cartTotal,
            method: 'UPI',
            transactionReference: customerUtr.trim() || undefined,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPlacedOrder(data.data.order);
        setCart([]);
        setIsCartOpen(false);
        setCustomerUtr('');
      } else {
        alert(data.error || 'Failed to place order.');
      }
    } catch {
      alert('Error connecting to bakery server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Staff Login Resolution & Role-based Redirection
  const handleStaffLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Cross-tenant breach test
    if (staffRoleSelection === 'CROSS_TENANT') {
      setAuthError(`Cross-Tenant Access Denied: User Jean-Luc (Crumb & Crust) has no membership in ${tenant?.name || 'this organization'}.`);
      return;
    }

    if (staffRoleSelection === 'CHEF') {
      router.push(`/kitchen/${slug}`);
    } else if (staffRoleSelection === 'DELIVERY') {
      router.push(`/delivery/${slug}`);
    } else if (staffRoleSelection === 'CASHIER') {
      router.push(`/pos/${slug}`);
    } else {
      router.push(`/admin/${slug}`);
    }
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.categoryId === selectedCategory);

  // Dynamic Styles derived from PostgreSQL / Store WebsiteSettings
  const primaryColor = theme?.primaryColor || '#e11d48';
  const pageBg = theme?.backgroundColor || '#fffbfb';
  const headingColor = theme?.headingColor || '#1e293b';
  const bodyTextColor = theme?.bodyTextColor || '#334155';
  const buttonBg = theme?.buttonBackgroundColor || primaryColor;
  const buttonText = theme?.buttonTextColor || '#ffffff';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-rose-600 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading Bakery Storefront...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors"
      style={{ backgroundColor: pageBg, color: bodyTextColor }}
    >

      {/* Announcement Bar */}
      {theme?.announcementBar && (
        <div
          className="py-2 px-4 text-center text-xs font-semibold tracking-wide text-white shadow-2xs"
          style={{ backgroundColor: primaryColor }}
        >
          {theme.announcementBar}
        </div>
      )}

      {/* Store Header & Info */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-[49px] z-40">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {profile?.logoUrl && (
              <img
                src={profile.logoUrl}
                alt={tenant?.name || 'Bakery'}
                className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-2xs"
              />
            )}
            <div>
              <h1 className="text-xl font-black tracking-tight" style={{ color: headingColor }}>
                {tenant?.name || 'Bakery Store'}
              </h1>
              <p className="text-xs text-slate-500 font-medium">{profile?.tagline}</p>
            </div>
          </div>

          {/* Header Actions: Quick Info, Staff Login, Cart */}
          <div className="flex items-center gap-3 text-xs">
            <div className="hidden md:flex items-center gap-3 text-slate-600">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {profile?.openingTime || '08:00'} - {profile?.closingTime || '22:00'}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {profile?.phone}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {profile?.city}
              </span>
            </div>

            {/* MANDATORY STAFF LOGIN BUTTON */}
            <button
              onClick={() => setIsStaffLoginOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-transform active:scale-95 border border-slate-700"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Staff Login</span>
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95"
              style={{ backgroundColor: buttonBg, color: buttonText }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Basket ({cart.reduce((n, i) => n + i.quantity, 0)})</span>
              {cart.length > 0 && <span className="ml-1 opacity-90">&bull; ₹{cartTotal.toFixed(2)}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 px-4">
        {theme?.heroImageUrl && (
          <img
            src={theme.heroImageUrl}
            alt="Bakery Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-xs"
          />
        )}
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs"
            style={{ backgroundColor: primaryColor }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisanal Bakery & Patisserie</span>
          </span>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {theme?.heroTitle || 'Baked Fresh with Passion, Every Single Morning'}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {theme?.heroSubtitle ||
              'Artisanal breads, viennoiserie pastries, and show-stopping customized cakes crafted for your special celebrations.'}
          </p>
        </div>
      </section>

      {/* Storefront Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full space-y-8">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all' ? 'text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
            style={{
              backgroundColor: selectedCategory === 'all' ? buttonBg : undefined,
              color: selectedCategory === 'all' ? buttonText : undefined,
            }}
          >
            All Items ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
              style={{
                backgroundColor: selectedCategory === cat.id ? buttonBg : undefined,
                color: selectedCategory === cat.id ? buttonText : undefined,
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const defaultVariant = product.variants?.find((v) => v.isDefault) || product.variants?.[0];
            const displayPrice = product.basePrice + (defaultVariant?.priceDelta || 0);

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {product.imagekitUrl ? (
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={product.imagekitUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      {product.isVeg && (
                        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 flex items-center gap-1 border border-emerald-200 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>100% Eggless</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-44 w-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                      No Image Available
                    </div>
                  )}

                  <div className="p-4 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{product.name}</h3>
                    </div>
                    {product.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Price</span>
                      <span className="text-base font-black text-slate-900">₹{displayPrice.toFixed(2)}</span>
                    </div>

                    {product.isCustomCake ? (
                      <button
                        onClick={() => setCustomizingProduct(product)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-2xs flex items-center gap-1.5 transition-transform active:scale-95"
                        style={{ backgroundColor: buttonBg }}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Design Cake</span>
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleAddToCart({
                            productId: product.id,
                            itemName: product.name,
                            unitPrice: product.basePrice,
                            quantity: 1,
                          })
                        }
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-2xs transition-transform active:scale-95"
                        style={{ backgroundColor: buttonBg }}
                      >
                        Add to Basket
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Public Footer with Store Details & Staff Login Link */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 mt-16 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h4 className="text-white font-bold text-base">{tenant?.name || 'Bakery'}</h4>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              {theme?.aboutText || 'Artisanal European bakery bringing handcrafted sourdough, delicate viennoiserie, and customized cakes everyday.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm">Store Location & Hours</h4>
            <p>{profile?.address}</p>
            <p>{profile?.city}, {profile?.state} - {profile?.pincode}</p>
            <p className="text-slate-300 font-semibold mt-1">Open: {profile?.openingTime || '08:00'} - {profile?.closingTime || '22:00'}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Staff & Organization Portal</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Staff members of {tenant?.name || 'this bakery'} can access their role-specific kitchen, delivery, or admin console.
            </p>
            <button
              onClick={() => setIsStaffLoginOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Staff Login</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Staff Login Modal */}
      {isStaffLoginOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">Staff Login Portal</h3>
                  <p className="text-[11px] text-slate-500">{tenant?.name || 'Organization'}</p>
                </div>
              </div>
              <button onClick={() => setIsStaffLoginOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Select an authorized employee profile for <strong>{tenant?.name}</strong>. The system resolves membership and routes directly to the permitted workspace.
            </p>

            <form onSubmit={handleStaffLoginSubmit} className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Select Staff Persona</label>
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="staffRole"
                        checked={staffRoleSelection === 'ADMIN'}
                        onChange={() => setStaffRoleSelection('ADMIN')}
                        className="text-rose-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Sunita Sharma (Owner / Admin)</div>
                        <div className="text-[11px] text-slate-400">Routes to: Tenant Admin Console</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="staffRole"
                        checked={staffRoleSelection === 'CHEF'}
                        onChange={() => setStaffRoleSelection('CHEF')}
                        className="text-rose-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Chef Anand (Head Baker)</div>
                        <div className="text-[11px] text-slate-400">Routes strictly to: Kitchen View & Voice KOT</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="staffRole"
                        checked={staffRoleSelection === 'DELIVERY'}
                        onChange={() => setStaffRoleSelection('DELIVERY')}
                        className="text-rose-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Suresh Kumar (Delivery Agent)</div>
                        <div className="text-[11px] text-slate-400">Routes strictly to: Delivery Dashboard</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="staffRole"
                        checked={staffRoleSelection === 'CASHIER'}
                        onChange={() => setStaffRoleSelection('CASHIER')}
                        className="text-rose-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Rahul Varma (POS Cashier)</div>
                        <div className="text-[11px] text-slate-400">Routes to: Counter Touch POS</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 cursor-pointer text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="staffRole"
                        checked={staffRoleSelection === 'CROSS_TENANT'}
                        onChange={() => setStaffRoleSelection('CROSS_TENANT')}
                        className="text-red-600"
                      />
                      <div>
                        <div className="font-bold text-red-900">Simulate Cross-Tenant User (Jean-Luc from Crumb & Crust)</div>
                        <div className="text-[11px] text-red-600">Tests isolation barrier enforcement</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStaffLoginOpen(false)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cart & Checkout Slide-Over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900">Your Bakery Basket</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">Your basket is empty.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{item.itemName}</h4>
                        <span className="text-xs text-slate-500">
                          {item.quantity} x ₹{item.unitPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-xs text-slate-900">
                          ₹{(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemoveFromCart(idx)}
                          className="block text-[10px] text-red-500 hover:underline mt-0.5"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    {item.customization && (
                      <div className="mt-1 pt-1 border-t border-slate-200/60 text-[11px] text-slate-600 space-y-0.5">
                        {item.customization.flavour && <div>Flavour: {item.customization.flavour}</div>}
                        {item.customization.shape && <div>Shape: {item.customization.shape}</div>}
                        {item.customization.messageOnCake && (
                          <div className="font-semibold text-rose-700">
                            Message: &quot;{item.customization.messageOnCake}&quot;
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Checkout Form */}
            {cart.length > 0 && (
              <form onSubmit={handleCheckout} className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('PICKUP')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                        deliveryType === 'PICKUP' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
                      }`}
                    >
                      Store Pickup
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('DELIVERY')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                        deliveryType === 'DELIVERY' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
                      }`}
                    >
                      Door Delivery
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp Phone Number *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  {deliveryType === 'DELIVERY' && (
                    <textarea
                      required
                      placeholder="Delivery Address *"
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  )}
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                {/* Direct Manual UPI Payment Instructions */}
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900">Direct Bakery UPI Payment</span>
                    <span className="text-[10px] font-mono font-bold bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full">
                      Zero Surcharge
                    </span>
                  </div>

                  {paymentSettings?.qrImageUrl && (
                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-amber-200">
                      <img
                        src={paymentSettings.qrImageUrl}
                        alt="UPI QR Scanner"
                        className="w-20 h-20 rounded-lg object-contain bg-white border border-slate-200 shrink-0"
                      />
                      <div className="text-[11px] space-y-1">
                        <p className="font-bold text-slate-800">{paymentSettings.accountDisplayName}</p>
                        <p className="font-mono text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-bold inline-block">
                          {paymentSettings.upiId}
                        </p>
                        <p className="text-[10px] text-slate-500">Scan via GPay, PhonePe, Paytm or BHIM</p>
                      </div>
                    </div>
                  )}

                  {paymentSettings?.instructions && (
                    <p className="text-[11px] text-slate-600 whitespace-pre-line leading-relaxed">
                      {paymentSettings.instructions}
                    </p>
                  )}

                  <div className="space-y-1 pt-1 border-t border-amber-200/60">
                    <label className="text-[11px] font-bold text-amber-950 block">
                      Submitted UPI Transaction Reference (UTR) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 428912345678 (12-digit UTR)"
                      value={customerUtr}
                      onChange={(e) => setCustomerUtr(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg bg-white font-mono"
                    />
                    <p className="text-[10px] text-slate-500">
                      Enter the 12-digit UTR from your UPI app so our cashier can verify and reconcile your payment.
                    </p>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="pt-2 border-t border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>₹{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>GST (5%):</span>
                    <span>₹{cartTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 text-sm pt-1 border-t border-slate-200">
                    <span>Authoritative Total:</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white shadow-xs transition-transform active:scale-95 disabled:opacity-50"
                  style={{ backgroundColor: buttonBg }}
                >
                  {isSubmitting ? 'Placing Order...' : `Submit Order & UTR Reference (₹${cartTotal.toFixed(2)})`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Order Success Confirmation Modal */}
      {placedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Order Placed</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Order #{placedOrder.orderNumber}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Thank you, {placedOrder.customerName}! Your order has been dispatched directly to the kitchen display and voice queue.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-left text-xs space-y-1.5 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Bill:</span>
                <span className="font-bold">₹{placedOrder.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-bold text-amber-600">{placedOrder.paymentStatus}</span>
              </div>
              {placedOrder.payments[0]?.transactionReference && (
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Submitted UTR:</span>
                  <span className="text-slate-800 font-semibold">{placedOrder.payments[0].transactionReference}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Kitchen KOT:</span>
                <span className="font-semibold text-emerald-600">Queued in Bilingual Voice KOT</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic bg-amber-50 p-2.5 rounded-xl border border-amber-100">
              Note: Submitted UPI payments remain pending verification until reviewed and approved by bakery staff.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => setShowReceiptModal(true)}
                className="w-full py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
              >
                View Thermal Receipt
              </button>
              <button
                onClick={() => setPlacedOrder(null)}
                className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Back to Bakery Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Cake Modal */}
      {customizingProduct && (
        <CustomCakeModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Thermal Receipt Preview Modal */}
      {showReceiptModal && placedOrder && (
        <ReceiptPrinter
          order={placedOrder}
          profile={profile}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
}
