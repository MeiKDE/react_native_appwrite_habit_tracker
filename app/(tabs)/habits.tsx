import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Pause,
  Play,
} from "lucide-react-native";
import { getUserHabits, updateHabit } from "../lib/appwrite";
import { Habit } from "../types/habit";
import { getWeekDayNames } from "../utils/habitUtils";

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "paused">("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  const loadHabits = useCallback(async () => {
    try {
      const habitsData = await getUserHabits();
      setHabits(habitsData);
      filterHabits(habitsData, searchQuery, filter);
    } catch (error) {
      Alert.alert("Error", "Failed to load habits");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, filter]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const filterHabits = (
    habitsData: Habit[],
    query: string,
    filterType: string
  ) => {
    let filtered = habitsData;

    // Filter by status
    if (filterType === "active") {
      filtered = filtered.filter((habit) => habit.isActive);
    } else if (filterType === "paused") {
      filtered = filtered.filter((habit) => !habit.isActive);
    }

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (habit) =>
          habit.name.toLowerCase().includes(query.toLowerCase()) ||
          habit.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredHabits(filtered);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHabits();
  }, [loadHabits]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterHabits(habits, query, filter);
  };

  const handleFilterChange = (newFilter: "all" | "active" | "paused") => {
    setFilter(newFilter);
    filterHabits(habits, searchQuery, newFilter);
  };

  const toggleHabitStatus = async (habit: Habit) => {
    try {
      await updateHabit(habit.$id, { isActive: !habit.isActive });
      await loadHabits();
    } catch (error) {
      Alert.alert("Error", "Failed to update habit status");
    }
  };

  const handleHabitPress = (habit: Habit) => {
    router.push(`/habit-detail/${habit.$id}` as any);
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
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">All Habits</Text>
          <TouchableOpacity
            className="bg-primary-500 w-12 h-12 rounded-full items-center justify-center"
            onPress={() => router.push("/add-habit")}
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="relative mb-4">
          <View className="absolute left-4 top-4 z-10">
            <Search size={20} color="#6B7280" />
          </View>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-gray-800"
            placeholder="Search habits..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Filter Buttons */}
        <View className="flex-row space-x-2 mb-4">
          {(["all", "active", "paused"] as const).map((filterType) => (
            <TouchableOpacity
              key={filterType}
              className={`px-4 py-2 rounded-lg ${
                filter === filterType
                  ? "bg-primary-500"
                  : "bg-white border border-gray-200"
              }`}
              onPress={() => handleFilterChange(filterType)}
            >
              <Text
                className={`font-medium capitalize ${
                  filter === filterType ? "text-white" : "text-gray-600"
                }`}
              >
                {filterType}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Habits List */}
      <ScrollView
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredHabits.length > 0 ? (
          <>
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              {filteredHabits.length} habit
              {filteredHabits.length !== 1 ? "s" : ""}
            </Text>
            {filteredHabits.map((habit) => (
              <TouchableOpacity
                key={habit.$id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
                onPress={() => handleHabitPress(habit)}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 flex-row items-center mr-4">
                    {/* Habit Icon */}
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: habit.color + "20" }}
                    >
                      <Text className="text-lg">{habit.icon}</Text>
                    </View>

                    {/* Habit Info */}
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-800 mb-1">
                        {habit.name}
                      </Text>
                      {habit.description && (
                        <Text
                          className="text-sm text-gray-500 mb-2"
                          numberOfLines={2}
                        >
                          {habit.description}
                        </Text>
                      )}

                      <View className="flex-row items-center space-x-4">
                        <View className="flex-row items-center">
                          <Calendar size={14} color="#6B7280" />
                          <Text className="text-sm text-gray-500 ml-1">
                            {habit.frequency === "daily"
                              ? "Daily"
                              : getWeekDayNames(habit.weekDays || [])}
                          </Text>
                        </View>

                        <View
                          className={`px-2 py-1 rounded-full ${
                            habit.isActive ? "bg-green-100" : "bg-gray-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              habit.isActive
                                ? "text-green-800"
                                : "text-gray-600"
                            }`}
                          >
                            {habit.isActive ? "Active" : "Paused"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Status Toggle */}
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => toggleHabitStatus(habit)}
                    activeOpacity={0.7}
                  >
                    {habit.isActive ? (
                      <Pause size={20} color="#F59E0B" />
                    ) : (
                      <Play size={20} color="#22C55E" />
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View className="bg-white rounded-xl p-8 items-center">
            <Calendar size={48} color="#D1D5DB" />
            <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">
              No habits found
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              {searchQuery || filter !== "all"
                ? "Try adjusting your search or filter"
                : "Create your first habit to get started"}
            </Text>
            {!searchQuery && filter === "all" && (
              <TouchableOpacity
                className="bg-primary-500 px-6 py-3 rounded-lg"
                onPress={() => router.push("/add-habit")}
              >
                <Text className="text-white font-semibold">
                  Add Your First Habit
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
