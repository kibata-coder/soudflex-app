import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Download, X } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, Radius } from '../constants/theme';

export default function PlayerScreen() {
  const { url, title, subtitle } = useLocalSearchParams<{
    url: string;
    title: string;
    subtitle?: string;
  }>();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const player = useVideoPlayer(url || '', player => {
    player.loop = false;
    player.play();
  });

  const downloadContent = async () => {
    if (!url) return;
    
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow media library access to save downloads.');
        return;
      }

      setIsDownloading(true);
      const filename = `${title?.replace(/[^a-zA-Z0-9]/g, '_') || 'video'}.mp4`;
      const fileUri = FileSystem.documentDirectory + filename;
      
      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        }
      );

      const result = await downloadResumable.downloadAsync();
      if (result) {
        await MediaLibrary.saveToLibraryAsync(result.uri);
        Alert.alert('Success', 'Video downloaded to your gallery!');
      }
    } catch (error: any) {
      Alert.alert('Download Error', error.message);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
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

      <VideoView 
        player={player} 
        style={styles.video} 
        allowsFullscreen 
        allowsPictureInPicture 
        nativeControls 
      />

      {/* Top bar Overlay */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <X color="#fff" size={20} />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          {title && <Text style={styles.playerTitle} numberOfLines={1}>{title}</Text>}
          {subtitle && <Text style={styles.playerSubtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>

        <TouchableOpacity 
          style={styles.downloadBtn} 
          onPress={downloadContent}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Text style={styles.downloadText}>{Math.round(downloadProgress * 100)}%</Text>
          ) : (
            <Download color="#fff" size={20} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
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
    gap: Spacing.md,
    // Add gradient or dark background so text is readable over video
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  },
  downloadBtn: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  downloadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
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
