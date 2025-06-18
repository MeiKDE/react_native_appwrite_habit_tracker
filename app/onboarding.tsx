import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, Shield, Users, Zap } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to Our App Next Star AI',
    description: 'Discover amazing features that will transform your daily experience and boost your productivity.',
    icon: Zap,
    color: '#007AFF',
  },
  {
    id: 2,
    title: 'Connect & Collaborate',
    description: 'Join a community of like-minded individuals and work together towards common goals.',
    icon: Users,
    color: '#34C759',
  },
  {
    id: 3,
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security. We respect your privacy above all.',
    icon: Shield,
    color: '#FF9500',
  },
];

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffset / screenWidth);
    setCurrentPage(currentIndex);
  };

  const goToNextPage = () => {
    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      scrollViewRef.current?.scrollTo({
        x: nextPage * screenWidth,
        animated: true,
      });
      setCurrentPage(nextPage);
    }
  };

  const isLastPage = currentPage === onboardingData.length - 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#5856D6' }}>
      <LinearGradient
        colors={['#007AFF', '#5856D6']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        >
          {onboardingData.map((item, index) => (
            <View
              key={item.id}
              style={{
                width: screenWidth,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 40,
              }}
            >
              <View className="items-center justify-center" style={{ flex: 1 }}>
                <View 
                  className="w-32 h-32 rounded-full justify-center items-center mb-10 shadow-2xl"
                  style={{ backgroundColor: item.color }}
                >
                  <item.icon size={60} color="white" />
                </View>
                
                <Text className="text-4xl font-bold text-white text-center mb-4">
                  {item.title}
                </Text>
                <Text className="text-lg text-white/90 text-center leading-7 mb-10">
                  {item.description}
                </Text>
                
                {index === onboardingData.length - 1 && (
                  <TouchableOpacity
                    className="w-14 h-14 rounded-full bg-white justify-center items-center shadow-lg"
                    onPress={goToNextPage}
                    activeOpacity={0.8}
                  >
                    <ChevronRight size={24} color="#007AFF" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Page Indicators */}
        <View className="flex-row justify-center items-center py-5">
          {onboardingData.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === currentPage 
                  ? 'w-6 bg-white' 
                  : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </View>

        {/* Action Buttons */}
        {isLastPage && (
          <View className="px-10 pb-10">
            <TouchableOpacity
              className="bg-white rounded-2xl py-5 items-center mb-4 shadow-lg"
              onPress={() => router.push('/sign-up')}
              activeOpacity={0.9}
            >
              <Text className="text-blue-600 text-lg font-semibold">
                Get Started
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="items-center py-3"
              onPress={() => router.push('/sign-in')}
              activeOpacity={0.8}
            >
              <Text className="text-white/90 text-base font-medium">
                I already have an account
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}