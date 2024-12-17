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
          <AppWrapper />
        </PaperProvider>
      </QueryClientProvider>
    </Provider>
  );
}