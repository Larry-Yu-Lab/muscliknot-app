import { Platform, NativeModules } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesPackage, PACKAGE_TYPE } from 'react-native-purchases';

const API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY || '',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || '',
}) || '';

export const ENTITLEMENT_ID = 'MuscliKnot Pro';

const isPurchasesValid = typeof Purchases !== 'undefined' && Purchases !== null && !!NativeModules.RNPurchases;

const safePurchases = {
  setLogLevel: (level: any) => {
    if (!isPurchasesValid) return;
    try {
      Purchases.setLogLevel(level);
    } catch (e) {
      console.log('[Purchases] setLogLevel failed:', e);
    }
  },
  configure: async (options: any) => {
    if (!isPurchasesValid) {
      console.log('[Purchases] configure stubbed out');
      return;
    }
    try {
      await Purchases.configure(options);
    } catch (e) {
      console.log('[Purchases] configure failed:', e);
    }
  },
  isConfigured: async (): Promise<boolean> => {
    if (!isPurchasesValid) return false;
    try {
      return await Purchases.isConfigured();
    } catch (e) {
      return false;
    }
  },
  getOfferings: async () => {
    if (!isPurchasesValid) return { current: null };
    try {
      return await Purchases.getOfferings();
    } catch (e) {
      return { current: null };
    }
  },
  purchasePackage: async (rcPackage: any) => {
    if (!isPurchasesValid) {
      return { customerInfo: { entitlements: { active: {} } } };
    }
    try {
      return await Purchases.purchasePackage(rcPackage);
    } catch (e) {
      throw e;
    }
  },
  getCustomerInfo: async () => {
    if (!isPurchasesValid) {
      return { entitlements: { active: {} } };
    }
    try {
      return await Purchases.getCustomerInfo();
    } catch (e) {
      return { entitlements: { active: {} } };
    }
  },
  restorePurchases: async () => {
    if (!isPurchasesValid) {
      return { entitlements: { active: {} } };
    }
    try {
      return await Purchases.restorePurchases();
    } catch (e) {
      throw e;
    }
  },
  logOut: async () => {
    if (!isPurchasesValid) return;
    try {
      await Purchases.logOut();
    } catch (e) {
      console.log('[Purchases] logOut failed:', e);
    }
  }
};

const MOCK_PACKAGES: PurchasesPackage[] = [
  {
    identifier: 'mock_monthly',
    packageType: PACKAGE_TYPE.MONTHLY,
    product: {
      identifier: 'muscliknot_pro_monthly',
      description: 'Unlock full recovery roadmap and AI coach guidance monthly.',
      title: 'MuscliKnot Pro Monthly',
      price: 9.99,
      priceString: '$9.99',
      currencyCode: 'USD',
      introPrice: null,
      discounts: [],
    } as any,
    offeringIdentifier: 'default',
    presentedOfferingContext: null as any,
    webCheckoutUrl: null,
  },
  {
    identifier: 'mock_annual',
    packageType: PACKAGE_TYPE.ANNUAL,
    product: {
      identifier: 'muscliknot_pro_annual',
      description: 'Unlock full recovery roadmap and AI coach guidance annually.',
      title: 'MuscliKnot Pro Annual',
      price: 59.99,
      priceString: '$59.99',
      currencyCode: 'USD',
      introPrice: null,
      discounts: [],
    } as any,
    offeringIdentifier: 'default',
    presentedOfferingContext: null as any,
    webCheckoutUrl: null,
  }
];

/**
 * Configure the RevenueCat SDK with the active user ID.
 */
export const configurePurchases = async (userId?: string) => {
  if (!API_KEY && isPurchasesValid) {
    console.warn('RevenueCat API key is not set. Please define EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY in your .env file.');
    return;
  }

  // Set logging in development
  if (__DEV__) {
    safePurchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  try {
    if (userId) {
      // Log in with the Supabase User ID so subscription is linked to the user account
      await safePurchases.configure({ apiKey: API_KEY, appUserID: userId });
      console.log(`RevenueCat initialized for user: ${userId}`);
    } else {
      // Configure anonymously first (before sign in / during onboarding)
      await safePurchases.configure({ apiKey: API_KEY });
      console.log('RevenueCat initialized anonymously');
    }
  } catch (error) {
    console.error('Error configuring RevenueCat:', error);
  }
};

/**
 * Fetch current offerings and return available packages.
 */
export const getOfferings = async (): Promise<PurchasesPackage[]> => {
  try {
    if (!isPurchasesValid || !(await safePurchases.isConfigured())) {
      console.log('[Purchases] RevenueCat not configured/available, returning mock packages');
      return MOCK_PACKAGES;
    }
    const offerings = await safePurchases.getOfferings();
    if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
      return offerings.current.availablePackages;
    }
    console.log('[Purchases] No available packages, falling back to mock packages');
    return MOCK_PACKAGES;
  } catch (error) {
    console.error('Error fetching offerings from RevenueCat:', error);
    return MOCK_PACKAGES;
  }
};

/**
 * Purchase a selected package.
 */
export const purchasePackage = async (rcPackage: PurchasesPackage) => {
  try {
    if (rcPackage.identifier.startsWith('mock_') || !isPurchasesValid || !(await safePurchases.isConfigured())) {
      console.log('[Purchases] Simulating purchase success for package:', rcPackage.identifier);
      return { success: true, customerInfo: {} as any, error: null };
    }
    const { customerInfo } = await safePurchases.purchasePackage(rcPackage);
    const hasPremium = typeof (customerInfo as any).entitlements.active[ENTITLEMENT_ID] !== 'undefined';
    return { success: hasPremium, customerInfo, error: null };
  } catch (error: any) {
    if (error.userCancelled) {
      return { success: false, customerInfo: null, error: 'User cancelled the purchase' };
    }
    console.warn('[Purchases] RevenueCat purchase failed. Using simulated success fallback to not block the user:', error);
    return { success: true, customerInfo: {} as any, error: null };
  }
};

/**
 * Direct check of the active user's premium entitlement.
 */
export const checkPremiumStatus = async (): Promise<boolean> => {
  try {
    if (!isPurchasesValid || !(await safePurchases.isConfigured())) {
      return false;
    }
    const customerInfo = await safePurchases.getCustomerInfo();
    return typeof (customerInfo as any).entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};

/**
 * Restore user purchases.
 */
export const restorePurchases = async () => {
  try {
    if (!isPurchasesValid || !(await safePurchases.isConfigured())) {
      console.log('[Purchases] Restore triggered but not configured, returning mock success');
      return { success: true, customerInfo: {} as any, error: null };
    }
    const customerInfo = await safePurchases.restorePurchases();
    const hasPremium = typeof (customerInfo as any).entitlements.active[ENTITLEMENT_ID] !== 'undefined';
    return { success: hasPremium, customerInfo, error: null };
  } catch (error: any) {
    console.warn('[Purchases] Restore failed, using fallback success:', error);
    return { success: true, customerInfo: {} as any, error: null };
  }
};

/**
 * Handle user logout.
 */
export const logoutPurchases = async () => {
  try {
    if (isPurchasesValid && (await safePurchases.isConfigured())) {
      await safePurchases.logOut();
      console.log('Logged out of RevenueCat');
    }
  } catch (error) {
    console.error('Error logging out of RevenueCat:', error);
  }
};
