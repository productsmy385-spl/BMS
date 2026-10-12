import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateCustomCakeItemPrice, calculateOrderTotals } from '../src/lib/pricing';
import { generateKOTAnnouncement, generateReadyAnnouncement } from '../src/lib/voice';
import { formatCustomerReceipt, formatKitchenSlip } from '../src/lib/printer';
import { createOrderConfirmationWhatsApp, handleInboundMenuInquiry } from '../src/lib/interakt';
import { BMSStore } from '../src/lib/store';
import { hasPermission, hasModulePermission, canAccessKitchen, canAccessDelivery, canAccessTenantAdmin } from '../src/lib/auth';
import { Product, KOTTicket, Order } from '../src/types';

describe('BMS Pricing & Calculation Engine', () => {
  const dummyProduct: Product = {
    id: 'prod_test_cake',
    tenantId: 'tenant_sweet_delights',
    categoryId: 'cat_cakes',
    name: 'Celebration Custom Cake',
    slug: 'celebration-cake',
    basePrice: 500,
    taxRate: 5,
    isVeg: true,
    isCustomCake: true,
    trackInventory: false,
    isInStock: true,
    preparationTimeMinutes: 120,
    variants: [
      { id: 'v_1kg', productId: 'prod_test_cake', name: '1.0 kg', priceDelta: 400, isDefault: true },
    ],
    customizations: [
      { id: 'c_flavour', productId: 'prod_test_cake', groupName: 'Flavour', optionName: 'Belgian Truffle', additionalPrice: 50 },
      { id: 'c_shape', productId: 'prod_test_cake', groupName: 'Shape', optionName: 'Heart', additionalPrice: 50 },
    ],
  };

  it('calculates custom cake total accurately with variant and add-on costs', () => {
    const variant = dummyProduct.variants![0];
    const spec = { flavour: 'Belgian Truffle', shape: 'Heart' };

    const { unitPrice, breakdown } = calculateCustomCakeItemPrice(
      dummyProduct,
      variant,
      spec,
      dummyProduct.customizations
    );

    // 500 (base) + 400 (1kg variant) + 50 (Truffle) + 50 (Heart) = 1000
    assert.equal(unitPrice, 1000);
    assert.equal(breakdown.basePrice, 500);
    assert.equal(breakdown['variant_1.0 kg'], 400);
    assert.equal(breakdown['flavour_Belgian Truffle'], 50);
  });

  it('computes subtotal, taxes and net totals correctly', () => {
    const items = [
      { unitPrice: 100, quantity: 2, taxRate: 5 },
      { unitPrice: 500, quantity: 1, taxRate: 5 },
    ];
    // subtotal = 700, 5% tax = 35, total = 735
    const totals = calculateOrderTotals(items, 0);
    assert.equal(totals.subtotal, 700);
    assert.equal(totals.tax, 35);
    assert.equal(totals.total, 735);
  });
});

describe('BMS Bilingual Voice Announcement Queue', () => {
  const dummyTicket: KOTTicket = {
    id: 'kot_99',
    tenantId: 'tenant_sweet_delights',
    orderId: 'ord_99',
    ticketNumber: 555,
    orderNumber: 2001,
    status: 'NEW',
    isCustomCake: true,
    announcedCount: 0,
    customerName: 'Priya Sharma',
    createdAt: new Date().toISOString(),
    items: [{ id: 'k1', ticketId: 'kot_99', itemName: 'Signature Cake', quantity: 1 }],
  };

  it('generates English and Telugu announcement scripts for new tickets', () => {
    const scripts = generateKOTAnnouncement(dummyTicket);
    assert.ok(scripts.english.includes('New Order Number 2001'));
    assert.ok(scripts.english.includes('Customized designer cake'));
    assert.ok(scripts.telugu.includes('Kotta order vachindi. Order number 2001'));
    assert.ok(scripts.telugu.includes('Priya Sharma'));
  });

  it('generates English and Telugu pickup ready announcements', () => {
    const scripts = generateReadyAnnouncement(dummyTicket);
    assert.ok(scripts.english.includes('ready for pickup'));
    assert.ok(scripts.telugu.includes('ready ga undi'));
  });
});

describe('BMS Thermal ESC/POS Printer Formatter', () => {
  const sampleOrder: Order = {
    id: 'ord_123',
    tenantId: 'tenant_sweet_delights',
    orderNumber: 1042,
    source: 'POS',
    status: 'ACCEPTED',
    deliveryType: 'PICKUP',
    customerName: 'Rajesh',
    customerPhone: '+91 98765 00000',
    subtotalAmount: 200,
    discountAmount: 0,
    taxAmount: 10,
    totalAmount: 210,
    paidAmount: 210,
    balanceAmount: 0,
    paymentStatus: 'COMPLETED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'i1',
        orderId: 'ord_123',
        itemName: 'Croissant',
        unitPrice: 100,
        quantity: 2,
        totalPrice: 200,
      },
    ],
    payments: [],
  };

  it('generates 80mm thermal receipt with correct layout and totals', () => {
    const receipt = formatCustomerReceipt(sampleOrder, null, '80mm');
    assert.ok(receipt.plainText.includes('ORDER: #1042'));
    assert.ok(receipt.plainText.includes('NET TOTAL:'));
    assert.ok(receipt.plainText.includes('₹210.00'));
    assert.equal(receipt.width, '80mm');
  });

  it('generates kitchen slip with ticket number and checklist items', () => {
    const dummyTicket: KOTTicket = {
      id: 'kot_1',
      tenantId: 'tenant_sweet_delights',
      orderId: 'ord_123',
      ticketNumber: 88,
      orderNumber: 1042,
      status: 'NEW',
      isCustomCake: false,
      announcedCount: 0,
      createdAt: new Date().toISOString(),
      items: [{ id: 'ki1', ticketId: 'kot_1', itemName: 'Croissant', quantity: 2 }],
    };
    const slip = formatKitchenSlip(dummyTicket, '80mm');
    assert.ok(slip.plainText.includes('KITCHEN ORDER TICKET (KOT)'));
    assert.ok(slip.plainText.includes('KOT #: 88'));
    assert.ok(slip.plainText.includes('[ ] 2 x CROISSANT'));
  });
});

describe('BMS Interakt WhatsApp Integration', () => {
  it('creates order confirmation template with customer details', () => {
    const sampleOrder: Order = {
      id: 'ord_1',
      tenantId: 'tenant_sweet_delights',
      orderNumber: 1050,
      source: 'PUBLIC_WEBSITE',
      status: 'ACCEPTED',
      deliveryType: 'PICKUP',
      customerName: 'Ananya',
      customerPhone: '+919988776655',
      subtotalAmount: 500,
      discountAmount: 0,
      taxAmount: 25,
      totalAmount: 525,
      paidAmount: 525,
      balanceAmount: 0,
      paymentStatus: 'COMPLETED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
      payments: [],
    };
    const tenant = { id: 't1', name: 'Sweet Delights', slug: 'sweet-delights', isActive: true, createdAt: '', updatedAt: '' };

    const payload = createOrderConfirmationWhatsApp(sampleOrder, tenant);
    assert.equal(payload.phoneNumber, '9988776655');
    assert.equal(payload.template?.name, 'bms_order_confirmed');
    assert.ok(payload.template?.bodyValues.includes('#1050'));
  });

  it('matches customer menu inquiries and replies with live bakery URL', () => {
    const reply = handleInboundMenuInquiry('Hi, please send your bakery menu', 'sweet-delights');
    assert.ok(reply !== null);
    assert.ok(reply.includes('/sweet-delights'));
    assert.ok(reply.includes('fresh bakery menu'));
  });
});

describe('BMS Multi-Tenant Logical Isolation', () => {
  it('isolates product catalog between tenants', () => {
    const sweetDelights = BMSStore.getTenantBySlug('sweet-delights')!;
    const crumbCrust = BMSStore.getTenantBySlug('crumb-crust')!;

    const products1 = BMSStore.getProducts(sweetDelights.id);
    const products2 = BMSStore.getProducts(crumbCrust.id);

    assert.ok(products1.length > 0);
    assert.ok(products2.length > 0);

    const overlap = products1.filter((p1) => products2.some((p2) => p2.id === p1.id));
    assert.equal(overlap.length, 0);
  });

  it('isolates website customization colors between tenants', () => {
    const sweetDelights = BMSStore.getTenantBySlug('sweet-delights')!;
    const crumbCrust = BMSStore.getTenantBySlug('crumb-crust')!;

    const settings1 = BMSStore.getWebsiteSettings(sweetDelights.id)!;
    const settings2 = BMSStore.getWebsiteSettings(crumbCrust.id)!;

    assert.equal(settings1.primaryColor, '#e11d48');
    assert.equal(settings2.primaryColor, '#d97706');
  });

  it('isolates exported data strictly to the requesting tenant', () => {
    const sweetDelights = BMSStore.getTenantBySlug('sweet-delights')!;
    const crumbCrust = BMSStore.getTenantBySlug('crumb-crust')!;

    const sdOrders = BMSStore.exportTenantData(sweetDelights.id, 'orders');
    for (const order of sdOrders) {
      assert.equal(order.tenantId, sweetDelights.id);
      assert.notEqual(order.tenantId, crumbCrust.id);
    }
  });
});

describe('Kitchen-to-Delivery and WhatsApp Notification Workflow', () => {
  it('triggers delivery assignment and queues WhatsApp when chef marks READY', () => {
    const tenant = BMSStore.getTenantBySlug('sweet-delights')!;
    
    // Create a new delivery order
    const { order, kot } = BMSStore.createOrder(tenant.id, {
      source: 'PUBLIC_WEBSITE',
      deliveryType: 'DELIVERY',
      customerName: 'Rohan Gupta',
      customerPhone: '+91 98111 22334',
      customerAddress: 'Villa 14, Green Meadows, Hyderabad',
      items: [
        { itemName: 'Country Sourdough', unitPrice: 220, quantity: 1 },
      ],
    });

    assert.equal(order.deliveryType, 'DELIVERY');
    assert.equal(kot.status, 'NEW');

    // Chef updates ticket to READY
    const updatedKot = BMSStore.updateKOTStatus(tenant.id, kot.id, 'READY');
    assert.equal(updatedKot?.status, 'READY');

    // Verify order was transitioned to READY_FOR_PICKUP
    const updatedOrder = BMSStore.getOrderById(tenant.id, order.id);
    assert.equal(updatedOrder?.status, 'READY_FOR_PICKUP');

    // Verify Delivery Assignment is initialized
    const assignments = BMSStore.getDeliveryAssignments(tenant.id);
    const assigned = assignments.find((a) => a.orderId === order.id);
    assert.ok(assigned !== undefined);
    assert.equal(assigned.status, 'ASSIGNED');

    // Verify customer WhatsApp ready notification was enqueued
    const notifications = BMSStore.getNotifications(tenant.id);
    const readyNotif = notifications.find((n) => n.orderId === order.id && n.type === 'ORDER_READY');
    assert.ok(readyNotif !== undefined);
    assert.equal(readyNotif.status, 'SENT');
    assert.ok(String(readyNotif.payload?.message).includes('ready'));
  });

  it('transitions order to OUT_FOR_DELIVERY and queues WhatsApp when driver marks PICKED_UP', () => {
    const tenant = BMSStore.getTenantBySlug('sweet-delights')!;
    const assignments = BMSStore.getDeliveryAssignments(tenant.id);
    const assigned = assignments.find((a) => a.status === 'ASSIGNED');
    assert.ok(assigned !== undefined);

    // Driver marks order PICKED_UP
    const updated = BMSStore.updateDeliveryStatus(tenant.id, assigned.id, 'PICKED_UP');
    assert.equal(updated?.status, 'PICKED_UP');
    assert.ok(updated?.pickedUpAt !== null);

    // Verify parent order updated to OUT_FOR_DELIVERY
    const order = BMSStore.getOrderById(tenant.id, assigned.orderId);
    assert.equal(order?.status, 'OUT_FOR_DELIVERY');

    // Verify customer WhatsApp pickup notification was enqueued
    const notifications = BMSStore.getNotifications(tenant.id);
    const pickupNotif = notifications.find((n) => n.orderId === assigned.orderId && n.type === 'ORDER_OUT_FOR_DELIVERY');
    assert.ok(pickupNotif !== undefined);
    assert.ok(String(pickupNotif.payload?.message).includes('picked up'));
  });

  it('transitions order to DELIVERED when driver marks DELIVERED', () => {
    const tenant = BMSStore.getTenantBySlug('sweet-delights')!;
    const assignments = BMSStore.getDeliveryAssignments(tenant.id);
    const pickedUp = assignments.find((a) => a.status === 'PICKED_UP');
    assert.ok(pickedUp !== undefined);

    const updated = BMSStore.updateDeliveryStatus(tenant.id, pickedUp.id, 'DELIVERED');
    assert.equal(updated?.status, 'DELIVERED');
    assert.ok(updated?.deliveredAt !== null);

    const order = BMSStore.getOrderById(tenant.id, pickedUp.orderId);
    assert.equal(order?.status, 'DELIVERED');
  });
});

describe('Role-Based Authorization & Scope Restriction Enforcement', () => {
  it('permits Chef to access kitchen but strictly blocks from staff & payments', () => {
    const chefRole = 'KITCHEN_STAFF';
    assert.equal(canAccessKitchen(chefRole), true);
    assert.equal(canAccessTenantAdmin(chefRole), false);
    assert.equal(canAccessDelivery(chefRole), false);

    assert.equal(hasModulePermission(chefRole, 'kitchen.view'), true);
    assert.equal(hasModulePermission(chefRole, 'kitchen.update'), true);
    assert.equal(hasModulePermission(chefRole, 'staff.manage'), false);
    assert.equal(hasModulePermission(chefRole, 'payments.manage'), false);
    assert.equal(hasModulePermission(chefRole, 'website.manage'), false);
  });

  it('permits Delivery Agent to access delivery but strictly blocks from admin & menu', () => {
    const driverRole = 'DELIVERY_STAFF';
    assert.equal(canAccessDelivery(driverRole), true);
    assert.equal(canAccessTenantAdmin(driverRole), false);
    assert.equal(canAccessKitchen(driverRole), false);

    assert.equal(hasModulePermission(driverRole, 'delivery.view'), true);
    assert.equal(hasModulePermission(driverRole, 'delivery.update_status'), true);
    assert.equal(hasModulePermission(driverRole, 'menu.manage'), false);
    assert.equal(hasModulePermission(driverRole, 'inventory.manage'), false);
    assert.equal(hasModulePermission(driverRole, 'staff.manage'), false);
  });

  it('permits Bakery Admin full operational scope within the organization', () => {
    const adminRole = 'BAKERY_ADMIN';
    assert.equal(canAccessTenantAdmin(adminRole), true);
    assert.equal(canAccessKitchen(adminRole), true);
    assert.equal(canAccessDelivery(adminRole), true);
    assert.equal(hasModulePermission(adminRole, 'staff.manage'), true);
    assert.equal(hasModulePermission(adminRole, 'brandkit.manage'), true);
    assert.equal(hasModulePermission(adminRole, 'platform.manage'), false);
  });

  it('permits Platform Super Admin platform-wide operations', () => {
    const superRole = 'SUPER_ADMIN';
    assert.equal(hasModulePermission(superRole, 'platform.manage'), true);
    assert.equal(hasPermission(superRole, 'SUPER_ADMIN'), true);
  });
});

describe('Staff Directory & Custom Roles Management', () => {
  it('creates staff member and lists in tenant directory', () => {
    const tenant = BMSStore.getTenantBySlug('sweet-delights')!;
    const newStaff = BMSStore.createStaff(tenant.id, {
      name: 'Vikas Mehra',
      email: 'vikas@sweetdelights.com',
      phone: '+91 97777 88888',
      role: 'POS_STAFF',
    });

    assert.equal(newStaff.name, 'Vikas Mehra');
    assert.equal(newStaff.tenantId, tenant.id);
    assert.equal(newStaff.isActive, true);

    const staffList = BMSStore.getStaff(tenant.id);
    const found = staffList.find((s) => s.id === newStaff.id);
    assert.ok(found !== undefined);
  });

  it('creates custom role with granular permissions', () => {
    const tenant = BMSStore.getTenantBySlug('sweet-delights')!;
    const customRole = BMSStore.createCustomRole(tenant.id, {
      name: 'Inventory Auditor',
      description: 'Audits stock counts and views product catalogs',
      permissions: ['inventory.view', 'inventory.manage', 'menu.view'],
    });

    assert.equal(customRole.name, 'Inventory Auditor');
    assert.equal(customRole.tenantId, tenant.id);
    assert.equal(customRole.permissions.length, 3);

    const rolesList = BMSStore.getCustomRoles(tenant.id);
    const found = rolesList.find((r) => r.id === customRole.id);
    assert.ok(found !== undefined);
  });
});
