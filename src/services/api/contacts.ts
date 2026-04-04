import { api } from "./client";
import { Contact, CreateContactRequest, UpdateContactRequest } from "../../types";

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getContacts(token: string) {
  const response = await api.get<Contact[]>("/contacts", {
    headers: authHeaders(token),
  });

  return response.data;
}

export async function createContact(token: string, payload: CreateContactRequest) {
  await api.post("/contacts", payload, {
    headers: authHeaders(token),
  });
}

export async function updateContact(token: string, contactId: number, payload: UpdateContactRequest) {
  await api.patch(`/contacts/${contactId}`, payload, {
    headers: authHeaders(token),
  });
}

export async function deleteContact(token: string, contactId: number) {
  await api.delete(`/contacts/${contactId}`, {
    headers: authHeaders(token),
  });
}
