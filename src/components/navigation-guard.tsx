// src/components/navigation-guard.tsx

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      console.log('NavigationGuard: Current path:', pathname);
      console.log('NavigationGuard: User state:', !!user);
      
      // Protected routes
      const protectedRoutes = ['/generate', '/dashboard', '/settings'];
      // Auth routes
      const authRoutes = ['/login', '/signup'];

      // Check if current path matches any route, accounting for route groups
      const isProtectedRoute = protectedRoutes.some(route => 
        pathname === route || pathname === `/(app)${route}`
      );
      const isAuthRoute = authRoutes.some(route => 
        pathname === route || pathname === `/(auth)${route}`
      );

      if (isProtectedRoute && !user) {
        console.log('NavigationGuard: Redirecting to login');
        router.replace('/login');
      } else if (isAuthRoute && user) {
        console.log('NavigationGuard: Redirecting to generate');
        router.replace('/generate');
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return <>{children}</>;
}