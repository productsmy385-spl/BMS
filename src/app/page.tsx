'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Store,
  Volume2,
  Truck,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Monitor,
  Palette,
  CreditCard,
  Users,
  BarChart3,
  Check,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { SaaSNavigation } from '@/components/SaaSNavigation';

export default function FlowDineOSSaaSLandingPage() {
  // Demo request form state
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    outletsCount: 1,
    requirements: '',
    preferredContact: 'PHONE' as 'EMAIL' | 'PHONE' | 'WHATSAPP',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const res = await fetch('/api/v1/demo-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(
          `Thank you, ${formData.name}! Your demo request has been logged (ID: ${data.data.id}). Our bakery solutions engineer will contact you shortly via ${formData.preferredContact}.`
        );
        setFormData({
          name: '',
          businessName: '',
          email: '',
          phone: '',
          outletsCount: 1,
          requirements: '',
          preferredContact: 'PHONE',
        });
      } else {
        setSubmitError(data.error || 'Failed to submit demo request.');
      }
    } catch {
      setSubmitError('Unable to connect to the FlowDineOS server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeBakeries = [
    {
      name: 'Sweet Delights Bakery',
      slug: 'sweet-delights',
      city: 'Hyderabad, Jubilee Hills',
      theme: 'Vibrant Rose & Cream',
      tagline: 'Artisanal Breads, Patisserie & Custom Celebration Cakes',
      badgeColor: 'bg-rose-500 text-white',
      borderHover: 'hover:border-rose-400',
      features: ['Bilingual Voice KOT (EN+TE)', 'Custom 3D Cake Studio', 'Manual UPI Verification'],
    },
    {
      name: 'Crumb & Crust Patisserie',
      slug: 'crumb-crust',
      city: 'Bengaluru, Indiranagar',
      theme: 'French Amber & Slate',
      tagline: 'Gourmet French Bakery, Sourdough & Classic Gateaux',
      badgeColor: 'bg-amber-500 text-white',
      borderHover: 'hover:border-amber-400',
      features: ['Driver Delivery Routing', 'Direct Counter POS', 'Brand Kit Customizer'],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-rose-500 selection:text-white">
      <SaaSNavigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(225,29,72,0.18),rgba(255,255,255,0))]" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Next-Generation Cloud ERP for Modern Bakery Organizations</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight max-w-5xl mx-auto">
            The Autonomous Operating System for{' '}
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              Independent Bakeries.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Replace chaotic paper slips, noisy printers, and disjointed aggregators. FlowDineOS provisions your bakery with an isolated dynamic storefront, hands-free <strong>Bilingual Voice KOT</strong>, delivery driver dispatch, and automated customer WhatsApp notifications.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
            <a
              href="#book-demo"
              className="px-7 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-900/40 transition-transform active:scale-95 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a 1-on-1 Platform Demo</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#bakeries"
              className="px-7 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold text-sm border border-slate-700 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Store className="w-4 h-4 text-rose-400" />
              <span>Explore Live Bakery Storefronts</span>
            </a>
          </div>

          {/* Social Proof / Key Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12 border-t border-slate-800/80 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl sm:text-3xl font-black text-white">100%</span>
              <p className="text-xs text-slate-400 mt-1">Tenant Logical Data Isolation</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">EN + TE</span>
              <p className="text-xs text-slate-400 mt-1">Bilingual Voice KOT Announcements</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl sm:text-3xl font-black text-rose-400">0%</span>
              <p className="text-xs text-slate-400 mt-1">Commission on Direct UPI Payments</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">&lt;2s</span>
              <p className="text-xs text-slate-400 mt-1">Real-Time Kitchen Ticket Dispatch</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section id="features" className="py-24 px-4 bg-slate-950 border-b border-slate-900">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Complete SaaS Capabilities</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">Engineered for Every Bakery Persona</h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              From head chef to counter cashier, delivery drivers to business owners — FlowDineOS delivers tailored, role-scoped workflows with zero clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Bilingual Voice KOT */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <Volume2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Bilingual Voice KOT</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Noisy thermal printers jam, run out of paper, and create clutter. FlowDineOS speaks new tickets hands-free in <strong>English and Telugu</strong> via Web Speech API with duplicate suppression and manual replay.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Auto-announces on website order placement</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Cashier Select-and-Share to Voice queue</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Custom cake sponge, flavour & message spoken</li>
              </ul>
            </div>

            {/* Pillar 2: Dynamic Public Website & Brand Kit */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Dynamic Storefront & Cakes</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every bakery receives a dynamic public domain (<code>/[tenantSlug]</code>) rendered with their logo, brand colors, custom cake configurator, and a dedicated <strong>Staff Login</strong> portal.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> Interactive multi-tier custom cake studio</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> Live brand kit (primary, header, button colors)</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> Dedicated Staff Login with zero platform leakage</li>
              </ul>
            </div>

            {/* Pillar 3: Driver Dispatch & WhatsApp Outbox */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Driver Portal & WhatsApp</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Chef READY action immediately notifies assigned drivers and queues an Interakt WhatsApp notification. When driver marks PICKED_UP, the customer receives an instant live transit update.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Chef READY &rarr; Automated WhatsApp notification</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Mobile-first driver pickup & delivery dashboard</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Durable outbox pattern with safe retry ledger</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-slate-900/40 border-b border-slate-900">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Lifecycle Pipeline</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">How FlowDineOS Orchestrates an Order</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              A synchronized, durable pipeline from customer click to kitchen oven to driver delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
              <span className="text-3xl font-black text-rose-500/30">01</span>
              <h4 className="font-bold text-sm text-white">Customer Places Order</h4>
              <p className="text-xs text-slate-400">
                Customer selects items on your storefront, customizes cakes, and submits payment via your UPI QR code. Stored securely in PostgreSQL.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
              <span className="text-3xl font-black text-amber-500/30">02</span>
              <h4 className="font-bold text-sm text-white">Voice KOT Announces</h4>
              <p className="text-xs text-slate-400">
                Kitchen display updates in real time. Web Speech engine announces the order number, items, and cake message in English or Telugu.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
              <span className="text-3xl font-black text-blue-500/30">03</span>
              <h4 className="font-bold text-sm text-white">Chef Marks READY</h4>
              <p className="text-xs text-slate-400">
                Order status updates to READY_FOR_PICKUP. Driver receives an alert on their mobile dashboard, and Interakt WhatsApp outbox notifies customer.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
              <span className="text-3xl font-black text-emerald-500/30">04</span>
              <h4 className="font-bold text-sm text-white">Driver PICKED_UP & Delivered</h4>
              <p className="text-xs text-slate-400">
                Driver marks PICKED_UP &rarr; customer receives "On the way" WhatsApp. Driver marks DELIVERED &rarr; order archived with verified audit logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Voice KOT Deep Dive */}
      <section id="voice-kot" className="py-24 px-4 bg-slate-950 border-b border-slate-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">No Thermal Paper Needed</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Bilingual Kitchen Speech.<br />
              <span className="text-amber-400">English & Telugu.</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              In hot and fast-paced commercial bakery kitchens, cooks have flour on their hands. Instead of forcing them to tear thermal receipt rolls, FlowDineOS speaks ticket numbers, product variants, and personalized cake messages directly to the kitchen.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <Volume2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">English Announcement Example</h4>
                  <p className="text-xs text-slate-400 italic mt-0.5">
                    &ldquo;New Order Number 1002. 1 Celebration Custom Cake, Belgian Truffle flavour, Heart shape. Message: Happy Birthday Rahul.&rdquo;
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <Volume2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Telugu Announcement Example (తెలుగు)</h4>
                  <p className="text-xs text-slate-400 italic mt-0.5">
                    &ldquo;Kotta order vachindi. Order number 1002. 1 Celebration Custom Cake, Belgian Truffle flavour. Message: Happy Birthday Rahul.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-500/30 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-white">Live Kitchen Sound Engine</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                Web Speech API
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Audio Pipeline Features</span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> Duplicate suppression</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> One-click replay</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> Offline cache fallback</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> Batch order sharing</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                <strong>Zero Waste:</strong> Save thousands of rupees each month on 80mm thermal paper rolls, replacement print heads, and cable faults.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Active Bakeries Showcase */}
      <section id="bakeries" className="py-24 px-4 bg-slate-900/60 border-b border-slate-900">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Live Demonstrations</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">Experience Active Bakery Tenants</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Explore how independent bakeries operate their public storefronts and staff logins in FlowDineOS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeBakeries.map((b) => (
              <div
                key={b.slug}
                className={`bg-slate-900/90 rounded-3xl p-8 border-2 border-slate-800 transition-all shadow-xl flex flex-col justify-between ${b.borderHover}`}
              >
                <div className="space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${b.badgeColor}`}>
                        Active Organization
                      </span>
                      <h3 className="text-2xl font-black text-white mt-3">{b.name}</h3>
                      <p className="text-xs text-slate-400">{b.city}</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                      /{b.slug}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{b.tagline}</p>

                  <div className="space-y-1.5 text-xs text-slate-400 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    <p className="font-semibold text-slate-200">Tenant Highlights:</p>
                    {b.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between gap-3">
                  <Link
                    href={`/${b.slug}`}
                    className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md"
                  >
                    <Store className="w-4 h-4" />
                    <span>View Public Storefront</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/admin/${b.slug}`}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
                  >
                    <span>Console</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SaaS Packages & Pricing Matrix */}
      <section id="packages" className="py-24 px-4 bg-slate-950 border-b border-slate-900">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Transparent Packages</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">Tailored for Every Scale</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Packages define granular feature entitlements checked server-side across all protected APIs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase text-slate-400">Starter Tier</span>
                <h3 className="text-2xl font-black text-white">Starter Bakery</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹1,999</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ideal for boutique bakeries needing a branded storefront, menu catalog, and direct UPI payments.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Dynamic Storefront (`/[slug]`)</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Menu & Categories Control</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Direct UPI QR Code & Instructions</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Up to 500 orders / mo</li>
                  <li className="flex items-center gap-2 text-slate-500"><span className="w-3.5 h-3.5 text-center">&times;</span> Voice KOT (Excluded)</li>
                  <li className="flex items-center gap-2 text-slate-500"><span className="w-3.5 h-3.5 text-center">&times;</span> Driver Portal (Excluded)</li>
                </ul>
              </div>
              <a
                href="#book-demo"
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-colors block"
              >
                Select Starter
              </a>
            </div>

            {/* Growth - Highlighted */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-rose-500 shadow-xl shadow-rose-950/20 space-y-6 flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                Most Popular
              </div>
              <div className="space-y-4">
                <span className="text-xs font-black uppercase text-rose-400">Growth Tier</span>
                <h3 className="text-2xl font-black text-white">Growth & Multi-Role</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹4,999</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Full multi-role suite with Bilingual Voice KOT, Driver Dispatch, Staff RBAC, and Custom Brand Kit.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> Everything in Starter</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> Bilingual Voice KOT (EN + TE)</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> Delivery Driver Mobile Portal</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> Live Brand Kit Color Theme Studio</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> Staff Directory & RBAC Scoping</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-rose-400" /> Up to 2,500 orders / mo</li>
                </ul>
              </div>
              <a
                href="#book-demo"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs text-center transition-transform active:scale-95 block shadow-md"
              >
                Select Growth
              </a>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase text-amber-400">Enterprise Tier</span>
                <h3 className="text-2xl font-black text-white">Enterprise SaaS</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹9,999</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Complete autonomous infrastructure with Interakt WhatsApp engine, custom roles, and CSV imports.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Everything in Growth</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Automated Interakt WhatsApp Engine</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Custom Roles & Permissions Matrix</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> CSV / JSON Data Import & Export</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Advanced Financial & Sales Reports</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Unlimited Orders & Priority SLA</li>
                </ul>
              </div>
              <a
                href="#book-demo"
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-colors block"
              >
                Select Enterprise
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Book a Demo Form Section */}
      <section id="book-demo" className="py-24 px-4 bg-slate-900/40 border-b border-slate-900">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Get Started Today</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">Book a Personalized FlowDineOS Demo</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Tell us about your bakery outlets. We will set up your trial tenant, demonstrate Bilingual Voice KOT on your hardware, and configure your brand kit.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            {submitSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Demo Request Received</h4>
                <p className="text-xs text-emerald-200 leading-relaxed max-w-lg mx-auto">{submitSuccess}</p>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(null)}
                  className="mt-4 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-5">
                {submitError && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Reddy"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Bakery / Business Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Velvet Crumb Bakers"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh@bakery.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98450 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Number of Outlets</label>
                    <select
                      value={formData.outletsCount}
                      onChange={(e) => setFormData({ ...formData, outletsCount: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-rose-500 transition-colors"
                    >
                      <option value={1}>1 Outlet (Single location)</option>
                      <option value={2}>2 - 4 Outlets</option>
                      <option value={5}>5 - 10 Outlets</option>
                      <option value={11}>10+ Outlets (Franchise Chain)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Preferred Contact Method</label>
                    <select
                      value={formData.preferredContact}
                      onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-rose-500 transition-colors"
                    >
                      <option value="PHONE">Phone Call</option>
                      <option value="WHATSAPP">WhatsApp Message</option>
                      <option value="EMAIL">Email</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Specific Requirements or Pain Points</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Currently having issues with missed phone calls and paper printer jams. Need Telugu speech support for our kitchen staff."
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-sm shadow-xl shadow-rose-950/40 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Registering Your Demo...' : 'Submit Demo Request & Reserve Onboarding Slot'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Company Information & Contact Section */}
      <section id="contact" className="py-20 px-4 bg-slate-950 border-b border-slate-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h4 className="font-black text-sm text-white">About FlowDineOS</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              FlowDineOS is developed by a dedicated team of food-tech architects and bakery operations specialists. We help independent confectioneries and artisan bakeries modernize operations with zero vendor lock-in.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-sm text-white">Headquarters & Support</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Madhapur, HITEC City, Hyderabad, Telangana 500081</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-rose-400" />
                <span>solutions@flowdineos.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-400" />
                <span>+91 40 4821 9900 (Mon - Sat, 9am - 7pm IST)</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-sm text-white">Cloud Architecture & Standards</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hosted on high-availability PostgreSQL on Railway. Isolated tenant boundaries, HTTPS webhook encryption, Interakt official WhatsApp BSP integration, and strict RBAC authorization.
            </p>
          </div>
        </div>
      </section>

      {/* Footer with Legal Links */}
      <footer className="bg-slate-950 text-slate-400 py-10 px-4 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-900 pt-8">
          <div>
            <p className="font-bold text-slate-300">FlowDineOS SaaS Platform &bull; All Rights Reserved.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Empowering modern bakery entrepreneurs across India.</p>
          </div>

          <div className="flex items-center gap-6 font-semibold text-slate-400">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/book-demo" className="text-rose-400 hover:text-rose-300 transition-colors">
              Book a Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
