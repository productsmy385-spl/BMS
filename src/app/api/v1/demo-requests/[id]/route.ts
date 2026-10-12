import { NextResponse } from 'next/server';
import { BMSStore } from '@/lib/store';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const validStatuses = ['PENDING', 'CONTACTED', 'SCHEDULED', 'RESOLVED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updated = BMSStore.updateDemoRequestStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Demo request not found.' },
        { status: 404 }
      );
    }

    BMSStore.logAudit(
      'platform',
      'DEMO_REQUEST_STATUS_UPDATED',
      'DemoRequest',
      id,
      { status: updated.status, notes: updated.notes }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
