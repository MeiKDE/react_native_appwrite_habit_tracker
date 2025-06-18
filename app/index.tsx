import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import "./global.css";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Defer navigation to ensure the root layout is fully mounted
    const timeoutId = setTimeout(() => {
      // Simulate checking if user is first time or returning user
      // In a real app, you'd check AsyncStorage or user preferences
      const isFirstTime = true; // This would be dynamic

      if (isFirstTime) {
        router.replace('/onboarding');
      } else {
        router.replace('/sign-in');
      }
    }, 0);

    // Cleanup function to clear timeout if component unmounts
    return () => clearTimeout(timeoutId);
  }, []);

  return <View className="flex-1 bg-blue-500" />;
}

