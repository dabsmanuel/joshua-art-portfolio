import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inquiryService, BulkActionPayload, UpdateStatusPayload, AddNotePayload } from '../services/inquiriesService';
import { InquiryInput, InquiryResponse, InquiriesResponse } from '../types/inquiry';

// Query keys for cache management
const INQUIRY_KEYS = {
  all: ['inquiries'] as const,
  single: (inquiryId: string) => ['inquiry', inquiryId] as const,
  stats: ['inquiries', 'stats'] as const,
  filtered: (filters: Record<string, any>) => ['inquiries', 'filtered', filters] as const,
};

// Hook to create a new inquiry
export const useCreateInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation<InquiryResponse, Error, InquiryInput>({
    mutationFn: inquiryService.createInquiry,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: INQUIRY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: INQUIRY_KEYS.stats });
    },
    onError: (error) => {
      console.error('Error creating inquiry:', error);
    },
  });
};

// Hook to fetch all inquiries (admin only)
export const useGetAllInquiries = (params?: {
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery<InquiriesResponse, Error>({
    queryKey: params ? INQUIRY_KEYS.filtered(params) : INQUIRY_KEYS.all,
    queryFn: () => inquiryService.getAllInquiries(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to fetch single inquiry
export const useGetInquiry = (inquiryId: string) => {
  return useQuery<InquiryResponse, Error>({
    queryKey: INQUIRY_KEYS.single(inquiryId),
    queryFn: () => inquiryService.getInquiryById(inquiryId),
    enabled: !!inquiryId,
  });
};

// Hook to update inquiry status
export const useUpdateInquiryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<InquiryResponse, Error, { inquiryId: string; statusData: UpdateStatusPayload }>({
    mutationFn: ({ inquiryId, statusData }) => inquiryService.updateInquiryStatus(inquiryId, statusData),
    onSuccess: (data, variables) => {
      // Update the specific inquiry in cache
      queryClient.invalidateQueries({ queryKey: INQUIRY_KEYS.single(variables.inquiryId) });
      // Update the list of inquiries
      queryClient.invalidateQueries({ queryKey: INQUIRY_KEYS.all });
      // Update stats
      queryClient.invalidateQueries({ queryKey: INQUIRY_KEYS.stats });
    },
    onError: (error) => {
      console.error('Error updating inquiry status:', error);
    },
  });
};

// Hook to add note to inquiry
export const useAddInquiryNote = () => {
  const queryClient = useQueryClient();

  return useMutation<InquiryResponse, Error, { inquiryId: string; noteData: AddNotePayload }>({
    mutationFn: ({ inquiryId, noteData }) => inquiryService.addInquiryNote(inquiryId, noteData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: INQUIRY_KEYS.single(variables.inquiryId) });
      queryClient.invalidateQueries({ queryKey: INQUIRY_KEYS.all });
    },
    onError: (error) => {
      console.error('Error adding inquiry note:', error);
    },
  });
};

// Hook to delete inquiry
export const useDeleteInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation<InquiryResponse, Error, string>({
    mutationFn: (inquiryId: string) => inquiryService.deleteInquiry(inquiryId),
    onSuccess: (data, inquiryId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: INQUIRY_KEYS.single(inquiryId) });
      // Update the list
      queryClient.invalidateQueries({ queryKey: INQUIRY_KEYS.all });
      // Update stats
      queryClient.invalidateQueries({ queryKey: INQUIRY_KEYS.stats });
    },
    onError: (error) => {
      console.error('Error deleting inquiry:', error);
    },
  });
};

// Hook for bulk actions
export const useBulkInquiryAction = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, BulkActionPayload>({
    mutationFn: (payload: BulkActionPayload) => inquiryService.bulkAction(payload),
    onSuccess: () => {
      // Invalidate all inquiry-related queries
      queryClient.invalidateQueries({ queryKey: INQUIRY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: INQUIRY_KEYS.stats });
    },
    onError: (error) => {
      console.error('Error performing bulk action:', error);
    },
  });
};

// Hook to get inquiry statistics
export const useInquiryStats = () => {
  return useQuery({
    queryKey: INQUIRY_KEYS.stats,
    queryFn: inquiryService.getInquiryStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to export inquiries
export const useExportInquiries = () => {
  return useMutation<Blob, Error, { status?: string; startDate?: string; endDate?: string }>({
    mutationFn: (params) => inquiryService.exportInquiries(params),
    onSuccess: (blob) => {
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inquiries-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Error exporting inquiries:', error);
    },
  });
};