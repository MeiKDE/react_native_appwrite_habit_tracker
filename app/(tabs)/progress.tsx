import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart, LineChart } from "react-native-chart-kit";
import { TrendingUp, Target, Calendar, Award } from "lucide-react-native";
import { getUserHabits, getTodayCompletions } from "../lib/appwrite";
import { Habit, HabitCompletion } from "../types/habit";

const screenWidth = Dimensions.get("window").width;

export default function ProgressScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [habitsData, completionsData] = await Promise.all([
        getUserHabits(),
        getTodayCompletions(),
      ]);
      setHabits(habitsData);
      setCompletions(completionsData);
    } catch {
      Alert.alert("Error", "Failed to load progress data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  // Calculate statistics
  const activeHabits = habits.filter((h) => h.isActive);
  const completedToday = completions.filter((c) => c.completed).length;
  const totalToday = activeHabits.length;
  const completionRate =
    totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Mock data for charts (in a real app, you'd calculate this from actual completion data)
  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [80, 65, 90, 75, 85, 70, completionRate],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const monthlyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        data: [75, 82, 68, 90],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-6">
            Progress & Insights
          </Text>

          {/* Stats Cards */}
          <View className="flex-row flex-wrap justify-between mb-6">
            <View className="bg-white rounded-xl p-4 w-[48%] mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Target size={24} color="#3B82F6" />
                <Text className="text-2xl font-bold text-gray-800">
                  {completionRate}%
                </Text>
              </View>
              <Text className="text-gray-600 text-sm">Today&apos;s Rate</Text>
            </View>

            <View className="bg-white rounded-xl p-4 w-[48%] mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Calendar size={24} color="#10B981" />
                <Text className="text-2xl font-bold text-gray-800">
                  {activeHabits.length}
                </Text>
              </View>
              <Text className="text-gray-600 text-sm">Active Habits</Text>
            </View>

            <View className="bg-white rounded-xl p-4 w-[48%]">
              <View className="flex-row items-center justify-between mb-2">
                <TrendingUp size={24} color="#F59E0B" />
                <Text className="text-2xl font-bold text-gray-800">7</Text>
              </View>
              <Text className="text-gray-600 text-sm">Day Streak</Text>
            </View>

            <View className="bg-white rounded-xl p-4 w-[48%]">
              <View className="flex-row items-center justify-between mb-2">
                <Award size={24} color="#8B5CF6" />
                <Text className="text-2xl font-bold text-gray-800">85%</Text>
              </View>
              <Text className="text-gray-600 text-sm">Weekly Avg</Text>
            </View>
          </View>

          {/* Weekly Progress Chart */}
          <View className="bg-white rounded-xl p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Weekly Completion Rate
            </Text>
            <LineChart
              data={weeklyData}
              width={screenWidth - 80}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>

          {/* Monthly Overview */}
          <View className="bg-white rounded-xl p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Monthly Overview
            </Text>
            <BarChart
              data={monthlyData}
              width={screenWidth - 80}
              height={200}
              chartConfig={chartConfig}
              yAxisLabel=""
              yAxisSuffix=""
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>

          {/* Top Habits */}
          <View className="bg-white rounded-xl p-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Your Top Habits
            </Text>
            {activeHabits.slice(0, 3).map((habit, index) => (
              <View
                key={habit.$id}
                className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-sm font-bold text-gray-600">
                    #{index + 1}
                  </Text>
                </View>
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: habit.color + "20" }}
                >
                  <Text className="text-sm">{habit.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">
                    {habit.name}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {Math.floor(Math.random() * 20) + 80}% completion rate
                  </Text>
                </View>
                <View className="bg-green-100 px-2 py-1 rounded-full">
                  <Text className="text-xs font-medium text-green-800">
                    {Math.floor(Math.random() * 10) + 5} day streak
                  </Text>
                </View>
              </View>
            ))}

            {activeHabits.length === 0 && (
              <View className="py-8 items-center">
                <Text className="text-gray-500 text-center">
                  No active habits to show progress for
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}