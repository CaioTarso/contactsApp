export type Contact = {
  id: number;
  name: string;
  phone: string;
  profile_picture_url?: string | null;
};

export type ContactImageFile = {
  uri: string;
  name: string;
  type: string;
  file?: File;
};

export type CreateContactRequest = {
  name: string;
  phone: string;
  profile_picture?: ContactImageFile;
};

export type UpdateContactRequest = {
  name: string;
  phone: string;
  profile_picture?: ContactImageFile;
};
