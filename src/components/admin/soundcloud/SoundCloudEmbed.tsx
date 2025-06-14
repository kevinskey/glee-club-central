
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Music, Play } from 'lucide-react';
import { toast } from 'sonner';

export function SoundCloudEmbed() {
  const [embedUrl, setEmbedUrl] = useState('');
  const [embedHeight, setEmbedHeight] = useState(166);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showComments, setShowComments] = useState(true);

  // Pre-configured tracks for demo
  const demoTracks = [
    {
      id: 'demo-1',
      title: 'Sample Track 1',
      url: 'https://soundcloud.com/doctorkj/sample-track-1',
      description: 'A beautiful choral arrangement'
    },
    {
      id: 'demo-2', 
      title: 'Sample Track 2',
      url: 'https://soundcloud.com/doctorkj/sample-track-2',
      description: 'Live performance recording'
    }
  ];

  const generateEmbedCode = (url: string) => {
    const embedParams = new URLSearchParams({
      url: url,
      color: '#ff5500',
      auto_play: autoPlay.toString(),
      hide_related: 'false',
      show_comments: showComments.toString(),
      show_user: 'true',
      show_reposts: 'false',
      show_teaser: 'true'
    });

    return `https://w.soundcloud.com/player/?${embedParams.toString()}`;
  };

  const handleAddEmbed = () => {
    if (!embedUrl) {
      toast.error('Please enter a SoundCloud URL');
      return;
    }

    if (!embedUrl.includes('soundcloud.com')) {
      toast.error('Please enter a valid SoundCloud URL');
      return;
    }

    console.log('Adding embed for:', embedUrl);
    toast.success('Embed added successfully!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            SoundCloud Embed Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="add" className="space-y-4">
            <TabsList>
              <TabsTrigger value="add">Add New Embed</TabsTrigger>
              <TabsTrigger value="demo">Demo Tracks</TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="embed-url">SoundCloud Track/Playlist URL</Label>
                  <Input
                    id="embed-url"
                    type="url"
                    placeholder="https://soundcloud.com/artist/track-name"
                    value={embedUrl}
                    onChange={(e) => setEmbedUrl(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="embed-height">Player Height (px)</Label>
                    <Input
                      id="embed-height"
                      type="number"
                      value={embedHeight}
                      onChange={(e) => setEmbedHeight(Number(e.target.value))}
                      min="100"
                      max="500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Player Options</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={autoPlay}
                          onChange={(e) => setAutoPlay(e.target.checked)}
                        />
                        Auto-play
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={showComments}
                          onChange={(e) => setShowComments(e.target.checked)}
                        />
                        Show Comments
                      </label>
                    </div>
                  </div>
                </div>

                {embedUrl && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <iframe
                      width="100%"
                      height={embedHeight}
                      scrolling="no"
                      frameBorder="no"
                      allow="autoplay"
                      src={generateEmbedCode(embedUrl)}
                      className="rounded border"
                    />
                  </div>
                )}

                <Button onClick={handleAddEmbed} className="w-full">
                  Add Embed to Library
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="demo" className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                These are example embeds showing how SoundCloud content will appear:
              </div>
              
              {demoTracks.map((track) => (
                <Card key={track.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{track.title}</h4>
                      <Button variant="outline" size="sm" asChild>
                        <a href={track.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{track.description}</p>
                  </CardHeader>
                  <CardContent>
                    <iframe
                      width="100%"
                      height="166"
                      scrolling="no"
                      frameBorder="no"
                      allow="autoplay"
                      src={generateEmbedCode(track.url)}
                      className="rounded"
                    />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Use SoundCloud Embeds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <Play className="w-4 h-4 mt-0.5 text-orange-500" />
            <div>
              <strong>Track URLs:</strong> Copy any SoundCloud track URL (like https://soundcloud.com/artist/track-name)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Play className="w-4 h-4 mt-0.5 text-orange-500" />
            <div>
              <strong>Playlist URLs:</strong> Works with playlist URLs too for multi-track embeds
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Play className="w-4 h-4 mt-0.5 text-orange-500" />
            <div>
              <strong>No Login Required:</strong> Embeds work without OAuth - perfect for public content
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
