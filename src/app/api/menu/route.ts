import { NextResponse } from 'next/server';
import { BMSStore } from '@/lib/store';

export async function GET() {
  const tenant = BMSStore.getTenantBySlug('sweet-delights');
  if (!tenant) return NextResponse.json([]);
  const products = BMSStore.getProducts(tenant.id);
  return NextResponse.json(products);
}
