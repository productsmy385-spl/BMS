import { KOTTicket } from '@/types';

export type VoiceLanguage = 'en' | 'te'; // English or Telugu

export interface AnnouncementText {
  english: string;
  telugu: string;
}

export function generateKOTAnnouncement(ticket: KOTTicket): AnnouncementText {
  const itemsSummary = ticket.items.map((i) => `${i.quantity} ${i.itemName}`).join(', ');
  const cakeNote = ticket.isCustomCake ? 'Customized designer cake.' : '';

  // English announcement
  const english = `New Order Number ${ticket.orderNumber || ticket.ticketNumber}. ${cakeNote} Items: ${itemsSummary}. Customer: ${ticket.customerName || 'Walk-in'}.`;

  // Telugu announcement (using standard phonetic Telugu phrases)
  const telugu = `Kotta order vachindi. Order number ${ticket.orderNumber || ticket.ticketNumber}. ${ticket.isCustomCake ? 'Special customized cake order.' : ''} Items: ${itemsSummary}. Customer: ${ticket.customerName || 'Customer'}.`;

  return { english, telugu };
}

export function generateReadyAnnouncement(ticket: KOTTicket): AnnouncementText {
  const english = `Attention please! Order Number ${ticket.orderNumber || ticket.ticketNumber} for ${ticket.customerName || 'customer'} is packed and ready for pickup!`;
  const telugu = `Attention please! ${ticket.customerName || 'Customer'} gaari order number ${ticket.orderNumber || ticket.ticketNumber} tayarayindi, ready ga undi!`;

  return { english, telugu };
}

// Client-side Browser Speech Dispatcher
export function playVoiceAnnouncement(
  text: string,
  lang: VoiceLanguage = 'en',
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Web Speech API is not supported in this browser.');
    return false;
  }

  // Cancel any ongoing speech to prevent queue build-up
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // Slightly slower for crisp kitchen clarity
  utterance.pitch = 1.0;

  if (lang === 'te') {
    utterance.lang = 'te-IN'; // Telugu (India)
  } else {
    utterance.lang = 'en-IN'; // Indian English
  }

  // Find preferred voice if available
  const voices = window.speechSynthesis.getVoices();
  const targetVoice = voices.find((v) => v.lang.startsWith(lang === 'te' ? 'te' : 'en'));
  if (targetVoice) {
    utterance.voice = targetVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}
