import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Send, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendResetLink = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
    }, 1500);
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    handleSendResetLink();
  };

  if (emailSent) {
    return (
      <SafeAreaView className="flex-1">
        <LinearGradient
          colors={['#007AFF', '#5856D6']}
          className="flex-1"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="flex-row items-center px-5 pt-5 pb-8">
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white/20 justify-center items-center"
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <Text className="flex-1 text-xl font-semibold text-white text-center mr-10">
              Reset Password
            </Text>
          </View>

          <View className="flex-1 px-5 justify-center">
            <View className="bg-white rounded-3xl p-8 shadow-2xl">
              <View className="items-center mb-6">
                <CheckCircle size={80} color="#34C759" />
              </View>
              
              <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
                Check Your Email
              </Text>
              <Text className="text-base text-gray-500 text-center mb-2">
                We've sent password reset instructions to
              </Text>
              <Text className="text-base font-semibold text-blue-600 text-center mb-6">
                {email}
              </Text>
              
              <Text className="text-sm text-gray-500 text-center leading-5 mb-8">
                Click the link in the email to reset your password. 
                If you don't see it, check your spam folder.
              </Text>

              <TouchableOpacity
                className="bg-gray-100 rounded-2xl py-4 items-center mb-4"
                onPress={handleResendEmail}
                activeOpacity={0.8}
              >
                <Text className="text-base font-semibold text-blue-600">
                  Resend Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="rounded-2xl shadow-lg"
                onPress={() => router.push('/sign-in')}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#007AFF', '#5856D6']}
                  className="py-5 rounded-2xl items-center"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text className="text-white text-lg font-semibold">
                    Back to Sign In
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={['#007AFF', '#5856D6']}
        className="flex-1"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View className="flex-row items-center px-5 pt-5 pb-8">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/20 justify-center items-center"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="flex-1 text-xl font-semibold text-white text-center mr-10">
            Reset Password
          </Text>
        </View>

        <View className="flex-1 px-5 justify-center">
          <View className="bg-white rounded-3xl p-8 shadow-2xl">
            <View className="items-center w-25 h-25 rounded-full bg-blue-50 justify-center self-center mb-6">
              <Send size={60} color="#007AFF" />
            </View>
            
            <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
              Forgot Password?
            </Text>
            <Text className="text-base text-gray-500 text-center leading-6 mb-8">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </Text>

            <View className="mb-6">
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

            <TouchableOpacity
              className={`rounded-2xl mb-6 shadow-lg ${isLoading ? 'opacity-60' : ''}`}
              onPress={handleSendResetLink}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#007AFF', '#5856D6']}
                className="py-5 rounded-2xl items-center"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text className="text-white text-lg font-semibold">
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center"
              onPress={() => router.push('/sign-in')}
              activeOpacity={0.7}
            >
              <Text className="text-base text-gray-500">
                Remember your password?{' '}
                <Text className="text-blue-600 font-medium">Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}