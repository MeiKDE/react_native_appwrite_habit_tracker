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
  User, 
  Mail, 
  Lock 
} from 'lucide-react-native';
import { initializeAppwriteClient, signUpWithEmailPassword, signInWithOAuth, OAUTH_PROVIDERS, getAppwriteOAuthUrl, client } from '../appwrite';
import * as AuthSession from 'expo-auth-session';
import { Account } from 'appwrite';
import * as WebBrowser from 'expo-web-browser';

// Ensure Appwrite client is initialized (ideally only once in your app entry point)
initializeAppwriteClient();

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUpWithEmailPassword(email, password, fullName);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Sign Up Failed', result.error || 'Unable to sign up.');
      }
    } catch (err: any) {
      Alert.alert('Sign Up Error', err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (platform: string) => {
    if (platform === 'Google') {
      setIsLoading(true);
      try {
        // 1. Get the redirect URI for your app
        let redirectUri = AuthSession.makeRedirectUri();
        // 2. Get the OAuth URL from Appwrite
        const authUrl = getAppwriteOAuthUrl(OAUTH_PROVIDERS.google, redirectUri) || '';
        // 3. Open the OAuth URL in a browser and wait for the redirect
        const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
        // 4. Parse the result for userId and secret
        if (result.type === 'success' && result.url) {
          const url = new URL(result.url);
          const secret = url.searchParams.get('secret');
          const userId = url.searchParams.get('userId');
          if (secret && userId) {
            // 5. Create a session with Appwrite
            const accountInstance = new Account(client);
            await accountInstance.createSession(userId, secret);
            // 6. Navigate to your app's main screen
            router.replace('/(tabs)');
          } else {
            Alert.alert('Google Sign Up Failed', 'Missing secret or userId in redirect.');
          }
        } else {
          Alert.alert('Google Sign Up Failed', 'OAuth flow was cancelled or failed.');
        }
      } catch (err: any) {
        Alert.alert('Google Sign Up Error', err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Social Sign Up', `${platform} sign up would be implemented here`);
    }
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
              Create Account
            </Text>
          </View>

          {/* Form Container */}
          <View className="px-5">
            <View className="bg-white rounded-3xl p-8 shadow-2xl mb-5">
              <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
                Welcome!
              </Text>
              <Text className="text-base text-gray-500 text-center mb-8">
                Create your account to get started
              </Text>

              {/* Social Sign Up Buttons */}
              <View className="mb-6">
                <TouchableOpacity
                  className="bg-gray-100 rounded-2xl py-4 items-center mb-3"
                  onPress={() => handleSocialSignUp('Google')}
                  activeOpacity={0.8}
                >
                  <Text className="text-base font-semibold text-gray-900">
                    Continue with Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-gray-100 rounded-2xl py-4 items-center mb-3"
                  onPress={() => handleSocialSignUp('Apple')}
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
                  Full Name
                </Text>
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-1">
                  <User size={20} color="#8E8E93" className="mr-3" />
                  <TextInput
                    className="flex-1 text-base text-gray-900 py-4"
                    placeholder="Enter your full name"
                    placeholderTextColor="#8E8E93"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

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
                    placeholder="Create password"
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

              <View className="mb-5">
                <Text className="text-base font-semibold text-gray-900 mb-2">
                  Confirm Password
                </Text>
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-1">
                  <Lock size={20} color="#8E8E93" className="mr-3" />
                  <TextInput
                    className="flex-1 text-base text-gray-900 py-4"
                    placeholder="Confirm password"
                    placeholderTextColor="#8E8E93"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-1"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#8E8E93" />
                    ) : (
                      <Eye size={20} color="#8E8E93" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                className={`rounded-2xl mt-2 mb-6 shadow-lg ${isLoading ? 'opacity-60' : ''}`}
                onPress={handleSignUp}
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
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Terms and Privacy */}
              <Text className="text-sm text-gray-500 text-center leading-5 mb-6">
                By signing up, you agree to our{' '}
                <Text className="text-blue-600 font-medium">Terms of Service</Text> and{' '}
                <Text className="text-blue-600 font-medium">Privacy Policy</Text>
              </Text>

              {/* Sign In Link */}
              <TouchableOpacity
                className="items-center"
                onPress={() => router.push('/sign-in')}
                activeOpacity={0.7}
              >
                <Text className="text-base text-gray-500">
                  Already have an account?{' '}
                  <Text className="text-blue-600 font-medium">Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}