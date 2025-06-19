// import { Tabs } from 'expo-router';
// import { Calendar, Home, BarChart3, Settings } from 'lucide-react-native';

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: '#3B82F6',
//         tabBarInactiveTintColor: '#6B7280',
//         tabBarStyle: {
//           backgroundColor: 'white',
//           borderTopWidth: 1,
//           borderTopColor: '#E5E7EB',
//           paddingTop: 8,
//           paddingBottom: 8,
//           height: 80,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: '600',
//           marginTop: 4,
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Today',
//           tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="habits"
//         options={{
//           title: 'All Habits',
//           tabBarIcon: ({ size, color }) => <Calendar size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="progress"
//         options={{
//           title: 'Progress',
//           tabBarIcon: ({ size, color }) => <BarChart3 size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="settings"
//         options={{
//           title: 'Settings',
//           tabBarIcon: ({ size, color }) => <Settings size={size} color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }

import { Tabs } from "expo-router";
import {
  Calendar,
  Home,
  ChartBar as BarChart3,
  CirclePlus,
} from "lucide-react-native";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="habits"
        options={{
          title: "All Habits",
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
    paddingBottom: 8,
    height: 80,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
