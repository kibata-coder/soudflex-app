import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Home, Film, Tv, PlaySquare, User } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Colors, FontSize } from '../../constants/theme';

function TabIcon({ icon: Icon, label, focused }: { icon: any; label: string; focused: boolean }) {
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(focused ? 1.2 : 1, { damping: 10, stiffness: 100 }),
        },
        {
          translateY: withTiming(focused ? -5 : 0, { duration: 200 }),
        }
      ],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(focused ? 1 : 0, { duration: 200 }),
      transform: [
        {
          translateY: withTiming(focused ? 0 : 10, { duration: 200 }),
        }
      ],
    };
  });

  return (
    <View style={styles.tabItem}>
      <Animated.View style={animatedIconStyle}>
        <Icon 
          size={24} 
          color={focused ? Colors.primary : Colors.textSecondary} 
          strokeWidth={focused ? 2.5 : 2}
        />
      </Animated.View>
      <Animated.View style={[styles.labelContainer, animatedTextStyle]}>
        <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
      </Animated.View>
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
            <TabIcon icon={Home} label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={Film} label="Movies" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tv"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={Tv} label="TV" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="anime"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={PlaySquare} label="Anime" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={User} label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#121212', // Sleek dark mode background
    borderTopColor: 'rgba(255,255,255,0.1)',
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 85 : 70,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    height: 50,
  },
  labelContainer: {
    position: 'absolute',
    bottom: -15,
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
