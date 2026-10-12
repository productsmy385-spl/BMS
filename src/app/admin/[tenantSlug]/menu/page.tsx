'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Store, Plus, Search, Check, RefreshCw, Tag, Sparkles } from 'lucide-react';
import { TenantConsoleNavigation } from '@/components/TenantConsoleNavigation';
import { ProductCategory, Product } from '@/types';

export default function TenantMenuManagementPage() {
  const params = useParams();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/tenants/${slug}/products`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data.categories || []);
        setProducts(data.data.products || []);
      }
    } catch (err) {
      console.error('Failed to load menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [slug]);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <TenantConsoleNavigation currentSlug={slug} />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Store className="w-6 h-6 text-rose-500" />
              <span>Menu &amp; Catalog Management</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage product categories, prices, taxes, and stock availability across online storefront and POS.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchMenu}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search product items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Items ({products.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">{p.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">Slug: {p.slug}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    p.isInStock ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {p.isInStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>

                <div className="flex items-center gap-2 pt-2 text-xs">
                  <span className="font-bold text-rose-400 text-sm">₹{p.basePrice}</span>
                  <span className="text-slate-500 font-mono text-[11px]">GST: {p.taxRate}%</span>
                  {p.isCustomCake && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                      Custom Cake Studio
                    </span>
                  )}
                </div>
              </div>

              {p.variants && p.variants.length > 0 && (
                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Variants: </span>
                  {p.variants.map((v) => `${v.name} (+₹${v.priceDelta})`).join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
