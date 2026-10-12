import { NextResponse } from 'next/server';
import { BMSStore } from '@/lib/store';

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
    const { paymentId, status, notes } = body;

    if (!paymentId || !['COMPLETED', 'FAILED'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'paymentId and valid status (COMPLETED or FAILED) are required.' },
        { status: 400 }
      );
    }

    if (status === 'FAILED' && (!notes || !notes.trim())) {
      return NextResponse.json(
        { success: false, error: 'A mandatory notes/reason is required when rejecting a payment.' },
        { status: 400 }
      );
    }

    const result = BMSStore.verifyPayment(tenant.id, paymentId, status, notes);
    if (!result) {
      return NextResponse.json({ success: false, error: 'Payment record not found.' }, { status: 404 });
    }

    if (result.alreadyReconciled) {
      return NextResponse.json(
        { success: false, error: 'This payment has already been verified/reconciled.' },
        { status: 409 }
      );
    }

    BMSStore.logAudit(
      tenant.id,
      'PAYMENT_MANUAL_VERIFICATION',
      'Payment',
      paymentId,
      { status, notes, orderId: result.order?.id, orderNumber: result.order?.orderNumber }
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
