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

  const profile = BMSStore.getProfile(tenant.id);
  const websiteSettings = BMSStore.getWebsiteSettings(tenant.id);

  return NextResponse.json({
    success: true,
    data: {
      tenant,
      profile,
      websiteSettings,
    },
  });
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

    if (body.websiteSettings) {
      BMSStore.updateWebsiteSettings(tenant.id, body.websiteSettings);
      BMSStore.logAudit(tenant.id, 'WEBSITE_SETTINGS_UPDATED', 'WebsiteSettings', tenant.id, body.websiteSettings);
    }

    const updatedSettings = BMSStore.getWebsiteSettings(tenant.id);
    const profile = BMSStore.getProfile(tenant.id);

    return NextResponse.json({
      success: true,
      data: {
        tenant,
        profile,
        websiteSettings: updatedSettings,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
