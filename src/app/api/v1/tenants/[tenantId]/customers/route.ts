import { NextResponse } from 'next/server';
import { BMSStore } from '@/lib/store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const { tenantId } = await params;
  const tenant = BMSStore.getTenantById(tenantId) || BMSStore.getTenantBySlug(tenantId);
  if (!tenant) {
    return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 });
  }

  const customers = BMSStore.getCustomers(tenant.id);
  return NextResponse.json({ success: true, data: customers });
}
