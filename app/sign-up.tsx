import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff, User, Mail, Lock } from "lucide-react-native";
import { useAuth } from "./context/AuthContext";

export default function SignUpScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const { signUp } = useAuth();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
    let newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let hasError = false;
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
      hasError = true;
    }
    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      hasError = true;
    }
    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }
    setErrors(newErrors);
    if (hasError) return;
    setIsLoading(true);
    try {
      await signUp(email, password, fullName);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert(
        "Sign Up Error",
        err.message || "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (platform: string) => {
    Alert.alert(
      "Social Sign Up",
      `${platform} sign up would be implemented here`
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#5856D6" }}>
      <LinearGradient
        colors={["#007AFF", "#5856D6"]}
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
                  onPress={() => handleSocialSignUp("Google")}
                  activeOpacity={0.8}
                >
                  <Text className="text-base font-semibold text-gray-900">
                    Continue with Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-gray-100 rounded-2xl py-4 items-center mb-3"
                  onPress={() => handleSocialSignUp("Apple")}
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
                <Text className="text-gray-500 text-sm font-medium px-4">
                  OR
                </Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {/* Input Fields */}
              <View className="mb-5">
                <Text className="text-base font-semibold text-gray-900 mb-2">
                  Full Name <Text style={{ color: "red" }}>*</Text>
                </Text>
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-1">
                  <User size={20} color="#8E8E93" className="mr-3" />
                  <TextInput
                    className="flex-1 text-base text-gray-900 py-4"
                    placeholder="Enter your full name"
                    placeholderTextColor="#8E8E93"
                    value={fullName}
                    onChangeText={(text) => {
                      setFullName(text);
                      if (errors.fullName)
                        setErrors({ ...errors, fullName: "" });
                    }}
                    autoCapitalize="words"
                  />
                </View>
                {errors.fullName ? (
                  <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                    {errors.fullName}
                  </Text>
                ) : null}
              </View>

              <View className="mb-5">
                <Text className="text-base font-semibold text-gray-900 mb-2">
                  Email Address <Text style={{ color: "red" }}>*</Text>
                </Text>
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-1">
                  <Mail size={20} color="#8E8E93" className="mr-3" />
                  <TextInput
                    className="flex-1 text-base text-gray-900 py-4"
                    placeholder="Enter your email"
                    placeholderTextColor="#8E8E93"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {errors.email ? (
                  <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                    {errors.email}
                  </Text>
                ) : null}
              </View>

              <View className="mb-5">
                <Text className="text-base font-semibold text-gray-900 mb-2">
                  Password <Text style={{ color: "red" }}>*</Text>
                </Text>
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-1">
                  <Lock size={20} color="#8E8E93" className="mr-3" />
                  <TextInput
                    className="flex-1 text-base text-gray-900 py-4"
                    placeholder="Create password"
                    placeholderTextColor="#8E8E93"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password)
                        setErrors({ ...errors, password: "" });
                    }}
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
                {errors.password ? (
                  <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                    {errors.password}
                  </Text>
                ) : null}
              </View>

              <View className="mb-5">
                <Text className="text-base font-semibold text-gray-900 mb-2">
                  Confirm Password <Text style={{ color: "red" }}>*</Text>
                </Text>
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-1">
                  <Lock size={20} color="#8E8E93" className="mr-3" />
                  <TextInput
                    className="flex-1 text-base text-gray-900 py-4"
                    placeholder="Confirm password"
                    placeholderTextColor="#8E8E93"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirmPassword)
                        setErrors({ ...errors, confirmPassword: "" });
                    }}
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
                {errors.confirmPassword ? (
                  <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                    {errors.confirmPassword}
                  </Text>
                ) : null}
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                className={`rounded-2xl mt-2 mb-6 shadow-lg ${
                  isLoading ? "opacity-60" : ""
                }`}
                onPress={handleSignUp}
                disabled={isLoading}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#007AFF", "#5856D6"]}
                  style={{
                    paddingVertical: 20,
                    borderRadius: 16,
                    alignItems: "center",
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text className="text-white text-lg font-semibold">
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Terms and Privacy */}
              <Text className="text-sm text-gray-500 text-center leading-5 mb-6">
                By signing up, you agree to our{" "}
                <Text className="text-blue-600 font-medium">
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text className="text-blue-600 font-medium">
                  Privacy Policy
                </Text>
              </Text>

              {/* Sign In Link */}
              <TouchableOpacity
                className="items-center"
                onPress={() => router.push("/sign-in")}
                activeOpacity={0.7}
              >
                <Text className="text-base text-gray-500">
                  Already have an account?{" "}
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