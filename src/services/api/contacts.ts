import { api } from "./client";
import { Contact, ContactImageFile, CreateContactRequest, UpdateContactRequest } from "../../types";
import { Platform } from "react-native";

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

function buildContactFormData(payload: CreateContactRequest | UpdateContactRequest) {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("phone", payload.phone);

  if (payload.profile_picture) {
    appendProfilePicture(formData, payload.profile_picture);
  }

  return formData;
}

function appendProfilePicture(formData: FormData, image: ContactImageFile) {
  if (Platform.OS === "web" && image.file) {
    formData.append("profile_picture", image.file);
    return;
  }

  formData.append("profile_picture", {
    uri: image.uri,
    name: image.name,
    type: image.type,
  } as never);
}

export async function getContacts(token: string) {
  const response = await api.get<Contact[]>("/contacts", {
    headers: authHeaders(token),
  });

  return response.data;
}

export async function createContact(token: string, payload: CreateContactRequest) {
  await api.post("/contacts", buildContactFormData(payload), {
    headers: authHeaders(token),
  });
}

export async function updateContact(token: string, contactId: number, payload: UpdateContactRequest) {
  await api.patch(`/contacts/${contactId}`, buildContactFormData(payload), {
    headers: authHeaders(token),
  });
}

export async function deleteContact(token: string, contactId: number) {
  await api.delete(`/contacts/${contactId}`, {
    headers: authHeaders(token),
  });
}
