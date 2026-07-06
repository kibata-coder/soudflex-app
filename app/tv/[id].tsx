import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTVShowDetails, useTVSeasonDetails } from '../../hooks/use-tmdb';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getBackdropUrl, getImageUrl } from '../../lib/tmdb';
import { getProviders, getTVShowEmbedUrl } from '../../lib/vidsrc';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

export default function TVDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const tvId = id ? parseInt(id) : null;
  const { data: show, isLoading, isError } = useTVShowDetails(tvId);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const { data: seasonData } = useTVSeasonDetails(tvId, selectedSeason);
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (isError || !show) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load TV show details.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const backdropUrl = getBackdropUrl(show.backdrop_path, 'w1280');
  const posterUrl = getImageUrl(show.poster_path, 'w300');
  const year = show.first_air_date?.slice(0, 4);
  const rating = show.vote_average ? show.vote_average.toFixed(1) : null;
  const seasons = show.seasons?.filter((s) => s.season_number > 0) || [];
  const episodes = seasonData?.episodes || [];

  const handleEpisodePress = (epNum: number) => {
    if (!tvId) return;
    router.push({
      pathname: '/player',
      params: {
        url: getTVShowEmbedUrl(tvId, selectedSeason, epNum, selectedServerIndex),
        title: show.name,
        subtitle: `S${selectedSeason} E${epNum}`,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero */}
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

        <View style={styles.content}>
          {/* Poster + Info */}
          <View style={styles.topRow}>
            {posterUrl && (
              <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" />
            )}
            <View style={styles.metaCol}>
              <Text style={styles.title}>{show.name}</Text>
              <View style={styles.statsRow}>
                {rating && <Text style={styles.stat}>⭐ {rating}</Text>}
                {year && <Text style={styles.stat}>📅 {year}</Text>}
                {show.number_of_seasons && (
                  <Text style={styles.stat}>📺 {show.number_of_seasons} seasons</Text>
                )}
              </View>
              {show.genres?.length > 0 && (
                <View style={styles.genresRow}>
                  {show.genres.slice(0, 3).map((g) => (
                    <View key={g.id} style={styles.genreTag}>
                      <Text style={styles.genreText}>{g.name}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Server picker */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Server</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.serverRow}>
                {getProviders().map((provider, index) => (
                  <TouchableOpacity
                    key={provider.id}
                    style={[
                      styles.serverBtn,
                      selectedServerIndex === index && styles.serverBtnActive,
                    ]}
                    onPress={() => setSelectedServerIndex(index)}
                  >
                    <Text
                      style={[
                        styles.serverBtnText,
                        selectedServerIndex === index && styles.serverBtnTextActive,
                      ]}
                    >
                      {provider.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Season picker */}
          {seasons.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Season</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.seasonRow}>
                  {seasons.map((s) => (
                    <TouchableOpacity
                      key={s.season_number}
                      style={[
                        styles.seasonBtn,
                        selectedSeason === s.season_number && styles.seasonBtnActive,
                      ]}
                      onPress={() => setSelectedSeason(s.season_number)}
                    >
                      <Text
                        style={[
                          styles.seasonBtnText,
                          selectedSeason === s.season_number && styles.seasonBtnTextActive,
                        ]}
                      >
                        S{s.season_number}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Episodes */}
          {episodes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Episodes</Text>
              {episodes.map((ep) => (
                <TouchableOpacity
                  key={ep.id}
                  style={styles.episodeRow}
                  onPress={() => handleEpisodePress(ep.episode_number)}
                  activeOpacity={0.75}
                >
                  {ep.still_path ? (
                    <Image
                      source={{ uri: `https://image.tmdb.org/t/p/w300${ep.still_path}` }}
                      style={styles.epThumb}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.epThumb, styles.epThumbPlaceholder]}>
                      <Text style={styles.epThumbPlaceholderText}>📺</Text>
                    </View>
                  )}
                  <View style={styles.epInfo}>
                    <Text style={styles.epNum}>E{ep.episode_number}</Text>
                    <Text style={styles.epName} numberOfLines={2}>{ep.name}</Text>
                  </View>
                  <Text style={styles.epPlayIcon}>▶</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Overview */}
          {show.overview ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.overview}>{show.overview}</Text>
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
  hero: { width, height: height * 0.32, position: 'relative' },
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
  content: { paddingHorizontal: Spacing.xl, marginTop: -Spacing.xl },
  topRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start', marginBottom: Spacing.xl },
  poster: {
    width: 90,
    height: 135,
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
  section: { marginBottom: Spacing.xl },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  serverRow: { flexDirection: 'row', gap: Spacing.sm },
  serverBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  serverBtnActive: { backgroundColor: Colors.primaryDim, borderColor: Colors.primary },
  serverBtnText: { color: Colors.textMuted, fontWeight: '700', fontSize: FontSize.sm },
  serverBtnTextActive: { color: Colors.primary },
  seasonRow: { flexDirection: 'row', gap: Spacing.sm },
  seasonBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  seasonBtnActive: { backgroundColor: Colors.primaryDim, borderColor: Colors.primary },
  seasonBtnText: { color: Colors.textMuted, fontWeight: '700', fontSize: FontSize.sm },
  seasonBtnTextActive: { color: Colors.primary },
  episodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  epThumb: { width: 120, height: 68, borderRadius: Radius.sm, backgroundColor: Colors.bgElevated },
  epThumbPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  epThumbPlaceholderText: { fontSize: 22 },
  epInfo: { flex: 1 },
  epNum: { color: Colors.textMuted, fontSize: FontSize.xs, fontWeight: '700', marginBottom: 2 },
  epName: { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: '600' },
  epPlayIcon: { color: Colors.primary, fontSize: FontSize.xl },
  overview: { color: Colors.textSecondary, fontSize: FontSize.sm, lineHeight: 22 },
});
