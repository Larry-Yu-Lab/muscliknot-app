import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesPackage } from 'react-native-purchases';

const API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY || '',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || '',
}) || '';

export const ENTITLEMENT_ID = 'MuscliKnot Pro';

/**
 * Configure the RevenueCat SDK with the active user ID.
 */
export const configurePurchases = async (userId?: string) => {
  if (!API_KEY) {
    console.warn('RevenueCat API key is not set. Please define EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY in your .env file.');
    return;
  }

  // Set logging in development
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  try {
    if (userId) {
      // Log in with the Supabase User ID so subscription is linked to the user account
      await Purchases.configure({ apiKey: API_KEY, appUserID: userId });
      console.log(`RevenueCat initialized for user: ${userId}`);
    } else {
      // Configure anonymously first (before sign in / during onboarding)
      await Purchases.configure({ apiKey: API_KEY });
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
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
      return offerings.current.availablePackages;
    }
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
    const { customerInfo } = await Purchases.purchasePackage(rcPackage);
    const hasPremium = typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
    return { success: hasPremium, customerInfo, error: null };
  } catch (error: any) {
    if (error.userCancelled) {
      return { success: false, customerInfo: null, error: 'User cancelled the purchase' };
    }
    console.error('Error purchasing package:', error);
    return { success: false, customerInfo: null, error: error.message || 'An error occurred during purchase' };
  }
};

/**
 * Direct check of the active user's premium entitlement.
 */
export const checkPremiumStatus = async (): Promise<boolean> => {
  try {
    if (!(await Purchases.isConfigured())) {
      return false;
    }
    const customerInfo = await Purchases.getCustomerInfo();
    return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};

/**
 * Handle user logout.
 */
export const logoutPurchases = async () => {
  try {
    if (await Purchases.isConfigured()) {
      await Purchases.logOut();
      console.log('Logged out of RevenueCat');
    }
  } catch (error) {
    console.error('Error logging out of RevenueCat:', error);
  }
};
