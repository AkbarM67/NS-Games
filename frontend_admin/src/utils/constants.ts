export const API_BASE_URL = 'http://localhost/NS-topupgames/ns-topup/public';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ANNOUNCEMENTS: '/announcements',
  USERS: '/users',
  TRANSACTIONS: '/transactions',
  PRODUCTS: '/products'
} as const;

export const ANNOUNCEMENT_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success'
} as const;