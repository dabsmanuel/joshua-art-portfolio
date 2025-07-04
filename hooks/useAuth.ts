// hooks/useAuth.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { handleApiError } from '../utils/errorHandler';
import { toast } from 'react-hot-toast';

// Query keys for cache management
export const authQueryKeys = {
  currentUser: ['auth', 'currentUser'],
  isAuthenticated: ['auth', 'isAuthenticated'],
};

// Custom hook for user registration
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Invalidate and refetch auth-related queries
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser });
      queryClient.invalidateQueries({ queryKey: authQueryKeys.isAuthenticated });
      
      toast.success('Registration successful!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    },
  });
};

// Custom hook for user login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(authQueryKeys.currentUser, { user: data.user });
      queryClient.setQueryData(authQueryKeys.isAuthenticated, true);
      
      toast.success('Login successful!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    },
  });
};

// Custom hook for user logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      // Set authentication state to false
      queryClient.setQueryData(authQueryKeys.isAuthenticated, false);
      queryClient.setQueryData(authQueryKeys.currentUser, null);
      
      toast.success('Logged out successfully!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      
      // Even if logout fails, clear local cache
      queryClient.clear();
      queryClient.setQueryData(authQueryKeys.isAuthenticated, false);
      queryClient.setQueryData(authQueryKeys.currentUser, null);
    },
  });
};

// Custom hook for getting current user
export const useCurrentUser = () => {
  const queryResult = useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: authService.getCurrentUser,
    enabled: authService.isAuthenticated(), // Only run if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as any).response?.status === 401
      ) {
        return false;
      }
      return true;
    },
  });

  if (
    queryResult.error &&
    !(
      typeof queryResult.error === 'object' &&
      queryResult.error !== null &&
      'response' in queryResult.error &&
      (queryResult.error as any).response?.status === 401
    )
  ) {
    const errorMessage = handleApiError(queryResult.error);
    toast.error(errorMessage);
  }

  return queryResult;
};

// Custom hook for updating user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      // Update the current user cache
      queryClient.setQueryData(authQueryKeys.currentUser, data);
      
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser });
      
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    },
  });
};

// Custom hook for authentication status
export const useAuthStatus = () => {
  return useQuery({
    queryKey: authQueryKeys.isAuthenticated,
    queryFn: () => authService.isAuthenticated(),
    staleTime: Infinity, // Never stale
  });
};

// Custom hook for token refresh
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refreshToken: string) => authService.refreshToken(refreshToken),
    onSuccess: () => {
      // Invalidate all queries to refetch with new token
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      
      // Clear auth state on refresh failure
      queryClient.setQueryData(authQueryKeys.isAuthenticated, false);
      queryClient.setQueryData(authQueryKeys.currentUser, null);
    },
  });
};

// Combined auth hook for convenience
export const useAuth = () => {
  const { data: currentUser, isLoading: userLoading, error: userError } = useCurrentUser();
  const { data: isAuthenticated, isLoading: authLoading } = useAuthStatus();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();
  const updateProfileMutation = useUpdateProfile();

  return {
    // User data
    user: currentUser?.user || null,
    isAuthenticated: isAuthenticated || false,
    
    // Loading states
    isLoading: userLoading || authLoading,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isUpdateProfileLoading: updateProfileMutation.isPending,
    
    // Error states
    userError,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    registerError: registerMutation.error,
    updateProfileError: updateProfileMutation.error,
    
    // Mutation functions
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    register: registerMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    
    // Async versions for use in event handlers
    loginAsync: loginMutation.mutateAsync,
    logoutAsync: logoutMutation.mutateAsync,
    registerAsync: registerMutation.mutateAsync,
    updateProfileAsync: updateProfileMutation.mutateAsync,
  };
};