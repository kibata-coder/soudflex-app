import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors, Radius, FontSize, Spacing } from '../constants/theme';
import type { AnilistAnime } from '../lib/anilist';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.xl * 2 - Spacing.md) / 2.4;

interface AnimeCardProps {
  anime: AnilistAnime;
  onPress: () => void;
  width?: number;
}

export default function AnimeCard({ anime, onPress, width: cardWidth }: AnimeCardProps) {
  const title = anime.title.english || anime.title.romaji;
  const posterUrl = anime.coverImage?.large;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null;
  const episodes = anime.episodes;

  const w = cardWidth || CARD_WIDTH;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, { width: w }]}
    >
      <View style={[styles.posterContainer, { width: w, height: w * 1.45 }]}>
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noPoster}>
            <Text style={styles.noPosterText}>🎌</Text>
          </View>
        )}
        {score && (
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>⭐ {score}</Text>
          </View>
        )}
        {episodes && (
          <View style={styles.epsBadge}>
            <Text style={styles.epsText}>{episodes} eps</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {anime.genres?.length > 0 && (
          <Text style={styles.genre} numberOfLines={1}>
            {anime.genres.slice(0, 2).join(' · ')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: Spacing.md,
  },
  posterContainer: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.bgElevated,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  noPoster: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosterText: {
    fontSize: 32,
  },
  scoreBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: Radius.sm,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  scoreText: {
    color: Colors.textPrimary,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  epsBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: Colors.primaryDim,
    borderRadius: Radius.sm,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  epsText: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  info: {
    marginTop: Spacing.sm,
    paddingHorizontal: 2,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    lineHeight: 18,
  },
  genre: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
});
