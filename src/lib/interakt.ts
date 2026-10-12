import { Order, Tenant } from '@/types';

export interface InteraktMessagePayload {
  countryCode: string;
  phoneNumber: string;
  type: 'Template' | 'Text';
  template?: {
    name: string;
    languageCode: string;
    headerValues?: string[];
    bodyValues: string[];
    buttonValues?: Record<string, string[]>;
  };
  text?: {
    body: string;
  };
}

export function createOrderConfirmationWhatsApp(
  order: Order,
  tenant: Tenant,
  publicAppUrl: string = 'http://localhost:3000'
): InteraktMessagePayload {
  const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
  const phone = cleanPhone.startsWith('91') ? cleanPhone.slice(2) : cleanPhone;

  return {
    countryCode: '+91',
    phoneNumber: phone,
    type: 'Template',
    template: {
      name: 'bms_order_confirmed',
      languageCode: 'en',
      bodyValues: [
        order.customerName,
        tenant.name,
        `#${order.orderNumber}`,
        `₹${order.totalAmount.toFixed(2)}`,
        order.deliveryType,
        `${publicAppUrl}/${tenant.slug}/orders/${order.id}`,
      ],
    },
  };
}

export function createOrderReadyWhatsApp(
  order: Order,
  tenant: Tenant
): InteraktMessagePayload {
  const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
  const phone = cleanPhone.startsWith('91') ? cleanPhone.slice(2) : cleanPhone;

  return {
    countryCode: '+91',
    phoneNumber: phone,
    type: 'Template',
    template: {
      name: 'bms_order_ready',
      languageCode: 'en',
      bodyValues: [
        order.customerName,
        `#${order.orderNumber}`,
        tenant.name,
      ],
    },
  };
}

export function handleInboundMenuInquiry(
  incomingText: string,
  tenantSlug: string,
  publicAppUrl: string = 'http://localhost:3000'
): string | null {
  const text = incomingText.toLowerCase();
  const menuKeywords = ['menu', 'catalog', 'cakes', 'prices', 'rate', 'order', 'items', 'list'];
  const matches = menuKeywords.some((keyword) => text.includes(keyword));

  if (matches) {
    return `Hello! 🧁 Thank you for reaching out. Here is our fresh bakery menu and custom cake catalog:\n\n👉 View Menu: ${publicAppUrl}/${tenantSlug}\n\nYou can customize your celebration cakes or place an online pickup/delivery order directly!`;
  }
  return null;
}
