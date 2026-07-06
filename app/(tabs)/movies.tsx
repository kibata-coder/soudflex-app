import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTrendingMovies, useActionMovies, useAdventureMovies, useComedyMovies, useDramaMovies, useSciFiMovies, useMovieSearch } from '../../hooks/use-tmdb';
import MediaCard from '../../components/MediaCard';
import Section from '../../components/Section';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import type { Movie } from '../../lib/tmdb';

export default function MoviesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: trendingData, isLoading } = useTrendingMovies();
  const { data: actionData } = useActionMovies();
  const { data: adventureData } = useAdventureMovies();
  const { data: comedyData } = useComedyMovies();
  const { data: dramaData } = useDramaMovies();
  const { data: scifiData } = useSciFiMovies();
  const { data: searchData, isLoading: isSearching } = useMovieSearch(searchQuery);

  const trending = (trendingData?.results || []) as Movie[];
  const action = (actionData?.pages.flatMap(p => p.results || []) || []) as Movie[];
  const adventure = (adventureData?.pages.flatMap(p => p.results || []) || []) as Movie[];
  const comedy = (comedyData?.pages.flatMap(p => p.results || []) || []) as Movie[];
  const drama = (dramaData?.pages.flatMap(p => p.results || []) || []) as Movie[];
  const scifi = (scifiData?.pages.flatMap(p => p.results || []) || []) as Movie[];
  const searchResults = (searchData?.results || []) as Movie[];

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
        <Text style={styles.pageTitle}>🎬 Movies</Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
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
        <View style={{ flex: 1 }}>
          {isSearching ? (
            <LoadingSpinner size="small" />
          ) : searchResults.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No movies found for "{searchQuery}"</Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              contentContainerStyle={styles.grid}
              renderItem={({ item }) => (
                <MediaCard
                  item={item}
                  onPress={() => router.push(`/movie/${item.id}`)}
                  width={(Spacing.xl * 2 - 8) / 3}
                />
              )}
            />
          )}
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Section title="Trending Now">
            {trending.slice(0, 12).map((m) => (
              <MediaCard key={m.id} item={m} onPress={() => router.push(`/movie/${m.id}`)} />
            ))}
          </Section>
          <Section title="Action">
            {action.slice(0, 12).map((m) => (
              <MediaCard key={m.id} item={m} onPress={() => router.push(`/movie/${m.id}`)} />
            ))}
          </Section>
          <Section title="Adventure">
            {adventure.slice(0, 12).map((m) => (
              <MediaCard key={m.id} item={m} onPress={() => router.push(`/movie/${m.id}`)} />
            ))}
          </Section>
          <Section title="Comedy">
            {comedy.slice(0, 12).map((m) => (
              <MediaCard key={m.id} item={m} onPress={() => router.push(`/movie/${m.id}`)} />
            ))}
          </Section>
          <Section title="Drama">
            {drama.slice(0, 12).map((m) => (
              <MediaCard key={m.id} item={m} onPress={() => router.push(`/movie/${m.id}`)} />
            ))}
          </Section>
          <Section title="Sci-Fi">
            {scifi.slice(0, 12).map((m) => (
              <MediaCard key={m.id} item={m} onPress={() => router.push(`/movie/${m.id}`)} />
            ))}
          </Section>
          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
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
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
  },
  clearBtn: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    padding: 4,
  },
  grid: {
    padding: Spacing.xl,
    gap: 12,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxxl,
  },
  noResultsText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    textAlign: 'center',
  },
});
