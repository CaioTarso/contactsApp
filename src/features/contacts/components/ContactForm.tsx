import * as ImagePicker from "expo-image-picker";
import { Button, Image, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../../../constants/theme";
import { ContactImageFile } from "../../../types";

type ContactFormProps = {
  name: string;
  phone: string;
  profilePictureUri: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onProfilePictureChange: (value: ContactImageFile | null) => void;
  onSubmit: () => void;
  submitLabel: string;
  disabled?: boolean;
};

export default function ContactForm({
  name,
  phone,
  profilePictureUri,
  onNameChange,
  onPhoneChange,
  onProfilePictureChange,
  onSubmit,
  submitLabel,
  disabled = false,
}: ContactFormProps) {
  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];

    onProfilePictureChange({
      uri: asset.uri,
      name: asset.fileName ?? `profile-picture.${getExtensionFromMimeType(asset.mimeType)}`,
      type: asset.mimeType ?? "image/jpeg",
      file: Platform.OS === "web" ? asset.file ?? undefined : undefined,
    });
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome"
        value={name}
        onChangeText={onNameChange}
        style={styles.input}
      />

      <TextInput
        placeholder="Telefone"
        value={phone}
        onChangeText={onPhoneChange}
        style={styles.input}
      />

      <View style={styles.imageSection}>
        {profilePictureUri ? (
          <Image source={{ uri: profilePictureUri }} style={styles.preview} />
        ) : (
          <View style={styles.previewFallback}>
            <Text style={styles.previewFallbackText}>Sem foto</Text>
          </View>
        )}

        <Button title="Escolher imagem" onPress={() => void handlePickImage()} />
      </View>

      <Button title={submitLabel} onPress={onSubmit} disabled={disabled} />
    </View>
  );
}

function getExtensionFromMimeType(mimeType?: string | null) {
  if (!mimeType) {
    return "jpg";
  }

  const [, extension] = mimeType.split("/");
  return extension || "jpg";
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  imageSection: {
    gap: 12,
  },
  preview: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#ddd",
  },
  previewFallback: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e5e7eb",
  },
  previewFallbackText: {
    color: colors.muted,
    fontSize: 13,
  },
});
