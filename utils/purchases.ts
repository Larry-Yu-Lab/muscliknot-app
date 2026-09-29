import { Platform, NativeModules, Linking } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesPackage, PACKAGE_TYPE, PurchasesOffering } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

export { RevenueCatUI, PAYWALL_RESULT };

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
    if (!isPurchasesValid) {
      console.log('[Purchases] RevenueCat native modules not available on this platform');
      return [];
    }
    if (!(await safePurchases.isConfigured())) {
      console.log('[Purchases] RevenueCat not configured yet, configuring now...');
      await configurePurchases();
    }
    const offerings = await safePurchases.getOfferings();
    console.log('[Purchases] Offerings received:', JSON.stringify(offerings));

    const anyOfferings = offerings as any;
    if (anyOfferings?.current?.availablePackages && anyOfferings.current.availablePackages.length > 0) {
      return anyOfferings.current.availablePackages;
    }

    if (anyOfferings?.all) {
      const defaultOffering = anyOfferings.all['default'] || Object.values(anyOfferings.all)[0];
      if (defaultOffering && defaultOffering.availablePackages && defaultOffering.availablePackages.length > 0) {
        return defaultOffering.availablePackages;
      }
    }

    console.log('[Purchases] No available packages in offerings');
    return [];
  } catch (error) {
    console.error('Error fetching offerings from RevenueCat:', error);
    return [];
  }
};

/**
 * Purchase a selected package.
 */
export const purchasePackage = async (rcPackage: PurchasesPackage) => {
  try {
    if (!isPurchasesValid || !(await safePurchases.isConfigured())) {
      return { success: false, customerInfo: null, error: 'RevenueCat is not configured.' };
    }
    const { customerInfo } = await safePurchases.purchasePackage(rcPackage);
    const activeEntitlements = (customerInfo as any)?.entitlements?.active || {};
    const activeSubs = (customerInfo as any)?.activeSubscriptions || [];
    const nonSubscriptionTransactions = (customerInfo as any)?.nonSubscriptionTransactions || [];
    const hasActiveLifetime = nonSubscriptionTransactions.some((t: any) => t.productIdentifier === 'lifetime');

    const hasPremium =
      Object.keys(activeEntitlements).length > 0 ||
      typeof activeEntitlements[ENTITLEMENT_ID] !== 'undefined' ||
      activeSubs.length > 0 ||
      hasActiveLifetime;

    return { success: hasPremium, customerInfo, error: null };
  } catch (error: any) {
    if (error.userCancelled) {
      return { success: false, customerInfo: null, error: 'User cancelled the purchase' };
    }
    console.warn('[Purchases] RevenueCat purchase failed:', error);
    return { success: false, customerInfo: null, error: error.message || 'Purchase failed.' };
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
    const activeEntitlements = (customerInfo as any)?.entitlements?.active || {};
    const activeSubs = (customerInfo as any)?.activeSubscriptions || [];
    const nonSubscriptionTransactions = (customerInfo as any)?.nonSubscriptionTransactions || [];
    const hasActiveLifetime = nonSubscriptionTransactions.some((t: any) => t.productIdentifier === 'lifetime');

    return (
      Object.keys(activeEntitlements).length > 0 ||
      typeof activeEntitlements[ENTITLEMENT_ID] !== 'undefined' ||
      activeSubs.length > 0 ||
      hasActiveLifetime
    );
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
      return { success: false, customerInfo: null, error: 'RevenueCat is not configured.' };
    }
    const customerInfo = await safePurchases.restorePurchases();
    const activeEntitlements = (customerInfo as any)?.entitlements?.active || {};
    const activeSubs = (customerInfo as any)?.activeSubscriptions || [];
    const nonSubscriptionTransactions = (customerInfo as any)?.nonSubscriptionTransactions || [];
    const hasActiveLifetime = nonSubscriptionTransactions.some((t: any) => t.productIdentifier === 'lifetime');

    const hasPremium =
      Object.keys(activeEntitlements).length > 0 ||
      typeof activeEntitlements[ENTITLEMENT_ID] !== 'undefined' ||
      activeSubs.length > 0 ||
      hasActiveLifetime;

    return { success: hasPremium, customerInfo, error: null };
  } catch (error: any) {
    console.warn('[Purchases] Restore failed:', error);
    return { success: false, customerInfo: null, error: error.message || 'Restore failed.' };
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

/**
 * Present the RevenueCat Paywall configured on the dashboard.
 * Shows the paywall modally.
 */
export const presentPaywall = async (options?: {
  offering?: PurchasesOffering;
  displayCloseButton?: boolean;
}): Promise<{
  success: boolean;
  result: PAYWALL_RESULT;
  error?: string;
}> => {
  try {
    if (!isPurchasesValid) {
      console.log('[Purchases] Cannot present paywall: native modules not available on this platform');
      return { success: false, result: PAYWALL_RESULT.NOT_PRESENTED, error: 'In-app purchases not available on this platform.' };
    }

    if (!(await safePurchases.isConfigured())) {
      console.log('[Purchases] RevenueCat not configured yet, initializing now...');
      await configurePurchases();
    }

    const paywallResult = await RevenueCatUI.presentPaywall({
      offering: options?.offering,
      displayCloseButton: options?.displayCloseButton ?? true,
    });

    const success =
      paywallResult === PAYWALL_RESULT.PURCHASED ||
      paywallResult === PAYWALL_RESULT.RESTORED;

    return { success, result: paywallResult };
  } catch (error: any) {
    console.warn('[Purchases] Error presenting paywall:', error);
    return {
      success: false,
      result: PAYWALL_RESULT.ERROR,
      error: error?.message || 'Failed to display paywall',
    };
  }
};

/**
 * Present the RevenueCat Paywall ONLY if the user does NOT have the required entitlement.
 */
export const presentPaywallIfNeeded = async (options?: {
  requiredEntitlementIdentifier?: string;
  offering?: PurchasesOffering;
  displayCloseButton?: boolean;
}): Promise<{
  success: boolean;
  result: PAYWALL_RESULT;
  error?: string;
}> => {
  try {
    if (!isPurchasesValid) {
      console.log('[Purchases] Cannot present paywall: native modules not available on this platform');
      return { success: false, result: PAYWALL_RESULT.NOT_PRESENTED, error: 'In-app purchases not available on this platform.' };
    }

    if (!(await safePurchases.isConfigured())) {
      console.log('[Purchases] RevenueCat not configured yet, initializing now...');
      await configurePurchases();
    }

    const entitlementId = options?.requiredEntitlementIdentifier || ENTITLEMENT_ID;
    const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: entitlementId,
      offering: options?.offering,
      displayCloseButton: options?.displayCloseButton ?? true,
    });

    const success =
      paywallResult === PAYWALL_RESULT.PURCHASED ||
      paywallResult === PAYWALL_RESULT.RESTORED;

    return { success, result: paywallResult };
  } catch (error: any) {
    console.warn('[Purchases] Error presenting paywall if needed:', error);
    return {
      success: false,
      result: PAYWALL_RESULT.ERROR,
      error: error?.message || 'Failed to display paywall',
    };
  }
};

/**
 * Present the RevenueCat Customer Center to let users manage/cancel subscriptions.
 * Falls back to native Apple subscriptions page if Customer Center is unavailable.
 */
export const presentCustomerCenter = async () => {
  try {
    if (!isPurchasesValid || !(await safePurchases.isConfigured())) {
      console.log('[Purchases] RevenueCat not configured, opening iOS subscription settings');
      Linking.openURL('https://apps.apple.com/account/subscriptions');
      return;
    }
    await RevenueCatUI.presentCustomerCenter();
  } catch (error) {
    console.warn('[Purchases] Error presenting customer center, opening iOS subscription settings:', error);
    Linking.openURL('https://apps.apple.com/account/subscriptions');
  }
};
