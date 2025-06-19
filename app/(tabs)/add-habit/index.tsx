import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Calendar, Clock, Palette } from "lucide-react-native";
import { createHabit } from "/Users/mei/projects/React_Practice_Projects/react-native-appwrite-template/app/lib/appwrite";
import {
  getHabitColors,
  getHabitIcons,
} from "/Users/mei/projects/React_Practice_Projects/react-native-appwrite-template/app/utils/habitUtils";

export default function AddHabitScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [reminderTime, setReminderTime] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState(getHabitColors()[0]);
  const [selectedIcon, setSelectedIcon] = useState(getHabitIcons()[0]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const weekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const toggleWeekDay = (day: number) => {
    setWeekDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleCreateHabit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }

    if (frequency === "weekly" && weekDays.length === 0) {
      Alert.alert("Error", "Please select at least one day for weekly habits");
      return;
    }

    setLoading(true);
    try {
      await createHabit({
        name: name.trim(),
        description: description.trim() || undefined,
        frequency,
        weekDays: frequency === "weekly" ? weekDays : undefined,
        reminderTime: reminderTime.trim() || undefined,
        reminderMessage: reminderMessage.trim() || undefined,
        color: selectedColor,
        icon: selectedIcon,
        isActive: true,
      });

      Alert.alert("Success", "Habit created successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to create habit"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Habit</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <Text style={styles.label}>Habit Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Drink 8 glasses of water"
              value={name}
              onChangeText={setName}
              maxLength={50}
            />

            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add a description to help you remember..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={200}
            />
          </View>

          {/* Frequency */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color="#3B82F6" />
              <Text style={styles.sectionTitleWithIcon}>Frequency</Text>
            </View>

            <View style={styles.frequencyButtons}>
              {(["daily", "weekly"] as const).map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyButton,
                    frequency === freq && styles.frequencyButtonActive,
                  ]}
                  onPress={() => setFrequency(freq)}
                >
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      frequency === freq && styles.frequencyButtonTextActive,
                    ]}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {frequency === "weekly" && (
              <View>
                <Text style={styles.label}>Select Days</Text>
                <View style={styles.weekDaysContainer}>
                  {weekDayNames.map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.weekDayButton,
                        weekDays.includes(index) && styles.weekDayButtonActive,
                      ]}
                      onPress={() => toggleWeekDay(index)}
                    >
                      <Text
                        style={[
                          styles.weekDayButtonText,
                          weekDays.includes(index) &&
                            styles.weekDayButtonTextActive,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Reminder */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#3B82F6" />
              <Text style={styles.sectionTitleWithIcon}>
                Reminder (Optional)
              </Text>
            </View>

            <Text style={styles.label}>Time (HH:MM)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 09:00"
              value={reminderTime}
              onChangeText={setReminderTime}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Custom Message</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Time to hydrate!"
              value={reminderMessage}
              onChangeText={setReminderMessage}
              maxLength={100}
            />
          </View>

          {/* Visual Identity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Palette size={20} color="#3B82F6" />
              <Text style={styles.sectionTitleWithIcon}>Visual Identity</Text>
            </View>

            <Text style={styles.label}>Choose a Color</Text>
            <View style={styles.colorsContainer}>
              {getHabitColors().map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorButtonActive,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <Text style={styles.label}>Choose an Icon</Text>
            <View style={styles.iconsContainer}>
              {getHabitIcons().map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconButton,
                    selectedIcon === icon && styles.iconButtonActive,
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text style={styles.iconText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.previewCard}>
              <View
                style={[
                  styles.previewIcon,
                  { backgroundColor: selectedColor + "20" },
                ]}
              >
                <Text style={styles.previewIconText}>{selectedIcon}</Text>
              </View>
              <View style={styles.previewContent}>
                <Text style={styles.previewName}>
                  {name || "Your habit name"}
                </Text>
                {description && (
                  <Text style={styles.previewDescription}>{description}</Text>
                )}
                <Text style={styles.previewFrequency}>
                  {frequency === "daily"
                    ? "Daily"
                    : `Weekly • ${weekDays.length} days`}
                </Text>
              </View>
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            style={[
              styles.createButton,
              loading && styles.createButtonDisabled,
            ]}
            onPress={handleCreateHabit}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? "Creating..." : "Create Habit"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleWithIcon: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
  },
  label: {
    color: "#374151",
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#1F2937",
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  frequencyButtons: {
    flexDirection: "row",
    marginBottom: 16,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#F3F4F6",
  },
  frequencyButtonActive: {
    backgroundColor: "#3B82F6",
  },
  frequencyButtonText: {
    textAlign: "center",
    fontWeight: "500",
    color: "#6B7280",
  },
  frequencyButtonTextActive: {
    color: "white",
  },
  weekDaysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  weekDayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#F3F4F6",
  },
  weekDayButtonActive: {
    backgroundColor: "#3B82F6",
  },
  weekDayButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  weekDayButtonTextActive: {
    color: "white",
  },
  colorsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    marginBottom: 12,
  },
  colorButtonActive: {
    borderWidth: 4,
    borderColor: "#D1D5DB",
  },
  iconsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginBottom: 12,
    backgroundColor: "#F3F4F6",
  },
  iconButtonActive: {
    backgroundColor: "#DBEAFE",
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  iconText: {
    fontSize: 18,
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  previewIconText: {
    fontSize: 18,
  },
  previewContent: {
    flex: 1,
  },
  previewName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  previewDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  previewFrequency: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  createButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
});
