import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';

export default function ProfileScreen() {
  const handleSignIn = () => {
    Alert.alert('Sign In', 'Auth coming soon — you can sign in on the web app at soudflex.pages.dev');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>👤 Profile</Text>

        {/* Guest state */}
        <View style={styles.guestCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.guestTitle}>You're not signed in</Text>
          <Text style={styles.guestSub}>
            Sign in to save your watchlist, continue watching, and get personalized recommendations.
          </Text>
          <TouchableOpacity style={styles.signInBtn} onPress={handleSignIn}>
            <Text style={styles.signInBtnText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About SoudFlex</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Streaming</Text>
            <Text style={styles.infoValue}>megaplay.buzz</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Anime Data</Text>
            <Text style={styles.infoValue}>AniList</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Movie Data</Text>
            <Text style={styles.infoValue}>TMDB</Text>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkText}>🏠  Home</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkText}>🎌  Browse Anime</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkText}>🎬  Browse Movies</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  pageTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    marginBottom: Spacing.xl,
  },
  guestCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primaryBorder,
  },
  avatarEmoji: { fontSize: 36 },
  guestTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  guestSub: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  signInBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  signInBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  section: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: { color: Colors.textSecondary, fontSize: FontSize.md },
  infoValue: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: '600' },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  linkText: { color: Colors.textPrimary, fontSize: FontSize.md },
  linkArrow: { color: Colors.textMuted, fontSize: FontSize.xl },
});
