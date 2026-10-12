'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Globe } from 'lucide-react';
import { VoiceLanguage, playVoiceAnnouncement } from '@/lib/voice';

interface VoiceAnnouncerProps {
  onLanguageChange?: (lang: VoiceLanguage) => void;
}

export function VoiceAnnouncer({ onLanguageChange }: VoiceAnnouncerProps) {
  const [lang, setLang] = useState<VoiceLanguage>('en');
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleLanguage = () => {
    const nextLang: VoiceLanguage = lang === 'en' ? 'te' : 'en';
    setLang(nextLang);
    onLanguageChange?.(nextLang);
  };

  const handleTestAudio = () => {
    if (muted) return;
    setIsPlaying(true);
    const testText =
      lang === 'te'
        ? 'BMS Voice Queue: Namaskaram! Order number 1001 ready ga undi.'
        : 'BMS Voice Queue: Attention please. Order number 1001 is ready for pickup.';

    playVoiceAnnouncement(testText, lang, () => setIsPlaying(false));
  };

  return (
    <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200/80 rounded-xl p-1.5 text-xs">
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white shadow-2xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
        title="Toggle between Indian English and Telugu voice announcements"
      >
        <Globe className="w-3.5 h-3.5 text-slate-500" />
        <span>{lang === 'en' ? 'English (en-IN)' : 'తెలుగు (te-IN)'}</span>
      </button>

      {/* Test Audio Button */}
      <button
        onClick={handleTestAudio}
        disabled={muted || isPlaying}
        className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
          isPlaying
            ? 'bg-amber-100 text-amber-800 animate-pulse'
            : 'bg-white text-slate-700 hover:bg-slate-50'
        } disabled:opacity-50`}
      >
        {isPlaying ? 'Speaking...' : 'Test Voice'}
      </button>

      {/* Mute Toggle */}
      <button
        onClick={() => {
          if (!muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
          setMuted(!muted);
        }}
        className={`p-1.5 rounded-lg transition-colors ${
          muted ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
        }`}
        title={muted ? 'Unmute voice announcements' : 'Mute voice announcements'}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
