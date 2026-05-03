/**
 * Apple HealthKit Integration
 *
 * Uses react-native-health to sync MuscliKnot sessions as workouts
 * and read step count data from Apple Health.
 *
 * Gracefully no-ops when:
 * - Not running on iOS
 * - The native module is not available (e.g., running in Expo Go)
 * - The user has not granted permissions
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ─────────────────────────────────────────────────────────────────

export type HealthKitWorkoutType = 'mindfulness' | 'functionalStrengthTraining' | 'yoga' | 'flexibility';

// ─── Activity Type Mapping ─────────────────────────────────────────────────

const ACTIVITY_TO_WORKOUT_TYPE: Record<string, HealthKitWorkoutType> = {
    relief: 'flexibility',
    warmup: 'flexibility',
    yoga: 'yoga',
    strength: 'functionalStrengthTraining',
    posture: 'flexibility',
};

// ─── AsyncStorage key for the user preference toggle ───────────────────────

const HK_ENABLED_KEY = '@muscliknot_healthkit_enabled';

// ─── Safe dynamic import of react-native-health ───────────────────────────

let AppleHealthKit: any = null;
let HealthKitPermissions: any = null;

try {
    if (Platform.OS === 'ios') {
        // Dynamic require so the app doesn't crash in Expo Go or Android
        const RNHealth = require('react-native-health');
        AppleHealthKit = RNHealth.default || RNHealth;
        HealthKitPermissions = {
            permissions: {
                read: [
                    RNHealth.HealthKitPermissions?.Steps ?? 'Steps',
                    RNHealth.HealthKitPermissions?.Workout ?? 'Workout',
                    RNHealth.HealthKitPermissions?.ActiveEnergyBurned ?? 'ActiveEnergyBurned',
                ],
                write: [
                    RNHealth.HealthKitPermissions?.Workout ?? 'Workout',
                    RNHealth.HealthKitPermissions?.ActiveEnergyBurned ?? 'ActiveEnergyBurned',
                ],
            },
        };
    }
} catch (e) {
    // react-native-health is not available (e.g., running in Expo Go)
    console.log('[HealthKit] Native module not available — running in stub mode');
    AppleHealthKit = null;
}

// ─── Core API ──────────────────────────────────────────────────────────────

/**
 * Returns true if the native HealthKit module is loaded and we're on iOS.
 */
export function isHealthKitAvailable(): boolean {
    return Platform.OS === 'ios' && AppleHealthKit !== null;
}

/**
 * Reads the persisted user preference for HealthKit integration.
 */
export async function isHealthKitEnabled(): Promise<boolean> {
    try {
        const val = await AsyncStorage.getItem(HK_ENABLED_KEY);
        return val === 'true';
    } catch {
        return false;
    }
}

/**
 * Persists the user's HealthKit toggle preference.
 */
export async function setHealthKitEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(HK_ENABLED_KEY, enabled ? 'true' : 'false');
}

/**
 * Initializes HealthKit and requests permissions.
 * Returns true if permissions were granted, false otherwise.
 */
export async function requestHealthKitPermission(): Promise<boolean> {
    if (!isHealthKitAvailable()) {
        console.log('[HealthKit] Not available — permission request skipped');
        return false;
    }

    return new Promise((resolve) => {
        AppleHealthKit.initHealthKit(HealthKitPermissions, (err: any) => {
            if (err) {
                console.error('[HealthKit] Permission denied or error:', err);
                resolve(false);
            } else {
                console.log('[HealthKit] Permissions granted');
                resolve(true);
            }
        });
    });
}

/**
 * Syncs a completed session to Apple Health as a workout sample.
 *
 * @param durationMinutes - Duration of the session in minutes
 * @param activityType - The MuscliKnot activity type (relief, warmup, yoga, etc.)
 * @param muscleGroup - Target muscle group for metadata
 * @returns true if sync succeeded, false otherwise
 */
export async function syncSessionToHealthKit(
    durationMinutes: number,
    activityType: string,
    muscleGroup: string
): Promise<boolean> {
    // Check user preference first
    const enabled = await isHealthKitEnabled();
    if (!enabled) {
        console.log('[HealthKit] Sync skipped — user has not enabled HealthKit');
        return false;
    }

    if (!isHealthKitAvailable()) {
        console.log('[HealthKit] Not available — sync skipped');
        return false;
    }

    const workoutType = ACTIVITY_TO_WORKOUT_TYPE[activityType] || 'flexibility';
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - durationMinutes * 60 * 1000);

    // Rough calorie estimate: ~3 kcal/min for stretching/yoga, ~5 for strength
    const calPerMin = activityType === 'strength' ? 5 : 3;
    const totalEnergy = durationMinutes * calPerMin;

    return new Promise((resolve) => {
        const options = {
            type: workoutType,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            energyBurned: totalEnergy,
            energyBurnedUnit: 'calorie',
            metadata: {
                HKMetadataKeyGroupFitnesss: muscleGroup,
                source: 'MuscliKnot',
            },
        };

        AppleHealthKit.saveWorkout(options, (err: any, result: any) => {
            if (err) {
                console.error('[HealthKit] Failed to save workout:', err);
                resolve(false);
            } else {
                console.log(`[HealthKit] Saved ${durationMinutes}min ${workoutType} for ${muscleGroup}`);
                resolve(true);
            }
        });
    });
}

/**
 * Reads today's step count from HealthKit.
 * Returns 0 if unavailable or not enabled.
 */
export async function getHealthKitSteps(): Promise<number> {
    const enabled = await isHealthKitEnabled();
    if (!enabled || !isHealthKitAvailable()) return 0;

    return new Promise((resolve) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const options = {
            date: today.toISOString(),
            includeManuallyAdded: true,
        };

        AppleHealthKit.getStepCount(options, (err: any, results: any) => {
            if (err) {
                console.error('[HealthKit] Failed to read steps:', err);
                resolve(0);
            } else {
                resolve(results?.value ?? 0);
            }
        });
    });
}

/**
 * Returns a summary string describing the sync result.
 */
export function getHealthKitSyncMessage(activityType: string): string {
    const workoutType = ACTIVITY_TO_WORKOUT_TYPE[activityType] || 'flexibility';
    return `Saved as ${workoutType.replace(/([A-Z])/g, ' $1').trim()} to Apple Health`;
}
