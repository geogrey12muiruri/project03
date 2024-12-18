import { Stack } from "expo-router";
import queryClient from "./(services)/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import store from "./(redux)/store";
import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./(redux)/authSlice";
import { PaperProvider } from 'react-native-paper'; // Import PaperProvider

function RootLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <Stack
          screenOptions={{
            headerShown: false, 
          }}
        >
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="auth/registar" options={{ title: "Register" }} />
          <Stack.Screen name="auth/login" options={{ title: "Login" }} />
        </Stack>
      </PaperProvider>
    </QueryClientProvider>
  );
}

// Wrap the RootLayout component with the Provider from react-redux
function App() {
  return (
    <Provider store={store}>
      <RootLayout />
    </Provider>
  );
}

export default App;