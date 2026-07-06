import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useMovieDetails } from '../../hooks/use-tmdb';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getBackdropUrl, getImageUrl } from '../../lib/tmdb';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: movie, isLoading, isError } = useMovieDetails(id ? parseInt(id) : null);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (isError || !movie) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load movie details.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handlePlay = () => {
    router.push({
      pathname: '/player',
      params: {
        url: `https://megaplay.buzz/stream/tmdb/movie/${movie.id}`,
        title: movie.title,
        subtitle: movie.release_date?.slice(0, 4) || '',
      },
    });
  };

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'w1280');
  const posterUrl = getImageUrl(movie.poster_path, 'w300');
  const year = movie.release_date?.slice(0, 4);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Backdrop */}
        <View style={styles.hero}>
          {backdropUrl ? (
            <Image source={{ uri: backdropUrl }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={[styles.heroImage, { backgroundColor: Colors.bgElevated }]} />
          )}
          <LinearGradient
            colors={['rgba(10,10,15,0.2)', 'rgba(10,10,15,0.7)', Colors.bg]}
            style={styles.heroGradient}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Poster + Info */}
          <View style={styles.topRow}>
            {posterUrl && (
              <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />
            )}
            <View style={styles.metaCol}>
              <Text style={styles.title}>{movie.title}</Text>
              <View style={styles.statsRow}>
                {rating && <Text style={styles.stat}>⭐ {rating}</Text>}
                {year && <Text style={styles.stat}>📅 {year}</Text>}
                {runtime && <Text style={styles.stat}>⏱ {runtime}</Text>}
              </View>
              {movie.genres?.length > 0 && (
                <View style={styles.genresRow}>
                  {movie.genres.slice(0, 3).map((g) => (
                    <View key={g.id} style={styles.genreTag}>
                      <Text style={styles.genreText}>{g.name}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Play Button */}
          <TouchableOpacity style={styles.playBtn} onPress={handlePlay} activeOpacity={0.85}>
            <Text style={styles.playBtnText}>▶  Watch Movie</Text>
          </TouchableOpacity>

          {/* Overview */}
          {movie.overview ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.overview}>{movie.overview}</Text>
            </View>
          ) : null}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xxxl },
  errorText: { color: Colors.error, fontSize: FontSize.md, marginBottom: Spacing.lg },
  backBtn: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  backBtnText: { color: Colors.textPrimary, fontWeight: '600', fontSize: FontSize.md },
  hero: { width, height: height * 0.35, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '80%' },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : Spacing.xl,
    left: Spacing.xl,
    width: 38,
    height: 38,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  backButtonText: { color: '#fff', fontSize: 24, lineHeight: 28 },
  content: { paddingHorizontal: Spacing.xl, marginTop: -Spacing.xxl },
  topRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start', marginBottom: Spacing.xl },
  poster: {
    width: 100,
    height: 150,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.primaryBorder,
    flexShrink: 0,
  },
  metaCol: { flex: 1, paddingTop: Spacing.sm },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '800',
    marginBottom: Spacing.sm,
    lineHeight: 26,
  },
  statsRow: { flexDirection: 'row', gap: Spacing.md, flexWrap: 'wrap', marginBottom: Spacing.sm },
  stat: { color: Colors.textSecondary, fontSize: FontSize.xs },
  genresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  genreTag: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genreText: { color: Colors.textSecondary, fontSize: FontSize.xs, fontWeight: '600' },
  playBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  playBtnText: { color: '#fff', fontWeight: '800', fontSize: FontSize.lg },
  section: { marginBottom: Spacing.xl },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  overview: { color: Colors.textSecondary, fontSize: FontSize.sm, lineHeight: 22 },
});
