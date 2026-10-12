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
    const { orderIds, language } = body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please select at least one valid order to share to Voice KOT.' },
        { status: 400 }
      );
    }

    const result = BMSStore.shareOrdersToVoiceKOT(tenant.id, orderIds, language || 'en');

    BMSStore.logAudit(
      tenant.id,
      'ORDERS_SHARED_TO_VOICE_KOT',
      'VoiceQueue',
      undefined,
      { count: result.queuedCount, language: language || 'en', orderIds }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully queued ${result.queuedCount} order(s) to Kitchen Voice KOT in ${language === 'te' ? 'Telugu' : 'English'}.`,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
