import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { colors } from "../../../constants/theme";
import { getSingleParam } from "../../../navigation/params";
import { routes } from "../../../navigation/routes";
import { createContact } from "../../../services/api/contacts";
import { ContactImageFile } from "../../../types";
import ContactForm from "../components/ContactForm";

export default function CreateContactScreen() {
  const params = useLocalSearchParams<{ token?: string | string[] }>();
  const token = getSingleParam(params.token);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<ContactImageFile | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  async function handleCreate() {
    if (!token) {
      Alert.alert("Sessao invalida", "Faca login novamente.");
      router.replace(routes.home);
      return;
    }

    if (!name.trim() || !phone.trim()) {
      Alert.alert("Campos obrigatorios", "Preencha nome e telefone.");
      return;
    }

    try {
      setIsSaving(true);

      await createContact(token, {
        name: name.trim(),
        phone: phone.trim(),
        profile_picture: profilePicture ?? undefined,
      });

      Alert.alert("Sucesso", "Contato criado!");
      router.back();
    } catch {
      Alert.alert("Erro", "Nao foi possivel criar o contato");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      {isSaving ? (
        <ActivityIndicator size="small" />
      ) : (
        <ContactForm
          name={name}
          phone={phone}
          profilePictureUri={profilePicture?.uri ?? ""}
          onNameChange={setName}
          onPhoneChange={setPhone}
          onProfilePictureChange={setProfilePicture}
          onSubmit={handleCreate}
          submitLabel="Salvar"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
});
