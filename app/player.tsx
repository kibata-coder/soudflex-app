import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, Radius } from '../constants/theme';

export default function PlayerScreen() {
  const { url, title, subtitle } = useLocalSearchParams<{
    url: string;
    title: string;
    subtitle?: string;
  }>();
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showControls = () => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 4000);
  };

  if (!url) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No video URL provided.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* WebView — MegaPlay embedded player */}
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={styles.webview}
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        javaScriptEnabled
        domStorageEnabled
        onTouchStart={showControls}
        userAgent={
          Platform.OS === 'android'
            ? 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36'
            : undefined
        }
      />

      {/* Overlay controls */}
      {controlsVisible && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.controlsOverlay}
          onPress={showControls}
        >
          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => router.back()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              {title && <Text style={styles.playerTitle} numberOfLines={1}>{title}</Text>}
              {subtitle && <Text style={styles.playerSubtitle} numberOfLines={1}>{subtitle}</Text>}
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  controlsOverlay: {
    position: 'absolute',
    inset: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    backgroundColor: 'rgba(0,0,0,0)',
    gap: Spacing.md,
    // Gradient-like top overlay
    backgroundImage: undefined,
  },
  closeBtn: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexShrink: 0,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  titleContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  playerTitle: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  playerSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  safe: { flex: 1, backgroundColor: '#000' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.lg },
  errorText: { color: Colors.error, fontSize: FontSize.md },
  backBtn: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  backBtnText: { color: Colors.textPrimary, fontWeight: '600', fontSize: FontSize.md },
});
