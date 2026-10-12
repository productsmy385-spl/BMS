import { NextResponse } from 'next/server';
import { BMSStore } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const { tenantId } = await params;
    const tenant = BMSStore.getTenantById(tenantId) || BMSStore.getTenantBySlug(tenantId);
    if (!tenant) {
      return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get('driverId') || undefined;

    const assignments = BMSStore.getDeliveryAssignments(tenant.id, driverId);
    return NextResponse.json({ success: true, data: assignments });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
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
    if (!body.orderId || !body.driverId) {
      return NextResponse.json({ success: false, error: 'orderId and driverId are required' }, { status: 400 });
    }

    const assignment = BMSStore.assignDeliveryOrder(tenant.id, body.orderId, body.driverId, body.notes);
    return NextResponse.json({ success: true, data: assignment }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(
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
    if (!body.assignmentId || !body.status) {
      return NextResponse.json({ success: false, error: 'assignmentId and status are required' }, { status: 400 });
    }

    const updated = BMSStore.updateDeliveryStatus(tenant.id, body.assignmentId, body.status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Delivery assignment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
