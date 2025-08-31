import { setSetting } from '../services/database';

/**
 * Force re-seeding of period data with actual historical data
 */
export const forceReseedPeriodData = async () => {
  try {
    // Reset the seeded flag so the app will re-seed with new data
    await setSetting('data_seeded', 'false');
    console.log('Data seeding flag reset - app will re-seed on next restart');
    return true;
  } catch (error) {
    console.error('Error resetting data seeding flag:', error);
    return false;
  }
};