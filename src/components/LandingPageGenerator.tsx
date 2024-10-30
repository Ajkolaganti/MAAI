'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface FormData {
  businessName: string;
  industry: string;
  targetAudience: string;
  keyFeatures: string;
  callToAction: string;
  colorScheme: string;
}

export const LandingPageGenerator = () => {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    industry: '',
    targetAudience: '',
    keyFeatures: '',
    callToAction: '',
    colorScheme: ''
  });
  
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePrompt = () => {
    return `Create a modern, responsive landing page HTML and CSS code for ${formData.businessName}. 
    Industry: ${formData.industry}
    Target Audience: ${formData.targetAudience}
    Key Features: ${formData.keyFeatures}
    Call to Action: ${formData.callToAction}
    Color Scheme: ${formData.colorScheme}
    Use only internal CSS and HTML. Make it modern and responsive.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: generatePrompt()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate landing page');
      }

      const data = await response.json();
      setGeneratedCode(data.generatedCode);
    } catch (error) {
      console.error('Error generating landing page:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Landing Page Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <Input
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Enter your business name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <Input
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                placeholder="e.g., Technology, Healthcare, Education"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Target Audience</label>
              <Input
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                placeholder="Who is your target audience?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Key Features/Benefits</label>
              <Textarea
                name="keyFeatures"
                value={formData.keyFeatures}
                onChange={handleInputChange}
                placeholder="List main features or benefits of your product/service"
                className="h-24"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Call to Action</label>
              <Input
                name="callToAction"
                value={formData.callToAction}
                onChange={handleInputChange}
                placeholder="e.g., Sign Up Now, Get Started, Learn More"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Color Scheme</label>
              <Input
                name="colorScheme"
                value={formData.colorScheme}
                onChange={handleInputChange}
                placeholder="e.g., Blue and White, Modern Dark"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Landing Page'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : generatedCode ? (
            <div className="border rounded-lg p-4 bg-white">
              <iframe
                srcDoc={generatedCode}
                title="Landing Page Preview"
                className="w-full h-96 border-0"
                sandbox="allow-scripts"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Generated landing page will appear here
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};