import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Button, FlatList, Image, Platform, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/theme";
import { getSingleParam } from "../../../navigation/params";
import { routes } from "../../../navigation/routes";
import { resolveApiUrl } from "../../../services/api/client";
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
        profilePictureUrl: resolveApiUrl(contact.profile_picture_url),
      },
    });
  }

  function handleCallContact(contact: Contact) {
    router.push({
      pathname: routes.call,
      params: {
        name: contact.name,
        phone: contact.phone,
        profilePictureUrl: resolveApiUrl(contact.profile_picture_url),
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
          renderItem={({ item }) => {
            const imageUri = resolveApiUrl(item.profile_picture_url);

            return (
              <View style={styles.card}>
                <Pressable style={styles.pressableArea} onPress={() => handleCallContact(item)}>
                  <View style={styles.header}>
                    {imageUri ? (
                      <Image source={{ uri: imageUri }} style={styles.avatar} />
                    ) : (
                      <View style={styles.avatarFallback}>
                        <Text style={styles.avatarFallbackText}>{item.name.charAt(0).toUpperCase()}</Text>
                      </View>
                    )}

                    <View style={styles.headerText}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.phone}>{item.phone}</Text>
                      <Text style={styles.callHint}>Toque para iniciar a ligacao</Text>
                    </View>
                  </View>
                </Pressable>

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
            );
          }}
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
  pressableArea: {
    margin: -4,
    padding: 4,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#ddd",
  },
  avatarFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1d4ed8",
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
  },
  callHint: {
    fontSize: 13,
    color: "#2563eb",
    marginTop: 8,
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
