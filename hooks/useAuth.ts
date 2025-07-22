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
      // Set authentication data in cache
      queryClient.setQueryData(authQueryKeys.currentUser, { user: data.user });
      queryClient.setQueryData(authQueryKeys.isAuthenticated, true);
      
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
  const queryClient = useQueryClient();
  
  const queryResult = useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: async () => {
      try {
        return await authService.getCurrentUser();
      } catch (error: any) {
        // If unauthorized, clear auth state and throw
        if (error?.response?.status === 401) {
          queryClient.setQueryData(authQueryKeys.isAuthenticated, false);
          queryClient.setQueryData(authQueryKeys.currentUser, null);
          authService.clearTokens(); // Clear invalid tokens
        }
        throw error;
      }
    },
    enabled: authService.hasTokens(),
    staleTime: 5 * 60 * 1000, 
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    gcTime: 0
  });

  queryResult.error && queryResult.error?.response?.status !== 401 && toast.error(handleApiError(queryResult.error));

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

// Custom hook for authentication status - simplified
export const useAuthStatus = () => {
  const { data: currentUser, isLoading, error } = useCurrentUser();
  
  return {
    data: !!currentUser && !error,
    isLoading,
    error
  };
};

// Custom hook for token refresh
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refreshToken: string) => authService.refreshToken(refreshToken),
    onSuccess: () => {
      // Invalidate current user query to refetch with new token
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser });
    },

    onError: (error: any) => {
      // Clear auth state on refresh failure
      queryClient.setQueryData(authQueryKeys.isAuthenticated, false);
      queryClient.setQueryData(authQueryKeys.currentUser, null);
      authService.clearTokens();
      
      // Don't show toast for 401 errors as they're expected when tokens are invalid
      if (error?.response?.status !== 401) {
        const errorMessage = handleApiError(error);
        toast.error(errorMessage);
      }
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

  // Determine if we're actually authenticated
  const actuallyAuthenticated = !!currentUser && !userError && authService.hasTokens();

  return {
    // User data
    user: currentUser || null,
    isAuthenticated: actuallyAuthenticated,
    
    // Loading states
    isLoading: userLoading && authService.hasTokens(), // Only show loading if we have tokens
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isUpdateProfileLoading: updateProfileMutation.isPending,
    
    // Error states
    userError: userError && 'response' in userError && (userError as any).response?.status !== 401 ? userError : null, // Don't expose 401 errors
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