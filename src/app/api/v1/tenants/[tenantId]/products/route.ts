import { NextResponse } from 'next/server';
import { BMSStore } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const { tenantId } = await params;
  const tenant = BMSStore.getTenantById(tenantId) || BMSStore.getTenantBySlug(tenantId);
  if (!tenant) {
    return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId') || undefined;

  const categories = BMSStore.getCategories(tenant.id);
  const products = BMSStore.getProducts(tenant.id, categoryId);

  return NextResponse.json({
    success: true,
    data: {
      categories,
      products,
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
    if (!body.name || !body.categoryId || body.basePrice === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name, categoryId, and basePrice are required.' },
        { status: 400 }
      );
    }

    const product = BMSStore.createProduct(tenant.id, {
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      categoryId: body.categoryId,
      description: body.description || null,
      basePrice: Number(body.basePrice),
      taxRate: Number(body.taxRate || 5),
      isVeg: Boolean(body.isVeg ?? true),
      isCustomCake: Boolean(body.isCustomCake ?? false),
      trackInventory: Boolean(body.trackInventory ?? true),
      isInStock: Boolean(body.isInStock ?? true),
      preparationTimeMinutes: Number(body.preparationTimeMinutes || 15),
      imagekitUrl: body.imagekitUrl || null,
      variants: body.variants || [],
      customizations: body.customizations || [],
    });

    BMSStore.logAudit(tenant.id, 'PRODUCT_CREATED', 'Product', product.id, { name: product.name });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
