import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { artworkService } from '../services/artworkService';
import { handleApiError } from '../utils/errorHandler';
import { toast } from 'react-hot-toast';
import { ArtworkResponse, ArtworkFilters } from '../types/artwork';
import type { ArtworkImageData } from '../types/artwork';

// Query keys for cache management
export const artworkQueryKeys = {
  all: ['artworks'] as const,
  lists: () => [...artworkQueryKeys.all, 'list'] as const,
  list: (filters: ArtworkFilters) => [...artworkQueryKeys.lists(), { filters }] as const,
  details: () => [...artworkQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...artworkQueryKeys.details(), id] as const,
  featured: () => [...artworkQueryKeys.all, 'featured'] as const,
  category: (category: string) => [...artworkQueryKeys.all, 'category', category] as const,
  search: (query: string) => [...artworkQueryKeys.all, 'search', query] as const,
  images: (id: string) => [...artworkQueryKeys.detail(id), 'images'] as const,
};

// Custom hook for creating artwork
export const useCreateArtwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: artworkService.createArtwork,
    onSuccess: (data: ArtworkResponse) => {
      // Invalidate and refetch artwork lists
      queryClient.invalidateQueries({ queryKey: artworkQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: artworkQueryKeys.featured() });
      
      // Add the new artwork to cache
      queryClient.setQueryData(artworkQueryKeys.detail(data.id), data);
      
      toast.success('Artwork created successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(error as any);
      toast.error(errorMessage);
    },
  });
};

// Custom hook for getting all artworks with filters
export const useArtworks = (filters: ArtworkFilters = {}) => {
  return useQuery({
    queryKey: artworkQueryKeys.list(filters),
    queryFn: () => artworkService.getAllArtworks(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Custom hook for getting single artwork
export const useArtwork = (id: string) => {
  return useQuery({
    queryKey: artworkQueryKeys.detail(id),
    queryFn: () => artworkService.getArtworkById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Custom hook for updating artwork
export const useUpdateArtwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, artworkData }: { id: string; artworkData: FormData }) => {
      console.log('Updating artwork with ID:', id);
      console.log('FormData entries:', Array.from(artworkData.entries()));
      return artworkService.updateArtwork(id, artworkData);
    },
    onSuccess: (data: ArtworkResponse, variables: { id: string; artworkData: FormData }) => {
      queryClient.setQueryData(artworkQueryKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: artworkQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: artworkQueryKeys.featured() });
      toast.success('Artwork updated successfully!');
    },
    onError: (error: unknown) => {
      console.error('Update artwork error:', error);
      const errorMessage = handleApiError(error as any);
      toast.error(errorMessage);
    },
  });
};

// Custom hook for deleting artwork
export const useDeleteArtwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: artworkService.deleteArtwork,
    onSuccess: (_data: { message: string }, artworkId: string) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: artworkQueryKeys.detail(artworkId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: artworkQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: artworkQueryKeys.featured() });
      
      toast.success('Artwork deleted successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(error as any);
      toast.error(errorMessage);
    },
  });
};

// Custom hook for getting featured artworks
export const useFeaturedArtworks = () => {
  return useQuery({
    queryKey: artworkQueryKeys.featured(),
    queryFn: artworkService.getFeaturedArtworks,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Custom hook for getting artworks by category
export const useArtworksByCategory = (category: string) => {
  return useQuery({
    queryKey: artworkQueryKeys.category(category),
    queryFn: () => artworkService.getArtworksByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Custom hook for searching artworks
export const useSearchArtworks = (query: string) => {
  return useQuery({
    queryKey: artworkQueryKeys.search(query),
    queryFn: () => artworkService.searchArtworks(query),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

export const useAddImagesToArtwork = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; addedImages: ArtworkImageData[]; artwork: ArtworkResponse },
    unknown,
    { artworkId: string; images: FormData }
  >({
    mutationFn: async ({ artworkId, images }: { artworkId: string; images: FormData }) => {
      const result = await artworkService.addImagesToArtwork(artworkId, images);
      return result as unknown as { message: string; addedImages: ArtworkImageData[]; artwork: ArtworkResponse };
    },
    onSuccess: (data: { message: string; addedImages: ArtworkImageData[]; artwork: ArtworkResponse }, variables: { artworkId: string; images: FormData }) => {
      queryClient.setQueryData(artworkQueryKeys.detail(variables.artworkId), data.artwork);
      queryClient.setQueryData(artworkQueryKeys.images(variables.artworkId), {
        message: data.message,
        images: data.artwork.images ?? [],
        primaryImage: data.artwork.primaryImage,
        count: data.artwork.images?.length ?? 0,
      });
      
      toast.success(`${data.addedImages.length} image(s) added successfully!`);
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(error as any);
      toast.error(errorMessage);
    },
  });
};


// Custom hook for removing image from artwork
export const useRemoveImageFromArtwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ artworkId, publicId }: { artworkId: string; publicId: string }) =>
      artworkService.removeImageFromArtwork(artworkId, publicId),
    onSuccess: (data: { message: string; removedImageId: string; artwork: ArtworkResponse }, variables: { artworkId: string; publicId: string }) => {
      // Update artwork cache
      queryClient.setQueryData(artworkQueryKeys.detail(variables.artworkId), data.artwork);
      
      // Update images cache
      queryClient.setQueryData(artworkQueryKeys.images(variables.artworkId), {
        message: data.message,
        images: data.artwork.images ?? [],
        primaryImage: data.artwork.primaryImage,
        count: data.artwork.images?.length ?? 0,
      });
      
      toast.success('Image removed successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(error as any);
      toast.error(errorMessage);
    },
  });
};

// Custom hook for setting primary image
export const useSetPrimaryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ artworkId, publicId }: { artworkId: string; publicId: string }) =>
      artworkService.setPrimaryImage(artworkId, publicId),
    onSuccess: (data: { message: string; primaryImageId: string; artwork: ArtworkResponse }, variables: { artworkId: string; publicId: string }) => {
      // Update artwork cache
      queryClient.setQueryData(artworkQueryKeys.detail(variables.artworkId), data.artwork);
      
      // Update images cache
      queryClient.setQueryData(artworkQueryKeys.images(variables.artworkId), {
        message: data.message,
        images: data.artwork.images ?? [],
        primaryImage: data.artwork.primaryImage,
        count: data.artwork.images?.length ?? 0,
      });
      
      toast.success('Primary image updated successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(error as any);
      toast.error(errorMessage);
    },
  });
};

// Custom hook for getting artwork images
export const useArtworkImages = (artworkId: string) => {
  return useQuery({
    queryKey: artworkQueryKeys.images(artworkId),
    queryFn: () => artworkService.getArtworkImages(artworkId),
    enabled: !!artworkId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Combined artwork hook for convenience
export const useArtworkManager = () => {
  const queryClient = useQueryClient();
  
  const createMutation = useCreateArtwork();
  const updateMutation = useUpdateArtwork();
  const deleteMutation = useDeleteArtwork();
  const addImagesMutation = useAddImagesToArtwork();
  const removeImageMutation = useRemoveImageFromArtwork();
  const setPrimaryMutation = useSetPrimaryImage();

  return {
    // Mutation functions
    createArtwork: createMutation.mutate,
    updateArtwork: updateMutation.mutate,
    deleteArtwork: deleteMutation.mutate,
    addImages: addImagesMutation.mutate,
    removeImage: removeImageMutation.mutate,
    setPrimaryImage: setPrimaryMutation.mutate,
    
    // Async versions
    createArtworkAsync: createMutation.mutateAsync,
    updateArtworkAsync: updateMutation.mutateAsync,
    deleteArtworkAsync: deleteMutation.mutateAsync,
    addImagesAsync: addImagesMutation.mutateAsync,
    removeImageAsync: removeImageMutation.mutateAsync,
    setPrimaryImageAsync: setPrimaryMutation.mutateAsync,
    
    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isAddingImages: addImagesMutation.isPending,
    isRemovingImage: removeImageMutation.isPending,
    isSettingPrimary: setPrimaryMutation.isPending,
    
    // Error states
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    addImagesError: addImagesMutation.error,
    removeImageError: removeImageMutation.error,
    setPrimaryError: setPrimaryMutation.error,
    
    // Cache utilities
    invalidateArtworks: () => queryClient.invalidateQueries({ queryKey: artworkQueryKeys.all }),
    invalidateArtwork: (id: string) => queryClient.invalidateQueries({ queryKey: artworkQueryKeys.detail(id) }),
    prefetchArtwork: (id: string) => queryClient.prefetchQuery({
      queryKey: artworkQueryKeys.detail(id),
      queryFn: () => artworkService.getArtworkById(id),
    }),
  };
};