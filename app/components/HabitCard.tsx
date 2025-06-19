import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CheckCircle, Circle, Calendar, Flame } from "lucide-react-native";
import { Habit, HabitCompletion } from "../types/habit";

interface HabitCardProps {
  habit: Habit;
  completion?: HabitCompletion;
  streak: number;
  onToggleComplete: () => void;
  onPress: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  completion,
  streak,
  onToggleComplete,
  onPress,
}) => {
  const isCompleted = completion?.completed || false;
  const isSkipped = completion?.skipped || false;

  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
      onPress={onPress}
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
              <Text className="text-sm text-gray-500 mb-2" numberOfLines={1}>
                {habit.description}
              </Text>
            )}

            {/* Streak and Frequency */}
            <View className="flex-row items-center">
              <View className="flex-row items-center mr-4">
                <Flame size={14} color="#F59E0B" />
                <Text className="text-sm text-gray-600 ml-1">
                  {streak} day{streak !== 1 ? "s" : ""}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Calendar size={14} color="#6B7280" />
                <Text className="text-sm text-gray-500 ml-1 capitalize">
                  {habit.frequency}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Complete Button */}
        <TouchableOpacity
          className="p-2"
          onPress={onToggleComplete}
          activeOpacity={0.7}
        >
          {isCompleted ? (
            <CheckCircle size={32} color="#22C55E" />
          ) : (
            <Circle
              size={32}
              color={isSkipped ? "#F59E0B" : "#D1D5DB"}
              strokeWidth={2}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Status Indicator */}
      {isSkipped && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          <Text className="text-sm text-amber-600 font-medium">
            Skipped for today
          </Text>
        </View>
      )}

      {completion?.note && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          <Text className="text-sm text-gray-600 italic">
            `{completion.note}``
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
