import api from "./authService";
import {ArtworkData, ArtworkUpdateData} from "../types/upload"

export const uploadService = {
  // Upload single image
  uploadSingleImage: async (imageFile: File): Promise<{
    message: string;
    image: ImageData & {
      optimized_url: string;
      thumbnail_url: string;
    };
  }> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple images
  uploadMultipleImages: async (imageFiles: File[]): Promise<{
    message: string;
    images: (ImageData & {
      optimized_url: string;
      thumbnail_url: string;
    })[];
    count: number;
  }> => {
    const formData = new FormData();
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete image from Cloudinary
  deleteImage: async (publicId: string): Promise<{
    message: string;
    public_id: string;
  }> => {
    const encodedPublicId = publicId.replace(/\//g, '--');
    const response = await api.delete(`/upload/${encodedPublicId}`);
    return response.data;
  },

  // Upload artwork-specific images
  uploadArtworkImages: async (
    imageFiles: File[], 
    artworkTitle?: string, 
    category?: string
  ): Promise<{
    message: string;
    images: (ImageData & {
      alt: string;
      isPrimary: boolean;
      optimized_url: string;
      thumbnail_url: string;
      metadata: {
        original_filename: string;
        width: number;
        height: number;
        format: string;
        size: number;
        category: string;
      };
    })[];
    count: number;
  }> => {
    const formData = new FormData();
    imageFiles.forEach(file => {
      formData.append('images', file);
    });
    
    if (artworkTitle) {
      formData.append('artworkTitle', artworkTitle);
    }
    if (category) {
      formData.append('category', category);
    }

    const response = await api.post('/upload/artwork-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get image information and URLs
  getImageInfo: async (publicId: string): Promise<{
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
  }> => {
    const encodedPublicId = publicId.replace(/\//g, '--');
    const response = await api.get(`/upload/image-info/${encodedPublicId}`);
    return response.data;
  },
};

// Helper functions for FormData creation
export const createArtworkFormData = (
  artworkData: ArtworkData,
  images?: File[]
): FormData => {
  const formData = new FormData();
  
  // Add text fields
  formData.append('title', artworkData.title);
  formData.append('description', artworkData.description);
  formData.append('category', artworkData.category);
  formData.append('medium', artworkData.medium);
  formData.append('dimensions', artworkData.dimensions);
  formData.append('year', artworkData.year.toString());
  formData.append('price', artworkData.price.toString());
  formData.append('featured', artworkData.featured.toString());
  formData.append('sold', artworkData.sold.toString());
  formData.append('availableOnPrint', artworkData.availableOnPrint.toString());
  
  // Add tags as JSON string or comma-separated values
  if (artworkData.tags && artworkData.tags.length > 0) {
    formData.append('tags', artworkData.tags.join(','));
  }
  
  // Add print sizes as JSON string
  if (artworkData.printSizes && artworkData.printSizes.length > 0) {
    formData.append('printSizes', JSON.stringify(artworkData.printSizes));
  }
  
  // Add images
  if (images && images.length > 0) {
    images.forEach(image => {
      formData.append('images', image);
    });
  }
  
  return formData;
};

export const createArtworkUpdateFormData = (
  artworkData: ArtworkUpdateData,
  newImages?: File[],
  keepExistingImages: boolean = true
): FormData => {
  const formData = new FormData();
  
  // Add text fields if they exist
  if (artworkData.title) formData.append('title', artworkData.title);
  if (artworkData.description) formData.append('description', artworkData.description);
  if (artworkData.category) formData.append('category', artworkData.category);
  if (artworkData.medium) formData.append('medium', artworkData.medium);
  if (artworkData.dimensions) formData.append('dimensions', artworkData.dimensions);
  if (artworkData.year) formData.append('year', artworkData.year.toString());
  if (artworkData.price !== undefined) formData.append('price', artworkData.price.toString());
  if (artworkData.featured !== undefined) formData.append('featured', artworkData.featured.toString());
  if (artworkData.sold !== undefined) formData.append('sold', artworkData.sold.toString());
  if (artworkData.availableOnPrint !== undefined) formData.append('availableOnPrint', artworkData.availableOnPrint.toString());
  
  // Add tags if they exist
  if (artworkData.tags && artworkData.tags.length > 0) {
    formData.append('tags', artworkData.tags.join(','));
  }
  
  // Add print sizes if they exist
  if (artworkData.printSizes && artworkData.printSizes.length > 0) {
    formData.append('printSizes', JSON.stringify(artworkData.printSizes));
  }
  
  // Add flag for keeping existing images
  formData.append('keepExistingImages', keepExistingImages.toString());
  
  // Add new images
  if (newImages && newImages.length > 0) {
    newImages.forEach(image => {
      formData.append('newImages', image);
    });
  }
  
  return formData;
};