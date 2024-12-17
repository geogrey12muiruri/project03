import { Stack } from "expo-router";
import queryClient from "./(services)/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import store from "./(redux)/store";
import { Provider } from "react-redux";
import AppWrapper from "./(redux)/AppWrapper";
import { PaperProvider } from 'react-native-paper'; // Import PaperProvider

export default function RootLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <Stack
            screenOptions={{
              headerShown: false, // Apply this globally to all screens in this Stack
            }}
          >
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen name="auth/registar" options={{ title: "Register" }} /> {/* Corrected route name */}
            <Stack.Screen name="auth/login" options={{ title: "Login" }} />
          </Stack>
        </PaperProvider>
      </QueryClientProvider>
    </Provider>
  );
}