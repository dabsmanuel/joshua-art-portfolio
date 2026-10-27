export interface ImageData {
  _id: string;
  id?: string;
  url: string;
  publicId: string;
  alt?: string;
  isPrimary: boolean;
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
    original_filename: string;
  };
}

export interface ArtworkImageData {
  _id: string;
  id?: string;
  url: string;
  publicId: string;
  alt?: string;
  isPrimary: boolean;
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
    original_filename: string;
  };
}

export interface ArtworkImagesResponse {
  message: string;
  images: ImageData[];
  primaryImage: ImageData | null;
  count: number;
}

export interface ArtworkResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  medium: string;
  dimensions: string;
  year: number;
  price: string | null;
  tags: string[];
  images: ArtworkImageData[];
  primaryImage: ArtworkImageData | null;
  // Note: featured and sold are mutually exclusive
  featured: boolean;
  sold: boolean;
  availableOnPrint: boolean;
  printSizes: { size: 'small' | 'large' | 'extra large'; price: string }[];
  slug: string;
  views: number;
  createdBy: { name: string; email: string } | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArtworkData {
  title: string;
  description: string;
  category: string;
  medium: string;
  dimensions: string;
  year: number;
  price: number;
  featured: boolean;
  sold: boolean;
  availableOnPrint: boolean;
  tags?: string[];
  printSizes?: { size: string; price: string }[];
}

export interface ArtworkUpdateData {
  title?: string;
  description?: string;
  category?: string;
  medium?: string;
  dimensions?: string;
  year?: number;
  price?: number;
  featured?: boolean;
  sold?: boolean;
  availableOnPrint?: boolean;
  tags?: string[];
  printSizes?: { size: string; price: string }[];
}

export interface ArtworkFilters {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  sold?: boolean;
  query?: string; 
}