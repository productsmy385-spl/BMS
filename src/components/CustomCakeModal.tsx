'use client';

import React, { useState } from 'react';
import { X, Sparkles, Cake, Check } from 'lucide-react';
import { Product, ProductVariant, CustomCakeSpec } from '@/types';
import { calculateCustomCakeItemPrice } from '@/lib/pricing';

interface CustomCakeModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: {
    productId: string;
    variantId?: string;
    itemName: string;
    unitPrice: number;
    quantity: number;
    customization: CustomCakeSpec;
    specialInstructions?: string;
  }) => void;
}

export function CustomCakeModal({ product, onClose, onAddToCart }: CustomCakeModalProps) {
  const variants = product.variants || [];
  const customizations = product.customizations || [];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    variants.find((v) => v.isDefault) || variants[0]
  );

  const [flavour, setFlavour] = useState<string>('Belgian Dark Truffle');
  const [shape, setShape] = useState<string>('Classic Round');
  const [sponge, setSponge] = useState<string>('100% Eggless Vanilla/Chocolate');
  const [cream, setCream] = useState<string>('Light Dairy Whipped Cream');
  const [messageOnCake, setMessageOnCake] = useState<string>('Happy Birthday!');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const currentSpec: CustomCakeSpec = {
    flavour,
    shape,
    sponge,
    cream,
    messageOnCake,
  };

  const { unitPrice, breakdown } = calculateCustomCakeItemPrice(
    product,
    selectedVariant,
    currentSpec,
    customizations
  );

  const handleConfirm = () => {
    onAddToCart({
      productId: product.id,
      variantId: selectedVariant?.id,
      itemName: `${product.name} (${selectedVariant?.name || 'Standard'})`,
      unitPrice,
      quantity: 1,
      customization: currentSpec,
      specialInstructions: specialInstructions || undefined,
    });
    onClose();
  };

  const flavours = customizations.filter((c) => c.groupName === 'Flavour');
  const shapes = customizations.filter((c) => c.groupName === 'Shape');
  const sponges = customizations.filter((c) => c.groupName === 'Sponge');
  const frostings = customizations.filter((c) => c.groupName === 'Frosting');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Custom Cake Designer</h2>
              <p className="text-xs text-slate-600">Tailor flavours, layers, shape, and message</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Size / Weight */}
          {variants.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Select Size & Weight
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-900">{v.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-rose-600" />}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {v.priceDelta > 0 ? `+₹${v.priceDelta.toFixed(2)}` : 'Included'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Flavour Choice */}
          {flavours.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                2. Cake Flavour
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {flavours.map((f) => {
                  const isSelected = flavour === f.optionName;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFlavour(f.optionName)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                        isSelected ? 'border-rose-600 bg-rose-50/60 text-rose-900' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{f.optionName}</span>
                      <span className="text-[11px] text-slate-500">
                        {f.additionalPrice > 0 ? `+₹${f.additionalPrice}` : 'Free'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Shape & Sponge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shapes.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  3. Cake Shape
                </label>
                <div className="space-y-1.5">
                  {shapes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setShape(s.optionName)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                        shape === s.optionName ? 'border-rose-600 bg-rose-50 text-rose-900' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{s.optionName}</span>
                      <span className="text-[11px] text-slate-500">{s.additionalPrice > 0 ? `+₹${s.additionalPrice}` : 'Free'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {frostings.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  4. Frosting Style
                </label>
                <div className="space-y-1.5">
                  {frostings.map((fr) => (
                    <button
                      key={fr.id}
                      type="button"
                      onClick={() => setCream(fr.optionName)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                        cream === fr.optionName ? 'border-rose-600 bg-rose-50 text-rose-900' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{fr.optionName}</span>
                      <span className="text-[11px] text-slate-500">{fr.additionalPrice > 0 ? `+₹${fr.additionalPrice}` : 'Free'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sponge Eggless / Regular */}
          {sponges.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                5. Sponge Formulation
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sponges.map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setSponge(sp.optionName)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      sponge === sp.optionName ? 'border-rose-600 bg-rose-50 text-rose-900' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    {sp.optionName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Message on Cake */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              6. Greeting Message on Cake Plaque
            </label>
            <input
              type="text"
              value={messageOnCake}
              onChange={(e) => setMessageOnCake(e.target.value)}
              placeholder="e.g. Happy 5th Birthday Aarav!"
              maxLength={40}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              7. Chef & Decoration Notes (Optional)
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less sweetness, gold leaf flakes on top, pastel pink theme..."
              rows={2}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Footer with Price Breakdown and CTA */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Authoritative Calculated Price</div>
            <div className="text-2xl font-black text-slate-900">₹{unitPrice.toFixed(2)}</div>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add Custom Cake</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
