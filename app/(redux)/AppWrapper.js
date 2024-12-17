import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { Stack } from "expo-router/stack";
import { loadUser } from "./authSlice";
import store from "./store";

function AppWrapper() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false, // Apply this globally to all screens in this Stack
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="auth/register" options={{ title: "Register" }} /> {/* Corrected route name */}
        <Stack.Screen name="auth/login" options={{ title: "Login" }} />
      </Stack>
    </Provider>
  );
}

export default AppWrapper;
