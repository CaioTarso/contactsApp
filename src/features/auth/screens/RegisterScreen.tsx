import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../../../constants/theme";
import { routes } from "../../../navigation/routes";
import { register } from "../../../services/api/auth";

export default function RegisterScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleRegister() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos obrigatorios", "Preencha email e senha para cadastrar.");
      return;
    }

    try {
      setIsLoading(true);

      await register({
        email: email.trim(),
        password,
      });

      Alert.alert("Cadastro criado", "Agora voce ja pode fazer login.");
      router.replace(routes.home);
    } catch {
      Alert.alert("Erro no cadastro", "Nao foi possivel criar sua conta.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
      <Text style={styles.subtitle}>Cadastre seu usuario para acessar sua agenda.</Text>

      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        value={email}
      />
      <TextInput
        onChangeText={setPassword}
        placeholder="Senha"
        secureTextEntry
        style={styles.input}
        value={password}
      />

      {isLoading ? <ActivityIndicator size="small" /> : <Button title="Cadastrar" onPress={handleRegister} />}

      <Button title="Voltar para login" onPress={() => router.replace(routes.home)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
});
