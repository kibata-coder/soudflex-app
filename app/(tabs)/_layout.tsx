import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize } from '../../constants/theme';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <Text style={[styles.icon, focused && styles.iconActive]}>{icon}</Text>
      <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🎬" label="Movies" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tv"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📺" label="TV" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="anime"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🎌" label="Anime" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.tabBar,
    borderTopColor: Colors.tabBarBorder,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    opacity: 0.5,
  },
  tabItemActive: {
    opacity: 1,
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
  },
  iconActive: {
    // Slightly larger when active
  },
  label: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
