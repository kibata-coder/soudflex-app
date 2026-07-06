import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAnimeSeries } from '../../hooks/use-anilist';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';

const { width, height } = Dimensions.get('window');
const COLS = 4;
const EP_SIZE = (width - Spacing.xl * 2 - Spacing.sm * (COLS - 1)) / COLS;

export default function AnimeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: anime, isLoading, isError } = useAnimeSeries(id ? parseInt(id) : null);
  const [language, setLanguage] = useState<'sub' | 'dub'>('sub');

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (isError || !anime) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load anime details.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const title = anime.title.english || anime.title.romaji;
  const episodeCount = anime.episodes || anime.streamingEpisodes?.length || 12;
  const episodesList = Array.from({ length: episodeCount }, (_, i) => i + 1);
  const description = anime.description?.replace(/<[^>]*>/g, '') || '';

  const handleEpisodePress = (epNum: number) => {
    if (!anime.idMal) {
      alert('Streaming not available — no MAL ID found for this anime.');
      return;
    }
    router.push({
      pathname: '/player',
      params: {
        url: `https://megaplay.buzz/stream/mal/${anime.idMal}/${epNum}/${language}`,
        title,
        subtitle: `Episode ${epNum} • ${language.toUpperCase()}`,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Image */}
        <View style={styles.hero}>
          <Image
            source={{ uri: anime.coverImage?.large || anime.bannerImage || undefined }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(10,10,15,0.3)', 'rgba(10,10,15,0.7)', Colors.bg]}
            style={styles.heroGradient}
          />
          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.heroInfo}>
            <Image
              source={{ uri: anime.coverImage?.large }}
              style={styles.poster}
              resizeMode="cover"
            />
            <View style={styles.metaCol}>
              <Text style={styles.heroTitle} numberOfLines={3}>{title}</Text>
              {anime.genres?.length > 0 && (
                <View style={styles.genresRow}>
                  {anime.genres.slice(0, 3).map((g) => (
                    <View key={g} style={styles.genreTag}>
                      <Text style={styles.genreText}>{g}</Text>
                    </View>
                  ))}
                </View>
              )}
              <View style={styles.statsRow}>
                {anime.averageScore && (
                  <Text style={styles.stat}>⭐ {(anime.averageScore / 10).toFixed(1)}</Text>
                )}
                {anime.episodes && (
                  <Text style={styles.stat}>📺 {anime.episodes} eps</Text>
                )}
                {anime.seasonYear && (
                  <Text style={styles.stat}>📅 {anime.seasonYear}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        {description.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text style={styles.description} numberOfLines={5}>{description}</Text>
          </View>
        )}

        {/* Language picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Episodes</Text>
          <View style={styles.langPicker}>
            <TouchableOpacity
              style={[styles.langBtn, language === 'sub' && styles.langBtnActiveSub]}
              onPress={() => setLanguage('sub')}
            >
              <Text style={[styles.langBtnText, language === 'sub' && styles.langBtnTextActive]}>
                SUB
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, language === 'dub' && styles.langBtnActiveDub]}
              onPress={() => setLanguage('dub')}
            >
              <Text style={[styles.langBtnText, language === 'dub' && styles.langBtnTextActive]}>
                DUB
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Episodes grid */}
        <View style={styles.episodesGrid}>
          {episodesList.map((epNum) => {
            const epInfo = anime.streamingEpisodes?.[epNum - 1];
            return (
              <TouchableOpacity
                key={epNum}
                style={styles.episodeBtn}
                onPress={() => handleEpisodePress(epNum)}
                activeOpacity={0.75}
              >
                {epInfo?.thumbnail ? (
                  <Image
                    source={{ uri: epInfo.thumbnail }}
                    style={styles.epThumb}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.epThumbPlaceholder} />
                )}
                <View style={styles.epNumBadge}>
                  <Text style={styles.epNum}>{epNum}</Text>
                </View>
                <View style={styles.epPlayOverlay}>
                  <Text style={styles.epPlayIcon}>▶</Text>
                </View>
              </TouchableOpacity>
            );
          })}
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
  hero: {
    width,
    height: height * 0.38,
    position: 'relative',
  },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: {
    position: 'absolute',
    inset: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : Spacing.xl,
    left: Spacing.xl,
    width: 38,
    height: 38,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  backButtonText: { color: '#fff', fontSize: 24, lineHeight: 28 },
  heroInfo: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.xl,
    right: Spacing.xl,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-end',
  },
  poster: {
    width: 80,
    height: 115,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.primaryBorder,
    flexShrink: 0,
  },
  metaCol: { flex: 1 },
  heroTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '800',
    marginBottom: Spacing.sm,
    lineHeight: 26,
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  genreTag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  genreText: { color: Colors.textSecondary, fontSize: FontSize.xs, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: Spacing.md, flexWrap: 'wrap' },
  stat: { color: Colors.textSecondary, fontSize: FontSize.xs },
  section: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 22,
  },
  langPicker: { flexDirection: 'row', gap: Spacing.sm },
  langBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langBtnActiveSub: {
    backgroundColor: Colors.primaryDim,
    borderColor: Colors.primary,
  },
  langBtnActiveDub: {
    backgroundColor: Colors.blueDim,
    borderColor: Colors.blue,
  },
  langBtnText: { color: Colors.textMuted, fontWeight: '700', fontSize: FontSize.md },
  langBtnTextActive: { color: Colors.textPrimary },
  episodesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  episodeBtn: {
    width: EP_SIZE,
    height: EP_SIZE,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.bgElevated,
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  epThumb: { width: '100%', height: '100%' },
  epThumbPlaceholder: { flex: 1, backgroundColor: Colors.bgElevated },
  epNumBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  epNum: { color: '#fff', fontSize: FontSize.xs, fontWeight: '700' },
  epPlayOverlay: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  epPlayIcon: { color: 'rgba(255,255,255,0.85)', fontSize: 22 },
});
