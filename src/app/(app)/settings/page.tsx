// src/app/(app)/settings/page.tsx

'use client';

// import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
// import { Settings, CreditCard, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-['Orbitron'] tracking-wider mb-8">
          Settings
        </h1>

        <div className="grid gap-8">
          {/* Profile Section */}
          <section className="p-6 rounded-lg bg-gray-900/50 border border-gray-800">
            <h2 className="text-xl font-['Orbitron'] tracking-wide mb-6">
              Profile Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700
                           text-gray-300 disabled:opacity-50"
                />
              </div>
            </div>
          </section>

          {/* Subscription Section */}
          <section className="p-6 rounded-lg bg-gray-900/50 border border-gray-800">
            <h2 className="text-xl font-['Orbitron'] tracking-wide mb-6">
              Subscription
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300">Current Plan</p>
                  <p className="text-sm text-gray-400">Free Plan</p>
                </div>
                <button
                  onClick={() => window.location.href = '/#pricing'}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600
                           rounded-lg text-sm font-medium transition-colors"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}