
import React from 'react';
import { AdminV2Layout } from '@/layouts/AdminV2Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Music, Upload, Settings } from 'lucide-react';

export default function MusicStudioPage() {
  return (
    <AdminV2Layout>
      <div className="space-y-6">
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white">
            Music Studio
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Recording tools and practice materials for the Glee Club
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Recording Studio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Record practice sessions and performances
              </p>
              <Button className="w-full">
                Start Recording
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Playlist Manager
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage music playlists and audio files
              </p>
              <Button className="w-full" onClick={() => window.location.href = '/admin/music'}>
                Manage Playlists
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Audio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Upload new audio files and recordings
              </p>
              <Button className="w-full">
                Upload Files
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Recordings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8 text-gray-500">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recordings found. Start recording to see your audio files here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminV2Layout>
  );
}
