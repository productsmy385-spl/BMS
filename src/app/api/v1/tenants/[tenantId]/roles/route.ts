import { NextResponse } from 'next/server';
import { BMSStore } from '@/lib/store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const { tenantId } = await params;
    const tenant = BMSStore.getTenantById(tenantId) || BMSStore.getTenantBySlug(tenantId);
    if (!tenant) {
      return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 });
    }

    const customRoles = BMSStore.getCustomRoles(tenant.id);
    return NextResponse.json({ success: true, data: customRoles });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

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
    if (!body.name || !Array.isArray(body.permissions)) {
      return NextResponse.json({ success: false, error: 'name and permissions array are required' }, { status: 400 });
    }

    const newRole = BMSStore.createCustomRole(tenant.id, {
      name: body.name,
      description: body.description,
      permissions: body.permissions,
    });

    BMSStore.logAudit(tenant.id, 'ROLE_CREATED', 'CustomRole', newRole.id, {
      name: newRole.name,
      permissionCount: newRole.permissions.length,
    });

    return NextResponse.json({ success: true, data: newRole }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
