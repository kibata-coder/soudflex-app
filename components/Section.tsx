import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  onSeeAll?: () => void;
}

export default function Section({ title, children, onSeeAll }: SectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.accent} />
          <Text style={styles.title}>{title}</Text>
        </View>
        {onSeeAll && (
          <Text style={styles.seeAll} onPress={onSeeAll}>
            See All
          </Text>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  accent: {
    width: 4,
    height: 20,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  seeAll: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
});
