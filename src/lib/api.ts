import { signOut } from "next-auth/react";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export interface ApiResponse<T = any> {
  data: T;
  isOk?: boolean;
  status?: number;
  error?: string;
}

export interface AuthenticatedFetchParams {
  accessToken: string;
  endpoint: string;
  options?: RequestInit;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Client-side authenticated fetch utility
 * Handles authentication, error handling, and response parsing
 */
export const createAuthenticatedFetch = async <T = any>({
  accessToken,
  endpoint,
  options = {},
}: AuthenticatedFetchParams): Promise<ApiResponse<T>> => {
  if (!BACKEND_API_URL) {
    throw new ApiError('Backend API URL is not configured', 500);
  }

  if (!accessToken) {
    throw new ApiError('Access token is required', 401);
  }

  const url = `${BACKEND_API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    // console.log(response)
    if (!response.ok) {
      const errorMessage = await response.text().catch(() => response.statusText);
      throw new ApiError(
        `API call failed: ${errorMessage}`,
        response.status,
        response
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        await signOut()
      }
      throw error;
    }
    
    // Handle network errors, parsing errors, etc.
    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
      0
    );
  }
};

/**
 * Utility function to check if an error is an API error
 */
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

/**
 * Utility function to get user-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    switch (error.status) {
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'A server error occurred. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
  
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
};