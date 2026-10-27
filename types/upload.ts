export interface ImageData {
  publicId: string;
  url: string;
  // Additional fields that may be returned by the API
  alt?: string;
  isPrimary?: boolean;
}

export interface ArtworkResponse {
  id: string;
  title: string;
  description?: string;
  category?: string;
  images: ImageData[];
  primaryImage?: ImageData | null;
  featured?: boolean;
  sold?: boolean;
  medium?: string;
  dimensions?: string;
  year?: number;
  price?: number;
  availableOnPrint?: boolean;
  tags?: string[];
  printSizes?: string[];
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
  printSizes?: string[];
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
  printSizes?: string[];
}

export interface UploadQueryKeys {
  all: string[];
  imageInfo: (publicId: string) => (string | undefined)[];
}

export interface UploadArtworkImagesInput {
  imageFiles: File[];
  artworkTitle: string;
  category: string;
}

export interface ImageInfoResponse {
  message: string;
  image: {
    public_id: string;
    original_url: string;
    thumbnail_url: string;
    small_url: string;
    medium_url: string;
    large_url: string;
    gallery_thumb: string;
    gallery_medium: string;
  };
}

export interface UseImageInfoResult<TError = unknown> {
  data: ImageInfoResponse | undefined;
  error: TError | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => void;
}