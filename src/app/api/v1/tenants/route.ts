import { NextResponse } from 'next/server';
import { BMSStore } from '@/lib/store';

export async function GET() {
  const tenants = BMSStore.getTenants();
  return NextResponse.json({ success: true, data: tenants });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Bakery name and unique slug are required.' },
        { status: 400 }
      );
    }

    const existing = BMSStore.getTenantBySlug(body.slug);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A bakery with this slug already exists.' },
        { status: 409 }
      );
    }

    const result = BMSStore.createTenant({
      name: body.name,
      slug: body.slug,
      tagline: body.tagline,
      phone: body.phone,
      email: body.email,
      address: body.address,
      city: body.city,
      primaryColor: body.primaryColor,
    });

    BMSStore.logAudit(result.tenant.id, 'TENANT_PROVISIONED', 'Tenant', result.tenant.id, {
      name: result.tenant.name,
      slug: result.tenant.slug,
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
