import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export function useAuthForm<T extends z.ZodType>(
  schema: T,
  defaultValues: z.infer<T>,
  onSubmit: (data: z.infer<T>) => Promise<void>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (data: z.infer<T>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await onSubmit(data);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(
        err instanceof Error ? err.message : 'An error occurred. Please try again.'
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isLoading,
    error,
    setError,
  };
}

export type AuthFormReturn = ReturnType<typeof useAuthForm>;
