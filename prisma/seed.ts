import { PrismaClient, Role, OrderSource, OrderStatus, DeliveryType, PaymentMethod, PaymentStatus, KOTStatus, StockMovementReason } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Multi-Tenant Bakery Management System data...');

  // 1. Super Admin User
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@bakeryms.com' },
    update: {},
    create: {
      email: 'admin@bakeryms.com',
      name: 'Global Platform Admin',
      phone: '+919999900000',
      isSuperAdmin: true,
    },
  });

  // 2. Tenant 1: Sweet Delights Bakery
  const tenant1 = await prisma.tenant.upsert({
    where: { slug: 'sweet-delights' },
    update: {},
    create: {
      name: 'Sweet Delights Bakery',
      slug: 'sweet-delights',
      isActive: true,
    },
  });

  await prisma.bakeryProfile.upsert({
    where: { tenantId: tenant1.id },
    update: {},
    create: {
      tenantId: tenant1.id,
      tagline: 'Artisanal Breads, Patisserie & Custom Celebration Cakes',
      phone: '+919876543210',
      email: 'contact@sweetdelights.com',
      address: 'Road No. 36, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      gstNumber: '36AABCU9603R1ZM',
      fssaiNumber: '13621014000452',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      openingTime: '08:00',
      closingTime: '23:00',
      allowPickup: true,
      allowDelivery: true,
      logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80',
    },
  });

  await prisma.websiteSettings.upsert({
    where: { tenantId: tenant1.id },
    update: {},
    create: {
      tenantId: tenant1.id,
      primaryColor: '#e11d48', // Vibrant Rose
      secondaryColor: '#f43f5e',
      backgroundColor: '#fffbfb',
      cardBackgroundColor: '#ffffff',
      headerBackgroundColor: '#ffffff',
      navBackgroundColor: '#ffffff',
      buttonBackgroundColor: '#e11d48',
      buttonTextColor: '#ffffff',
      headingColor: '#1e293b',
      bodyTextColor: '#334155',
      entireTextColor: '#334155',
      linkColor: '#e11d48',
      fontFamily: 'Inter',
      heroTitle: 'Baked Fresh with Passion, Every Single Morning',
      heroSubtitle: 'Handcrafted sourdough breads, French pastries, and show-stopping customized cakes tailored for your special celebrations.',
      heroImageUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&auto=format&fit=crop&q=80',
      aboutText: 'Sweet Delights has been serving Jubilee Hills since 2018 with authentic European pastry techniques and pure local butter.',
      announcementBar: '🎉 Free delivery on orders over ₹1,500! Pre-order your weekend custom cakes 24 hours in advance.',
    },
  });

  // Users for Tenant 1
  const owner1 = await prisma.user.upsert({
    where: { email: 'owner@sweetdelights.com' },
    update: {},
    create: {
      email: 'owner@sweetdelights.com',
      name: 'Sunita Sharma (Owner)',
      phone: '+919876543211',
    },
  });

  const posStaff1 = await prisma.user.upsert({
    where: { email: 'pos@sweetdelights.com' },
    update: {},
    create: {
      email: 'pos@sweetdelights.com',
      name: 'Rahul Varma (Cashier)',
      phone: '+919876543212',
    },
  });

  const chef1 = await prisma.user.upsert({
    where: { email: 'chef@sweetdelights.com' },
    update: {},
    create: {
      email: 'chef@sweetdelights.com',
      name: 'Master Baker Anand',
      phone: '+919876543213',
    },
  });

  // Memberships
  await prisma.tenantMembership.upsert({
    where: { tenantId_userId: { tenantId: tenant1.id, userId: owner1.id } },
    update: {},
    create: { tenantId: tenant1.id, userId: owner1.id, role: Role.BAKERY_ADMIN },
  });

  await prisma.tenantMembership.upsert({
    where: { tenantId_userId: { tenantId: tenant1.id, userId: posStaff1.id } },
    update: {},
    create: { tenantId: tenant1.id, userId: posStaff1.id, role: Role.POS_STAFF },
  });

  await prisma.tenantMembership.upsert({
    where: { tenantId_userId: { tenantId: tenant1.id, userId: chef1.id } },
    update: {},
    create: { tenantId: tenant1.id, userId: chef1.id, role: Role.KITCHEN_STAFF },
  });

  // Categories for Tenant 1
  const catBreads = await prisma.productCategory.upsert({
    where: { tenantId_slug: { tenantId: tenant1.id, slug: 'breads' } },
    update: {},
    create: {
      tenantId: tenant1.id,
      name: 'Artisan Breads',
      slug: 'breads',
      description: 'Slow-fermented crusty sourdoughs, baguettes and dinner rolls.',
      displayOrder: 1,
    },
  });

  const catPastries = await prisma.productCategory.upsert({
    where: { tenantId_slug: { tenantId: tenant1.id, slug: 'pastries' } },
    update: {},
    create: {
      tenantId: tenant1.id,
      name: 'Pastries & Viennoiserie',
      slug: 'pastries',
      description: 'Pure French butter croissants, danishes, and choux.',
      displayOrder: 2,
    },
  });

  const catCakes = await prisma.productCategory.upsert({
    where: { tenantId_slug: { tenantId: tenant1.id, slug: 'cakes' } },
    update: {},
    create: {
      tenantId: tenant1.id,
      name: 'Cakes & Desserts',
      slug: 'cakes',
      description: 'Fresh slices and whole celebration cakes.',
      displayOrder: 3,
    },
  });

  const catCustomCakes = await prisma.productCategory.upsert({
    where: { tenantId_slug: { tenantId: tenant1.id, slug: 'custom-cakes' } },
    update: {},
    create: {
      tenantId: tenant1.id,
      name: 'Customized Cakes',
      slug: 'custom-cakes',
      description: 'Designer tiered cakes with customized flavours, shapes, and greetings.',
      displayOrder: 4,
    },
  });

  const catCookies = await prisma.productCategory.upsert({
    where: { tenantId_slug: { tenantId: tenant1.id, slug: 'cookies' } },
    update: {},
    create: {
      tenantId: tenant1.id,
      name: 'Cookies & Savouries',
      slug: 'cookies',
      description: 'Crunchy shortbread, macarons, and puff snacks.',
      displayOrder: 5,
    },
  });

  // Products
  const prodCroissant = await prisma.product.upsert({
    where: { tenantId_slug: { tenantId: tenant1.id, slug: 'butter-croissant' } },
    update: {},
    create: {
      tenantId: tenant1.id,
      categoryId: catPastries.id,
      name: 'Classic Butter Croissant',
      slug: 'butter-croissant',
      description: 'Hand-laminated with imported French butter. Golden, flaky and airy.',
      basePrice: 120.00,
      taxRate: 5.0,
      isVeg: true,
      trackInventory: true,
      isInStock: true,
      preparationTimeMinutes: 5,
      imagekitUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
    },
  });

  const prodSourdough = await prisma.product.upsert({
    where: { tenantId_slug: { tenantId: tenant1.id, slug: 'country-sourdough' } },
    update: {},
    create: {
      tenantId: tenant1.id,
      categoryId: catBreads.id,
      name: 'San Francisco Country Sourdough',
      slug: 'country-sourdough',
      description: 'Naturally leavened for 36 hours. Crisp blistered crust and tangy crumb.',
      basePrice: 220.00,
      taxRate: 5.0,
      isVeg: true,
      trackInventory: true,
      isInStock: true,
      preparationTimeMinutes: 5,
      imagekitUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80',
    },
  });

  const prodCustomCake = await prisma.product.upsert({
    where: { tenantId_slug: { tenantId: tenant1.id, slug: 'designer-celebration-cake' } },
    update: {},
    create: {
      tenantId: tenant1.id,
      categoryId: catCustomCakes.id,
      name: 'Signature Celebration Cake (Custom Design)',
      slug: 'designer-celebration-cake',
      description: 'Fully customizable celebration cake made to your exact taste, theme, and size.',
      basePrice: 750.00, // base 0.5kg
      taxRate: 18.0,
      isVeg: true,
      isCustomCake: true,
      trackInventory: false,
      isInStock: true,
      preparationTimeMinutes: 180,
      imagekitUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80',
    },
  });

  // Variants for Custom Cake (Weight)
  await prisma.productVariant.createMany({
    data: [
      { productId: prodCustomCake.id, name: '0.5 kg (Serves 4-6)', priceDelta: 0.00, isDefault: true },
      { productId: prodCustomCake.id, name: '1.0 kg (Serves 8-12)', priceDelta: 650.00, isDefault: false },
      { productId: prodCustomCake.id, name: '2.0 kg (2-Tiers, Serves 20)', priceDelta: 1800.00, isDefault: false },
    ],
    skipDuplicates: true,
  });

  // Customization Groups
  await prisma.productCustomization.createMany({
    data: [
      // Flavours
      { productId: prodCustomCake.id, groupName: 'Flavour', optionName: 'Belgian Dark Truffle', additionalPrice: 50.00 },
      { productId: prodCustomCake.id, groupName: 'Flavour', optionName: 'Classic Red Velvet Cream Cheese', additionalPrice: 80.00 },
      { productId: prodCustomCake.id, groupName: 'Flavour', optionName: 'Fresh Alphonso Mango (Seasonal)', additionalPrice: 100.00 },
      { productId: prodCustomCake.id, groupName: 'Flavour', optionName: 'Dutch Chocolate Hazelnut', additionalPrice: 120.00 },
      // Shape
      { productId: prodCustomCake.id, groupName: 'Shape', optionName: 'Classic Round', additionalPrice: 0.00 },
      { productId: prodCustomCake.id, groupName: 'Shape', optionName: 'Romantic Heart', additionalPrice: 50.00 },
      { productId: prodCustomCake.id, groupName: 'Shape', optionName: 'Modern Square', additionalPrice: 50.00 },
      // Sponge
      { productId: prodCustomCake.id, groupName: 'Sponge', optionName: '100% Eggless Vanilla/Chocolate', additionalPrice: 0.00 },
      { productId: prodCustomCake.id, groupName: 'Sponge', optionName: 'Traditional Butter Sponge', additionalPrice: 0.00 },
      // Frosting
      { productId: prodCustomCake.id, groupName: 'Frosting', optionName: 'Light Dairy Whipped Cream', additionalPrice: 0.00 },
      { productId: prodCustomCake.id, groupName: 'Frosting', optionName: 'Rich Swiss Meringue Buttercream', additionalPrice: 75.00 },
    ],
    skipDuplicates: true,
  });

  // Inventory items
  const invCroissant = await prisma.inventoryItem.upsert({
    where: { tenantId_sku: { tenantId: tenant1.id, sku: 'SKU-CROISSANT' } },
    update: {},
    create: {
      tenantId: tenant1.id,
      productId: prodCroissant.id,
      name: 'Classic Butter Croissant',
      sku: 'SKU-CROISSANT',
      currentStock: 48,
      unit: 'PCS',
      lowStockThreshold: 10,
    },
  });

  const invSourdough = await prisma.inventoryItem.upsert({
    where: { tenantId_sku: { tenantId: tenant1.id, sku: 'SKU-SOURDOUGH' } },
    update: {},
    create: {
      tenantId: tenant1.id,
      productId: prodSourdough.id,
      name: 'Country Sourdough',
      sku: 'SKU-SOURDOUGH',
      currentStock: 25,
      unit: 'PCS',
      lowStockThreshold: 5,
    },
  });

  // Initial Stock Movement Log
  await prisma.stockMovement.create({
    data: {
      tenantId: tenant1.id,
      inventoryItemId: invCroissant.id,
      quantityChange: 50,
      balanceAfter: 48,
      reason: StockMovementReason.PURCHASE_RESTOCK,
      notes: 'Morning fresh bake batch',
      createdById: chef1.id,
    },
  });

  // Sample Walk-in POS Order
  const sampleOrder1 = await prisma.order.upsert({
    where: { tenantId_orderNumber: { tenantId: tenant1.id, orderNumber: 1001 } },
    update: {},
    create: {
      tenantId: tenant1.id,
      orderNumber: 1001,
      source: OrderSource.POS,
      status: OrderStatus.READY_FOR_PICKUP,
      deliveryType: DeliveryType.PICKUP,
      customerName: 'Kavita Reddy',
      customerPhone: '+919876599999',
      subtotalAmount: 240.00,
      taxAmount: 12.00,
      discountAmount: 0.00,
      totalAmount: 252.00,
      paidAmount: 252.00,
      balanceAmount: 0.00,
      paymentStatus: PaymentStatus.COMPLETED,
      items: {
        create: [
          {
            productId: prodCroissant.id,
            itemName: 'Classic Butter Croissant',
            unitPrice: 120.00,
            quantity: 2,
            totalPrice: 240.00,
            specialInstructions: 'Warm slightly if served immediately',
          },
        ],
      },
    },
  });

  // Payment for sampleOrder1
  await prisma.payment.create({
    data: {
      tenantId: tenant1.id,
      orderId: sampleOrder1.id,
      amount: 252.00,
      method: PaymentMethod.UPI,
      status: PaymentStatus.COMPLETED,
      transactionReference: 'UPI-REF-992817291',
      recordedById: posStaff1.id,
    },
  });

  // KOT Ticket for sampleOrder1
  await prisma.kOTTicket.upsert({
    where: { tenantId_ticketNumber: { tenantId: tenant1.id, ticketNumber: 101 } },
    update: {},
    create: {
      tenantId: tenant1.id,
      orderId: sampleOrder1.id,
      ticketNumber: 101,
      status: KOTStatus.READY,
      isCustomCake: false,
      announcedCount: 1,
      items: {
        create: [
          {
            itemName: 'Classic Butter Croissant',
            quantity: 2,
            specialInstructions: 'Pack in brown bakery pouch',
          },
        ],
      },
    },
  });

  // 3. Tenant 2: Crumb & Crust Patisserie (Testing multi-tenancy & different brand styling)
  const tenant2 = await prisma.tenant.upsert({
    where: { slug: 'crumb-crust' },
    update: {},
    create: {
      name: 'Crumb & Crust Patisserie',
      slug: 'crumb-crust',
      isActive: true,
    },
  });

  await prisma.bakeryProfile.upsert({
    where: { tenantId: tenant2.id },
    update: {},
    create: {
      tenantId: tenant2.id,
      tagline: 'Gourmet French Bakery & Cafe',
      phone: '+919123456789',
      email: 'hello@crumbcrust.com',
      address: '100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      gstNumber: '29AABCC1234F1Z5',
      fssaiNumber: '11223344556677',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      logoUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&auto=format&fit=crop&q=80',
    },
  });

  await prisma.websiteSettings.upsert({
    where: { tenantId: tenant2.id },
    update: {},
    create: {
      tenantId: tenant2.id,
      primaryColor: '#d97706', // Warm Amber
      secondaryColor: '#f59e0b',
      backgroundColor: '#fefcf8',
      cardBackgroundColor: '#ffffff',
      headerBackgroundColor: '#ffffff',
      navBackgroundColor: '#ffffff',
      buttonBackgroundColor: '#d97706',
      buttonTextColor: '#ffffff',
      headingColor: '#1c1917',
      bodyTextColor: '#44403c',
      entireTextColor: '#44403c',
      linkColor: '#d97706',
      fontFamily: 'Inter',
      heroTitle: 'Old-World French Baking in the Heart of Bengaluru',
      heroSubtitle: 'Flaky pain au chocolat, sourdough brioche, and custom gateaux handcrafted daily.',
      heroImageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80',
    },
  });

  console.log('✅ Multi-Tenant Database Seed Completed Successfully!');
  console.log(`- Super Admin: admin@bakeryms.com`);
  console.log(`- Tenant 1: Sweet Delights Bakery (slug: sweet-delights)`);
  console.log(`- Tenant 2: Crumb & Crust Patisserie (slug: crumb-crust)`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
