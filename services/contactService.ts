import api from "./authService"; // Assuming this is the same axios instance
import { ContactInput, ContactResponse, ContactsResponse, UpdateContactInput } from "../types/contact";

// Contact service with API methods
export const contactService = {
  // Create a new contact inquiry
  createContact: async (contactData: ContactInput): Promise<ContactResponse> => {
    const response = await api.post<ContactResponse>('/contacts', contactData);
    return response.data;
  },

  // Get all contact inquiries (admin only)
  getAllContacts: async (): Promise<ContactsResponse> => {
    const response = await api.get<ContactsResponse>('/contacts');
    return response.data;
  },

  // Update contact inquiry status or response (admin only)
  updateContact: async (id: string, updateData: UpdateContactInput): Promise<ContactResponse> => {
    const response = await api.put<ContactResponse>(`/contacts/${id}`, updateData);
    return response.data;
  },
};
