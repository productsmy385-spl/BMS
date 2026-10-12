import { Role } from '@/types';

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  role: Role;
  tenantId?: string;
  isSuperAdmin: boolean;
}

// Development Sessions for Fast Role & Persona Switching
export const MOCK_USERS: Record<string, AuthSession> = {
  superAdmin: {
    userId: 'usr_super',
    name: 'FlowDineOS Super Admin',
    email: 'admin@flowdine.os',
    role: 'SUPER_ADMIN',
    isSuperAdmin: true,
  },
  sweetDelightsOwner: {
    userId: 'usr_sd_owner',
    name: 'Sunita Sharma (Owner & Admin)',
    email: 'owner@sweetdelights.com',
    role: 'BAKERY_ADMIN',
    tenantId: 'tenant_sweet_delights',
    isSuperAdmin: false,
  },
  sweetDelightsCashier: {
    userId: 'usr_sd_pos',
    name: 'Rahul Varma (Cashier)',
    email: 'pos@sweetdelights.com',
    role: 'POS_STAFF',
    tenantId: 'tenant_sweet_delights',
    isSuperAdmin: false,
  },
  sweetDelightsChef: {
    userId: 'usr_sd_chef',
    name: 'Chef Anand (Head Baker)',
    email: 'chef@sweetdelights.com',
    role: 'KITCHEN_STAFF',
    tenantId: 'tenant_sweet_delights',
    isSuperAdmin: false,
  },
  sweetDelightsDriver: {
    userId: 'usr_sd_driver',
    name: 'Suresh Kumar (Delivery Agent)',
    email: 'driver@sweetdelights.com',
    role: 'DELIVERY_STAFF',
    tenantId: 'tenant_sweet_delights',
    isSuperAdmin: false,
  },
  crumbCrustOwner: {
    userId: 'usr_cc_owner',
    name: 'Jean-Luc (Patisserie Owner)',
    email: 'owner@crumbcrust.com',
    role: 'BAKERY_ADMIN',
    tenantId: 'tenant_crumb_crust',
    isSuperAdmin: false,
  },
  crumbCrustDriver: {
    userId: 'usr_cc_driver',
    name: 'David Raj (Delivery Agent)',
    email: 'driver@crumbcrust.com',
    role: 'DELIVERY_STAFF',
    tenantId: 'tenant_crumb_crust',
    isSuperAdmin: false,
  },
};

// Granular Role-Based Permission Matrix
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: [
    'platform.manage',
    'dashboard.view',
    'menu.view',
    'menu.manage',
    'orders.view',
    'orders.create',
    'orders.update',
    'kitchen.view',
    'kitchen.update',
    'delivery.view',
    'delivery.assign',
    'delivery.update_status',
    'staff.view',
    'staff.manage',
    'roles.view',
    'roles.manage',
    'website.view',
    'website.manage',
    'brandkit.manage',
    'inventory.view',
    'inventory.manage',
    'reports.view',
    'data.export',
    'data.import',
    'payments.view',
    'payments.manage',
    'settings.manage',
    'audit.view',
  ],
  BAKERY_ADMIN: [
    'dashboard.view',
    'menu.view',
    'menu.manage',
    'orders.view',
    'orders.create',
    'orders.update',
    'kitchen.view',
    'kitchen.update',
    'delivery.view',
    'delivery.assign',
    'delivery.update_status',
    'staff.view',
    'staff.manage',
    'roles.view',
    'roles.manage',
    'website.view',
    'website.manage',
    'brandkit.manage',
    'inventory.view',
    'inventory.manage',
    'reports.view',
    'data.export',
    'data.import',
    'payments.view',
    'payments.manage',
    'settings.manage',
    'audit.view',
  ],
  ORDER_MANAGER: [
    'dashboard.view',
    'menu.view',
    'menu.manage',
    'orders.view',
    'orders.create',
    'orders.update',
    'kitchen.view',
    'kitchen.update',
    'delivery.view',
    'delivery.assign',
    'delivery.update_status',
    'inventory.view',
    'inventory.manage',
    'reports.view',
    'data.export',
    'payments.view',
    'payments.manage',
  ],
  POS_STAFF: [
    'orders.view',
    'orders.create',
    'menu.view',
    'payments.view',
    'payments.manage',
  ],
  KITCHEN_STAFF: [
    'kitchen.view',
    'kitchen.update',
    'orders.view',
    'menu.view',
  ],
  DELIVERY_STAFF: [
    'delivery.view',
    'delivery.update_status',
  ],
};

export function hasPermission(
  userRole: Role,
  requiredRole: 'SUPER_ADMIN' | 'BAKERY_ADMIN' | 'POS_STAFF' | 'KITCHEN_STAFF' | 'DELIVERY_STAFF' | 'PUBLIC'
): boolean {
  if (requiredRole === 'PUBLIC') return true;
  if (userRole === 'SUPER_ADMIN') return true;
  if (requiredRole === 'BAKERY_ADMIN') return userRole === 'BAKERY_ADMIN';
  if (requiredRole === 'POS_STAFF') return userRole === 'BAKERY_ADMIN' || userRole === 'ORDER_MANAGER' || userRole === 'POS_STAFF';
  if (requiredRole === 'KITCHEN_STAFF') return userRole === 'BAKERY_ADMIN' || userRole === 'ORDER_MANAGER' || userRole === 'KITCHEN_STAFF';
  if (requiredRole === 'DELIVERY_STAFF') return userRole === 'BAKERY_ADMIN' || userRole === 'ORDER_MANAGER' || userRole === 'DELIVERY_STAFF';
  return false;
}

export function hasModulePermission(userRole: Role, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
}

// Route Gateways
export function canAccessTenantAdmin(role: Role): boolean {
  return role === 'SUPER_ADMIN' || role === 'BAKERY_ADMIN' || role === 'ORDER_MANAGER';
}

export function canAccessKitchen(role: Role): boolean {
  return role === 'SUPER_ADMIN' || role === 'BAKERY_ADMIN' || role === 'ORDER_MANAGER' || role === 'KITCHEN_STAFF';
}

export function canAccessDelivery(role: Role): boolean {
  return role === 'SUPER_ADMIN' || role === 'BAKERY_ADMIN' || role === 'ORDER_MANAGER' || role === 'DELIVERY_STAFF';
}
