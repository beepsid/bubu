# Bubu - Relation Android App

A private, offline-first React Native app built for relations.

## 🎁 **What This App Does**

A beautiful, romantic Android app with 6 special features:

- 👋 **Slap Counter** - Fun counter with secret admin controls & Google Sheets sync
- 🔔 **Smart Alerts** - Personalized reminders for health, medication, and daily activities
- 💪 **Health Tracker** - Wellness tracking for water, sleep, exercise, mood, and more
- 📖 **His Diary** - Read-only diary entries from you to her
- 🎭 **Poems** - Collection of poems written by you
- 📸 **Photo Gallery** - Private photo collection with favorites

## 🎁 Features

### 👋 **Slap Counter**

- Fun, affectionate counter with heart animations
- Hidden admin button (5 taps on heart) for him to increment
- Online sync with Google Sheets API
- Offline-first with automatic sync when online

### 🔔 **Smart Alerts**

- Personalized reminders for medications, water intake, exercise, sleep, and meals
- Toggle alerts on/off without deleting them
- Color-coded categories with beautiful icons
- Custom alert messages and timing

### 💪 **Health Tracker**

- Track daily wellness metrics: water, sleep, exercise, mood, weight, temperature
- Visual dashboard with today's summary statistics
- Historical data with trends and patterns
- Easy numeric and text input for quick logging

### 📖 **His Diary (Read-Only)**

- Diary entries written by him
- Beautiful typography and elegant design
- Read-only for her - she can only view, not edit
- Preloaded with sample love messages

### 🎭 **Poems Collection**

- Categorized poems written from the heart
- Elegant script typography for feel
- Read-only poetry collection
- Categories: Beauty, Daily Life, etc

### 📸 **Photo Gallery**

- Masonry-style photo grid
- Zoomable full-screen image viewer
- Favorites system with heart icons
- Bundled images (no internet required)

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI: `npm install -g @expo/cli`
- Android Studio (for Android development)
- Physical Android device or emulator

### Installation

1. **Clone and Install**

   ```bash
   cd bubu-app
   npm install
   ```

2. **Add Fonts** (Optional but recommended)

   - Download fonts from Google Fonts (see `assets/fonts/README.md`)
   - Place font files in `assets/fonts/` directory

3. **Add Images**

   - Replace placeholder images in `assets/images/`
   - Update image paths in `GalleryScreen.js`
   - Create custom app icon and splash screen

4. **Configure Google Sheets** (For slap counter sync)

   - Create a Google Sheet with slap counter data
   - Get Google Sheets API key
   - Update `src/services/googleSheets.js` with your credentials

5. **Customize Content**
   - Edit diary entries in `src/services/dataSeeder.js`
   - Add your own poems and messages
   - Personalize the messages throughout the app

### Running the App

```bash
# Start development server
npm start

# Run on Android
npm run android

# Build for production
expo build:android
```

## 🎨 Customization

### Theme Colors

Edit `src/styles/theme.js` to customize the color palette:

```javascript
colors: {
  primary: '#FFB6C1',     // Light pink
  secondary: '#E6E6FA',   // Lavender
  accent: '#FFC0CB',      // Pink
  // ... customize as needed
}
```

### Content

- **Diary Entries**: Edit `sampleDiaryEntries` in `src/services/dataSeeder.js`
- **Poems**: Edit `samplePoems` in `src/services/dataSeeder.js`
- **Gallery**: Replace images in `assets/images/gallery/`
- **Messages**: Update messages throughout the screens

### App Identity

- **App Name**: Change in `app.json`
- **Package Name**: Update `android.package` in `app.json`
- **Icons**: Replace `assets/icon.png` and `assets/splash.png`

## 🔒 Privacy & Personal Content

**Your personal content is protected!** This repository only contains the app code. All personal content is automatically excluded from Git:

- 📖 **Diary entries** (`content/diary/*.txt`) - Your personal diary entries stay private
- 🎭 **Poems** (`content/poems/*.txt`) - Personal poems remain on your device only
- 📸 **Photos** - Any personal photos you add are excluded
- 💪 **Health data** - All health tracking information stays local
- 🔔 **Alert settings** - Your personal reminders remain private

See `PRIVACY.md` for complete details on what's private vs. what's shared.

## 🔐 Secret Features (For Him)

### Hidden Slap Counter Increment

- Tap the heart icon 5 times quickly on the Slap Counter screen
- Secret admin dialog will appear
- Only you know this sequence!

### Data Management

- All diary entries and poems are preloaded during app installation
- Use the database functions to add more content programmatically
- Data can be managed through the calendar interface

## 📱 Google Sheets Integration

### Setup Instructions

1. Create a new Google Sheet
2. Set up the sheet structure:
   ```
   A1: "Slap Count"    B1: "Last Updated"
   A2: "0"             B2: "2024-01-01T00:00:00Z"
   ```
3. Get the Sheet ID from the URL
4. Create a Google Cloud Project and enable Sheets API
5. Generate an API key
6. Update `src/services/googleSheets.js`:
   ```javascript
   const GOOGLE_SHEETS_CONFIG = {
     SHEET_ID: "your-sheet-id-here",
     API_KEY: "your-api-key-here",
     RANGE: "Sheet1!A1:B2",
   };
   ```

### Offline Behavior

- App works completely offline
- Slap counter increments are stored locally
- Syncs with Google Sheets when internet is available
- Uses the higher count if there's a discrepancy

## 🏗️ Project Structure

```
bubu-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Main app screens
│   ├── services/           # Database, storage, API services
│   ├── styles/             # Theme and styling
│   └── utils/              # Helper functions
├── assets/
│   ├── fonts/              # Custom fonts
│   ├── images/             # Gallery images and icons
│   └── ...
├── App.js                  # Main app entry point
├── app.json               # Expo configuration
└── package.json           # Dependencies
```

## Special Touches

- **Heart Animations**: Floating hearts on slap counter increment
- **Soft Color Palette**: Pastel pinks, lavenders, and creams
- **Elegant Typography**: Mix of serif, sans-serif, and script fonts
- **Personal Messages**: Quotes and messages throughout
- **Gentle Haptics**: Subtle vibrations for interactions
- **Smooth Transitions**: Elegant animations between screens

## 🎯 Building for Production

### Android APK

```bash
# Build APK
expo build:android

# Or use EAS Build (recommended)
npm install -g @expo/eas-cli
eas build --platform android
```

### Signing and Distribution

- Generate Android signing keys
- Configure app signing in `app.json`
- Build signed APK for distribution
- Install directly on her phone (sideload)

## 🐛 Troubleshooting

### Common Issues

- **Fonts not loading**: Check font files are in `assets/fonts/`
- **Images not showing**: Verify image paths and file formats
- **Google Sheets sync failing**: Check API key and sheet permissions
- **App crashes**: Check console logs and ensure all dependencies are installed

### Development Tips

- Use `expo start --clear` to clear cache
- Test on physical device for best performance
- Use `expo doctor` to check for common issues

##  Final Notes

The offline-first approach ensures your private moments stay private, while the Google Sheets integration adds a fun, connected element to the slap counter.

Remember to:

- Personalize all the content with your own messages
- Add your actual photos to the gallery
- Test thoroughly before gifting
- Keep the secret admin features to yourself!

---

_Built with React Native, Expo
