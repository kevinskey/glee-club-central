
import React from 'react';
import { OptimizedSlider } from '@/components/ui/optimized-slider';

const demoSlides = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1200&h=675&fit=crop&crop=center',
    srcSet: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=338&fit=crop&crop=center 600w, https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1200&h=675&fit=crop&crop=center 1200w',
    alt: 'Woman working on laptop',
    title: 'Remote Work Excellence',
    subtitle: 'Discover the future of flexible working',
    priority: true
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&h=675&fit=crop&crop=center',
    srcSet: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=338&fit=crop&crop=center 600w, https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&h=675&fit=crop&crop=center 1200w',
    alt: 'Gray laptop computer',
    title: 'Technology Innovation',
    subtitle: 'Powering the digital transformation'
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=675&fit=crop&crop=center',
    srcSet: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=338&fit=crop&crop=center 600w, https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=675&fit=crop&crop=center 1200w',
    alt: 'Circuit board macro photography',
    title: 'Hardware Engineering',
    subtitle: 'Building the foundation of tomorrow'
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=675&fit=crop&crop=center',
    srcSet: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=338&fit=crop&crop=center 600w, https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=675&fit=crop&crop=center 1200w',
    alt: 'Monitor showing Java programming',
    title: 'Software Development',
    subtitle: 'Crafting elegant code solutions'
  }
];

export function OptimizedSliderDemo() {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Optimized Slider Demo</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This slider demonstrates all performance best practices: lazy loading, 
          responsive images, loading placeholders, smooth responsive heights, 
          and rendering only visible slides.
        </p>
      </div>

      {/* Video aspect ratio slider */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Video Aspect Ratio (16:9)</h2>
        <OptimizedSlider
          slides={demoSlides}
          aspectRatio="video"
          autoPlay={true}
          autoPlayInterval={4000}
          onSlideChange={(index) => console.log('Current slide:', index)}
        />
      </div>

      {/* Square aspect ratio slider */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Square Aspect Ratio</h2>
        <div className="max-w-md mx-auto">
          <OptimizedSlider
            slides={demoSlides}
            aspectRatio="square"
            autoPlay={false}
            showControls={true}
            showIndicators={true}
          />
        </div>
      </div>

      {/* Wide aspect ratio slider */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Wide Aspect Ratio (21:9)</h2>
        <OptimizedSlider
          slides={demoSlides}
          aspectRatio="wide"
          autoPlay={true}
          autoPlayInterval={6000}
          preloadAdjacent={true}
        />
      </div>

      {/* Feature highlights */}
      <div className="bg-muted/50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4">Performance Features:</h3>
        <ul className="space-y-2 text-sm">
          <li>✅ Lazy loading with native <code>&lt;img loading="lazy" /&gt;</code></li>
          <li>✅ Responsive images with <code>srcset</code> for different screen sizes</li>
          <li>✅ Loading placeholders and error states</li>
          <li>✅ Smooth responsive heights across all screen sizes</li>
          <li>✅ Only renders current + adjacent slides (not all at once)</li>
          <li>✅ Preloads adjacent images for smooth transitions</li>
          <li>✅ Keyboard navigation support</li>
          <li>✅ Accessibility features with proper ARIA labels</li>
          <li>✅ Memoized components for performance</li>
          <li>✅ Configurable aspect ratios and auto-play</li>
        </ul>
      </div>
    </div>
  );
}
