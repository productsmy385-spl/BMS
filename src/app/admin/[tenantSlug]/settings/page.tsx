'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Palette, Check, RefreshCw, Eye, Sparkles, Save } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { WebsiteSettings, Tenant, BakeryProfile } from '@/types';

export default function TenantBrandingSettingsPage() {
  const params = useParams();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [profile, setProfile] = useState<BakeryProfile | null>(null);

  // Form State for Website Colors & Branding
  const [primaryColor, setPrimaryColor] = useState('#e11d48');
  const [secondaryColor, setSecondaryColor] = useState('#f43f5e');
  const [backgroundColor, setBackgroundColor] = useState('#fffbfb');
  const [cardBackgroundColor, setCardBackgroundColor] = useState('#ffffff');
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState('#ffffff');
  const [navBackgroundColor, setNavBackgroundColor] = useState('#ffffff');
  const [buttonBackgroundColor, setButtonBackgroundColor] = useState('#e11d48');
  const [buttonTextColor, setButtonTextColor] = useState('#ffffff');
  const [headingColor, setHeadingColor] = useState('#1e293b');
  const [bodyTextColor, setBodyTextColor] = useState('#334155');
  const [entireTextColor, setEntireTextColor] = useState('#334155');
  const [linkColor, setLinkColor] = useState('#e11d48');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [announcementBar, setAnnouncementBar] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/tenants/${slug}/settings`);
        const data = await res.json();
        if (data.success) {
          setTenant(data.data.tenant);
          setProfile(data.data.profile);
          const s: WebsiteSettings = data.data.websiteSettings;
          if (s) {
            setPrimaryColor(s.primaryColor || '#e11d48');
            setSecondaryColor(s.secondaryColor || '#f43f5e');
            setBackgroundColor(s.backgroundColor || '#fffbfb');
            setCardBackgroundColor(s.cardBackgroundColor || '#ffffff');
            setHeaderBackgroundColor(s.headerBackgroundColor || '#ffffff');
            setNavBackgroundColor(s.navBackgroundColor || '#ffffff');
            setButtonBackgroundColor(s.buttonBackgroundColor || s.primaryColor || '#e11d48');
            setButtonTextColor(s.buttonTextColor || '#ffffff');
            setHeadingColor(s.headingColor || '#1e293b');
            setBodyTextColor(s.bodyTextColor || '#334155');
            setEntireTextColor(s.entireTextColor || s.bodyTextColor || '#334155');
            setLinkColor(s.linkColor || s.primaryColor || '#e11d48');
            setFontFamily(s.fontFamily || 'Inter');
            setHeroTitle(s.heroTitle || '');
            setHeroSubtitle(s.heroSubtitle || '');
            setAnnouncementBar(s.announcementBar || '');
          }
        }
      } catch (err) {
        console.error('Failed to load branding settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [slug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch(`/api/v1/tenants/${slug}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteSettings: {
            primaryColor,
            secondaryColor,
            backgroundColor,
            cardBackgroundColor,
            headerBackgroundColor,
            navBackgroundColor,
            buttonBackgroundColor,
            buttonTextColor,
            headingColor,
            bodyTextColor,
            entireTextColor,
            linkColor,
            fontFamily,
            heroTitle,
            heroSubtitle,
            announcementBar,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to update settings');
      }
    } catch {
      alert('Error updating branding settings');
    } finally {
      setSaving(false);
    }
  };

  const presetPalettes = [
    {
      name: 'Rose & Berry (Current Sweet Delights)',
      primary: '#e11d48',
      secondary: '#f43f5e',
      bg: '#fffbfb',
      btn: '#e11d48',
      head: '#1e293b',
    },
    {
      name: 'French Amber & Espresso (Crumb & Crust)',
      primary: '#d97706',
      secondary: '#f59e0b',
      bg: '#fefcf8',
      btn: '#d97706',
      head: '#1c1917',
    },
    {
      name: 'Matcha & Vanilla Cream',
      primary: '#059669',
      secondary: '#10b981',
      bg: '#f0fdf4',
      btn: '#059669',
      head: '#064e3b',
    },
    {
      name: 'Midnight Chocolate Velvet',
      primary: '#475569',
      secondary: '#64748b',
      bg: '#f8fafc',
      btn: '#0f172a',
      head: '#020617',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-semibold text-slate-500">Loading Theme Customizer...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation currentSlug={slug} />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Title Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Palette className="w-6 h-6 text-rose-600" />
              <h1 className="text-2xl font-black text-slate-900">Public Website Theme & Colors</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Customize colours, typography, and banners for{' '}
              <strong className="text-slate-700">{tenant?.name}</strong>. Persisted to database per tenant.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Live Storefront</span>
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xs disabled:opacity-50 transition-transform active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Theme'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preset Palettes Quick Pick */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Curated Bakery Colour Palettes</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {presetPalettes.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setPrimaryColor(p.primary);
                  setSecondaryColor(p.secondary);
                  setBackgroundColor(p.bg);
                  setButtonBackgroundColor(p.btn);
                  setLinkColor(p.primary);
                  setHeadingColor(p.head);
                }}
                className="p-3 rounded-xl border border-slate-200 text-left hover:border-slate-400 transition-all group"
              >
                <div className="flex gap-1.5 mb-2">
                  <span className="w-6 h-6 rounded-full shadow-xs border border-white" style={{ backgroundColor: p.primary }} />
                  <span className="w-6 h-6 rounded-full shadow-xs border border-white" style={{ backgroundColor: p.secondary }} />
                  <span className="w-6 h-6 rounded-full shadow-xs border border-white" style={{ backgroundColor: p.bg }} />
                </div>
                <span className="text-xs font-semibold text-slate-800 block group-hover:text-rose-600 transition-colors">
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Colour Configuration Grid & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Exact Hex Colour Settings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Primary Color */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="font-bold text-slate-700 block">Primary Brand Colour</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 font-mono text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="font-bold text-slate-700 block">Secondary Accent Colour</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 font-mono text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Page Background */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="font-bold text-slate-700 block">Page Background Colour</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 font-mono text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Card Background */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="font-bold text-slate-700 block">Card Background Colour</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cardBackgroundColor}
                    onChange={(e) => setCardBackgroundColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={cardBackgroundColor}
                    onChange={(e) => setCardBackgroundColor(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 font-mono text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Button Background */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="font-bold text-slate-700 block">Button Background Colour</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={buttonBackgroundColor}
                    onChange={(e) => setButtonBackgroundColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={buttonBackgroundColor}
                    onChange={(e) => setButtonBackgroundColor(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 font-mono text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Button Text Color */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="font-bold text-slate-700 block">Button Text Colour</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={buttonTextColor}
                    onChange={(e) => setButtonTextColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={buttonTextColor}
                    onChange={(e) => setButtonTextColor(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 font-mono text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Heading Color */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="font-bold text-slate-700 block">Heading Colour</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={headingColor}
                    onChange={(e) => setHeadingColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={headingColor}
                    onChange={(e) => setHeadingColor(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 font-mono text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Body Text Color */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="font-bold text-slate-700 block">Body & Overall Text Colour</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bodyTextColor}
                    onChange={(e) => {
                      setBodyTextColor(e.target.value);
                      setEntireTextColor(e.target.value);
                    }}
                    className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={bodyTextColor}
                    onChange={(e) => {
                      setBodyTextColor(e.target.value);
                      setEntireTextColor(e.target.value);
                    }}
                    className="flex-1 px-2.5 py-1.5 font-mono text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Typography & Marketing Text */}
            <div className="pt-4 border-t border-slate-200 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Announcement Top Bar Text</label>
                <input
                  type="text"
                  value={announcementBar}
                  onChange={(e) => setAnnouncementBar(e.target.value)}
                  placeholder="e.g. 🎉 Free delivery on orders over ₹1,500!"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hero Title</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Hero headline"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hero Subtitle</label>
                <textarea
                  rows={2}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Hero description"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>
            </div>
          </div>

          {/* Interactive Live Mini-Preview */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Instant Responsive Live Preview</span>
            </h3>

            {/* Mock Mini Browser Frame */}
            <div
              className="rounded-2xl border-2 border-slate-300 shadow-xl overflow-hidden transition-all duration-300"
              style={{ backgroundColor }}
            >
              {/* Mini Browser Bar */}
              <div className="bg-slate-200 px-3 py-1.5 flex items-center gap-1.5 border-b border-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-slate-500 font-mono ml-2">
                  app.bakeryms.com/{slug}
                </span>
              </div>

              {/* Announcement Bar */}
              {announcementBar && (
                <div
                  className="px-3 py-1 text-[10px] font-bold text-center text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {announcementBar}
                </div>
              )}

              {/* Mini Header */}
              <div
                className="px-4 py-3 border-b flex items-center justify-between"
                style={{ backgroundColor: headerBackgroundColor }}
              >
                <div>
                  <h4 className="text-sm font-black" style={{ color: headingColor }}>
                    {tenant?.name}
                  </h4>
                  <p className="text-[10px]" style={{ color: bodyTextColor }}>
                    Artisan Bakery
                  </p>
                </div>
                <div
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
                  style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor }}
                >
                  Basket (2)
                </div>
              </div>

              {/* Mini Hero */}
              <div className="p-4 bg-slate-900 text-white space-y-1.5 text-center">
                <h5 className="font-extrabold text-sm">{heroTitle || 'Baked Fresh Everyday'}</h5>
                <p className="text-[10px] text-slate-300 line-clamp-2">
                  {heroSubtitle || 'Handcrafted European pastries and sourdough.'}
                </p>
              </div>

              {/* Mini Product Cards Preview */}
              <div className="p-4 space-y-3">
                <div
                  className="p-3 rounded-xl border border-slate-200/60 shadow-xs flex items-center justify-between"
                  style={{ backgroundColor: cardBackgroundColor }}
                >
                  <div>
                    <h5 className="font-bold text-xs" style={{ color: headingColor }}>
                      Classic Butter Croissant
                    </h5>
                    <span className="text-[11px] font-extrabold" style={{ color: bodyTextColor }}>
                      ₹120.00
                    </span>
                  </div>
                  <button
                    className="px-3 py-1 rounded-lg text-[10px] font-bold shadow-2xs"
                    style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor }}
                  >
                    Add
                  </button>
                </div>

                <div
                  className="p-3 rounded-xl border border-slate-200/60 shadow-xs flex items-center justify-between"
                  style={{ backgroundColor: cardBackgroundColor }}
                >
                  <div>
                    <h5 className="font-bold text-xs" style={{ color: headingColor }}>
                      Signature Celebration Cake
                    </h5>
                    <span className="text-[11px] font-extrabold" style={{ color: bodyTextColor }}>
                      ₹750.00
                    </span>
                  </div>
                  <button
                    className="px-3 py-1 rounded-lg text-[10px] font-bold shadow-2xs"
                    style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor }}
                  >
                    Customize
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
