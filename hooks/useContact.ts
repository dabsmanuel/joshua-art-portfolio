
// React Query hooks for contact service
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '../services/contactService';
import { ContactInput, ContactResponse, ContactsResponse, UpdateContactInput } from '../types/contact';
import { toast } from 'react-hot-toast';
import { handleApiError } from '../utils/errorHandler';

// Query keys for cache management
export const contactQueryKeys = {
  all: ['contacts'] as const,
  single: (id: string) => ['contact', id] as const,
};

// Hook to create a new contact inquiry
export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation<ContactResponse, Error, ContactInput>({
    mutationFn: contactService.createContact,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contactQueryKeys.all });
      toast.success('Contact inquiry submitted successfully!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    },
  });
};

// Hook to fetch all contact inquiries (admin only)
export const useGetAllContacts = () => {
  return useQuery<ContactsResponse, Error>({
    queryKey: contactQueryKeys.all,
    queryFn: contactService.getAllContacts,
    enabled: true, 
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as any).response?.status === 401
      ) {
        return false;
      }
      return true;
    },
  });
};

// Hook to update a contact inquiry (admin only)
export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation<ContactResponse, Error, { id: string; data: UpdateContactInput }>({
    mutationFn: ({ id, data }) => contactService.updateContact(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contactQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: contactQueryKeys.single(data.contact._id) });
      toast.success('Contact inquiry updated successfully!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    },
  });
};

// Combined contact hook for convenience
export const useContact = () => {
  const { data: contacts, isLoading: contactsLoading, error: contactsError } = useGetAllContacts();
  const createContactMutation = useCreateContact();
  const updateContactMutation = useUpdateContact();

  return {
    // Contact data
    contacts: contacts?.contacts || [],
    
    // Loading states
    isLoading: contactsLoading,
    isCreateLoading: createContactMutation.isPending,
    isUpdateLoading: updateContactMutation.isPending,
    
    // Error states
    contactsError,
    createError: createContactMutation.error,
    updateError: updateContactMutation.error,
    
    // Mutation functions
    createContact: createContactMutation.mutate,
    updateContact: updateContactMutation.mutate,
    
    // Async versions for use in event handlers
    createContactAsync: createContactMutation.mutateAsync,
    updateContactAsync: updateContactMutation.mutateAsync,
  };
};