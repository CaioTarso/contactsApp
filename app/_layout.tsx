import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Voltar" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: "Cadastro" }} />
      <Stack.Screen name="contacts" options={{ title: "Contatos" }} />
      <Stack.Screen name="create-contact" options={{ title: "Novo contato" }} />
      <Stack.Screen name="edit-contact" options={{ title: "Editar contato" }} />
    </Stack>
  );
}
