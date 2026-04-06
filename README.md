# Contacts App

Aplicativo mobile de lista de contatos com `Expo`, `React Native` e `expo-router`.

## Rodando o projeto

1. Instale as dependencias

```bash
npm install
```

2. Configure o `.env`

Exemplo atual:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.12:3000
```

Use o IP local da maquina onde sua API esta rodando.

3. Inicie o app

```bash
npm start
```

## Estrutura

```text
app/
  _layout.tsx
  index.tsx
  auth/
    index.tsx
    register.tsx
  protected/
    contacts.tsx
    create-contact.tsx
    edit-contact.tsx
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

## Rotas

- `/` redireciona para `/auth`
- `/auth`: login
- `/auth/register`: cadastro
- `/protected/contacts`: lista de contatos
- `/protected/create-contact`: criar contato
- `/protected/edit-contact`: editar contato

## API

A URL da API vem da variavel abaixo:

```env
EXPO_PUBLIC_API_URL=http://seuip:3000
```

### Quando usar IP local

- No navegador e no iPhone com Expo Go, `localhost` normalmente nao funciona como voce espera
- Use o IP local da maquina na mesma rede Wi-Fi
- Exemplo: `http://seuip:3000`



Tambem confirme:

- computador e celular na mesma rede
- CORS liberado para o frontend
- firewall liberando a porta `3000`

## Observacoes

- Se mudar o valor do `.env`, reinicie o Expo
