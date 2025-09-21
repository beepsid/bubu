# Bubu 💕 - Romantic Companion App

## 📱 Project Overview

**Bubu** is a beautiful, romantic React Native mobile application designed as a personal companion app for couples. Built with Expo SDK 54, it features a warm, loving interface with multiple interactive features designed to strengthen relationships and provide daily support.

## 🏗️ Architecture

### Technology Stack
- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation v6 (Bottom Tabs)
- **Database**: SQLite with Expo SQLite
- **Animations**: Lottie React Native
- **Notifications**: Expo Notifications
- **External APIs**: Google Sheets API for data synchronization
- **State Management**: React Hooks & Context
- **Styling**: Custom theme system with romantic color palette

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── DrinkingAnimation.js      # Water reminder animations
│   ├── ModernAlertModal.js       # Alert creation modal
│   ├── NotificationCurtain.js    # Cross-app notifications
│   ├── NotificationWrapper.js    # Notification system wrapper
│   ├── QuickTestAlert.js         # Development testing component
│   └── WaterReminderScreen.js    # Water reminder interface
├── screens/             # Main app screens
│   ├── AlertsScreen.js           # Smart alerts management
│   ├── DiaryScreen.js            # Personal diary
│   ├── GalleryScreen.js          # Photo gallery
│   ├── HomeScreen.js             # Main dashboard
│   ├── PoemsScreen.js            # Poetry collection
│   └── SlapCounterScreen.js      # Interactive counter with Google Sheets sync
├── services/            # Business logic and external integrations
│   ├── alertsService.js          # Alert scheduling and management
│   ├── contentLoader.js          # Content loading utilities
│   ├── database.js               # SQLite database operations
│   ├── dataSeeder.js             # Initial data population
│   ├── developmentNotificationService.js  # Dev environment notifications
│   ├── googleSheets.js           # Google Sheets API integration
│   ├── notificationManager.js    # Notification orchestration
│   └── sdk54NotificationService.js       # Production notifications
├── styles/              # Theming and styling
│   ├── common.js                 # Common style utilities
│   └── theme.js                  # App theme configuration
└── utils/               # Helper utilities
    ├── dataManager.js            # Data management utilities
    └── navigationDetection.js    # Navigation type detection
```

## 🎯 Core Features

### 1. **Smart Alerts System** 🔔
- **Modern UI**: Beautiful alert creation modal with date/time pickers
- **Cross-app Notifications**: Notifications appear over any app when phone is in use
- **Background Notifications**: System-level notifications when app is closed
- **Dual Environment Support**: 
  - Development service for Expo Go testing
  - Production service for standalone apps
- **Custom Scheduling**: Daily, weekly, or custom repeat patterns
- **Alert Types**: Water reminders, medication, exercise, custom messages

### 2. **Interactive Slap Counter** ⭐
- **Real-time Google Sheets Sync**: Counter updates sync to Google Sheets in real-time
- **Offline Support**: Works offline, syncs when connection restored
- **Beautiful Animations**: Smooth counter animations with haptic feedback
- **Clean UI**: Removed secret tap functionality for better user experience

### 3. **Water Reminder System** 💧
- **Animated Reminders**: Cute cat animations for water drinking reminders
- **Customizable Timing**: Set personalized reminder intervals
- **Progress Tracking**: Visual progress indicators
- **Celebration Animations**: Reward animations for completing goals

### 4. **Personal Diary** 📝
- **Private Journaling**: Secure local storage for personal thoughts
- **Rich Text Support**: Formatted text entries with timestamps
- **Search Functionality**: Find entries by date or content
- **Backup Options**: Export capabilities for data safety

### 5. **Poetry Collection** 📜
- **Curated Content**: Beautiful poetry collection
- **Romantic Themes**: Love-focused content selection
- **Reading Experience**: Optimized typography for comfortable reading
- **Favorites System**: Save and organize favorite poems

### 6. **Photo Gallery** 📸
- **Memory Storage**: Secure photo storage and organization
- **Slideshow Mode**: Beautiful photo viewing experience
- **Favorites System**: Mark and organize special photos
- **Sharing Options**: Easy sharing capabilities

## 🔧 Technical Implementation

### Database Schema
- **SQLite Database**: Local data storage with structured tables
- **Data Seeding**: Automatic initial data population
- **Migration Support**: Database version management
- **Backup/Restore**: Data export and import capabilities

### Notification System
- **Dual Architecture**: 
  - `developmentNotificationService.js` for Expo Go
  - `sdk54NotificationService.js` for production builds
- **Cross-app Curtain**: Custom overlay system for in-app notifications
- **Background Processing**: Handles notifications when app is closed
- **Permission Management**: Automatic notification permission requests

### Google Sheets Integration
- **Real-time Sync**: Bidirectional data synchronization
- **Error Handling**: Robust error handling with retry logic
- **Offline Queue**: Queues updates when offline, syncs when online
- **Security**: API keys managed through environment variables

### Theme System
- **Romantic Color Palette**: Warm pinks, soft gradients, loving tones
- **Consistent Typography**: Custom font system with multiple weights
- **Responsive Design**: Adapts to different screen sizes
- **Dark Mode Ready**: Infrastructure for future dark mode support

## 🔐 Security & Privacy

### Environment Variables
```bash
# Required environment variables in .env
EXPO_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id_here
EXPO_PUBLIC_GOOGLE_API_KEY=your_api_key_here
```

### Data Protection
- **Local Storage**: Sensitive data stored locally on device
- **API Key Security**: All API keys managed through environment variables
- **No Hardcoded Secrets**: All sensitive data externalized
- **Gitignore Protection**: Comprehensive gitignore for sensitive files

### Privacy Features
- **Offline First**: Core functionality works without internet
- **Local Database**: Personal data stays on device
- **Optional Sync**: Google Sheets sync is optional feature
- **No Analytics**: No user tracking or analytics collection

## 🚀 Development Setup

### Prerequisites
- Node.js 18+
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation
```bash
# Clone repository
git clone [repository-url]
cd bubu

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Google Sheets credentials

# Start development server
npm start
```

### Google Sheets Setup
1. Create a Google Sheet for counter data
2. Get the Sheet ID from the URL
3. Create Google Cloud Project
4. Enable Google Sheets API
5. Generate API key
6. Update .env file with credentials
7. Make sheet publicly readable or share with service account

## 📱 Platform Support

### Current Support
- **Android**: Full support with SDK 54
- **iOS**: Full support with SDK 54
- **Development**: Expo Go for rapid development

### Navigation Compatibility
- **Gesture Navigation**: Optimized for modern Android gesture navigation
- **Button Navigation**: Compatible with traditional 3-button navigation
- **Auto-detection**: Automatically detects navigation type and adjusts UI

## 🎨 Design Philosophy

### User Experience
- **Romantic Theme**: Warm, loving, and intimate design language
- **Intuitive Navigation**: Clear, simple navigation patterns
- **Delightful Interactions**: Smooth animations and haptic feedback
- **Accessibility**: Designed with accessibility best practices

### Visual Design
- **Color Palette**: Soft pinks, warm gradients, romantic tones
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Generous whitespace for comfortable viewing
- **Animations**: Subtle, meaningful animations that enhance experience

## 🔄 Recent Updates & Cleanup

### Code Cleanup (Latest)
- ✅ Removed duplicate `bubu/` project directory
- ✅ Removed unused `www/` web version
- ✅ Deleted test utilities (`testNotifications.js`, `resetData.js`)
- ✅ Removed unused `storage.js` service
- ✅ Updated `.gitignore` for better security
- ✅ Removed hardcoded API keys from `app.json`
- ✅ Cleaned up hardcoded credentials in source files

### Security Improvements
- ✅ All API keys moved to environment variables
- ✅ Enhanced `.gitignore` to protect sensitive data
- ✅ Removed IDE-specific files from repository
- ✅ Added comprehensive file exclusion patterns

### Performance Optimizations
- ✅ Removed unnecessary dependencies
- ✅ Cleaned up unused code and files
- ✅ Optimized bundle size by removing duplicate projects
- ✅ Streamlined service architecture

## 📋 Future Roadmap

### Planned Features
- **Cloud Backup**: Optional cloud backup for diary entries
- **Themes**: Multiple theme options beyond romantic
- **Widget Support**: Home screen widgets for quick access
- **Voice Notes**: Audio diary entries
- **Reminder Categories**: More sophisticated alert categorization

### Technical Improvements
- **Performance**: Further optimization for older devices
- **Offline Sync**: Enhanced offline capabilities
- **Push Notifications**: Server-side push notification support
- **Analytics**: Optional, privacy-focused usage analytics

## 🤝 Contributing

### Development Guidelines
- Follow React Native best practices
- Maintain romantic theme consistency
- Write comprehensive tests for new features
- Update documentation for any changes
- Respect privacy-first approach

### Code Style
- Use ESLint configuration
- Follow component naming conventions
- Maintain consistent file structure
- Comment complex logic thoroughly

## 📄 License

This project is a personal romantic application. Please respect the intimate nature of the content and use responsibly.

---

**Made with 💕 for someone special**

*Last updated: December 2024*