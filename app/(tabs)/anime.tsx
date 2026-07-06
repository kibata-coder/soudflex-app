import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTrendingAnime, usePopularAnime, useSearchAnime } from '../../hooks/use-anilist';
import AnimeCard from '../../components/AnimeCard';
import Section from '../../components/Section';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import type { AnilistAnime } from '../../lib/anilist';

const { width, height } = Dimensions.get('window');

export default function AnimeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'trending' | 'popular'>('trending');

  const {
    data: trendingData,
    isLoading: loadingTrending,
    fetchNextPage: fetchMoreTrending,
    hasNextPage: hasMoreTrending,
    isFetchingNextPage: fetchingMoreTrending,
  } = useTrendingAnime();

  const {
    data: popularData,
    isLoading: loadingPopular,
  } = usePopularAnime();

  const { data: searchData, isLoading: isSearching } = useSearchAnime(searchQuery);

  const trending = trendingData?.pages.flatMap(p => p.media) || [];
  const popular = popularData?.pages.flatMap(p => p.media) || [];
  const searchResults = searchData?.media || [];

  const heroAnime = trending[0];
  const isSearchMode = searchQuery.length >= 2;

  if (loadingTrending) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>🎌 Anime</Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search anime..."
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
        /* ---- Search Mode ---- */
        <View style={{ flex: 1 }}>
          {isSearching ? (
            <LoadingSpinner size="small" />
          ) : searchQuery.length < 3 ? (
            <View style={styles.centered}>
              <Text style={styles.hintText}>Enter at least 3 characters to search</Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.hintText}>No anime found for "{searchQuery}"</Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item, i) => `${item.id}-${i}`}
              numColumns={3}
              contentContainerStyle={styles.grid}
              columnWrapperStyle={styles.gridRow}
              renderItem={({ item }) => (
                <AnimeCard
                  anime={item}
                  onPress={() => router.push(`/anime/${item.id}`)}
                  width={(width - Spacing.xl * 2 - Spacing.md * 2) / 3}
                />
              )}
            />
          )}
        </View>
      ) : (
        /* ---- Browse Mode ---- */
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hero */}
          {heroAnime && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push(`/anime/${heroAnime.id}`)}
            >
              <View style={styles.hero}>
                <Image
                  source={{ uri: heroAnime.bannerImage || heroAnime.coverImage?.large }}
                  style={styles.heroImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(10,10,15,0.85)', Colors.bg]}
                  style={styles.heroGradient}
                />
                <View style={styles.heroContent}>
                  <View style={styles.trendingBadge}>
                    <Text style={styles.trendingBadgeText}>🔥 TRENDING #1</Text>
                  </View>
                  <Text style={styles.heroTitle} numberOfLines={2}>
                    {heroAnime.title.english || heroAnime.title.romaji}
                  </Text>
                  {heroAnime.genres?.length > 0 && (
                    <View style={styles.genresRow}>
                      {heroAnime.genres.slice(0, 3).map((g) => (
                        <View key={g} style={styles.genreTag}>
                          <Text style={styles.genreText}>{g}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.watchBtn}
                    onPress={() => router.push(`/anime/${heroAnime.id}`)}
                  >
                    <Text style={styles.watchBtnText}>▶  Watch Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Tab switcher */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'trending' && styles.tabActive]}
              onPress={() => setActiveTab('trending')}
            >
              <Text style={[styles.tabText, activeTab === 'trending' && styles.tabTextActive]}>
                Trending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'popular' && styles.tabActive]}
              onPress={() => setActiveTab('popular')}
            >
              <Text style={[styles.tabText, activeTab === 'popular' && styles.tabTextActive]}>
                Popular
              </Text>
            </TouchableOpacity>
          </View>

          {/* Anime Grid */}
          <View style={styles.gridContainer}>
            {(activeTab === 'trending' ? trending.slice(1) : popular).map((anime, i) => (
              <AnimeCard
                key={`${anime.id}-${i}`}
                anime={anime}
                onPress={() => router.push(`/anime/${anime.id}`)}
                width={(width - Spacing.xl * 2 - Spacing.md * 2) / 3}
              />
            ))}
          </View>

          {activeTab === 'trending' && hasMoreTrending && (
            <TouchableOpacity
              style={styles.loadMoreBtn}
              onPress={() => fetchMoreTrending()}
              disabled={fetchingMoreTrending}
            >
              {fetchingMoreTrending ? (
                <ActivityIndicator color={Colors.primary} size="small" />
              ) : (
                <Text style={styles.loadMoreText}>Load More</Text>
              )}
            </TouchableOpacity>
          )}

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
  hero: {
    width,
    height: height * 0.45,
    position: 'relative',
    marginBottom: Spacing.xl,
  },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: Spacing.xl,
    right: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  trendingBadge: {
    backgroundColor: Colors.primaryDim,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  trendingBadgeText: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    marginBottom: Spacing.sm,
    lineHeight: 30,
  },
  genresRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  genreText: { color: Colors.textSecondary, fontSize: FontSize.xs, fontWeight: '600' },
  watchBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  watchBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    justifyContent: 'flex-start',
  },
  grid: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  gridRow: {
    gap: Spacing.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxxl,
  },
  hintText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    textAlign: 'center',
  },
  loadMoreBtn: {
    margin: Spacing.xl,
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  loadMoreText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: FontSize.md,
  },
});
