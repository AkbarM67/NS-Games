export const config = {
  api: {
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com/ns-topup/public'
      : 'http://localhost/NS-topupgames/ns-topup/public',
    timeout: 10000,
  },
  app: {
    name: 'NS Games Admin',
    version: '1.0.0',
    description: 'Game & Pulsa',
  },
  features: {
    realTimeUpdates: true,
    notifications: true,
    darkMode: false,
  }
} as const;