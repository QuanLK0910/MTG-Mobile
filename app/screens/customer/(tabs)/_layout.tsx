import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import Header from "../../../components/header";
export default function TabsLayout() {
  return (
    <>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#4a148c',
          tabBarInactiveTintColor: '#666666',
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: '#E0E0E0',
            backgroundColor: '#ffffff'
          }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Trang chủ',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="notification/index"
          options={{
            title: 'Thông báo',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="notifications" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="findgrave/index"
          options={{
            title: 'Tìm mộ',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="service/index"
          options={{
            title: 'Dịch vụ',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account/index"
          options={{
            title: 'Tài khoản',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
