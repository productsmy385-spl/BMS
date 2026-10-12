'use client';

import React from 'react';
import Link from 'next/link';
import { Store, Clock, Phone, MapPin, ShoppingBag, KeyRound, Sparkles } from 'lucide-react';
import { BakeryProfile, WebsiteSettings, Tenant } from '@/types';

interface TenantPublicHeaderProps {
  slug: string;
  tenant: Tenant | null;
  profile: BakeryProfile | null;
  theme: WebsiteSettings | null;
  cartCount: number;
  onOpenCart: () => void;
  onOpenStaffLogin: () => void;
}

export function TenantPublicHeader({
  slug,
  tenant,
  profile,
  theme,
  cartCount,
  onOpenCart,
  onOpenStaffLogin,
}: TenantPublicHeaderProps) {
  const primaryColor = theme?.primaryColor || '#e11d48';
  const headerBg = theme?.headerBackgroundColor || '#ffffff';
  const headingColor = theme?.headingColor || '#0f172a';
  const buttonBg = theme?.buttonBackgroundColor || primaryColor;
  const buttonText = theme?.buttonTextColor || '#ffffff';

  return (
    <header
      className="sticky top-0 z-40 border-b border-slate-200/80 shadow-xs transition-colors backdrop-blur-md"
      style={{ backgroundColor: headerBg }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Bakery Brand Info */}
        <Link href={`/${slug}`} className="flex items-center gap-3 group">
          {profile?.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt={tenant?.name || 'Bakery'}
              className="w-10 h-10 rounded-2xl object-cover shadow-xs border border-slate-200"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-2xl text-white flex items-center justify-center font-black shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <Store className="w-5 h-5" />
            </div>
          )}
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight" style={{ color: headingColor }}>
              {tenant?.name || 'Artisanal Bakery'}
            </h1>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              {profile?.tagline || `${profile?.city || 'City'}, ${profile?.state || 'India'}`}
            </p>
          </div>
        </Link>

        {/* Operating Hours & Contact Pill */}
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{profile?.openingTime || '08:00'} - {profile?.closingTime || '22:00'}</span>
          </div>
          {profile?.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile?.city && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{profile.city}</span>
            </div>
          )}
        </div>

        {/* Right Actions: Cart & Staff Login ONLY (NO SUPER ADMIN) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCart}
            className="relative px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-800 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-slate-600" />
            <span>Bag</span>
            {cartCount > 0 && (
              <span
                className="w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center animate-pulse"
                style={{ backgroundColor: primaryColor }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Prominent Staff Login Button for authorized bakery members */}
          <button
            type="button"
            onClick={onOpenStaffLogin}
            className="px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
            style={{ backgroundColor: buttonBg, color: buttonText }}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Staff Login</span>
          </button>
        </div>
      </div>
    </header>
  );
}
