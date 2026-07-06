import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTrendingTV, useTVSearch } from '../../hooks/use-tmdb';
import MediaCard from '../../components/MediaCard';
import Section from '../../components/Section';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import type { TVShow } from '../../lib/tmdb';

export default function TVScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: trendingData, isLoading } = useTrendingTV();
  const { data: searchData, isLoading: isSearching } = useTVSearch(searchQuery);

  const trending = (trendingData?.results || []) as TVShow[];
  const searchResults = (searchData?.results || []) as TVShow[];
  const isSearchMode = searchQuery.length >= 2;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>📺 TV Shows</Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search TV shows..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearchMode ? (
        isSearching ? (
          <LoadingSpinner size="small" />
        ) : searchResults.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No shows found for "{searchQuery}"</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Section title={`Results for "${searchQuery}"`}>
              {searchResults.slice(0, 20).map((s) => (
                <MediaCard key={s.id} item={s} onPress={() => router.push(`/tv/${s.id}`)} />
              ))}
            </Section>
          </ScrollView>
        )
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Section title="Trending This Week">
            {trending.slice(0, 15).map((s) => (
              <MediaCard key={s.id} item={s} onPress={() => router.push(`/tv/${s.id}`)} />
            ))}
          </Section>
          {/* Second page batch */}
          <Section title="Popular Shows">
            {trending.slice(5, 20).map((s) => (
              <MediaCard key={`pop-${s.id}`} item={s} onPress={() => router.push(`/tv/${s.id}`)} />
            ))}
          </Section>
          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  pageTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: FontSize.md },
  clearBtn: { color: Colors.textMuted, fontSize: FontSize.md, padding: 4 },
  noResults: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xxxl },
  noResultsText: { color: Colors.textMuted, fontSize: FontSize.md, textAlign: 'center' },
});
