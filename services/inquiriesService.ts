import api from "./authService"; // Assuming this is the same axios instance
import { Inquiry, InquiryInput, InquiryResponse, InquiriesResponse } from "../types/inquiry";

export interface BulkActionPayload {
  action: 'delete' | 'update-status' | 'archive';
  inquiryIds: string[];
  status?: 'pending' | 'contacted' | 'closed';
}

export interface InquiryStats {
  total: number;
  thisMonth: number;
  thisWeek: number;
  byStatus: {
    pending: number;
    contacted: number;
    closed: number;
  };
}

export interface UpdateStatusPayload {
  status: 'pending' | 'contacted' | 'closed';
}

export interface AddNotePayload {
  note: string;
}

export const inquiryService = {
  // Create a new inquiry
  createInquiry: async (inquiryData: InquiryInput): Promise<InquiryResponse> => {
    const response = await api.post<InquiryResponse>('/inquiries', inquiryData);
    return response.data;
  },

  // Get all inquiries with optional filters
  getAllInquiries: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<InquiriesResponse> => {
    const response = await api.get<InquiriesResponse>('/inquiries', { params });
    return response.data;
  },

  // Get single inquiry by ID
  getInquiryById: async (inquiryId: string): Promise<InquiryResponse> => {
    const response = await api.get<InquiryResponse>(`/inquiries/${inquiryId}`);
    return response.data;
  },

  // Update inquiry status
  updateInquiryStatus: async (inquiryId: string, statusData: UpdateStatusPayload): Promise<InquiryResponse> => {
    const response = await api.put<InquiryResponse>(`/inquiries/${inquiryId}/status`, statusData);
    return response.data;
  },

  // Add note to inquiry
  addInquiryNote: async (inquiryId: string, noteData: AddNotePayload): Promise<InquiryResponse> => {
    const response = await api.put<InquiryResponse>(`/inquiries/${inquiryId}/note`, noteData);
    return response.data;
  },

  // Delete inquiry
  deleteInquiry: async (inquiryId: string): Promise<InquiryResponse> => {
    const response = await api.delete<InquiryResponse>(`/inquiries/${inquiryId}`);
    return response.data;
  },

  // Bulk actions
  bulkAction: async (payload: BulkActionPayload): Promise<{
    message: string;
    affected: number;
    result: any;
  }> => {
    const response = await api.post('/inquiries/bulk-actions', payload);
    return response.data;
  },

  // Get inquiry statistics
  getInquiryStats: async (): Promise<{
    message: string;
    stats: InquiryStats;
  }> => {
    const response = await api.get('/inquiries/stats/summary');
    return response.data;
  },

  // Export inquiries to CSV
  exportInquiries: async (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> => {
    const response = await api.get('/inquiries/export/csv', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }
};