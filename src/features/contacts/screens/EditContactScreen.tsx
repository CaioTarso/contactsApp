import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { colors } from "../../../constants/theme";
import { getSingleParam } from "../../../navigation/params";
import { routes } from "../../../navigation/routes";
import { updateContact } from "../../../services/api/contacts";
import ContactForm from "../components/ContactForm";

export default function EditContactScreen() {
  const params = useLocalSearchParams<{
    token?: string | string[];
    id?: string | string[];
    name?: string | string[];
    phone?: string | string[];
  }>();

  const token = getSingleParam(params.token);
  const rawId = getSingleParam(params.id);
  const initialName = getSingleParam(params.name) ?? "";
  const initialPhone = getSingleParam(params.phone) ?? "";
  const [name, setName] = useState<string>(initialName);
  const [phone, setPhone] = useState<string>(initialPhone);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  async function handleUpdate() {
    const contactId = Number(rawId);

    if (!token || !rawId || Number.isNaN(contactId)) {
      Alert.alert("Sessao invalida", "Volte para a lista e tente novamente.");
      router.replace(routes.home);
      return;
    }

    if (!name.trim() || !phone.trim()) {
      Alert.alert("Campos obrigatorios", "Preencha nome e telefone.");
      return;
    }

    try {
      setIsSaving(true);

      await updateContact(token, contactId, {
        name: name.trim(),
        phone: phone.trim(),
      });

      Alert.alert("Contato atualizado", "As informacoes foram salvas.");
      router.back();
    } catch {
      Alert.alert("Erro", "Nao foi possivel atualizar o contato.");
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
          onNameChange={setName}
          onPhoneChange={setPhone}
          onSubmit={handleUpdate}
          submitLabel="Salvar alteracoes"
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
