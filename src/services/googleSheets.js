import axios from "axios";
import Constants from "expo-constants";

// Google Sheets configuration - using environment variables for security
const GOOGLE_SHEETS_CONFIG = {
  SHEET_ID:
    Constants.expoConfig?.extra?.googleSheetId ||
    process.env.EXPO_PUBLIC_GOOGLE_SHEET_ID ||
    "",
  API_KEY:
    Constants.expoConfig?.extra?.googleApiKey ||
    process.env.EXPO_PUBLIC_GOOGLE_API_KEY ||
    "",
  RANGE: "Sheet1!A1:B2",
};

// Check if Google Sheets is configured
const isConfigured = () => {
  const configured =
    GOOGLE_SHEETS_CONFIG.SHEET_ID &&
    GOOGLE_SHEETS_CONFIG.API_KEY &&
    GOOGLE_SHEETS_CONFIG.SHEET_ID !== "YOUR_SHEET_ID_HERE" &&
    GOOGLE_SHEETS_CONFIG.API_KEY !== "YOUR_API_KEY_HERE" &&
    !GOOGLE_SHEETS_CONFIG.API_KEY.includes("PLACEHOLDER") &&
    GOOGLE_SHEETS_CONFIG.API_KEY.length > 20;

  return configured;
};

// Google Sheets API URL
const getSheetUrl = () => {
  return `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGE}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
};

const updateSheetUrl = () => {
  return `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGE}?valueInputOption=RAW&key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
};

// Update slap count in Google Sheets
export const updateSlapCountInSheet = async (count) => {
  if (!isConfigured()) {
    return false;
  }

  try {
    const timestamp = new Date().toISOString();
    const data = {
      values: [
        ["Slap Count", "Last Updated"],
        [count.toString(), timestamp],
      ],
    };

    const response = await axios.put(updateSheetUrl(), data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating Google Sheets:", error);
    return false;
  }
};

// Get slap count from Google Sheets
export const getSlapCountFromSheet = async () => {
  if (!isConfigured()) {
    return 0;
  }

  try {
    const url = getSheetUrl();
    const response = await axios.get(url);

    if (response.status === 200 && response.data && response.data.values) {
      const values = response.data.values;

      if (values.length > 1 && values[1] && values[1][0]) {
        const rawValue = values[1][0];
        const count = parseInt(rawValue, 10);
        return isNaN(count) ? 0 : count;
      }
    }

    return 0;
  } catch (error) {
    console.error("❌ Error getting slap count from Google Sheets:");
    console.error("Error message:", error.message);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    return 0;
  }
};

// Get current slap count
export const getSlapCount = async () => {
  return await getSlapCountFromSheet();
};

// Increment slap count
export const incrementSlapCount = async () => {
  try {
    // Get current count from Google Sheets
    const currentCount = await getSlapCountFromSheet();
    const newCount = currentCount + 1;

    // Update Google Sheets with new count
    await updateSlapCountInSheet(newCount);

    return newCount;
  } catch (error) {
    console.error("Error incrementing slap count:", error);
    throw error;
  }
};

// Check if we can connect to Google Sheets
export const testGoogleSheetsConnection = async () => {
  if (!isConfigured()) {
    return false;
  }

  try {
    const url = getSheetUrl();
    const response = await axios.get(url);
    return response.status === 200;
  } catch (error) {
    console.error("Google Sheets connection test failed:");
    console.error("Error message:", error.message);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);

    if (error.response?.status === 403) {
      console.error(
        "❌ 403 Forbidden - Check API key permissions and sheet sharing settings"
      );
    } else if (error.response?.status === 404) {
      console.error("❌ 404 Not Found - Check sheet ID and sheet name");
    }

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

10. Update your .env file:
    EXPO_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id_here
    EXPO_PUBLIC_GOOGLE_API_KEY=your_api_key_here

The app will work offline and sync when online!
  `;
};
