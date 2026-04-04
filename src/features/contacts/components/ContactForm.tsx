import { Button, StyleSheet, TextInput, View } from "react-native";
import { colors } from "../../../constants/theme";

type ContactFormProps = {
  name: string;
  phone: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  disabled?: boolean;
};

export default function ContactForm({
  name,
  phone,
  onNameChange,
  onPhoneChange,
  onSubmit,
  submitLabel,
  disabled = false,
}: ContactFormProps) {
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

      <Button title={submitLabel} onPress={onSubmit} disabled={disabled} />
    </View>
  );
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
});
