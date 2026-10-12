export type Role =
  | 'SUPER_ADMIN'
  | 'BAKERY_ADMIN'
  | 'POS_STAFF'
  | 'KITCHEN_STAFF'
  | 'ORDER_MANAGER'
  | 'DELIVERY_STAFF';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BakeryProfile {
  id: string;
  tenantId: string;
  tagline?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  gstNumber?: string | null;
  fssaiNumber?: string | null;
  currency: string;
  timezone: string;
  openingTime?: string | null;
  closingTime?: string | null;
  allowPickup: boolean;
  allowDelivery: boolean;
  logoUrl?: string | null;
}

export interface WebsiteSettings {
  id: string;
  tenantId: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  headerBackgroundColor: string;
  navBackgroundColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  headingColor: string;
  bodyTextColor: string;
  entireTextColor?: string | null;
  linkColor: string;
  fontFamily: string;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImageUrl?: string | null;
  aboutText?: string | null;
  announcementBar?: string | null;
}

export interface ProductCategory {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  priceDelta: number;
  sku?: string | null;
  isDefault: boolean;
}

export interface ProductCustomization {
  id: string;
  productId: string;
  groupName: string;
  optionName: string;
  additionalPrice: number;
}

export interface Product {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  basePrice: number;
  taxRate: number;
  isVeg: boolean;
  isCustomCake: boolean;
  trackInventory: boolean;
  isInStock: boolean;
  preparationTimeMinutes: number;
  imagekitUrl?: string | null;
  variants?: ProductVariant[];
  customizations?: ProductCustomization[];
}

export type OrderSource = 'POS' | 'PUBLIC_WEBSITE' | 'WHATSAPP';

export type OrderStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type DeliveryType = 'PICKUP' | 'DELIVERY';

export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'STORE_CREDIT';

export type PaymentStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'PARTIALLY_PAID'
  | 'FAILED'
  | 'REFUNDED';

export interface CustomCakeSpec {
  flavour?: string;
  sponge?: string;
  cream?: string;
  shape?: string;
  tiers?: number;
  messageOnCake?: string;
  referencePhotoUrl?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string | null;
  variantId?: string | null;
  itemName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  specialInstructions?: string | null;
  customization?: CustomCakeSpec | null;
}

export interface Payment {
  id: string;
  tenantId: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionReference?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  tenantId: string;
  orderNumber: number;
  source: OrderSource;
  status: OrderStatus;
  deliveryType: DeliveryType;
  scheduledFor?: string | null;
  customerName: string;
  customerPhone: string;
  customerAddress?: string | null;
  subtotalAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  specialNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payments: Payment[];
}

export type KOTStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';

export interface KOTTicketItem {
  id: string;
  ticketId: string;
  itemName: string;
  quantity: number;
  specialInstructions?: string | null;
}

export interface KOTTicket {
  id: string;
  tenantId: string;
  orderId: string;
  ticketNumber: number;
  status: KOTStatus;
  isCustomCake: boolean;
  announcedCount: number;
  lastAnnouncedAt?: string | null;
  createdAt: string;
  items: KOTTicketItem[];
  customerName?: string;
  orderNumber?: number;
}

export interface InventoryItem {
  id: string;
  tenantId: string;
  productId?: string | null;
  name: string;
  sku: string;
  currentStock: number;
  unit: string;
  lowStockThreshold: number;
}

export type StockMovementReason =
  | 'ORDER_SALE'
  | 'MANUAL_CORRECTION'
  | 'PURCHASE_RESTOCK'
  | 'EXPIRED'
  | 'SPOILED'
  | 'RETURN';

export interface StockMovement {
  id: string;
  tenantId: string;
  inventoryItemId: string;
  quantityChange: number;
  balanceAfter: number;
  reason: StockMovementReason;
  notes?: string | null;
  createdAt: string;
}

export type DeliveryStatus =
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'DELIVERY_FAILED';

export interface DeliveryAssignment {
  id: string;
  tenantId: string;
  orderId: string;
  assignedDriverId?: string | null;
  driverName?: string | null;
  driverPhone?: string | null;
  status: DeliveryStatus;
  assignedAt: string;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  deliveryNotes?: string | null;
  order?: Order;
}

export type NotificationType =
  | 'ORDER_CONFIRMATION'
  | 'ORDER_READY'
  | 'ORDER_OUT_FOR_DELIVERY'
  | 'MENU_INQUIRY_RESPONSE';

export type NotificationStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';

export interface Notification {
  id: string;
  tenantId: string;
  orderId?: string | null;
  recipientPhone: string;
  type: NotificationType;
  status: NotificationStatus;
  payload?: Record<string, unknown> | null;
  retryCount: number;
  errorLog?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StaffUser {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  customRoleId?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CustomRole {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
  permissions: string[];
  createdAt: string;
}

export interface IntegrationConfig {
  id: string;
  tenantId: string;
  interaktApiKey?: string | null;
  interaktTemplateNamespace?: string | null;
  imagekitPublicKey?: string | null;
  imagekitPrivateKey?: string | null;
  imagekitUrlEndpoint?: string | null;
  escPosPrinterIp?: string | null;
  escPosPrinterWidth: number;
}

export interface PrintJob {
  id: string;
  tenantId: string;
  orderId?: string | null;
  type: 'RECEIPT' | 'KOT';
  format: '80MM' | '58MM';
  rawContent: string;
  status: 'PENDING' | 'PRINTED' | 'FAILED';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  tenantId?: string | null;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
  createdAt: string;
}
