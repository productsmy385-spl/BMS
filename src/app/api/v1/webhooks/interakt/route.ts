import { NextResponse } from 'next/server';
import { handleInboundMenuInquiry } from '@/lib/interakt';
import { BMSStore } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Standard Interakt incoming webhook format
    // { type: "message_received", data: { message: { text: "Can you send the menu please?" }, customer: { phone_number: "+919876543210" } }, tenantSlug: "sweet-delights" }
    const incomingText = body?.data?.message?.text || body?.text || '';
    const tenantSlug = body?.tenantSlug || 'sweet-delights';

    const tenant = BMSStore.getTenantBySlug(tenantSlug);
    if (!tenant) {
      return NextResponse.json({ success: false, error: 'Tenant not recognized' }, { status: 404 });
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const publicAppUrl = `${protocol}://${host}`;

    const reply = handleInboundMenuInquiry(incomingText, tenant.slug, publicAppUrl);

    if (reply) {
      return NextResponse.json({
        success: true,
        action: 'AUTO_REPLY_SENT',
        reply,
        recipient: body?.data?.customer?.phone_number || 'customer',
      });
    }

    return NextResponse.json({
      success: true,
      action: 'NO_ACTION_TRIGGERED',
      message: 'Inbound message did not match catalog inquiry keywords.',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
