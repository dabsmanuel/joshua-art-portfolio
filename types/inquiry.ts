export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  message: string;
  artworkId: string;
  artworkTitle: string;
  status: 'pending' | 'contacted' | 'closed';
  adminNote?: string;
  priority: 'low' | 'medium' | 'high';
  archived: boolean;
  tags: string[];
  followUpDate?: string;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryInput {
  name: string;
  email: string;
  message: string;
  artworkId: string;
  artworkTitle: string;
}

export interface InquiryResponse {
  message: string;
  inquiry: Inquiry;
}

export interface InquiriesResponse {
  success: boolean;
  message: string;
  inquiries: Inquiry[];
  pagination?: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}

export interface InquiryFilters {
  status?: 'all' | 'pending' | 'contacted' | 'closed';
  priority?: 'all' | 'low' | 'medium' | 'high';
  archived?: boolean;
  search?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}

export interface InquirySortOptions {
  sortBy: 'createdAt' | 'updatedAt' | 'name' | 'status' | 'priority';
  sortOrder: 'asc' | 'desc';
}

export interface InquiryStats {
  total: number;
  thisMonth: number;
  thisWeek: number;
  overdue: number;
  byStatus: {
    pending: number;
    contacted: number;
    closed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface BulkActionPayload {
  action: 'delete' | 'update-status' | 'archive';
  inquiryIds: string[];
  status?: 'pending' | 'contacted' | 'closed';
}

export interface UpdateInquiryPayload {
  status?: 'pending' | 'contacted' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  adminNote?: string;
  tags?: string[];
  followUpDate?: Date;
}


export interface InquiryResponse {
  success: boolean;
  message: string;
  inquiry: Inquiry;
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
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  overdue: number;
}

export interface UpdateStatusPayload {
  status: 'pending' | 'contacted' | 'closed';
}

export interface AddNotePayload {
  note: string;
}
