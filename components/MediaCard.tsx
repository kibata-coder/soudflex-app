import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { getImageUrl } from '../lib/tmdb';
import { Colors, Radius, FontSize, Spacing } from '../constants/theme';
import type { Movie, TVShow } from '../lib/tmdb';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.xl * 2 - Spacing.md) / 2.4;

interface MediaCardProps {
  item: Movie | TVShow;
  onPress: () => void;
  width?: number;
}

export default function MediaCard({ item, onPress, width: cardWidth }: MediaCardProps) {
  const title = 'title' in item ? item.title : item.name;
  const posterUrl = getImageUrl(item.poster_path, 'w300');
  const year = 'release_date' in item
    ? item.release_date?.slice(0, 4)
    : item.first_air_date?.slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

  const w = cardWidth || CARD_WIDTH;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, { width: w }]}
    >
      <View style={[styles.posterContainer, { width: w, height: w * 1.5 }]}>
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noPoster}>
            <Text style={styles.noPosterText}>🎬</Text>
          </View>
        )}
        {rating && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {rating}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {year && <Text style={styles.year}>{year}</Text>}
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
  ratingBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: Radius.sm,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  ratingText: {
    color: Colors.textPrimary,
    fontSize: FontSize.xs,
    fontWeight: '600',
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
  year: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
});
