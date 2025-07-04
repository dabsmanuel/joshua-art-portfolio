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
  category: 'portraits' | 'landscapes' | 'still-life' | 'sketches';
  medium: string;
  dimensions: string;
  year: number;
  description: string;
  tags: string[];
  featured: boolean;
  sold: boolean;
  price?: string;
  images?: ImageData[];
  primaryImage?: ImageData | null;
  availableOnPrint: boolean;
  printSizes: { size: string; price: string }[];
  // Additional properties from your response
  createdAt?: string;
  createdBy?: string;
  isActive?: boolean;
  slug?: string;
  updatedAt?: string;
  views?: number;
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