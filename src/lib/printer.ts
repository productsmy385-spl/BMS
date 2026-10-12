import { Order, BakeryProfile, KOTTicket } from '@/types';

export interface FormattedReceipt {
  plainText: string;
  width: '80mm' | '58mm';
  printedAt: string;
}

export function formatCustomerReceipt(
  order: Order,
  profile?: BakeryProfile | null,
  width: '80mm' | '58mm' = '80mm'
): FormattedReceipt {
  const colWidth = width === '80mm' ? 42 : 32;
  const line = '='.repeat(colWidth);
  const dashed = '-'.repeat(colWidth);

  const center = (text: string) => {
    const pad = Math.max(0, Math.floor((colWidth - text.length) / 2));
    return ' '.repeat(pad) + text;
  };

  const justify = (left: string, right: string) => {
    const space = Math.max(1, colWidth - left.length - right.length);
    return left + ' '.repeat(space) + right;
  };

  const lines: string[] = [];
  lines.push(center(profile?.tagline ? profile.tagline.slice(0, colWidth) : 'BAKERY & PATISSERIE'));
  if (profile?.address) lines.push(center(profile.address));
  if (profile?.phone) lines.push(center(`Tel: ${profile.phone}`));
  if (profile?.gstNumber) lines.push(center(`GSTIN: ${profile.gstNumber}`));
  if (profile?.fssaiNumber) lines.push(center(`FSSAI Lic: ${profile.fssaiNumber}`));
  lines.push(line);

  lines.push(justify(`ORDER: #${order.orderNumber}`, new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })));
  lines.push(justify(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, `Type: ${order.deliveryType}`));
  lines.push(justify(`Customer: ${order.customerName}`, `Ph: ${order.customerPhone}`));
  lines.push(dashed);

  lines.push(justify('ITEM DESCRIPTION', 'QTY x PRICE   TOTAL'));
  lines.push(dashed);

  for (const item of order.items) {
    const itemTotal = `₹${item.totalPrice.toFixed(2)}`;
    const itemQtyPrice = `${item.quantity} x ₹${item.unitPrice.toFixed(2)}`;
    lines.push(item.itemName);
    lines.push(justify(`  ${itemQtyPrice}`, itemTotal));
    if (item.customization?.flavour) {
      lines.push(`  * Flavour: ${item.customization.flavour}`);
    }
    if (item.customization?.messageOnCake) {
      lines.push(`  * Message: "${item.customization.messageOnCake}"`);
    }
    if (item.specialInstructions) {
      lines.push(`  * Note: ${item.specialInstructions}`);
    }
  }

  lines.push(dashed);
  lines.push(justify('Subtotal:', `₹${order.subtotalAmount.toFixed(2)}`));
  if (order.discountAmount > 0) {
    lines.push(justify('Discount:', `-₹${order.discountAmount.toFixed(2)}`));
  }
  lines.push(justify('GST (5% / 18%):', `₹${order.taxAmount.toFixed(2)}`));
  lines.push(line);
  lines.push(justify('NET TOTAL:', `₹${order.totalAmount.toFixed(2)}`));
  lines.push(line);

  lines.push(justify('Paid Amount:', `₹${order.paidAmount.toFixed(2)}`));
  if (order.balanceAmount > 0) {
    lines.push(justify('BALANCE DUE:', `₹${order.balanceAmount.toFixed(2)}`));
  }
  lines.push(justify('Payment Status:', order.paymentStatus));

  lines.push(dashed);
  lines.push(center('Thank you for visiting!'));
  lines.push(center('Baked Fresh with Love'));
  lines.push('\n\n\n'); // Feed space for paper tear

  return {
    plainText: lines.join('\n'),
    width,
    printedAt: new Date().toISOString(),
  };
}

export function formatKitchenSlip(ticket: KOTTicket, width: '80mm' | '58mm' = '80mm'): FormattedReceipt {
  const colWidth = width === '80mm' ? 42 : 32;
  const line = '='.repeat(colWidth);
  const dashed = '-'.repeat(colWidth);

  const center = (text: string) => {
    const pad = Math.max(0, Math.floor((colWidth - text.length) / 2));
    return ' '.repeat(pad) + text;
  };

  const justify = (left: string, right: string) => {
    const space = Math.max(1, colWidth - left.length - right.length);
    return left + ' '.repeat(space) + right;
  };

  const lines: string[] = [];
  lines.push(center('*** KITCHEN ORDER TICKET (KOT) ***'));
  lines.push(line);
  lines.push(justify(`KOT #: ${ticket.ticketNumber}`, `Order: #${ticket.orderNumber || 'N/A'}`));
  lines.push(justify(`Time: ${new Date(ticket.createdAt).toLocaleTimeString()}`, ticket.isCustomCake ? '[CUSTOM CAKE]' : '[STANDARD]'));
  lines.push(justify(`Customer: ${ticket.customerName || 'Walk-in'}`, ''));
  lines.push(dashed);

  for (const item of ticket.items) {
    lines.push(`[ ] ${item.quantity} x ${item.itemName.toUpperCase()}`);
    if (item.specialInstructions) {
      lines.push(`    >>> NOTE: ${item.specialInstructions}`);
    }
  }

  lines.push(dashed);
  lines.push(center(`Status: ${ticket.status}`));
  lines.push('\n\n');

  return {
    plainText: lines.join('\n'),
    width,
    printedAt: new Date().toISOString(),
  };
}
