import { Product, ProductVariant, ProductCustomization, CustomCakeSpec } from '@/types';

export interface CalculatedItemPrice {
  basePrice: number;
  variantPriceDelta: number;
  customizationExtra: number;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export function calculateCustomCakeItemPrice(
  product: Product,
  variant: ProductVariant | undefined,
  customization: CustomCakeSpec | undefined,
  availableCustomizations: ProductCustomization[] = []
): { unitPrice: number; breakdown: Record<string, number> } {
  let unitPrice = product.basePrice;
  const breakdown: Record<string, number> = {
    basePrice: product.basePrice,
  };

  if (variant) {
    unitPrice += variant.priceDelta;
    breakdown[`variant_${variant.name}`] = variant.priceDelta;
  }

  if (customization) {
    if (customization.flavour) {
      const match = availableCustomizations.find(
        (c) => c.groupName === 'Flavour' && c.optionName === customization.flavour
      );
      if (match && match.additionalPrice > 0) {
        unitPrice += match.additionalPrice;
        breakdown[`flavour_${match.optionName}`] = match.additionalPrice;
      }
    }

    if (customization.shape) {
      const match = availableCustomizations.find(
        (c) => c.groupName === 'Shape' && c.optionName === customization.shape
      );
      if (match && match.additionalPrice > 0) {
        unitPrice += match.additionalPrice;
        breakdown[`shape_${match.optionName}`] = match.additionalPrice;
      }
    }

    if (customization.cream) {
      const match = availableCustomizations.find(
        (c) => c.groupName === 'Frosting' && c.optionName === customization.cream
      );
      if (match && match.additionalPrice > 0) {
        unitPrice += match.additionalPrice;
        breakdown[`frosting_${match.optionName}`] = match.additionalPrice;
      }
    }
  }

  return { unitPrice, breakdown };
}

export function calculateOrderTotals(
  items: Array<{ unitPrice: number; quantity: number; taxRate?: number }>,
  discountPercent = 0
): { subtotal: number; discount: number; tax: number; total: number } {
  let subtotal = 0;
  let tax = 0;

  for (const item of items) {
    const itemSubtotal = item.unitPrice * item.quantity;
    subtotal += itemSubtotal;
    const rate = item.taxRate ?? 5.0; // default 5% GST on bakery items
    tax += (itemSubtotal * rate) / 100;
  }

  const discount = (subtotal * discountPercent) / 100;
  const netSubtotal = Math.max(0, subtotal - discount);
  const total = Number((netSubtotal + tax).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total,
  };
}
