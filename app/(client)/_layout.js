import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native'; // Import View from react-native
import ClientHeader from '../../components/ClientHeader'; // Import ClientHeader component

export default function RootLayout() {
  return (
    <>
      <ClientHeader title="MedPlus" /> {/* Use ClientHeader component */}
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
          headerShown: false, // Ensure no header is shown for all screens
          tabBarLabelStyle: { fontSize: 12 }, 
          tabBarStyle: {
            backgroundColor: '#a3de83', // Custom background color for tab bar
            borderTopColor: 'transparent',
            height: 60,
          },
        })}
      >
        <Tabs.Screen name="index" options={{ tabBarLabel: 'Home', headerShown: false }} />
        <Tabs.Screen name="appointment" options={{ tabBarLabel: 'Appointments', headerShown: false }} />
        <Tabs.Screen name="health" options={{ tabBarLabel: 'Health', headerShown: false }} />
        <Tabs.Screen name="settings" options={{ tabBarLabel: 'Settings', headerShown: false }} />
      </Tabs>
    </>
  );
}