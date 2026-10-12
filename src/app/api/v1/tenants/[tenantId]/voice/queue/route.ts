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

  const queue = BMSStore.getVoiceQueue(tenant.id);
  return NextResponse.json({ success: true, data: queue });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const { tenantId } = await params;
  const tenant = BMSStore.getTenantById(tenantId) || BMSStore.getTenantBySlug(tenantId);
  if (!tenant) {
    return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 });
  }

  try {
    const { queueItemId } = await request.json();
    if (!queueItemId) {
      return NextResponse.json({ success: false, error: 'queueItemId is required' }, { status: 400 });
    }
    const item = BMSStore.markVoiceAnnounced(tenant.id, queueItemId);
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
