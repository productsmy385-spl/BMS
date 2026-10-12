'use client';

import React, { useState } from 'react';
import { Printer, X, Check, Copy } from 'lucide-react';
import { Order, BakeryProfile } from '@/types';
import { formatCustomerReceipt } from '@/lib/printer';

interface ReceiptPrinterProps {
  order: Order;
  profile?: BakeryProfile | null;
  onClose: () => void;
}

export function ReceiptPrinter({ order, profile, onClose }: ReceiptPrinterProps) {
  const [width, setWidth] = useState<'80mm' | '58mm'>('80mm');
  const [copied, setCopied] = useState(false);

  const formatted = formatCustomerReceipt(order, profile, width);

  const handleBrowserPrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(formatted.plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Thermal Receipt Preview</h3>
              <p className="text-xs text-slate-500">Order #{order.orderNumber} • ESC/POS Emulator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Width Toggle */}
        <div className="px-6 py-3 bg-slate-100 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">Paper Roll Width:</span>
          <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setWidth('80mm')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                width === '80mm' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              80mm (Standard)
            </button>
            <button
              onClick={() => setWidth('58mm')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                width === '58mm' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              58mm (Compact)
            </button>
          </div>
        </div>

        {/* Receipt Body (Thermal Simulation) */}
        <div className="p-6 overflow-y-auto bg-slate-200/50 flex justify-center">
          <div
            id="printable-receipt"
            className={`bg-[#fffef7] text-slate-900 font-mono text-[11px] leading-tight p-6 shadow-md border border-slate-300 rounded-sm whitespace-pre ${
              width === '80mm' ? 'w-[340px]' : 'w-[260px]'
            }`}
          >
            {formatted.plainText}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg border border-slate-200 hover:bg-white"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Plaintext'}</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
            >
              Done
            </button>
            <button
              onClick={handleBrowserPrint}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Thermal Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
