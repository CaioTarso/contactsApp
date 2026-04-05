export const routes = {
  home: "/",
  auth: "/auth",
  register: "/auth/register",
  contacts: "/protected/contacts",
  createContact: "/protected/create-contact",
  editContact: "/protected/edit-contact",
} as const;
