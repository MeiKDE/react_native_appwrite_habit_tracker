import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Plus, Calendar } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { HabitCard } from "../components/HabitCard";
import {
  getUserHabits,
  getTodayCompletions,
  markHabitComplete,
  skipHabit,
} from "../lib/appwrite";
import { Habit, HabitCompletion } from "../types/habit";
import {
  calculateStreak,
  isHabitDueToday,
  formatDate,
  getGreeting,
} from "../utils/habitUtils";

export default function TodayScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const loadData = useCallback(async () => {
    try {
      const [habitsData, completionsData] = await Promise.all([
        getUserHabits(),
        getTodayCompletions(),
      ]);
      setHabits(habitsData);
      setCompletions(completionsData);
    } catch (error) {
      Alert.alert("Error", "Failed to load habits");
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

  const handleToggleComplete = async (habit: Habit) => {
    const today = formatDate(new Date());
    const completion = completions.find((c) => c.habitId === habit.$id);
    const newCompleted = !completion?.completed;

    try {
      await markHabitComplete(habit.$id, today, newCompleted);
      await loadData();
    } catch (error) {
      Alert.alert("Error", "Failed to update habit");
    }
  };

  const handleHabitPress = (habit: Habit) => {
    router.push(`/habit-detail/${habit.$id}`);
  };

  const todayHabits = habits.filter(
    (habit) => habit.isActive && isHabitDueToday(habit)
  );
  const completedToday = completions.filter((c) => c.completed).length;
  const totalToday = todayHabits.length;

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
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                {getGreeting()}, {user?.name?.split(" ")[0]}!
              </Text>
              <Text className="text-gray-600 mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-primary-500 w-12 h-12 rounded-full items-center justify-center"
              onPress={() => router.push("/add-habit")}
            >
              <Plus size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Progress Summary */}
          <View className="bg-white rounded-xl p-4 mb-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-semibold text-gray-800">
                  Today's Progress
                </Text>
                <Text className="text-gray-600">
                  {completedToday} of {totalToday} habits completed
                </Text>
              </View>
              <View className="items-center">
                <View className="w-16 h-16 rounded-full bg-primary-100 items-center justify-center">
                  <Text className="text-2xl font-bold text-primary-600">
                    {totalToday > 0
                      ? Math.round((completedToday / totalToday) * 100)
                      : 0}
                    %
                  </Text>
                </View>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="mt-4">
              <View className="bg-gray-200 rounded-full h-2">
                <View
                  className="bg-primary-500 h-2 rounded-full"
                  style={{
                    width: `${
                      totalToday > 0 ? (completedToday / totalToday) * 100 : 0
                    }%`,
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Habits List */}
        <View className="px-6 pb-6">
          {todayHabits.length > 0 ? (
            <>
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Today's Habits ({todayHabits.length})
              </Text>
              {todayHabits.map((habit) => {
                const completion = completions.find(
                  (c) => c.habitId === habit.$id
                );
                const streak = calculateStreak([]); // TODO: Load habit-specific completions for streak

                return (
                  <HabitCard
                    key={habit.$id}
                    habit={habit}
                    completion={completion}
                    streak={streak}
                    onToggleComplete={() => handleToggleComplete(habit)}
                    onPress={() => handleHabitPress(habit)}
                  />
                );
              })}
            </>
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <Calendar size={48} color="#D1D5DB" />
              <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                No habits for today
              </Text>
              <Text className="text-gray-600 text-center mb-6">
                Create your first habit to start building better routines
              </Text>
              <TouchableOpacity
                className="bg-primary-500 px-6 py-3 rounded-lg"
                onPress={() => router.push("/add-habit")}
              >
                <Text className="text-white font-semibold">
                  Add Your First Habit
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
