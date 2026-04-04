import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { routes } from "../../../navigation/routes";
import { login } from "../../../services/api/auth";
import { colors } from "../../../constants/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos obrigatorios", "Preencha email e senha para continuar.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await login({
        email: email.trim(),
        password,
      });

      router.push({
        pathname: routes.contacts,
        params: { token: response.token },
      });
    } catch {
      Alert.alert("Erro no login", "Nao foi possivel entrar. Confira suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de contatos</Text>
      <Text style={styles.subtitle}>Entre para visualizar e cadastrar contatos.</Text>

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

      {isLoading ? <ActivityIndicator size="small" /> : <Button title="Entrar" onPress={handleLogin} />}

      <Button title="Criar conta" onPress={() => router.push(routes.register)} />
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
