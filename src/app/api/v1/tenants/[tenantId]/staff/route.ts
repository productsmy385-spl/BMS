import { NextResponse } from 'next/server';
import { BMSStore } from '@/lib/store';
import { Role } from '@/types';

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

    const staff = BMSStore.getStaff(tenant.id);
    return NextResponse.json({ success: true, data: staff });
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
    if (!body.name || !body.email || !body.role) {
      return NextResponse.json({ success: false, error: 'name, email, and role are required' }, { status: 400 });
    }

    const newStaff = BMSStore.createStaff(tenant.id, {
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: body.role as Role,
      customRoleId: body.customRoleId,
    });

    BMSStore.logAudit(tenant.id, 'STAFF_INVITED', 'StaffUser', newStaff.id, {
      name: newStaff.name,
      role: newStaff.role,
    });

    return NextResponse.json({ success: true, data: newStaff }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
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
    if (!body.staffId) {
      return NextResponse.json({ success: false, error: 'staffId is required' }, { status: 400 });
    }

    const toggled = BMSStore.toggleStaffStatus(tenant.id, body.staffId);
    if (!toggled) {
      return NextResponse.json({ success: false, error: 'Staff member not found' }, { status: 404 });
    }

    BMSStore.logAudit(tenant.id, 'STAFF_STATUS_UPDATED', 'StaffUser', toggled.id, {
      name: toggled.name,
      isActive: toggled.isActive,
    });

    return NextResponse.json({ success: true, data: toggled });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
