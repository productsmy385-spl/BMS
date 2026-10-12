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

  const pkg = BMSStore.getTenantPackage(tenant.id);
  return NextResponse.json({ success: true, data: pkg });
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
    const { packageId } = body;
    if (!packageId) {
      return NextResponse.json({ success: false, error: 'packageId is required' }, { status: 400 });
    }

    const updatedTenant = BMSStore.updateTenantPackage(tenant.id, packageId);
    if (!updatedTenant) {
      return NextResponse.json({ success: false, error: 'Failed to update tenant package' }, { status: 400 });
    }

    const pkg = BMSStore.getTenantPackage(tenant.id);
    BMSStore.logAudit(
      tenant.id,
      'TENANT_PACKAGE_UPDATED',
      'Package',
      packageId,
      { packageName: pkg?.name }
    );

    return NextResponse.json({ success: true, data: { tenant: updatedTenant, package: pkg } });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
