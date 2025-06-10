
import React from 'react';
import { OptimizedSliderDemo } from '@/components/demo/OptimizedSliderDemo';
import { BackButton } from '@/components/ui/back-button';

export default function SliderDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton 
        label="Back to Admin Dashboard" 
        fallbackPath="/admin" 
        className="mb-6" 
      />
      <OptimizedSliderDemo />
    </div>
  );
}
