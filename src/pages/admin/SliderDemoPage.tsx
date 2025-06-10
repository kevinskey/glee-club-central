
import React, { useState } from 'react';
import { OptimizedSliderDemo } from '@/components/demo/OptimizedSliderDemo';
import { SliderControls } from '@/components/ui/slider-controls';
import { BackButton } from '@/components/ui/back-button';

export default function SliderDemoPage() {
  const [sliderSettings, setSliderSettings] = useState({
    isPlaying: true,
    currentSlide: 0,
    autoPlayInterval: 4000,
    showControls: true,
    showIndicators: true,
    aspectRatio: 'video',
    preloadAdjacent: true
  });

  const handlePlayPause = () => {
    setSliderSettings(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handlePrevious = () => {
    setSliderSettings(prev => ({
      ...prev,
      currentSlide: prev.currentSlide > 0 ? prev.currentSlide - 1 : 3
    }));
  };

  const handleNext = () => {
    setSliderSettings(prev => ({
      ...prev,
      currentSlide: (prev.currentSlide + 1) % 4
    }));
  };

  const handleReset = () => {
    setSliderSettings(prev => ({ ...prev, currentSlide: 0 }));
  };

  const handleSlideSelect = (index: number) => {
    setSliderSettings(prev => ({ ...prev, currentSlide: index }));
  };

  const handleIntervalChange = (interval: number) => {
    setSliderSettings(prev => ({ ...prev, autoPlayInterval: interval }));
  };

  const handleShowControlsChange = (show: boolean) => {
    setSliderSettings(prev => ({ ...prev, showControls: show }));
  };

  const handleShowIndicatorsChange = (show: boolean) => {
    setSliderSettings(prev => ({ ...prev, showIndicators: show }));
  };

  const handleAspectRatioChange = (ratio: string) => {
    setSliderSettings(prev => ({ ...prev, aspectRatio: ratio }));
  };

  const handlePreloadAdjacentChange = (preload: boolean) => {
    setSliderSettings(prev => ({ ...prev, preloadAdjacent: preload }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton 
        label="Back to Admin Dashboard" 
        fallbackPath="/admin" 
        className="mb-6" 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-1">
          <SliderControls
            isPlaying={sliderSettings.isPlaying}
            onPlayPause={handlePlayPause}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onReset={handleReset}
            currentSlide={sliderSettings.currentSlide}
            totalSlides={4}
            onSlideSelect={handleSlideSelect}
            autoPlayInterval={sliderSettings.autoPlayInterval}
            onIntervalChange={handleIntervalChange}
            showControls={sliderSettings.showControls}
            onShowControlsChange={handleShowControlsChange}
            showIndicators={sliderSettings.showIndicators}
            onShowIndicatorsChange={handleShowIndicatorsChange}
            aspectRatio={sliderSettings.aspectRatio}
            onAspectRatioChange={handleAspectRatioChange}
            preloadAdjacent={sliderSettings.preloadAdjacent}
            onPreloadAdjacentChange={handlePreloadAdjacentChange}
          />
        </div>

        {/* Slider Demo */}
        <div className="lg:col-span-2">
          <OptimizedSliderDemo settings={sliderSettings} />
        </div>
      </div>
    </div>
  );
}
