import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Voltar" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ title: "Cadastro" }} />
      <Stack.Screen name="protected/contacts" options={{ title: "Contatos" }} />
      <Stack.Screen name="protected/create-contact" options={{ title: "Novo contato" }} />
      <Stack.Screen name="protected/edit-contact" options={{ title: "Editar contato" }} />
    </Stack>
  );
}
