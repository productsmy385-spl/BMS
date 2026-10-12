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

  const items = BMSStore.getInventory(tenant.id);
  const movements = BMSStore.getStockMovements(tenant.id);

  return NextResponse.json({
    success: true,
    data: {
      items,
      movements,
    },
  });
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
    if (!body.inventoryItemId || body.change === undefined || !body.reason) {
      return NextResponse.json(
        { success: false, error: 'inventoryItemId, change amount, and reason are required.' },
        { status: 400 }
      );
    }

    const result = BMSStore.adjustStock(
      tenant.id,
      body.inventoryItemId,
      Number(body.change),
      body.reason,
      body.notes
    );

    if (!result) {
      return NextResponse.json({ success: false, error: 'Inventory item not found' }, { status: 404 });
    }

    BMSStore.logAudit(tenant.id, 'INVENTORY_ADJUSTED', 'InventoryItem', body.inventoryItemId, {
      change: body.change,
      reason: body.reason,
      newBalance: result.item.currentStock,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
