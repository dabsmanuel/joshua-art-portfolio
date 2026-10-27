export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType: string;
  status?: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType: string;
}

export interface UpdateContactInput {
  status?: string;
  response?: string;
}

export interface ContactResponse {
  message: string;
  contact: Contact;
}

export interface ContactsResponse {
  message: string;
  contacts: Contact[];
}