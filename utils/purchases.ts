import { Platform, NativeModules, Linking, Alert } from 'react-native';
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
    const allPurchased = (customerInfo as any)?.allPurchasedProductIdentifiers || [];
    const nonSubscriptionTransactions = (customerInfo as any)?.nonSubscriptionTransactions || [];
    const hasActiveLifetime = nonSubscriptionTransactions.some((t: any) => t.productIdentifier === 'lifetime');

    const hasPremium =
      Object.keys(activeEntitlements).length > 0 ||
      typeof activeEntitlements[ENTITLEMENT_ID] !== 'undefined' ||
      activeSubs.length > 0 ||
      allPurchased.length > 0 ||
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
    const allPurchased = (customerInfo as any)?.allPurchasedProductIdentifiers || [];
    const nonSubscriptionTransactions = (customerInfo as any)?.nonSubscriptionTransactions || [];
    const hasActiveLifetime = nonSubscriptionTransactions.some((t: any) => t.productIdentifier === 'lifetime');

    return (
      Object.keys(activeEntitlements).length > 0 ||
      typeof activeEntitlements[ENTITLEMENT_ID] !== 'undefined' ||
      activeSubs.length > 0 ||
      allPurchased.length > 0 ||
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
    const allPurchased = (customerInfo as any)?.allPurchasedProductIdentifiers || [];
    const nonSubscriptionTransactions = (customerInfo as any)?.nonSubscriptionTransactions || [];
    const hasActiveLifetime = nonSubscriptionTransactions.some((t: any) => t.productIdentifier === 'lifetime');

    const hasPremium =
      Object.keys(activeEntitlements).length > 0 ||
      typeof activeEntitlements[ENTITLEMENT_ID] !== 'undefined' ||
      activeSubs.length > 0 ||
      allPurchased.length > 0 ||
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
    if (!isPurchasesValid || !API_KEY || API_KEY.trim().length === 0) {
      console.log('[Purchases] Cannot present paywall: API key or native modules not available');
      return { success: false, result: PAYWALL_RESULT.NOT_PRESENTED, error: 'In-app purchases not configured.' };
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

/**
 * Triggers the paywall or upgrade flow for blocked features.
 * 1. First attempts to present RevenueCat Paywall UI (`presentPaywall()`).
 * 2. If paywall UI is presented and user purchases or restores, updates user state via `updateUser({ isPremium: true })` and returns { success: true }.
 * 3. If paywall UI is NOT presented (e.g. RevenueCat native UI missing on platform, paywall not configured on RC dashboard, or simulator without native template),
 *    falls back to fetching offerings and calling `purchasePackage()`.
 * 4. In `__DEV__` mode, if offerings are empty, presents a fallback alert allowing simulated upgrade so testing/upgrading works 100% of the time.
 */
export const triggerPaywallOrUpgrade = async (
  updateUser?: (data: { isPremium: boolean }) => Promise<void> | void
): Promise<{ success: boolean; error?: string }> => {
  try {
    const hasValidKey = !!API_KEY && API_KEY.trim().length > 0;

    // 1. Try to fetch offerings first to see if RevenueCat is live with products
    let packages: PurchasesPackage[] = [];
    if (hasValidKey) {
      try {
        packages = await getOfferings();
      } catch (e) {
        console.log('[Purchases] Could not fetch offerings:', e);
      }
    }

    // 2. If API Key is configured AND offerings exist, try native RevenueCat UI paywall
    if (hasValidKey && packages.length > 0) {
      try {
        const paywallRes = await presentPaywall();
        if (paywallRes.success) {
          if (updateUser) {
            await updateUser({ isPremium: true });
          }
          return { success: true };
        }

        if (paywallRes.result === PAYWALL_RESULT.CANCELLED) {
          return { success: false, error: 'User cancelled' };
        }
      } catch (paywallErr) {
        console.warn('[Purchases] Native paywall failed or unconfigured, falling back to direct purchase:', paywallErr);
      }
    }

    // 3. Fallback: Direct package purchase if Paywall UI is unconfigured in RevenueCat Dashboard
    if (packages.length > 0) {
      const selectedPackage = packages.find(pkg => pkg.packageType === 'ANNUAL') || packages.find(pkg => pkg.packageType === 'MONTHLY') || packages[0];
      const purchaseRes = await purchasePackage(selectedPackage);
      if (purchaseRes.success) {
        if (updateUser) {
          await updateUser({ isPremium: true });
        }
        Alert.alert(
          'Success',
          'Congratulations! Your Premium Access has been unlocked.',
          [{ text: 'OK' }]
        );
        return { success: true };
      } else if (purchaseRes.error && purchaseRes.error !== 'User cancelled the purchase') {
        Alert.alert('Purchase Note', purchaseRes.error);
        return { success: false, error: purchaseRes.error };
      }
      return { success: false, error: purchaseRes.error || 'Purchase not completed' };
    }

    // 4. Fallback for __DEV__ / simulator / unconfigured environment
    if (__DEV__) {
      return new Promise((resolve) => {
        Alert.alert(
          'StoreKit / Paywall Simulation',
          'RevenueCat paywall or offerings are not active in this test environment.\n\nWould you like to simulate unlocking Premium Access for testing?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => resolve({ success: false, error: 'Cancelled' })
            },
            {
              text: 'Simulate Upgrade',
              onPress: async () => {
                if (updateUser) {
                  await updateUser({ isPremium: true });
                }
                Alert.alert('Success', 'Simulated purchase successful! Premium Access is active.');
                resolve({ success: true });
              }
            }
          ]
        );
      });
    }

    Alert.alert(
      'Subscription Service',
      'In-app subscriptions are currently being updated. Please try again shortly or contact support.'
    );
    return {
      success: false,
      error: 'No active subscription options found.'
    };
  } catch (err: any) {
    console.error('Error in triggerPaywallOrUpgrade:', err);
    Alert.alert('Error', 'An unexpected error occurred while processing upgrade.');
    return { success: false, error: err?.message || 'Failed to open paywall' };
  }
};

