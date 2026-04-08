import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { colors } from "../../../constants/theme";
import { getSingleParam } from "../../../navigation/params";
import { resolveApiUrl } from "../../../services/api/client";

const callVideo = require("../../../../assets/video/ScreenRecording_04-06-2026 22-24-29_1.mov");

export default function CallScreen() {
  const params = useLocalSearchParams<{
    name?: string | string[];
    phone?: string | string[];
    profilePictureUrl?: string | string[];
  }>();

  const name = getSingleParam(params.name) ?? "Contato";
  const phone = getSingleParam(params.phone) ?? "";
  const profilePictureUrl = resolveApiUrl(getSingleParam(params.profilePictureUrl));
  const [showVideo, setShowVideo] = useState(false);

  const player = useVideoPlayer(callVideo, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
    videoPlayer.currentTime = 0;
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowVideo(true);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      try {
        player.pause();
      } catch {
      }
    };
  }, [player]);

  useEffect(() => {
    if (!showVideo) {
      return;
    }

    const playbackTimeout = setTimeout(() => {
      player.currentTime = 0;
      player.play();
    }, 150);

    return () => {
      clearTimeout(playbackTimeout);
    };
  }, [player, showVideo]);

  return (
    <View style={styles.container}>
      {showVideo ? (
        <View style={styles.videoContainer}>
          <Text style={styles.videoTitle}>Chamada em andamento</Text>
          <VideoView player={player} style={styles.video} nativeControls={false} playsInline />
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          {profilePictureUrl ? (
            <Image source={{ uri: profilePictureUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{name.charAt(0).toUpperCase()}</Text>
            </View>
          )}

          <Text style={styles.title}>Ligando para {name}...</Text>
          {phone ? <Text style={styles.subtitle}>{phone}</Text> : null}
          <ActivityIndicator size="large" style={styles.loader} />
          <Text style={styles.helper}>chamando...</Text>
        </View>
      )}

      <Pressable style={styles.hangupButton} onPress={() => router.back()}>
        <Text style={styles.hangupButtonText}>Desligar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 24,
    justifyContent: "center",
  },
  loadingContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    marginBottom: 20,
    backgroundColor: "#1f2937",
  },
  avatarFallback: {
    width: 112,
    height: 112,
    borderRadius: 56,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#172554",
  },
  avatarFallbackText: {
    color: "#bfdbfe",
    fontSize: 36,
    fontWeight: "700",
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  loader: {
    marginTop: 28,
  },
  helper: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 16,
    textAlign: "center",
  },
  videoContainer: {
    gap: 16,
    paddingBottom: 88,
  },
  videoTitle: {
    color: colors.background,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  video: {
    width: "100%",
    aspectRatio: 9 / 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  hangupButton: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dc2626",
    zIndex: 10,
    elevation: 10,
  },
  hangupButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
