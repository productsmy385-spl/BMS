import { NextResponse } from 'next/server';
import { BMSStore } from '@/lib/store';

export async function GET() {
  const requests = BMSStore.getDemoRequests();
  return NextResponse.json({ success: true, data: requests });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, businessName, email, phone, outletsCount, requirements, preferredContact } = body;

    if (!name?.trim() || !businessName?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Full name, bakery name, work email, and phone number are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid work email address.' },
        { status: 400 }
      );
    }

    const demoRequest = BMSStore.createDemoRequest({
      name: name.trim(),
      businessName: businessName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      outletsCount: outletsCount ? Number(outletsCount) : 1,
      requirements: requirements?.trim() || undefined,
      preferredContact: preferredContact || 'PHONE',
    });

    BMSStore.logAudit(
      'platform',
      'DEMO_REQUEST_SUBMITTED',
      'DemoRequest',
      demoRequest.id,
      { businessName: demoRequest.businessName, email: demoRequest.email }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Demo request received successfully. Our onboarding specialist will contact you shortly.',
        data: demoRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
