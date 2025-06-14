
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioFileSelector } from '@/components/audio/AudioFileSelector';

export default function WaveSurferDemo() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">WaveSurfer Music Player</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Custom React music player with waveform visualization powered by WaveSurfer.js
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Interactive waveform visualization</li>
            <li>• Click-to-seek functionality</li>
            <li>• Volume control with mute toggle</li>
            <li>• Play/pause controls</li>
            <li>• Direct download functionality</li>
            <li>• Fully responsive design</li>
            <li>• Performance optimized (loads on demand)</li>
            <li>• Dark/light theme support</li>
          </ul>
        </CardContent>
      </Card>

      <AudioFileSelector showPlayer={true} />
    </div>
  );
}
