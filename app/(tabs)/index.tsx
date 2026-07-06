import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTrendingMovies, useTrendingTV, useMovieSearch, useTVSearch } from '../../hooks/use-tmdb';
import MediaCard from '../../components/MediaCard';
import Section from '../../components/Section';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getBackdropUrl, getImageUrl } from '../../lib/tmdb';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';
import type { Movie, TVShow } from '../../lib/tmdb';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const { data: trendingMoviesData, isLoading: loadingMovies } = useTrendingMovies();
  const { data: trendingTVData } = useTrendingTV();
  const { data: movieSearchData, isLoading: searchingMovies } = useMovieSearch(searchQuery);
  const { data: tvSearchData, isLoading: searchingTV } = useTVSearch(searchQuery);

  const trendingMovies = (trendingMoviesData?.results || []) as Movie[];
  const trendingTV = (trendingTVData?.results || []) as TVShow[];
  const heroMovie = trendingMovies[0];

  const isSearching = searchQuery.length >= 2;
  const searchMovies = (movieSearchData?.results || []) as Movie[];
  const searchTV = (tvSearchData?.results || []) as TVShow[];

  if (loadingMovies && !isSearching) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.logoRow}>
          <Text style={styles.logo}>SoudFlex</Text>
        </View>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies, shows..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearching ? (
        /* Search Results */
        <ScrollView style={styles.scroll} contentContainerStyle={styles.searchResults}>
          {(searchingMovies || searchingTV) && <LoadingSpinner size="small" />}
          {searchMovies.length > 0 && (
            <Section title="Movies">
              {searchMovies.slice(0, 10).map((m) => (
                <MediaCard
                  key={m.id}
                  item={m}
                  onPress={() => router.push(`/movie/${m.id}`)}
                />
              ))}
            </Section>
          )}
          {searchTV.length > 0 && (
            <Section title="TV Shows">
              {searchTV.slice(0, 10).map((s) => (
                <MediaCard
                  key={s.id}
                  item={s}
                  onPress={() => router.push(`/tv/${s.id}`)}
                />
              ))}
            </Section>
          )}
          {!searchingMovies && !searchingTV && searchMovies.length === 0 && searchTV.length === 0 && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No results for "{searchQuery}"</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Banner */}
          {heroMovie && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push(`/movie/${heroMovie.id}`)}
            >
              <View style={styles.hero}>
                <Image
                  source={{ uri: getBackdropUrl(heroMovie.backdrop_path, 'w1280') || undefined }}
                  style={styles.heroImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(10,10,15,0.8)', Colors.bg]}
                  style={styles.heroGradient}
                />
                <View style={styles.heroContent}>
                  <View style={styles.heroLive}>
                    <Text style={styles.heroLiveText}>🔥 TRENDING</Text>
                  </View>
                  <Text style={styles.heroTitle} numberOfLines={2}>
                    {heroMovie.title}
                  </Text>
                  <Text style={styles.heroOverview} numberOfLines={3}>
                    {heroMovie.overview}
                  </Text>
                  <View style={styles.heroButtons}>
                    <TouchableOpacity
                      style={styles.playBtn}
                      onPress={() => router.push(`/movie/${heroMovie.id}`)}
                    >
                      <Text style={styles.playBtnText}>▶  Watch Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.infoBtn}
                      onPress={() => router.push(`/movie/${heroMovie.id}`)}
                    >
                      <Text style={styles.infoBtnText}>ℹ  More Info</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Trending Movies */}
          <Section
            title="Trending Movies"
            onSeeAll={() => router.push('/movies')}
          >
            {trendingMovies.slice(0, 12).map((m) => (
              <MediaCard
                key={m.id}
                item={m}
                onPress={() => router.push(`/movie/${m.id}`)}
              />
            ))}
          </Section>

          {/* Trending TV */}
          <Section
            title="Trending TV Shows"
            onSeeAll={() => router.push('/tv')}
          >
            {trendingTV.slice(0, 12).map((s) => (
              <MediaCard
                key={s.id}
                item={s}
                onPress={() => router.push(`/tv/${s.id}`)}
              />
            ))}
          </Section>

          {/* Anime promo banner */}
          <TouchableOpacity
            style={styles.animeBanner}
            onPress={() => router.push('/anime')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#f97316', '#ea580c', '#c2410c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.animeBannerGrad}
            >
              <Text style={styles.animeBannerEmoji}>🎌</Text>
              <View>
                <Text style={styles.animeBannerTitle}>Watch Anime</Text>
                <Text style={styles.animeBannerSub}>Sub & Dub • Powered by AniList</Text>
              </View>
              <Text style={styles.animeBannerArrow}>›</Text>
            </LinearGradient>
          </TouchableOpacity>

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
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.bg,
  },
  logoRow: {
    marginBottom: Spacing.md,
  },
  logo: {
    color: Colors.primary,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.5,
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
  searchIcon: {
    fontSize: 16,
  },
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
  scroll: {
    flex: 1,
  },
  hero: {
    width,
    height: height * 0.52,
    position: 'relative',
    marginBottom: Spacing.xxl,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: Spacing.xl,
    right: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  heroLive: {
    backgroundColor: Colors.primaryDim,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  heroLiveText: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    marginBottom: Spacing.sm,
    lineHeight: 30,
  },
  heroOverview: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  playBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    flex: 1,
    alignItems: 'center',
  },
  playBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FontSize.md,
  },
  infoBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  infoBtnText: {
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: FontSize.md,
  },
  animeBanner: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  animeBannerGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  animeBannerEmoji: {
    fontSize: 32,
  },
  animeBannerTitle: {
    color: '#fff',
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  animeBannerSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  animeBannerArrow: {
    color: '#fff',
    fontSize: 28,
    marginLeft: 'auto',
    fontWeight: '300',
  },
  searchResults: {
    paddingTop: Spacing.md,
  },
  noResults: {
    padding: Spacing.xxxl,
    alignItems: 'center',
  },
  noResultsText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
});
