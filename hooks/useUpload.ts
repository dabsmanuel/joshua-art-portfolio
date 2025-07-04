import { uploadService } from "@/services/uploadService";
import { handleApiError } from "@/utils/errorHandler";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UploadQueryKeys, UploadArtworkImagesInput, ImageInfoResponse, UseImageInfoResult,} from "@/types/upload";



export const uploadQueryKeys: UploadQueryKeys = {
  all: ['uploads'],
  imageInfo: (publicId: string) => [...uploadQueryKeys.all, 'imageInfo', publicId],
};

// Custom hook for uploading single image
export const useUploadSingleImage = () => {
  return useMutation({
    mutationFn: uploadService.uploadSingleImage,
    onSuccess: (data) => {
      toast.success('Image uploaded successfully!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    },
  });
};

// Custom hook for uploading multiple images
export const useUploadMultipleImages = () => {
  return useMutation({
    mutationFn: uploadService.uploadMultipleImages,
    onSuccess: (data) => {
      toast.success(`${data.count} image(s) uploaded successfully!`);
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    },
  });
};

// Custom hook for uploading artwork images

export const useUploadArtworkImages = () => {
  return useMutation({
    mutationFn: ({ imageFiles, artworkTitle, category }: UploadArtworkImagesInput) => 
      uploadService.uploadArtworkImages(imageFiles, artworkTitle, category),
    onSuccess: (data) => {
      toast.success(`${data.count} artwork image(s) uploaded successfully!`);
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    },
  });
};

// Custom hook for deleting image
export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadService.deleteImage,
    onSuccess: (data) => {
      // Remove image info from cache
      queryClient.removeQueries({ queryKey: uploadQueryKeys.imageInfo(data.public_id) });
      
      toast.success('Image deleted successfully!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    },
  });
};

export const useImageInfo = <TError = unknown>(publicId: string): UseImageInfoResult<TError> => {
  const result = useQuery<ImageInfoResponse, TError>({
    queryKey: uploadQueryKeys.imageInfo(publicId),
    queryFn: () => uploadService.getImageInfo(publicId),
    enabled: !!publicId,
    staleTime: 30 * 60 * 1000, // 30 minutes (image info rarely changes)
    retry: 2,
  });

  return {
    data: result.data,
    error: result.error,
    isLoading: result.isLoading,
    isError: result.isError,
    isSuccess: result.isSuccess,
    refetch: result.refetch,
  };
};

// Combined upload hook for convenience
export const useUploadManager = () => {
  const singleUploadMutation = useUploadSingleImage();
  const multipleUploadMutation = useUploadMultipleImages();
  const artworkUploadMutation = useUploadArtworkImages();
  const deleteImageMutation = useDeleteImage();

  return {
    // Upload functions
    uploadSingle: singleUploadMutation.mutate,
    uploadMultiple: multipleUploadMutation.mutate,
    uploadArtworkImages: artworkUploadMutation.mutate,
    deleteImage: deleteImageMutation.mutate,
    
    // Async versions
    uploadSingleAsync: singleUploadMutation.mutateAsync,
    uploadMultipleAsync: multipleUploadMutation.mutateAsync,
    uploadArtworkImagesAsync: artworkUploadMutation.mutateAsync,
    deleteImageAsync: deleteImageMutation.mutateAsync,
    
    // Loading states
    isSingleUploading: singleUploadMutation.isPending,
    isMultipleUploading: multipleUploadMutation.isPending,
    isArtworkUploading: artworkUploadMutation.isPending,
    isDeleting: deleteImageMutation.isPending,
    
    // Error states
    singleUploadError: singleUploadMutation.error,
    multipleUploadError: multipleUploadMutation.error,
    artworkUploadError: artworkUploadMutation.error,
    deleteError: deleteImageMutation.error,
    
    // Success states
    singleUploadSuccess: singleUploadMutation.isSuccess,
    multipleUploadSuccess: multipleUploadMutation.isSuccess,
    artworkUploadSuccess: artworkUploadMutation.isSuccess,
    deleteSuccess: deleteImageMutation.isSuccess,
    
    // Data
    singleUploadData: singleUploadMutation.data,
    multipleUploadData: multipleUploadMutation.data,
    artworkUploadData: artworkUploadMutation.data,
    
    // Reset functions
    resetSingleUpload: singleUploadMutation.reset,
    resetMultipleUpload: multipleUploadMutation.reset,
    resetArtworkUpload: artworkUploadMutation.reset,
    resetDelete: deleteImageMutation.reset,
  };
};