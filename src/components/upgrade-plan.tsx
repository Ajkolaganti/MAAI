'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

export function UpgradePlan() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (plan: 'pro' | 'ultra') => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          userId: user.id
        })
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleUpgrade('pro')}
        disabled={loading}
        className="px-4 py-2 bg-purple-500 rounded-lg"
      >
        {loading ? <Loader2 className="animate-spin" /> : 'Upgrade to Pro'}
      </button>
      <button
        onClick={() => handleUpgrade('ultra')}
        disabled={loading}
        className="px-4 py-2 bg-purple-500 rounded-lg"
      >
        {loading ? <Loader2 className="animate-spin" /> : 'Upgrade to Ultra'}
      </button>
    </div>
  );
} 