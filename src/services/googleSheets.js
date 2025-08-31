import axios from 'axios';
import { getSlapCount, setSlapCount, getLastSyncTime, setLastSyncTime } from './storage';

// Google Sheets configuration
const GOOGLE_SHEETS_CONFIG = {
  // Replace with your Google Sheets API details
  SHEET_ID: 'YOUR_GOOGLE_SHEET_ID',
  API_KEY: 'YOUR_GOOGLE_API_KEY',
  RANGE: 'Sheet1!A1:B2', // Adjust range as needed
};

// Google Sheets API URL
const getSheetUrl = () => {
  return `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGE}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
};

const updateSheetUrl = () => {
  return `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGE}?valueInputOption=RAW&key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
};

// Sync slap count to Google Sheets
export const syncSlapCountToSheet = async (count) => {
  try {
    const timestamp = new Date().toISOString();
    const data = {
      values: [
        ['Slap Count', 'Last Updated'],
        [count.toString(), timestamp]
      ]
    };

    const response = await axios.put(updateSheetUrl(), data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      await setLastSyncTime(timestamp);
      console.log('Slap count synced to Google Sheets:', count);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error syncing to Google Sheets:', error);
    return false;
  }
};

// Get slap count from Google Sheets
export const getSlapCountFromSheet = async () => {
  try {
    const response = await axios.get(getSheetUrl());
    
    if (response.status === 200 && response.data.values) {
      const values = response.data.values;
      if (values.length > 1 && values[1][0]) {
        const count = parseInt(values[1][0], 10);
        return isNaN(count) ? 0 : count;
      }
    }
    return 0;
  } catch (error) {
    console.error('Error getting slap count from Google Sheets:', error);
    return null;
  }
};

// Sync slap count (bidirectional)
export const syncSlapCount = async () => {
  try {
    const localCount = await getSlapCount();
    const remoteCount = await getSlapCountFromSheet();
    
    if (remoteCount === null) {
      // Can't connect to sheets, use local count
      return localCount;
    }
    
    // Use the higher count (in case of offline increments)
    const finalCount = Math.max(localCount, remoteCount);
    
    // Update both local and remote if needed
    if (finalCount !== localCount) {
      await setSlapCount(finalCount);
    }
    
    if (finalCount !== remoteCount) {
      await syncSlapCountToSheet(finalCount);
    }
    
    return finalCount;
  } catch (error) {
    console.error('Error syncing slap count:', error);
    // Return local count as fallback
    return await getSlapCount();
  }
};

// Increment slap count and sync
export const incrementAndSyncSlapCount = async () => {
  try {
    // Get current local count
    const currentCount = await getSlapCount();
    const newCount = currentCount + 1;
    
    // Update local storage immediately
    await setSlapCount(newCount);
    
    // Try to sync to Google Sheets (don't wait for it)
    syncSlapCountToSheet(newCount).catch(error => {
      console.log('Background sync failed, will retry later:', error);
    });
    
    return newCount;
  } catch (error) {
    console.error('Error incrementing slap count:', error);
    return await getSlapCount();
  }
};

// Check if we can connect to Google Sheets
export const testGoogleSheetsConnection = async () => {
  try {
    const response = await axios.get(getSheetUrl());
    return response.status === 200;
  } catch (error) {
    console.error('Google Sheets connection test failed:', error);
    return false;
  }
};

// Setup instructions for Google Sheets
export const getSetupInstructions = () => {
  return `
To set up Google Sheets sync for the slap counter:

1. Create a new Google Sheet
2. In cell A1, put "Slap Count"
3. In cell B1, put "Last Updated"
4. In cell A2, put "0" (initial count)
5. In cell B2, put current date/time

6. Get the Sheet ID from the URL:
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit

7. Enable Google Sheets API in Google Cloud Console
8. Create an API key with Sheets API access
9. Make the sheet publicly readable or share with service account

10. Update GOOGLE_SHEETS_CONFIG in googleSheets.js:
    - SHEET_ID: Your sheet ID
    - API_KEY: Your API key
    - RANGE: Adjust if needed (default: Sheet1!A1:B2)

The app will work offline and sync when online!
  `;
};