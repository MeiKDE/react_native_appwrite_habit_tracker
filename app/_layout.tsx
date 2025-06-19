import { Stack } from "expo-router";
import { View } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { initializeAppwriteClient } from '../appwrite';

// Initialize Appwrite client at app startup
initializeAppwriteClient();

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <AuthProvider>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="sign-up" />
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="reset-password" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
        {/* <StatusBar style="auto" /> */}
      </AuthProvider>
    </>
  );
}