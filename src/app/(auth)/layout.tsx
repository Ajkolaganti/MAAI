// src/app/(auth)/layout.tsx

'use client';

import { AuthProvider } from '@/contexts/auth-context';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-950">
        {children}
      </div>
    </AuthProvider>
  );
}