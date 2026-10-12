import { NextResponse } from 'next/server';
import { BMSStore } from '@/lib/store';
import { createOrderConfirmationWhatsApp } from '@/lib/interakt';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const { tenantId } = await params;
  const tenant = BMSStore.getTenantById(tenantId) || BMSStore.getTenantBySlug(tenantId);
  if (!tenant) {
    return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 });
  }

  const orders = BMSStore.getOrders(tenant.id);
  return NextResponse.json({ success: true, data: orders });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const { tenantId } = await params;
    const tenant = BMSStore.getTenantById(tenantId) || BMSStore.getTenantBySlug(tenantId);
    if (!tenant) {
      return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 });
    }

    const body = await request.json();
    if (!body.customerName || !body.customerPhone || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'customerName, customerPhone, and non-empty items are required.' },
        { status: 400 }
      );
    }

    // Authoritative calculation from backend items
    const validatedItems = body.items.map((item: {
      productId?: string;
      variantId?: string;
      itemName?: string;
      unitPrice?: number;
      quantity?: number;
      specialInstructions?: string | null;
      customization?: unknown;
    }) => {
      let price = Number(item.unitPrice || 0);
      let name = item.itemName || 'Bakery Item';

      if (item.productId) {
        const prod = BMSStore.getProductById(tenant.id, item.productId);
        if (prod) {
          price = prod.basePrice;
          name = prod.name;
          if (item.variantId && prod.variants) {
            const v = prod.variants.find((vr) => vr.id === item.variantId);
            if (v) price += v.priceDelta;
          }
        }
      }

      return {
        productId: item.productId,
        variantId: item.variantId,
        itemName: name,
        unitPrice: price,
        quantity: Math.max(1, Number(item.quantity || 1)),
        specialInstructions: item.specialInstructions || null,
        customization: item.customization as any,
      };
    });

    const result = BMSStore.createOrder(tenant.id, {
      source: body.source || 'PUBLIC_WEBSITE',
      deliveryType: body.deliveryType || 'PICKUP',
      scheduledFor: body.scheduledFor || null,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress || null,
      items: validatedItems,
      payment: body.payment,
      specialNotes: body.specialNotes,
    });

    // Generate WhatsApp Outbox Payload
    const whatsappPayload = createOrderConfirmationWhatsApp(result.order, tenant);

    BMSStore.logAudit(tenant.id, 'ORDER_CREATED', 'Order', result.order.id, {
      orderNumber: result.order.orderNumber,
      source: result.order.source,
      total: result.order.totalAmount,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          order: result.order,
          kot: result.kot,
          whatsappOutbox: whatsappPayload,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
