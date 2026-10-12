import {
  Tenant,
  BakeryProfile,
  WebsiteSettings,
  ProductCategory,
  Product,
  Order,
  OrderItem,
  KOTTicket,
  InventoryItem,
  StockMovement,
  Payment,
  AuditLog,
  OrderStatus,
  KOTStatus,
  PaymentStatus,
  StockMovementReason,
  DeliveryAssignment,
  DeliveryStatus,
  Notification,
  NotificationType,
  StaffUser,
  CustomRole,
  PrintJob,
  Role,
} from '@/types';

// In-Memory Multi-Tenant Store with Rich Seed Data & Isolated Boundaries
interface MultiTenantState {
  tenants: Tenant[];
  profiles: BakeryProfile[];
  websiteSettings: WebsiteSettings[];
  categories: ProductCategory[];
  products: Product[];
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  orders: Order[];
  kotTickets: KOTTicket[];
  payments: Payment[];
  deliveryAssignments: DeliveryAssignment[];
  notifications: Notification[];
  staff: StaffUser[];
  customRoles: CustomRole[];
  printJobs: PrintJob[];
  auditLogs: AuditLog[];
}

function initializeState(): MultiTenantState {
  const tenant1: Tenant = {
    id: 'tenant_sweet_delights',
    name: 'Sweet Delights Bakery',
    slug: 'sweet-delights',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const tenant2: Tenant = {
    id: 'tenant_crumb_crust',
    name: 'Crumb & Crust Patisserie',
    slug: 'crumb-crust',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const profile1: BakeryProfile = {
    id: 'prof_1',
    tenantId: tenant1.id,
    tagline: 'Artisanal Breads, Patisserie & Custom Celebration Cakes',
    phone: '+91 98765 43210',
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
  };

  const profile2: BakeryProfile = {
    id: 'prof_2',
    tenantId: tenant2.id,
    tagline: 'Gourmet French Bakery & Cafe',
    phone: '+91 91234 56789',
    email: 'hello@crumbcrust.com',
    address: '100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    gstNumber: '29AABCC1234F1Z5',
    fssaiNumber: '11223344556677',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    openingTime: '09:00',
    closingTime: '22:00',
    allowPickup: true,
    allowDelivery: true,
    logoUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&auto=format&fit=crop&q=80',
  };

  const theme1: WebsiteSettings = {
    id: 'theme_1',
    tenantId: tenant1.id,
    primaryColor: '#e11d48', // Rose
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
    aboutText: 'Sweet Delights has been serving Hyderabad with authentic European pastry techniques and pure local butter.',
    announcementBar: '🎉 Free delivery on orders over ₹1,500! Pre-order your weekend custom cakes 24 hours in advance.',
  };

  const theme2: WebsiteSettings = {
    id: 'theme_2',
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
    heroTitle: 'Old-World French Baking in Indiranagar',
    heroSubtitle: 'Flaky pain au chocolat, sourdough brioche, and custom gateaux handcrafted daily.',
    heroImageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80',
    aboutText: 'Crumb & Crust brings artisanal French baking traditions to Bengaluru.',
    announcementBar: '🥖 Fresh batch of baguettes out of the oven every 2 hours!',
  };

  const categories: ProductCategory[] = [
    { id: 'cat_1', tenantId: tenant1.id, name: 'Artisan Breads', slug: 'breads', displayOrder: 1, isActive: true },
    { id: 'cat_2', tenantId: tenant1.id, name: 'Pastries & Viennoiserie', slug: 'pastries', displayOrder: 2, isActive: true },
    { id: 'cat_3', tenantId: tenant1.id, name: 'Cakes & Desserts', slug: 'cakes', displayOrder: 3, isActive: true },
    { id: 'cat_4', tenantId: tenant1.id, name: 'Customized Cakes', slug: 'custom-cakes', displayOrder: 4, isActive: true },
    { id: 'cat_5', tenantId: tenant1.id, name: 'Cookies & Savouries', slug: 'cookies', displayOrder: 5, isActive: true },
    // Tenant 2 categories
    { id: 'cat_6', tenantId: tenant2.id, name: 'Breads', slug: 'breads', displayOrder: 1, isActive: true },
    { id: 'cat_7', tenantId: tenant2.id, name: 'French Pastries', slug: 'pastries', displayOrder: 2, isActive: true },
    { id: 'cat_8', tenantId: tenant2.id, name: 'Gateaux', slug: 'gateaux', displayOrder: 3, isActive: true },
  ];

  const products: Product[] = [
    {
      id: 'prod_croissant',
      tenantId: tenant1.id,
      categoryId: 'cat_2',
      name: 'Classic Butter Croissant',
      slug: 'butter-croissant',
      description: 'Hand-laminated with imported French butter. Golden, flaky, and honeycomb interior.',
      basePrice: 120,
      taxRate: 5,
      isVeg: true,
      isCustomCake: false,
      trackInventory: true,
      isInStock: true,
      preparationTimeMinutes: 5,
      imagekitUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'prod_sourdough',
      tenantId: tenant1.id,
      categoryId: 'cat_1',
      name: 'San Francisco Country Sourdough',
      slug: 'country-sourdough',
      description: 'Naturally leavened for 36 hours. Blistered crust and tangy, open crumb.',
      basePrice: 220,
      taxRate: 5,
      isVeg: true,
      isCustomCake: false,
      trackInventory: true,
      isInStock: true,
      preparationTimeMinutes: 5,
      imagekitUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'prod_choco_pastry',
      tenantId: tenant1.id,
      categoryId: 'cat_3',
      name: 'Belgian Dark Truffle Slice',
      slug: 'choco-truffle-slice',
      description: '70% dark chocolate ganache layered with moist cocoa sponge. 100% Eggless.',
      basePrice: 180,
      taxRate: 5,
      isVeg: true,
      isCustomCake: false,
      trackInventory: true,
      isInStock: true,
      preparationTimeMinutes: 5,
      imagekitUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'prod_custom_cake',
      tenantId: tenant1.id,
      categoryId: 'cat_4',
      name: 'Signature Celebration Cake (Custom Design)',
      slug: 'designer-celebration-cake',
      description: 'Fully customized designer cake crafted to your exact celebration theme, flavor, shape, and message.',
      basePrice: 750,
      taxRate: 18,
      isVeg: true,
      isCustomCake: true,
      trackInventory: false,
      isInStock: true,
      preparationTimeMinutes: 180,
      imagekitUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80',
      variants: [
        { id: 'var_0_5kg', productId: 'prod_custom_cake', name: '0.5 kg (Serves 4-6)', priceDelta: 0, isDefault: true },
        { id: 'var_1kg', productId: 'prod_custom_cake', name: '1.0 kg (Serves 8-12)', priceDelta: 650, isDefault: false },
        { id: 'var_2kg', productId: 'prod_custom_cake', name: '2.0 kg (2-Tiers, Serves 20)', priceDelta: 1800, isDefault: false },
      ],
      customizations: [
        { id: 'cust_f1', productId: 'prod_custom_cake', groupName: 'Flavour', optionName: 'Belgian Dark Truffle', additionalPrice: 50 },
        { id: 'cust_f2', productId: 'prod_custom_cake', groupName: 'Flavour', optionName: 'Classic Red Velvet Cream Cheese', additionalPrice: 80 },
        { id: 'cust_f3', productId: 'prod_custom_cake', groupName: 'Flavour', optionName: 'Fresh Alphonso Mango (Seasonal)', additionalPrice: 100 },
        { id: 'cust_f4', productId: 'prod_custom_cake', groupName: 'Flavour', optionName: 'Dutch Chocolate Hazelnut', additionalPrice: 120 },
        { id: 'cust_s1', productId: 'prod_custom_cake', groupName: 'Shape', optionName: 'Classic Round', additionalPrice: 0 },
        { id: 'cust_s2', productId: 'prod_custom_cake', groupName: 'Shape', optionName: 'Romantic Heart', additionalPrice: 50 },
        { id: 'cust_s3', productId: 'prod_custom_cake', groupName: 'Shape', optionName: 'Modern Square', additionalPrice: 50 },
        { id: 'cust_sp1', productId: 'prod_custom_cake', groupName: 'Sponge', optionName: '100% Eggless Vanilla/Chocolate', additionalPrice: 0 },
        { id: 'cust_sp2', productId: 'prod_custom_cake', groupName: 'Sponge', optionName: 'Traditional Butter Sponge', additionalPrice: 0 },
        { id: 'cust_fr1', productId: 'prod_custom_cake', groupName: 'Frosting', optionName: 'Light Dairy Whipped Cream', additionalPrice: 0 },
        { id: 'cust_fr2', productId: 'prod_custom_cake', groupName: 'Frosting', optionName: 'Rich Swiss Meringue Buttercream', additionalPrice: 75 },
      ],
    },
    {
      id: 'prod_almond_cookies',
      tenantId: tenant1.id,
      categoryId: 'cat_5',
      name: 'Roasted Almond Butter Cookies (Box of 12)',
      slug: 'almond-cookies',
      description: 'Melt-in-mouth sablé cookies packed with roasted California almonds.',
      basePrice: 280,
      taxRate: 5,
      isVeg: true,
      isCustomCake: false,
      trackInventory: true,
      isInStock: true,
      preparationTimeMinutes: 5,
      imagekitUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80',
    },
    // Tenant 2 products
    {
      id: 'prod_baguette',
      tenantId: tenant2.id,
      categoryId: 'cat_6',
      name: 'Parisian Traditional Baguette',
      slug: 'traditional-baguette',
      description: 'Crisp shatter-crust baguette made with stone-ground French flour.',
      basePrice: 110,
      taxRate: 5,
      isVeg: true,
      isCustomCake: false,
      trackInventory: true,
      isInStock: true,
      preparationTimeMinutes: 5,
      imagekitUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'prod_eclair',
      tenantId: tenant2.id,
      categoryId: 'cat_7',
      name: 'Coffee Caramel Éclair',
      slug: 'coffee-eclair',
      description: 'Crisp choux pastry filled with espresso diplomat cream and salted caramel glaze.',
      basePrice: 160,
      taxRate: 5,
      isVeg: true,
      isCustomCake: false,
      trackInventory: true,
      isInStock: true,
      preparationTimeMinutes: 5,
      imagekitUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const inventory: InventoryItem[] = [
    { id: 'inv_1', tenantId: tenant1.id, productId: 'prod_croissant', name: 'Classic Butter Croissant', sku: 'SKU-CROISSANT', currentStock: 46, unit: 'PCS', lowStockThreshold: 10 },
    { id: 'inv_2', tenantId: tenant1.id, productId: 'prod_sourdough', name: 'San Francisco Country Sourdough', sku: 'SKU-SOURDOUGH', currentStock: 25, unit: 'PCS', lowStockThreshold: 5 },
    { id: 'inv_3', tenantId: tenant1.id, productId: 'prod_choco_pastry', name: 'Belgian Dark Truffle Slice', sku: 'SKU-TRUFFLE-SLICE', currentStock: 18, unit: 'PCS', lowStockThreshold: 5 },
    { id: 'inv_4', tenantId: tenant1.id, productId: 'prod_almond_cookies', name: 'Roasted Almond Butter Cookies', sku: 'SKU-ALMOND-COOKIES', currentStock: 30, unit: 'BOX', lowStockThreshold: 8 },
  ];

  const sampleOrder1: Order = {
    id: 'ord_1001',
    tenantId: tenant1.id,
    orderNumber: 1001,
    source: 'POS',
    status: 'READY_FOR_PICKUP',
    deliveryType: 'PICKUP',
    customerName: 'Kavita Reddy',
    customerPhone: '+91 98765 99999',
    subtotalAmount: 240,
    taxAmount: 12,
    discountAmount: 0,
    totalAmount: 252,
    paidAmount: 252,
    balanceAmount: 0,
    paymentStatus: 'COMPLETED',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'item_1',
        orderId: 'ord_1001',
        productId: 'prod_croissant',
        itemName: 'Classic Butter Croissant',
        unitPrice: 120,
        quantity: 2,
        totalPrice: 240,
        specialInstructions: 'Warm slightly',
      },
    ],
    payments: [
      {
        id: 'pay_1',
        tenantId: tenant1.id,
        orderId: 'ord_1001',
        amount: 252,
        method: 'UPI',
        status: 'COMPLETED',
        transactionReference: 'UPI-REF-992817291',
        createdAt: new Date().toISOString(),
      },
    ],
  };

  const sampleOrder2: Order = {
    id: 'ord_1002',
    tenantId: tenant1.id,
    orderNumber: 1002,
    source: 'PUBLIC_WEBSITE',
    status: 'ACCEPTED',
    deliveryType: 'DELIVERY',
    customerName: 'Ananya Roy',
    customerPhone: '+91 98765 12345',
    customerAddress: 'Flat 402, Lotus Greens, Road No. 45, Jubilee Hills, Hyderabad',
    scheduledFor: new Date(Date.now() + 7200000).toISOString(),
    subtotalAmount: 930,
    taxAmount: 135,
    discountAmount: 0,
    totalAmount: 1065,
    paidAmount: 1065,
    balanceAmount: 0,
    paymentStatus: 'COMPLETED',
    specialNotes: 'Call upon gate arrival',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'item_2',
        orderId: 'ord_1002',
        productId: 'prod_custom_cake',
        itemName: 'Signature Celebration Cake (Custom Design)',
        unitPrice: 750,
        quantity: 1,
        totalPrice: 750,
        customization: {
          flavour: 'Belgian Dark Truffle',
          shape: 'Romantic Heart',
          messageOnCake: 'Happy Birthday Aryan!',
        },
      },
      {
        id: 'item_3',
        orderId: 'ord_1002',
        productId: 'prod_choco_pastry',
        itemName: 'Belgian Dark Truffle Slice',
        unitPrice: 180,
        quantity: 1,
        totalPrice: 180,
      },
    ],
    payments: [
      {
        id: 'pay_2',
        tenantId: tenant1.id,
        orderId: 'ord_1002',
        amount: 1065,
        method: 'CARD',
        status: 'COMPLETED',
        transactionReference: 'CARD-TXN-882199',
        createdAt: new Date().toISOString(),
      },
    ],
  };

  const sampleKOT1: KOTTicket = {
    id: 'kot_101',
    tenantId: tenant1.id,
    orderId: sampleOrder1.id,
    ticketNumber: 101,
    status: 'READY',
    isCustomCake: false,
    announcedCount: 1,
    lastAnnouncedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    customerName: 'Kavita Reddy',
    orderNumber: 1001,
    items: [
      {
        id: 'kot_item_1',
        ticketId: 'kot_101',
        itemName: 'Classic Butter Croissant',
        quantity: 2,
        specialInstructions: 'Warm slightly',
      },
    ],
  };

  const sampleKOT2: KOTTicket = {
    id: 'kot_102',
    tenantId: tenant1.id,
    orderId: sampleOrder2.id,
    ticketNumber: 102,
    status: 'ACCEPTED',
    isCustomCake: true,
    announcedCount: 0,
    lastAnnouncedAt: null,
    createdAt: new Date().toISOString(),
    customerName: 'Ananya Roy',
    orderNumber: 1002,
    items: [
      {
        id: 'kot_item_2',
        ticketId: 'kot_102',
        itemName: 'Signature Celebration Cake (Custom Design)',
        quantity: 1,
        specialInstructions: 'Heart shape, Truffle flavour. Msg: "Happy Birthday Aryan!"',
      },
      {
        id: 'kot_item_3',
        ticketId: 'kot_102',
        itemName: 'Belgian Dark Truffle Slice',
        quantity: 1,
      },
    ],
  };

  const sampleDeliveryAssignment: DeliveryAssignment = {
    id: 'deliv_101',
    tenantId: tenant1.id,
    orderId: sampleOrder2.id,
    assignedDriverId: 'usr_sd_driver',
    driverName: 'Suresh Kumar',
    driverPhone: '+91 98888 11111',
    status: 'ASSIGNED',
    assignedAt: new Date().toISOString(),
    deliveryNotes: 'Gate security code 4402',
    order: sampleOrder2,
  };

  const staff: StaffUser[] = [
    {
      id: 'usr_sd_owner',
      tenantId: tenant1.id,
      name: 'Sunita Sharma',
      email: 'owner@sweetdelights.com',
      phone: '+91 98765 43210',
      role: 'BAKERY_ADMIN',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_sd_chef',
      tenantId: tenant1.id,
      name: 'Chef Anand',
      email: 'chef@sweetdelights.com',
      phone: '+91 98765 11111',
      role: 'KITCHEN_STAFF',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_sd_pos',
      tenantId: tenant1.id,
      name: 'Rahul Varma',
      email: 'pos@sweetdelights.com',
      phone: '+91 98765 22222',
      role: 'POS_STAFF',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_sd_driver',
      tenantId: tenant1.id,
      name: 'Suresh Kumar',
      email: 'driver@sweetdelights.com',
      phone: '+91 98888 11111',
      role: 'DELIVERY_STAFF',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    // Crumb & Crust staff
    {
      id: 'usr_cc_owner',
      tenantId: tenant2.id,
      name: 'Jean-Luc',
      email: 'owner@crumbcrust.com',
      phone: '+91 91234 56789',
      role: 'BAKERY_ADMIN',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_cc_driver',
      tenantId: tenant2.id,
      name: 'David Raj',
      email: 'driver@crumbcrust.com',
      phone: '+91 91234 99999',
      role: 'DELIVERY_STAFF',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const customRoles: CustomRole[] = [
    {
      id: 'role_shift_lead',
      tenantId: tenant1.id,
      name: 'Shift Lead',
      description: 'Can manage daily orders, POS, kitchen flow and stock adjustments',
      permissions: ['orders.view', 'orders.create', 'kitchen.view', 'kitchen.update', 'inventory.view', 'inventory.manage'],
      createdAt: new Date().toISOString(),
    },
  ];

  const notifications: Notification[] = [
    {
      id: 'notif_1',
      tenantId: tenant1.id,
      orderId: sampleOrder1.id,
      recipientPhone: '9876599999',
      type: 'ORDER_CONFIRMATION',
      status: 'DELIVERED',
      payload: { orderNumber: 1001, total: 252 },
      retryCount: 0,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  return {
    tenants: [tenant1, tenant2],
    profiles: [profile1, profile2],
    websiteSettings: [theme1, theme2],
    categories,
    products,
    inventory,
    stockMovements: [],
    orders: [sampleOrder1, sampleOrder2],
    kotTickets: [sampleKOT1, sampleKOT2],
    payments: [...sampleOrder1.payments, ...sampleOrder2.payments],
    deliveryAssignments: [sampleDeliveryAssignment],
    notifications,
    staff,
    customRoles,
    printJobs: [],
    auditLogs: [],
  };
}

// Global state singleton
const globalStore = globalThis as unknown as { __bmsStore?: MultiTenantState };
if (!globalStore.__bmsStore) {
  globalStore.__bmsStore = initializeState();
}
export const store = globalStore.__bmsStore;

// Store Operations Helper
export const BMSStore = {
  // Tenant & Branding
  getTenants: () => store.tenants,
  getTenantBySlug: (slug: string) => store.tenants.find((t) => t.slug === slug && t.isActive),
  getTenantById: (id: string) => store.tenants.find((t) => t.id === id),
  getProfile: (tenantId: string) => store.profiles.find((p) => p.tenantId === tenantId),
  getWebsiteSettings: (tenantId: string) => store.websiteSettings.find((w) => w.tenantId === tenantId),
  updateWebsiteSettings: (tenantId: string, updates: Partial<WebsiteSettings>) => {
    const existing = store.websiteSettings.find((w) => w.tenantId === tenantId);
    if (existing) {
      Object.assign(existing, updates);
      return existing;
    }
    const created: WebsiteSettings = {
      id: `theme_${Date.now()}`,
      tenantId,
      primaryColor: updates.primaryColor || '#e11d48',
      secondaryColor: updates.secondaryColor || '#f43f5e',
      backgroundColor: updates.backgroundColor || '#ffffff',
      cardBackgroundColor: updates.cardBackgroundColor || '#ffffff',
      headerBackgroundColor: updates.headerBackgroundColor || '#ffffff',
      navBackgroundColor: updates.navBackgroundColor || '#ffffff',
      buttonBackgroundColor: updates.buttonBackgroundColor || '#e11d48',
      buttonTextColor: updates.buttonTextColor || '#ffffff',
      headingColor: updates.headingColor || '#0f172a',
      bodyTextColor: updates.bodyTextColor || '#334155',
      entireTextColor: updates.entireTextColor || '#334155',
      linkColor: updates.linkColor || '#e11d48',
      fontFamily: updates.fontFamily || 'Inter',
      heroTitle: updates.heroTitle || 'Freshly Baked Delights',
      heroSubtitle: updates.heroSubtitle || 'Handcrafted breads and cakes',
      ...updates,
    };
    store.websiteSettings.push(created);
    return created;
  },

  createTenant: (tenantData: {
    name: string;
    slug: string;
    tagline?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    primaryColor?: string;
  }) => {
    const tenantId = `tenant_${tenantData.slug.replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
    const newTenant: Tenant = {
      id: tenantId,
      name: tenantData.name,
      slug: tenantData.slug,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.tenants.push(newTenant);

    const newProfile: BakeryProfile = {
      id: `prof_${Date.now()}`,
      tenantId,
      tagline: tenantData.tagline || 'Artisanal Bakery & Patisserie',
      phone: tenantData.phone || '+91 99999 00000',
      email: tenantData.email || `contact@${tenantData.slug}.com`,
      address: tenantData.address || 'Main Road',
      city: tenantData.city || 'Hyderabad',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      allowPickup: true,
      allowDelivery: true,
      openingTime: '08:00',
      closingTime: '23:00',
    };
    store.profiles.push(newProfile);

    const newTheme: WebsiteSettings = {
      id: `theme_${Date.now()}`,
      tenantId,
      primaryColor: tenantData.primaryColor || '#e11d48',
      secondaryColor: '#f43f5e',
      backgroundColor: '#ffffff',
      cardBackgroundColor: '#ffffff',
      headerBackgroundColor: '#ffffff',
      navBackgroundColor: '#ffffff',
      buttonBackgroundColor: tenantData.primaryColor || '#e11d48',
      buttonTextColor: '#ffffff',
      headingColor: '#0f172a',
      bodyTextColor: '#334155',
      entireTextColor: '#334155',
      linkColor: tenantData.primaryColor || '#e11d48',
      fontFamily: 'Inter',
      heroTitle: `Welcome to ${tenantData.name}`,
      heroSubtitle: tenantData.tagline || 'Fresh handcrafted artisan bakes, everyday.',
    };
    store.websiteSettings.push(newTheme);

    // Initial default categories
    const catBread: ProductCategory = {
      id: `cat_bread_${Date.now()}`,
      tenantId,
      name: 'Fresh Breads',
      slug: 'breads',
      displayOrder: 1,
      isActive: true,
    };
    const catCakes: ProductCategory = {
      id: `cat_cakes_${Date.now()}`,
      tenantId,
      name: 'Custom Celebration Cakes',
      slug: 'cakes',
      displayOrder: 2,
      isActive: true,
    };
    store.categories.push(catBread, catCakes);

    // Initial administrator staff account
    const initialAdmin: StaffUser = {
      id: `usr_${tenantData.slug}_admin`,
      tenantId,
      name: `${tenantData.name} Admin`,
      email: tenantData.email || `admin@${tenantData.slug}.com`,
      phone: tenantData.phone,
      role: 'BAKERY_ADMIN',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    store.staff.push(initialAdmin);

    return { tenant: newTenant, profile: newProfile, websiteSettings: newTheme, admin: initialAdmin };
  },

  toggleTenantStatus: (tenantId: string) => {
    const tenant = store.tenants.find((t) => t.id === tenantId);
    if (tenant) {
      tenant.isActive = !tenant.isActive;
      tenant.updatedAt = new Date().toISOString();
      return tenant;
    }
    return null;
  },

  // Catalog
  getCategories: (tenantId: string) => store.categories.filter((c) => c.tenantId === tenantId && c.isActive),
  createCategory: (tenantId: string, name: string, slug: string, description?: string) => {
    const category: ProductCategory = {
      id: `cat_${Date.now()}`,
      tenantId,
      name,
      slug,
      description,
      displayOrder: store.categories.filter((c) => c.tenantId === tenantId).length + 1,
      isActive: true,
    };
    store.categories.push(category);
    return category;
  },
  getProducts: (tenantId: string, categoryId?: string) => {
    return store.products.filter(
      (p) => p.tenantId === tenantId && (categoryId ? p.categoryId === categoryId : true)
    );
  },
  getProductById: (tenantId: string, productId: string) => {
    return store.products.find((p) => p.tenantId === tenantId && p.id === productId);
  },
  createProduct: (tenantId: string, productData: Omit<Product, 'id' | 'tenantId'>) => {
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      tenantId,
      ...productData,
    };
    store.products.push(newProduct);

    if (newProduct.trackInventory) {
      const inv: InventoryItem = {
        id: `inv_${Date.now()}`,
        tenantId,
        productId: newProduct.id,
        name: newProduct.name,
        sku: `SKU-${newProduct.slug.toUpperCase()}`,
        currentStock: 20,
        unit: 'PCS',
        lowStockThreshold: 5,
      };
      store.inventory.push(inv);
    }
    return newProduct;
  },

  // Orders
  getOrders: (tenantId: string) => {
    return store.orders
      .filter((o) => o.tenantId === tenantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getOrderById: (tenantId: string, orderId: string) => {
    return store.orders.find((o) => o.tenantId === tenantId && o.id === orderId);
  },
  createOrder: (
    tenantId: string,
    orderData: {
      source: Order['source'];
      deliveryType: Order['deliveryType'];
      customerName: string;
      customerPhone: string;
      customerAddress?: string;
      scheduledFor?: string;
      specialNotes?: string;
      items: Array<{
        productId?: string;
        variantId?: string;
        itemName: string;
        unitPrice: number;
        quantity: number;
        taxRate?: number;
        specialInstructions?: string;
        customization?: any;
      }>;
      payment?: {
        amount: number;
        method: Payment['method'];
        transactionReference?: string;
      };
    }
  ) => {
    const tenantOrders = store.orders.filter((o) => o.tenantId === tenantId);
    const nextOrderNumber = tenantOrders.length > 0 ? Math.max(...tenantOrders.map((o) => o.orderNumber)) + 1 : 1001;

    let subtotalAmount = 0;
    let taxAmount = 0;
    const orderId = `ord_${Date.now()}`;

    const orderItems: OrderItem[] = orderData.items.map((i, idx) => {
      const lineTotal = i.unitPrice * i.quantity;
      subtotalAmount += lineTotal;
      const taxRate = i.taxRate ?? 5;
      taxAmount += lineTotal * (taxRate / 100);

      return {
        id: `item_${Date.now()}_${idx}`,
        orderId,
        productId: i.productId,
        variantId: i.variantId,
        itemName: i.itemName,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        totalPrice: lineTotal,
        specialInstructions: i.specialInstructions,
        customization: i.customization,
      };
    });

    const totalAmount = subtotalAmount + taxAmount;
    const paidAmount = orderData.payment ? orderData.payment.amount : 0;
    const balanceAmount = Math.max(0, totalAmount - paidAmount);
    const paymentStatus: PaymentStatus =
      paidAmount >= totalAmount ? 'COMPLETED' : paidAmount > 0 ? 'PARTIALLY_PAID' : 'PENDING';

    const newOrder: Order = {
      id: orderId,
      tenantId,
      orderNumber: nextOrderNumber,
      source: orderData.source,
      status: 'ACCEPTED',
      deliveryType: orderData.deliveryType,
      scheduledFor: orderData.scheduledFor,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      subtotalAmount,
      taxAmount,
      discountAmount: 0,
      totalAmount,
      paidAmount,
      balanceAmount,
      paymentStatus,
      specialNotes: orderData.specialNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: orderItems,
      payments: [],
    };

    if (orderData.payment && orderData.payment.amount > 0) {
      const paymentRecord: Payment = {
        id: `pay_${Date.now()}`,
        tenantId,
        orderId,
        amount: orderData.payment.amount,
        method: orderData.payment.method,
        status: 'COMPLETED',
        transactionReference: orderData.payment.transactionReference,
        createdAt: new Date().toISOString(),
      };
      newOrder.payments.push(paymentRecord);
      store.payments.push(paymentRecord);
    }

    store.orders.push(newOrder);

    // Atomic Inventory Decrement
    for (const item of orderData.items) {
      if (item.productId) {
        const inv = store.inventory.find((i) => i.tenantId === tenantId && i.productId === item.productId);
        if (inv) {
          inv.currentStock = Math.max(0, inv.currentStock - item.quantity);
          store.stockMovements.push({
            id: `mov_${Date.now()}_${item.productId}`,
            tenantId,
            inventoryItemId: inv.id,
            quantityChange: -item.quantity,
            balanceAfter: inv.currentStock,
            reason: 'ORDER_SALE',
            notes: `Sold via Order #${nextOrderNumber}`,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    // Auto-create KOT Ticket for kitchen
    const currentKots = store.kotTickets.filter((k) => k.tenantId === tenantId);
    const nextTicketNumber = currentKots.length > 0 ? Math.max(...currentKots.map((k) => k.ticketNumber)) + 1 : 101;
    const hasCustomCake = orderItems.some((i) => i.customization || i.itemName.toLowerCase().includes('cake'));

    const kotTicket: KOTTicket = {
      id: `kot_${Date.now()}`,
      tenantId,
      orderId,
      ticketNumber: nextTicketNumber,
      status: 'NEW',
      isCustomCake: hasCustomCake,
      announcedCount: 0,
      createdAt: new Date().toISOString(),
      customerName: orderData.customerName,
      orderNumber: nextOrderNumber,
      items: orderItems.map((i, idx) => ({
        id: `kitem_${Date.now()}_${idx}`,
        ticketId: `kot_${Date.now()}`,
        itemName: i.itemName,
        quantity: i.quantity,
        specialInstructions: i.specialInstructions || (i.customization?.messageOnCake ? `Msg: "${i.customization.messageOnCake}"` : null),
      })),
    };
    store.kotTickets.push(kotTicket);

    // If Delivery order, prepare initial delivery assignment
    if (orderData.deliveryType === 'DELIVERY') {
      const activeDriver = store.staff.find((s) => s.tenantId === tenantId && s.role === 'DELIVERY_STAFF' && s.isActive);
      const deliveryAssignment: DeliveryAssignment = {
        id: `deliv_${Date.now()}`,
        tenantId,
        orderId,
        assignedDriverId: activeDriver?.id || null,
        driverName: activeDriver?.name || 'Assigned Driver',
        driverPhone: activeDriver?.phone || null,
        status: 'ASSIGNED',
        assignedAt: new Date().toISOString(),
        deliveryNotes: orderData.specialNotes,
        order: newOrder,
      };
      store.deliveryAssignments.push(deliveryAssignment);
    }

    // Queue order confirmation WhatsApp
    const notif: Notification = {
      id: `notif_${Date.now()}`,
      tenantId,
      orderId,
      recipientPhone: orderData.customerPhone.replace(/[^0-9]/g, ''),
      type: 'ORDER_CONFIRMATION',
      status: 'SENT',
      payload: {
        orderNumber: nextOrderNumber,
        total: totalAmount,
        message: `Your order #${nextOrderNumber} at has been confirmed!`,
      },
      retryCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.notifications.push(notif);

    emitRealtime(tenantId, 'kot:created', kotTicket);
    emitRealtime(tenantId, 'order:created', newOrder);

    return { order: newOrder, kot: kotTicket };
  },

  updateOrderStatus: (tenantId: string, orderId: string, status: OrderStatus) => {
    const order = store.orders.find((o) => o.tenantId === tenantId && o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      emitRealtime(tenantId, 'order:updated', order);
      return order;
    }
    return null;
  },

  // Kitchen Order Tickets
  getKOTTickets: (tenantId: string) => {
    return store.kotTickets
      .filter((k) => k.tenantId === tenantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // CHEF MARKS READY WORKFLOW:
  // 1. Updates ticket status to READY
  // 2. Synchronizes Order to READY_FOR_PICKUP
  // 3. If delivery order, triggers delivery workflow & notifies delivery agent
  // 4. Queues WhatsApp customer notification via Interakt outbox
  updateKOTStatus: (tenantId: string, ticketId: string, status: KOTStatus) => {
    const ticket = store.kotTickets.find((k) => k.tenantId === tenantId && k.id === ticketId);
    if (ticket) {
      ticket.status = status;
      const order = store.orders.find((o) => o.tenantId === tenantId && o.id === ticket.orderId);

      if (status === 'READY' && order) {
        order.status = 'READY_FOR_PICKUP';
        order.updatedAt = new Date().toISOString();
        emitRealtime(tenantId, 'order:updated', order);

        // If delivery order, ensure DeliveryAssignment is ready
        if (order.deliveryType === 'DELIVERY') {
          let assignment = store.deliveryAssignments.find((d) => d.tenantId === tenantId && d.orderId === order.id);
          if (!assignment) {
            const activeDriver = store.staff.find((s) => s.tenantId === tenantId && s.role === 'DELIVERY_STAFF' && s.isActive);
            assignment = {
              id: `deliv_${Date.now()}`,
              tenantId,
              orderId: order.id,
              assignedDriverId: activeDriver?.id || null,
              driverName: activeDriver?.name || 'Assigned Driver',
              driverPhone: activeDriver?.phone || null,
              status: 'ASSIGNED',
              assignedAt: new Date().toISOString(),
              order,
            };
            store.deliveryAssignments.push(assignment);
          }
          emitRealtime(tenantId, 'delivery:order_ready', { order, assignment });
        }

        // Queue WhatsApp Customer Ready Notification
        const phoneClean = order.customerPhone.replace(/[^0-9]/g, '');
        const readyNotif: Notification = {
          id: `notif_ready_${Date.now()}`,
          tenantId,
          orderId: order.id,
          recipientPhone: phoneClean,
          type: 'ORDER_READY',
          status: 'SENT',
          payload: {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            deliveryType: order.deliveryType,
            message: `Your order #${order.orderNumber} is ready. We will update you when it is picked up for delivery.`,
          },
          retryCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        store.notifications.push(readyNotif);
        emitRealtime(tenantId, 'notification:created', readyNotif);
      }

      emitRealtime(tenantId, 'kot:updated', ticket);
      return ticket;
    }
    return null;
  },

  incrementKOTAnnouncement: (tenantId: string, ticketId: string) => {
    const ticket = store.kotTickets.find((k) => k.tenantId === tenantId && k.id === ticketId);
    if (ticket) {
      ticket.announcedCount += 1;
      ticket.lastAnnouncedAt = new Date().toISOString();
      return ticket;
    }
    return null;
  },

  // DELIVERY WORKFLOW
  getDeliveryAssignments: (tenantId: string, driverId?: string) => {
    return store.deliveryAssignments
      .filter((d) => d.tenantId === tenantId && (driverId ? d.assignedDriverId === driverId : true))
      .map((d) => {
        const order = store.orders.find((o) => o.id === d.orderId);
        return { ...d, order };
      })
      .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime());
  },

  assignDeliveryOrder: (tenantId: string, orderId: string, driverId: string, notes?: string) => {
    const driver = store.staff.find((s) => s.tenantId === tenantId && s.id === driverId);
    let assignment = store.deliveryAssignments.find((d) => d.tenantId === tenantId && d.orderId === orderId);

    if (assignment) {
      assignment.assignedDriverId = driverId;
      assignment.driverName = driver?.name || assignment.driverName;
      assignment.driverPhone = driver?.phone || assignment.driverPhone;
      assignment.deliveryNotes = notes || assignment.deliveryNotes;
    } else {
      assignment = {
        id: `deliv_${Date.now()}`,
        tenantId,
        orderId,
        assignedDriverId: driverId,
        driverName: driver?.name || 'Driver',
        driverPhone: driver?.phone || null,
        status: 'ASSIGNED',
        assignedAt: new Date().toISOString(),
        deliveryNotes: notes,
      };
      store.deliveryAssignments.push(assignment);
    }
    emitRealtime(tenantId, 'delivery:assigned', assignment);
    return assignment;
  },

  // DRIVER STATUS PROGRESSION:
  // PICKED_UP -> sets order to OUT_FOR_DELIVERY -> queues WhatsApp customer outbox notification
  // DELIVERED -> sets order to DELIVERED
  updateDeliveryStatus: (tenantId: string, assignmentId: string, status: DeliveryStatus) => {
    const assignment = store.deliveryAssignments.find((d) => d.tenantId === tenantId && d.id === assignmentId);
    if (!assignment) return null;

    assignment.status = status;
    const order = store.orders.find((o) => o.tenantId === tenantId && o.id === assignment.orderId);

    if (status === 'PICKED_UP') {
      assignment.pickedUpAt = new Date().toISOString();
      if (order) {
        order.status = 'OUT_FOR_DELIVERY';
        order.updatedAt = new Date().toISOString();
        emitRealtime(tenantId, 'order:updated', order);

        // Queue WhatsApp Customer Picked Up Notification
        const phoneClean = order.customerPhone.replace(/[^0-9]/g, '');
        const pickupNotif: Notification = {
          id: `notif_picked_${Date.now()}`,
          tenantId,
          orderId: order.id,
          recipientPhone: phoneClean,
          type: 'ORDER_OUT_FOR_DELIVERY',
          status: 'SENT',
          payload: {
            orderNumber: order.orderNumber,
            driverName: assignment.driverName,
            driverPhone: assignment.driverPhone,
            message: `Your order #${order.orderNumber} has been picked up by our delivery agent ${assignment.driverName || ''} and is on its way.`,
          },
          retryCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        store.notifications.push(pickupNotif);
        emitRealtime(tenantId, 'notification:created', pickupNotif);
      }
    } else if (status === 'DELIVERED') {
      assignment.deliveredAt = new Date().toISOString();
      if (order) {
        order.status = 'DELIVERED';
        order.updatedAt = new Date().toISOString();
        emitRealtime(tenantId, 'order:updated', order);
      }
    }

    emitRealtime(tenantId, 'delivery:status_changed', assignment);
    return assignment;
  },

  // NOTIFICATION OUTBOX & RETRY
  getNotifications: (tenantId: string) => {
    return store.notifications
      .filter((n) => n.tenantId === tenantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  retryNotification: (tenantId: string, notificationId: string) => {
    const notif = store.notifications.find((n) => n.tenantId === tenantId && n.id === notificationId);
    if (notif) {
      notif.retryCount += 1;
      notif.status = 'SENT';
      notif.updatedAt = new Date().toISOString();
      return notif;
    }
    return null;
  },

  // STAFF MANAGEMENT
  getStaff: (tenantId: string) => {
    return store.staff.filter((s) => s.tenantId === tenantId);
  },

  createStaff: (
    tenantId: string,
    data: { name: string; email: string; phone?: string; role: Role; customRoleId?: string }
  ) => {
    const newStaff: StaffUser = {
      id: `usr_${Date.now()}`,
      tenantId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      customRoleId: data.customRoleId,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    store.staff.push(newStaff);
    return newStaff;
  },

  toggleStaffStatus: (tenantId: string, staffId: string) => {
    const member = store.staff.find((s) => s.tenantId === tenantId && s.id === staffId);
    if (member) {
      member.isActive = !member.isActive;
      return member;
    }
    return null;
  },

  // CUSTOM ROLES
  getCustomRoles: (tenantId: string) => {
    return store.customRoles.filter((r) => r.tenantId === tenantId);
  },

  createCustomRole: (
    tenantId: string,
    data: { name: string; description?: string; permissions: string[] }
  ) => {
    const newRole: CustomRole = {
      id: `role_${Date.now()}`,
      tenantId,
      name: data.name,
      description: data.description,
      permissions: data.permissions,
      createdAt: new Date().toISOString(),
    };
    store.customRoles.push(newRole);
    return newRole;
  },

  // PRINT QUEUE & JOBS
  getPrintJobs: (tenantId: string) => {
    return store.printJobs.filter((p) => p.tenantId === tenantId);
  },

  createPrintJob: (
    tenantId: string,
    jobData: { orderId?: string; type: 'RECEIPT' | 'KOT'; format: '80MM' | '58MM'; rawContent: string }
  ) => {
    const job: PrintJob = {
      id: `print_${Date.now()}`,
      tenantId,
      orderId: jobData.orderId,
      type: jobData.type,
      format: jobData.format,
      rawContent: jobData.rawContent,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    store.printJobs.push(job);
    return job;
  },

  // DATA EXPORT (TENANT ISOLATED)
  exportTenantData: (tenantId: string, dataType: 'orders' | 'inventory' | 'products' | 'sales') => {
    if (dataType === 'orders' || dataType === 'sales') {
      return store.orders.filter((o) => o.tenantId === tenantId);
    }
    if (dataType === 'inventory') {
      return store.inventory.filter((i) => i.tenantId === tenantId);
    }
    if (dataType === 'products') {
      return store.products.filter((p) => p.tenantId === tenantId);
    }
    return [];
  },

  // Inventory
  getInventory: (tenantId: string) => store.inventory.filter((i) => i.tenantId === tenantId),
  adjustStock: (tenantId: string, inventoryItemId: string, change: number, reason: StockMovementReason, notes?: string) => {
    const item = store.inventory.find((i) => i.tenantId === tenantId && i.id === inventoryItemId);
    if (item) {
      item.currentStock = Math.max(0, item.currentStock + change);
      const movement: StockMovement = {
        id: `mov_${Date.now()}`,
        tenantId,
        inventoryItemId: item.id,
        quantityChange: change,
        balanceAfter: item.currentStock,
        reason,
        notes: notes || 'Manual adjustment',
        createdAt: new Date().toISOString(),
      };
      store.stockMovements.push(movement);
      return { item, movement };
    }
    return null;
  },
  getStockMovements: (tenantId: string, inventoryItemId?: string) => {
    return store.stockMovements
      .filter((m) => m.tenantId === tenantId && (inventoryItemId ? m.inventoryItemId === inventoryItemId : true))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Audit
  logAudit: (tenantId: string, action: string, entityType: string, entityId?: string, details?: Record<string, unknown>) => {
    const log: AuditLog = {
      id: `audit_${Date.now()}`,
      tenantId,
      action,
      entityType,
      entityId,
      details,
      createdAt: new Date().toISOString(),
    };
    store.auditLogs.push(log);
    return log;
  },
  getAuditLogs: (tenantId?: string) => {
    return store.auditLogs
      .filter((a) => (tenantId ? a.tenantId === tenantId : true))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
};

// Helper to emit real-time Socket.IO events safely
function emitRealtime(tenantId: string, event: string, payload: unknown) {
  try {
    const io = (globalThis as typeof globalThis & { io?: { to: (room: string) => { emit: (event: string, payload: unknown) => void }; emit: (event: string, payload: unknown) => void } }).io;
    if (io) {
      io.to(`tenant:${tenantId}`).emit(event, payload);
      io.emit(event, payload);
    }
  } catch {
    // Socket emit is non-blocking
  }
}
