
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface WaveformVisualizerProps {
  waveformData: number[];
  currentTime: number;
  duration: number;
  onSeek: (value: number[]) => void;
  className?: string;
}

export function WaveformVisualizer({ 
  waveformData, 
  currentTime, 
  duration, 
  onSeek,
  className 
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);

  // Generate mock waveform data if none provided
  const mockWaveformData = Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1);
  const data = waveformData.length > 0 ? waveformData : mockWaveformData;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size
    canvas.width = rect.width * dpr;
    canvas.height = 80 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '80px';
    
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, 80);

    const barWidth = rect.width / data.length;
    const progressRatio = duration > 0 ? currentTime / duration : 0;
    const progressX = rect.width * progressRatio;

    // Draw waveform bars
    data.forEach((amplitude, index) => {
      const x = index * barWidth;
      const height = amplitude * 60; // Max height of 60px
      const y = (80 - height) / 2; // Center vertically
      
      // Color based on progress
      const isPlayed = x < progressX;
      ctx.fillStyle = isPlayed ? '#f97316' : '#e5e7eb'; // Orange for played, gray for unplayed
      
      ctx.fillRect(x, y, Math.max(barWidth - 1, 1), height);
    });

    // Draw progress line
    if (progressX > 0) {
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, 80);
      ctx.stroke();
    }

    // Draw hover indicator
    if (isHovering && hoverPosition > 0) {
      ctx.strokeStyle = '#f9731680';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hoverPosition, 0);
      ctx.lineTo(hoverPosition, 80);
      ctx.stroke();
    }
  }, [data, currentTime, duration, isHovering, hoverPosition]);

  const handleClick = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    const newTime = ratio * duration;
    
    onSeek([newTime]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHovering) return;
    
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHoverPosition(Math.max(0, Math.min(x, rect.width)));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getHoverTime = () => {
    const container = containerRef.current;
    if (!container) return 0;
    
    const rect = container.getBoundingClientRect();
    const ratio = hoverPosition / rect.width;
    return ratio * duration;
  };

  return (
    <div className={cn("relative", className)}>
      <div 
        ref={containerRef}
        className="relative cursor-pointer group"
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <canvas 
          ref={canvasRef}
          className="w-full h-20 rounded-md"
        />
        
        {/* Hover tooltip */}
        {isHovering && (
          <div 
            className="absolute top-0 transform -translate-x-1/2 -translate-y-full mb-2 px-2 py-1 bg-black text-white text-xs rounded pointer-events-none"
            style={{ left: hoverPosition }}
          >
            {formatTime(getHoverTime())}
          </div>
        )}
      </div>
    </div>
  );
}
