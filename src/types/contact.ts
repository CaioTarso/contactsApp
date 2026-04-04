export type Contact = {
  id: number;
  name: string;
  phone: string;
};

export type CreateContactRequest = {
  name: string;
  phone: string;
};

export type UpdateContactRequest = {
  name: string;
  phone: string;
};
