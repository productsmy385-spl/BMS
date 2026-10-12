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

  const settings = BMSStore.getPaymentSettings(tenant.id);
  return NextResponse.json({ success: true, data: settings });
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
    const updated = BMSStore.updatePaymentSettings(tenant.id, {
      upiId: body.upiId,
      accountDisplayName: body.accountDisplayName,
      qrImageUrl: body.qrImageUrl,
      instructions: body.instructions,
      contactPhone: body.contactPhone,
      acceptUpi: body.acceptUpi !== undefined ? Boolean(body.acceptUpi) : true,
    });

    BMSStore.logAudit(
      tenant.id,
      'PAYMENT_SETTINGS_UPDATED',
      'TenantPaymentSettings',
      updated.id,
      { upiId: updated.upiId, accountDisplayName: updated.accountDisplayName }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
