import { NextResponse } from 'next/server';
import { BMSStore } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const { tenantId } = await params;
    const tenant = BMSStore.getTenantById(tenantId) || BMSStore.getTenantBySlug(tenantId);
    if (!tenant) {
      return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const type = (searchParams.get('type') || 'orders') as 'orders' | 'inventory' | 'products' | 'sales';
    const format = searchParams.get('format') || 'json';

    const records = BMSStore.exportTenantData(tenant.id, type);

    BMSStore.logAudit(tenant.id, 'DATA_EXPORTED', type.toUpperCase(), tenant.id, {
      format,
      recordCount: records.length,
    });

    if (format === 'csv') {
      if (records.length === 0) {
        return new NextResponse('No records found', {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${tenant.slug}_${type}.csv"`,
          },
        });
      }
      const firstRecord = records[0] as any;
      const keys = Object.keys(firstRecord).filter((k) => typeof firstRecord[k] !== 'object');
      const csvHeader = keys.join(',');
      const csvRows = records.map((r: any) =>
        keys.map((k) => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(',')
      );
      const csvContent = [csvHeader, ...csvRows].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${tenant.slug}_${type}.csv"`,
        },
      });
    }

    return NextResponse.json({ success: true, data: records });
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
    if (!Array.isArray(body.items)) {
      return NextResponse.json({ success: false, error: 'items array is required' }, { status: 400 });
    }

    const categories = BMSStore.getCategories(tenant.id);
    const defaultCategory = categories[0] || BMSStore.createCategory(tenant.id, 'General', 'general');

    const createdProducts = [];
    const errors = [];

    for (let i = 0; i < body.items.length; i++) {
      const item = body.items[i];
      if (!item.name || !item.basePrice) {
        errors.push({ row: i + 1, error: 'Missing name or basePrice' });
        continue;
      }

      const product = BMSStore.createProduct(tenant.id, {
        categoryId: item.categoryId || defaultCategory.id,
        name: item.name,
        slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description: item.description || null,
        basePrice: Number(item.basePrice),
        taxRate: Number(item.taxRate || 5),
        isVeg: item.isVeg !== false,
        isCustomCake: !!item.isCustomCake,
        trackInventory: item.trackInventory !== false,
        isInStock: true,
        preparationTimeMinutes: Number(item.preparationTimeMinutes || 10),
      });
      createdProducts.push(product);
    }

    BMSStore.logAudit(tenant.id, 'CATALOG_IMPORTED', 'PRODUCT', tenant.id, {
      importedCount: createdProducts.length,
      errorCount: errors.length,
    });

    return NextResponse.json({
      success: true,
      data: {
        imported: createdProducts.length,
        errors,
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
