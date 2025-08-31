import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SlapCounterScreen from './src/screens/SlapCounterScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import HealthScreen from './src/screens/HealthScreen';
import DiaryScreen from './src/screens/DiaryScreen';
import PoemsScreen from './src/screens/PoemsScreen';
import GalleryScreen from './src/screens/GalleryScreen';

// Services
import { initializeDatabase } from './src/services/database';
import { seedInitialData } from './src/services/dataSeeder';

// Theme
import { theme } from './src/styles/theme';

const Tab = createBottomTabNavigator();

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts (skip for now to avoid errors)
        // await Font.loadAsync({
        //   'Inter_400Regular': require('./assets/fonts/Inter-Regular.ttf'),
        //   'Inter_500Medium': require('./assets/fonts/Inter-Medium.ttf'),
        //   'Inter_600SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
        //   'Inter_700Bold': require('./assets/fonts/Inter-Bold.ttf'),
        // });

        // Initialize database
        await initializeDatabase();
        
        // Seed initial data
        await seedInitialData();
        
        // Artificial delay for splash screen (optional)
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer onReady={onLayoutRootView}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'heart' : 'heart-outline';
                break;
              case 'Counter':
                iconName = focused ? 'hand-left' : 'hand-left-outline';
                break;
              case 'Alerts':
                iconName = focused ? 'notifications' : 'notifications-outline';
                break;
              case 'Health':
                iconName = focused ? 'fitness' : 'fitness-outline';
                break;
              case 'Diary':
                iconName = focused ? 'book' : 'book-outline';
                break;
              case 'Poems':
                iconName = focused ? 'library' : 'library-outline';
                break;
              case 'Gallery':
                iconName = focused ? 'images' : 'images-outline';
                break;
              default:
                iconName = 'heart-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.primary,
            borderTopWidth: 1,
            paddingTop: 8,
            paddingBottom: 8,
            height: 70,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: theme.fonts.medium,
            marginTop: 4,
          },
          headerStyle: {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.primary,
            borderBottomWidth: 1,
          },
          headerTitleStyle: {
            fontFamily: theme.fonts.elegant,
            fontSize: theme.fontSizes.xl,
            color: theme.colors.text,
          },
          headerTintColor: theme.colors.primary,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Bubu 💕' }}
        />
        <Tab.Screen 
          name="Counter" 
          component={SlapCounterScreen}
          options={{ title: 'Slaps' }}
        />
        <Tab.Screen 
          name="Alerts" 
          component={AlertsScreen}
          options={{ title: 'Alerts' }}
        />
        <Tab.Screen 
          name="Health" 
          component={HealthScreen}
          options={{ title: 'Health' }}
        />
        <Tab.Screen 
          name="Diary" 
          component={DiaryScreen}
          options={{ title: 'His Diary' }}
        />
        <Tab.Screen 
          name="Poems" 
          component={PoemsScreen}
          options={{ title: 'Poems' }}
        />
        <Tab.Screen 
          name="Gallery" 
          component={GalleryScreen}
          options={{ title: 'Photos' }}
        />
      </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}