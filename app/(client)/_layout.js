import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native'; // Import View from react-native

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'index':
              iconName = 'home';
              break;
            case 'appointment':
              iconName = 'event';
              break;
            case 'health':
              iconName = 'health-and-safety';
              break;
            case 'settings':
              iconName = 'settings';
              break;
            default:
              return null;
          }

          return (
            <View>
              <MaterialIcons name={iconName} size={size} color={color} />
            </View>
          );
        },
        headerShown: false, // Hide the header
        tabBarLabelStyle: { fontSize: 12 }, // Style for tab labels
        tabBarStyle: {
          backgroundColor: '#a3de83', // Custom background color for tab bar
          borderTopColor: 'transparent',
          height: 60,
        },
      })}
    >
      <Tabs.Screen name="index" options={{ tabBarLabel: 'Home' }} />
      <Tabs.Screen name="appointment" options={{ tabBarLabel: 'Appointments' }} />
      <Tabs.Screen name="health" options={{ tabBarLabel: 'Health' }} />
      <Tabs.Screen name="settings" options={{ tabBarLabel: 'Settings' }} />
    </Tabs>
  );
}