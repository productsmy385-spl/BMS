import { NextResponse } from 'next/server';
import { OrderStatus } from '@/types';
import { BMSStore } from '@/lib/store';

const allowed: OrderStatus[] = [
  'NEW',
  'ACCEPTED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();
  if (!allowed.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
  }

  const tenant = BMSStore.getTenantBySlug('sweet-delights');
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

  const updated = BMSStore.updateOrderStatus(tenant.id, id, body.status);
  if (!updated) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}
