import { Stack } from "expo-router";
import React from "react";


export default function CustomerLayout() {
  return (
    <>
      
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
