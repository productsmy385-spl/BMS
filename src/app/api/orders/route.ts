import { NextResponse } from 'next/server';
import { BMSStore } from '@/lib/store';

export async function GET() {
  const tenant = BMSStore.getTenantBySlug('sweet-delights');
  if (!tenant) return NextResponse.json([]);
  const orders = BMSStore.getOrders(tenant.id);
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const tenant = BMSStore.getTenantBySlug('sweet-delights');
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const result = BMSStore.createOrder(tenant.id, {
      source: 'PUBLIC_WEBSITE',
      deliveryType: 'PICKUP',
      customerName: body.customerName || 'Walk-in',
      customerPhone: body.customerPhone || '9876543210',
      customerAddress: body.deliveryAddress,
      items: (body.items || []).map((i: any) => ({
        productId: i.menuItemId || i.productId,
        itemName: i.itemName || 'Bakery Item',
        unitPrice: Number(i.unitPrice || 100),
        quantity: Number(i.quantity || 1),
        specialInstructions: i.specialInstructions,
      })),
    });

    return NextResponse.json(result.order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
