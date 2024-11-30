import { Stack } from "expo-router";
import React from "react";
import Header from "../../components/header";

export default function CustomerLayout() {
  return (
    <>
      <Header />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="relative-grave/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="cart"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}
