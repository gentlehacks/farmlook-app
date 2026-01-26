import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { StatusBar, Text, View } from "react-native";
import "./global.css";

SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const [isOffline, setIsOffline] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    const prepare = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await SplashScreen.hideAsync();
    };

    prepare();

    return () => unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Status Bar */}
      <StatusBar
        barStyle="dark-content" // or "light-content"
        backgroundColor="#4CAF50" // Your FarmLook green
        translucent={false}
      />
      {/* OFFLINE BANNER */}
      {isOffline && (
        <View className="w-full bg-red-500 py-2 items-center">
          <Text className="text-white text-sm font-medium">
            You are offline. Some features may not work.
          </Text>
        </View>
      )}

      {/* NAVIGATION */}
      <Stack screenOptions={{
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <Ionicons
              name="arrow-back"
              size={24}
              onPress={() => router.back()}
            />
          ) : null,
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/select" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/camera" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/result" options={{ title: "Analysis" }} />
        <Stack.Screen name="(tabs)/savedReports" options={{
          title: "Saved Analysis",

        }} />
        <Stack.Screen name="(tabs)/saved/[id]" options={{
          title: "Analysis Report",

        }} />
        <Stack.Screen name="(tabs)/settings" options={{ title: "Settings" }} />
        <Stack.Screen name="(tabs)/about" options={{ title: "About" }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
