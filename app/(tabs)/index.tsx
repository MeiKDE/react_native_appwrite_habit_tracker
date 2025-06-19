import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet,
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
} from "../lib/appwrite";
import {
  Habit,
  HabitCompletion,
} from "../types/habit";
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
    } catch {
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
    } catch {
      Alert.alert("Error", "Failed to update habit");
    }
  };

  const handleHabitPress = (habit: Habit) => {
    router.push(`/habit-detail/${habit.$id}` as any);
  };

  const handleAddHabit = () => {
    router.push("/add-habit");
  };

  const todayHabits = habits.filter(
    (habit) => habit.isActive && isHabitDueToday(habit)
  );
  const completedToday = completions.filter((c) => c.completed).length;
  const totalToday = todayHabits.length;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>
                {getGreeting()}, {user?.name?.split(" ")[0]}!
              </Text>
              <Text style={styles.date}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
              <Plus size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Progress Summary */}
          <View style={styles.progressCard}>
            <View style={styles.progressContent}>
              <View>
                <Text style={styles.progressTitle}>Today&apos;s Progress</Text>
                <Text style={styles.progressSubtitle}>
                  {completedToday} of {totalToday} habits completed
                </Text>
              </View>
              <View style={styles.progressCircle}>
                <Text style={styles.progressPercentage}>
                  {totalToday > 0
                    ? Math.round((completedToday / totalToday) * 100)
                    : 0}
                  %
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${
                        totalToday > 0 ? (completedToday / totalToday) * 100 : 0
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Habits List */}
        <View style={styles.habitsContainer}>
          {todayHabits.length > 0 ? (
            <>
              <Text style={styles.habitsTitle}>
                Today&apos;s Habits ({todayHabits.length})
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
            <View style={styles.emptyState}>
              <Calendar size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>No habits for today</Text>
              <Text style={styles.emptyStateSubtitle}>
                Create your first habit to start building better routines
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={handleAddHabit}
              >
                <Text style={styles.emptyStateButtonText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#6B7280",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  date: {
    color: "#6B7280",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#3B82F6",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  progressCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  progressContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  progressSubtitle: {
    color: "#6B7280",
  },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563EB",
  },
  progressBarContainer: {
    marginTop: 16,
  },
  progressBarBackground: {
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    height: 8,
  },
  progressBarFill: {
    backgroundColor: "#3B82F6",
    height: 8,
    borderRadius: 4,
  },
  habitsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  habitsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "white",
    fontWeight: "600",
  },
});