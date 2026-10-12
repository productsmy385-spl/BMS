'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { UtensilsCrossed, Clock, CheckCircle2, AlertCircle, Volume2, Sparkles, RefreshCw } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { VoiceAnnouncer } from '@/components/VoiceAnnouncer';
import { KOTTicket, KOTStatus } from '@/types';
import { playVoiceAnnouncement, generateKOTAnnouncement, generateReadyAnnouncement, VoiceLanguage } from '@/lib/voice';

export default function KitchenKOTDisplayPage() {
  const params = useParams();
  const slug = (params?.tenantSlug as string) || 'sweet-delights';

  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<KOTTicket[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ACTIVE');
  const [currentLang, setCurrentLang] = useState<VoiceLanguage>('en');
  const [lastAnnouncedId, setLastAnnouncedId] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`/api/v1/tenants/${slug}/kitchen/tickets`);
      const data = await res.json();
      if (data.success) {
        setTickets(data.data);

        // Check if there are newly arrived tickets that haven't been announced
        const newTicket = data.data.find(
          (t: KOTTicket) => (t.status === 'NEW' || t.status === 'ACCEPTED') && t.announcedCount === 0
        );
        if (newTicket && newTicket.id !== lastAnnouncedId) {
          const announcement = generateKOTAnnouncement(newTicket);
          const speechText = currentLang === 'te' ? announcement.telugu : announcement.english;
          playVoiceAnnouncement(speechText, currentLang);
          setLastAnnouncedId(newTicket.id);
        }
      }
    } catch (err) {
      console.error('Failed to poll kitchen tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 3000); // Polling for real-time fallback
    return () => clearInterval(interval);
  }, [slug, currentLang, lastAnnouncedId]);

  const handleUpdateStatus = async (ticketId: string, nextStatus: KOTStatus) => {
    try {
      const res = await fetch(`/api/v1/tenants/${slug}/kitchen/tickets`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Trigger Ready Voice Announcement if status changed to READY
        if (nextStatus === 'READY' && data.data.announcement) {
          const text =
            currentLang === 'te'
              ? data.data.announcement.telugu
              : data.data.announcement.english;
          playVoiceAnnouncement(text, currentLang);
        }
        fetchTickets();
      }
    } catch {
      alert('Failed to update ticket status');
    }
  };

  const handleManualAnnounce = (ticket: KOTTicket) => {
    const announcement =
      ticket.status === 'READY'
        ? generateReadyAnnouncement(ticket)
        : generateKOTAnnouncement(ticket);

    const speechText = currentLang === 'te' ? announcement.telugu : announcement.english;
    playVoiceAnnouncement(speechText, currentLang);
  };

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === 'ACTIVE') {
      return t.status !== 'COMPLETED' && t.status !== 'CANCELLED';
    }
    return t.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <Navigation currentSlug={slug} />

      {/* Kitchen Screen Top Bar */}
      <div className="px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight">Kitchen Order Tickets (KOT)</h1>
            <p className="text-[11px] text-slate-400">Live Kitchen Display System (KDS) & Voice Queue</p>
          </div>
        </div>

        {/* Bilingual Voice Controller & Filters */}
        <div className="flex items-center gap-3">
          <VoiceAnnouncer onLanguageChange={(lang) => setCurrentLang(lang)} />

          {/* Status Filter */}
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setFilterStatus('ACTIVE')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                filterStatus === 'ACTIVE' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Active ({tickets.filter((t) => t.status !== 'COMPLETED').length})
            </button>
            <button
              onClick={() => setFilterStatus('READY')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                filterStatus === 'READY' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ready
            </button>
            <button
              onClick={() => setFilterStatus('COMPLETED')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                filterStatus === 'COMPLETED' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Completed
            </button>
          </div>

          <button
            onClick={fetchTickets}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
            title="Refresh Tickets"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ticket Cards Grid */}
      <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
        {loading && (
          <div className="text-center py-20 text-slate-500 text-sm font-semibold">
            Connecting to Kitchen Order Queue...
          </div>
        )}

        {!loading && filteredTickets.length === 0 && (
          <div className="text-center py-24 text-slate-500 space-y-2">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500/50" />
            <h3 className="text-base font-bold text-slate-400">All Kitchen Orders Cleared!</h3>
            <p className="text-xs text-slate-600">New counter or website orders will pop up instantly.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTickets.map((ticket) => {
            const isReady = ticket.status === 'READY';
            const isPreparing = ticket.status === 'PREPARING';
            const isNew = ticket.status === 'NEW' || ticket.status === 'ACCEPTED';

            return (
              <div
                key={ticket.id}
                className={`rounded-2xl border-2 flex flex-col justify-between overflow-hidden transition-all shadow-lg ${
                  ticket.isCustomCake
                    ? 'border-pink-500/60 bg-slate-900/90'
                    : isReady
                    ? 'border-emerald-500/80 bg-slate-900/90'
                    : isPreparing
                    ? 'border-amber-500/80 bg-slate-900/90'
                    : 'border-slate-700 bg-slate-850'
                }`}
              >
                {/* Ticket Header */}
                <div
                  className={`px-4 py-3 border-b flex items-center justify-between ${
                    ticket.isCustomCake
                      ? 'bg-pink-950/40 border-pink-500/30'
                      : isReady
                      ? 'bg-emerald-950/40 border-emerald-500/30'
                      : isPreparing
                      ? 'bg-amber-950/40 border-amber-500/30'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black tracking-tight">KOT #{ticket.ticketNumber}</span>
                      {ticket.isCustomCake && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pink-500 text-white">
                          <Sparkles className="w-3 h-3" />
                          Custom Cake
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      Order #{ticket.orderNumber} • {ticket.customerName || 'Walk-in'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleManualAnnounce(ticket)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Play Voice Announcement"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <span
                      className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg ${
                        isReady
                          ? 'bg-emerald-500 text-slate-950'
                          : isPreparing
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 space-y-2.5 flex-1 overflow-y-auto">
                  {ticket.items.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-sm text-slate-100">{item.itemName}</span>
                        <span className="text-xs font-black px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300">
                          x {item.quantity}
                        </span>
                      </div>
                      {item.specialInstructions && (
                        <p className="text-xs text-amber-300/90 font-medium mt-1 pl-1 border-l-2 border-amber-400">
                          {item.specialInstructions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Status Progression Actions */}
                <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="flex gap-2">
                    {isNew && (
                      <button
                        onClick={() => handleUpdateStatus(ticket.id, 'PREPARING')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-xs"
                      >
                        Start Baking
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        onClick={() => handleUpdateStatus(ticket.id, 'READY')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-xs"
                      >
                        Mark Ready for Pickup
                      </button>
                    )}

                    {isReady && (
                      <button
                        onClick={() => handleUpdateStatus(ticket.id, 'COMPLETED')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                      >
                        Handover Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
