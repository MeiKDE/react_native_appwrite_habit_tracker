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
import { ArrowLeft, Eye, EyeOff, Lock, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const router = useRouter();

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleResetPassword = async () => {
    if (!validatePassword(newPassword)) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setPasswordReset(true);
    }, 1500);
  };

  if (passwordReset) {
    return (
      <SafeAreaView className="flex-1">
        <LinearGradient
          colors={['#007AFF', '#5856D6']}
          className="flex-1"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="flex-1 px-5 justify-center">
            <View className="bg-white rounded-3xl p-8 shadow-2xl">
              <View className="items-center mb-6">
                <CheckCircle size={80} color="#34C759" />
              </View>
              
              <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
                Password Reset Successful!
              </Text>
              <Text className="text-base text-gray-500 text-center leading-6 mb-8">
                Your password has been successfully reset. You can now sign in with your new password.
              </Text>

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
                    Sign In Now
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
              <Lock size={60} color="#007AFF" />
            </View>
            
            <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
              Set New Password
            </Text>
            <Text className="text-base text-gray-500 text-center leading-6 mb-8">
              Please enter and confirm your new password below.
            </Text>

            <View className="mb-5">
              <Text className="text-base font-semibold text-gray-900 mb-2">
                New Password
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-1">
                <Lock size={20} color="#8E8E93" className="mr-3" />
                <TextInput
                  className="flex-1 text-base text-gray-900 py-4"
                  placeholder="Enter new password"
                  placeholderTextColor="#8E8E93"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  className="p-1"
                >
                  {showNewPassword ? (
                    <EyeOff size={20} color="#8E8E93" />
                  ) : (
                    <Eye size={20} color="#8E8E93" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-base font-semibold text-gray-900 mb-2">
                Confirm New Password
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-1">
                <Lock size={20} color="#8E8E93" className="mr-3" />
                <TextInput
                  className="flex-1 text-base text-gray-900 py-4"
                  placeholder="Confirm new password"
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

            {/* Password Requirements */}
            <View className="bg-gray-50 rounded-xl p-4 mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Password Requirements:
              </Text>
              <Text className={`text-sm mb-1 ${
                newPassword.length >= 6 ? 'text-green-600' : 'text-gray-500'
              }`}>
                • At least 6 characters
              </Text>
              <Text className={`text-sm ${
                newPassword === confirmPassword && newPassword.length > 0 
                  ? 'text-green-600' 
                  : 'text-gray-500'
              }`}>
                • Passwords match
              </Text>
            </View>

            <TouchableOpacity
              className={`rounded-2xl shadow-lg ${isLoading ? 'opacity-60' : ''}`}
              onPress={handleResetPassword}
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
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}