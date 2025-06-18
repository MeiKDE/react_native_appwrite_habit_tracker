import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock 
} from 'lucide-react-native';
import { initializeAppwriteClient, signInWithEmailPassword } from '../appwrite';

// Ensure Appwrite client is initialized (ideally only once in your app entry point)
initializeAppwriteClient();

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signInWithEmailPassword(email, password);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Sign In Failed', result.error || 'Unable to sign in.');
      }
    } catch (err: any) {
      Alert.alert('Sign In Error', err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = (platform: string) => {
    Alert.alert('Social Sign In', `${platform} sign in would be implemented here`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#5856D6' }}>
      <LinearGradient
        colors={['#007AFF', '#5856D6']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center px-5 pt-5 pb-8">
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white/20 justify-center items-center"
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <Text className="flex-1 text-xl font-semibold text-white text-center mr-10">
              Sign In
            </Text>
          </View>

          {/* Form Container */}
          <View className="px-5" style={{ flex: 1 }}>
            <View className="bg-white rounded-3xl p-8 shadow-2xl mb-5">
              <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
                Welcome Back!
              </Text>
              <Text className="text-base text-gray-500 text-center mb-8">
                Sign in to your account to continue
              </Text>

              {/* Social Sign In Buttons */}
              <View className="mb-6">
                <TouchableOpacity
                  className="bg-gray-100 rounded-2xl py-4 items-center mb-3"
                  onPress={() => handleSocialSignIn('Google')}
                  activeOpacity={0.8}
                >
                  <Text className="text-base font-semibold text-gray-900">
                    Continue with Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-gray-100 rounded-2xl py-4 items-center mb-3"
                  onPress={() => handleSocialSignIn('Apple')}
                  activeOpacity={0.8}
                >
                  <Text className="text-base font-semibold text-gray-900">
                    Continue with Apple
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="text-gray-500 text-sm font-medium px-4">OR</Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {/* Input Fields */}
              <View className="mb-5">
                <Text className="text-base font-semibold text-gray-900 mb-2">
                  Email Address
                </Text>
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-1">
                  <Mail size={20} color="#8E8E93" className="mr-3" />
                  <TextInput
                    className="flex-1 text-base text-gray-900 py-4"
                    placeholder="Enter your email"
                    placeholderTextColor="#8E8E93"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View className="mb-5">
                <Text className="text-base font-semibold text-gray-900 mb-2">
                  Password
                </Text>
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-1">
                  <Lock size={20} color="#8E8E93" className="mr-3" />
                  <TextInput
                    className="flex-1 text-base text-gray-900 py-4"
                    placeholder="Enter your password"
                    placeholderTextColor="#8E8E93"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="p-1"
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#8E8E93" />
                    ) : (
                      <Eye size={20} color="#8E8E93" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity
                className="self-end mb-6"
                onPress={() => router.push('/forgot-password')}
                activeOpacity={0.7}
              >
                <Text className="text-sm text-blue-600 font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity
                className={`rounded-2xl mb-6 shadow-lg ${isLoading ? 'opacity-60' : ''}`}
                onPress={handleSignIn}
                disabled={isLoading}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#007AFF', '#5856D6']}
                  style={{
                    paddingVertical: 20,
                    borderRadius: 16,
                    alignItems: 'center'
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text className="text-white text-lg font-semibold">
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <TouchableOpacity
                className="items-center"
                onPress={() => router.push('/sign-up')}
                activeOpacity={0.7}
              >
                <Text className="text-base text-gray-500">
                  Don't have an account?{' '}
                  <Text className="text-blue-600 font-medium">Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}