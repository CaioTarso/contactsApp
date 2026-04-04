import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Button, FlatList, Platform, RefreshControl, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/theme";
import { getSingleParam } from "../../../navigation/params";
import { routes } from "../../../navigation/routes";
import { deleteContact, getContacts } from "../../../services/api/contacts";
import { Contact } from "../../../types";

export default function ContactsScreen() {
  const params = useLocalSearchParams<{ token?: string | string[] }>();
  const token = getSingleParam(params.token);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [deletingContactId, setDeletingContactId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchContacts = useCallback(async () => {
    if (!token) {
      setErrorMessage("Token nao encontrado. Faca login novamente.");
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      setErrorMessage("");
      const data = await getContacts(token);
      setContacts(data);
    } catch {
      setErrorMessage("Nao foi possivel carregar seus contatos.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchContacts();
    }, [fetchContacts])
  );

  function handleRefresh() {
    setIsRefreshing(true);
    fetchContacts();
  }

  function handleCreateContact() {
    router.push({
      pathname: routes.createContact,
      params: { token },
    });
  }

  function handleEditContact(contact: Contact) {
    router.push({
      pathname: routes.editContact,
      params: {
        token,
        id: contact.id.toString(),
        name: contact.name,
        phone: contact.phone,
      },
    });
  }

  function handleDeleteContact(contact: Contact) {
    if (!token) {
      Alert.alert("Sessao invalida", "Faca login novamente.");
      return;
    }

    const confirmDelete = async () => {
      try {
        setDeletingContactId(contact.id);
        await deleteContact(token, contact.id);
        await fetchContacts();
      } catch {
        Alert.alert("Erro", "Nao foi possivel excluir o contato.");
      } finally {
        setDeletingContactId(null);
      }
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm(`Deseja remover ${contact.name}?`);

      if (confirmed) {
        void confirmDelete();
      }

      return;
    }

    Alert.alert("Excluir contato", `Deseja remover ${contact.name}?`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => void confirmDelete(),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Button title="Adicionar contato" onPress={handleCreateContact} />

      {isLoading ? <ActivityIndicator size="large" style={styles.loader} /> : null}

      {!isLoading && errorMessage ? <Text style={styles.message}>{errorMessage}</Text> : null}

      {!isLoading && !errorMessage && contacts.length === 0 ? (
        <Text style={styles.message}>Nenhum contato cadastrado ainda.</Text>
      ) : null}

      {!isLoading && !errorMessage ? (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={contacts}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.phone}>{item.phone}</Text>
              <View style={styles.actions}>
                <Button title="Editar" onPress={() => handleEditContact(item)} />
                <Button
                  title={deletingContactId === item.id ? "Excluindo..." : "Excluir"}
                  color="#c62828"
                  onPress={() => handleDeleteContact(item)}
                  disabled={deletingContactId === item.id}
                />
              </View>
            </View>
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
    gap: 16,
  },
  loader: {
    marginTop: 24,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.softBorder,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.card,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
    color: colors.text,
  },
  phone: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 12,
  },
  message: {
    marginTop: 24,
    textAlign: "center",
    color: colors.muted,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
});
