// lib/swrFetcher.ts
import { createAuthenticatedFetch } from './api'; // adjust path

export const swrAuthenticatedFetcher =
  (accessToken: string) =>
  async <T>(endpoint: string): Promise<T> => {
    const response = await createAuthenticatedFetch<T>({
      accessToken,
      endpoint,
    });

    if (!response || !response.data) {
      throw new Error('No data returned from API');
    }

    if (response.error) {
      throw new Error("An error occurred while fetching data");
    }

    return response.data;
  };
