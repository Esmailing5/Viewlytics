'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';

/**
 * Global App Providers Wrapper
 *
 * Wraps the application with:
 * 1. ThemeProvider — dark/light mode with localStorage persistence
 * 2. AuthProvider — global authentication context
 * 3. QueryClientProvider — TanStack Query for data fetching
 *
 * Keeping providers in a separate client component prevents the root layout
 * from becoming a client component, preserving Next.js SSR benefits.
 *
 * @see app/layout.tsx — Used in root layout
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

