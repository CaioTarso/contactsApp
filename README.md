# Contacts App

Aplicativo mobile de lista de contatos com `Expo`, `React Native` e `expo-router`.

## Rodando o projeto

1. Instale as dependencias

```bash
npm install
```

2. Inicie o app

```bash
npm start
```

## Estrutura

```text
app/
  _layout.tsx
  index.tsx
  contacts.tsx
  create-contact.tsx
src/
  constants/
  features/
    auth/
    contacts/
  navigation/
  services/
  types/
```

## Organizacao adotada

- `app/`: apenas rotas do `expo-router`
- `src/features/`: telas e regras separadas por dominio
- `src/services/`: comunicacao com a API
- `src/types/`: tipos compartilhados
- `src/constants/`: valores visuais e configuracoes reutilizaveis

## API

Por padrao a base da API fica em:

- Android emulator: `http://10.0.2.2:3000`
- Outras plataformas: `http://localhost:3000`

Para usar outro endereco, defina:

```bash
EXPO_PUBLIC_API_URL=http://SEU_IP:3000
```
