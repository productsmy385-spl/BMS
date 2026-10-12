import { NextResponse } from 'next/server';
import { BMSStore } from '@/lib/store';
import { generateKOTAnnouncement, generateReadyAnnouncement } from '@/lib/voice';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const { tenantId } = await params;
  const tenant = BMSStore.getTenantById(tenantId) || BMSStore.getTenantBySlug(tenantId);
  if (!tenant) {
    return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 });
  }

  const tickets = BMSStore.getKOTTickets(tenant.id);
  return NextResponse.json({ success: true, data: tickets });
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
    if (!body.ticketId || !body.status) {
      return NextResponse.json(
        { success: false, error: 'ticketId and status are required.' },
        { status: 400 }
      );
    }

    const updated = BMSStore.updateKOTStatus(tenant.id, body.ticketId, body.status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
    }

    // Voice announcement triggers
    let announcement = null;
    if (updated.status === 'READY') {
      announcement = generateReadyAnnouncement(updated);
    } else if (updated.status === 'NEW' || updated.status === 'ACCEPTED') {
      announcement = generateKOTAnnouncement(updated);
    }

    return NextResponse.json({
      success: true,
      data: {
        ticket: updated,
        announcement,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
