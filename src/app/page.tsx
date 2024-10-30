// src/app/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
   Code2, Zap, Shield, 
  ChevronRight, Check, Github, Loader2 
} from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import Image from 'next/image';
import Maai from '../../public/Maai.png';
import { useAuth } from '@/contexts/auth-context';

const features = [
  {
    icon: Code2,
    title: 'AI-Powered UI Generation',
    description: 'Generate stunning UI components with natural language descriptions'
  },
  {
    icon: Zap,
    title: 'Instant Preview',
    description: 'See your components come to life in real-time with live preview'
  },
  {
    icon: Shield,
    title: 'Production Ready',
    description: 'Get clean, optimized code ready for your next project'
  }
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '0',
    credits: '10',
    planId: 'free',
    features: [
      'Basic UI Generation',
      'Live Preview',
      'Code Export',
      'Community Support'
    ]
  },
  {
    name: 'Pro',
    price: '9',
    credits: '100',
    planId: 'pro',
    features: [
      'Advanced UI Generation',
      'Version History',
      'Code Comparison',
      'Priority Support',
      'Team Collaboration'
    ],
    popular: true
  },
  {
    name: 'Ultra',
    price: '29',
    credits: '500',
    planId: 'ultra',
    features: [
      'Custom UI Generation',
      'Dedicated Support',
      'Custom Integrations',
      'Team Management'
    ]
  }
];

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') {
      window.location.href = '/generate';
      return;
    }

    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
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
    <div className="min-h-screen bg-gray-950 text-white">
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="fixed w-full z-50 glass-dark backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-black from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              <Image 
                src={Maai} 
                alt="MAAI" 
                className="h-8 w-auto" 
                width={32} 
                height={32}
              />
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </a>
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white
                         hover:bg-gray-800 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600
                         transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r 
                       from-purple-400 via-blue-400 to-purple-400 bg-clip-text 
                       text-transparent animate-gradient-flow">
            Generate Beautiful UI Components with AI
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Transform your ideas into production-ready React components using 
            natural language. Powered by GPT-4 and modern design principles.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/signup')}
              className="px-8 py-3 rounded-lg bg-purple-500 hover:bg-purple-600
                       transition-all flex items-center space-x-2"
            >
              <span>Start Building</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href="#"
              className="px-8 py-3 rounded-lg border border-gray-700 hover:bg-gray-800
                       transition-all flex items-center space-x-2"
            >
              <Github className="w-4 h-4" />
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400">Everything you need to build amazing UIs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-6 rounded-xl 
                                        hover:translate-y-[-4px] transition-all">
                <feature.icon className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-gray-400">Start free, upgrade when you need more</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} 
                   className={`glass-card p-6 rounded-xl relative
                             ${plan.popular ? 'border-2 border-purple-500' : ''}`}>
                {plan.popular && (
                  <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                                 bg-purple-500 text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <div className="mb-6">
                  <span className="text-2xl font-bold text-purple-400">
                    {plan.credits}
                  </span>
                  <span className="text-gray-400"> credits</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade(plan.planId)}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all
                           ${plan.popular 
                             ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                             : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center space-x-2`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Get Started</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}