import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { exhibitionService } from '../services/exhibitionService';
import { handleApiError } from '../utils/errorHandler';
import type { TypedApiError } from '../types/error';

export const exhibitionQueryKeys = {
  all: ['exhibitions'] as const,
};

export const useExhibitions = () =>
  useQuery({
    queryKey: exhibitionQueryKeys.all,
    queryFn: exhibitionService.getAllExhibitions,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

export const useCreateExhibition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: exhibitionService.createExhibition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exhibitionQueryKeys.all });
      toast.success('Exhibition added');
    },
    onError: (error) => toast.error(handleApiError(error as TypedApiError)),
  });
};

export const useUpdateExhibition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => exhibitionService.updateExhibition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exhibitionQueryKeys.all });
      toast.success('Exhibition updated');
    },
    onError: (error) => toast.error(handleApiError(error as TypedApiError)),
  });
};

export const useDeleteExhibition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: exhibitionService.deleteExhibition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exhibitionQueryKeys.all });
      toast.success('Exhibition deleted');
    },
    onError: (error) => toast.error(handleApiError(error as TypedApiError)),
  });
};
