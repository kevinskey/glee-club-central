
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Play, Pause, Square, Music, Upload, Archive, Share, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface BackingTrack {
  id: string;
  title: string;
  file_url: string;
  category: string;
}

interface Recording {
  id: string;
  title: string;
  backing_track_id?: string;
  recording_file_url: string;
  share_level: 'private' | 'section' | 'group' | 'director';
  created_at: string;
  user_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
    voice_part: string;
  };
}

export default function MusicStudioPage() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('sight-reading');
  const [backingTracks, setBackingTracks] = useState<BackingTrack[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<BackingTrack | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState('');
  const [shareLevel, setShareLevel] = useState<'private' | 'section' | 'group' | 'director'>('private');

  useEffect(() => {
    fetchBackingTracks();
    fetchRecordings();
  }, []);

  const fetchBackingTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('audio_files')
        .select('*')
        .eq('is_backing_track', true)
        .order('title');

      if (error) throw error;
      setBackingTracks(data || []);
    } catch (error) {
      console.error('Error fetching backing tracks:', error);
      toast.error('Failed to load backing tracks');
    }
  };

  const fetchRecordings = async () => {
    try {
      const { data, error } = await supabase
        .from('track_recordings')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            voice_part
          )
        `)
        .or(`user_id.eq.${user?.id},share_level.eq.group,share_level.eq.director`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecordings(data || []);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast.error('Failed to load recordings');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedBlob(blob);
        setSaveDialogOpen(true);
        
        // Generate automatic title
        const timestamp = new Date().toLocaleString();
        const trackTitle = selectedTrack ? selectedTrack.title : 'Practice';
        const userName = profile?.first_name || 'User';
        setRecordingTitle(`${userName} - ${trackTitle} - ${timestamp}`);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
      toast.success('Recording stopped');
    }
  };

  const saveRecording = async () => {
    if (!recordedBlob || !recordingTitle) {
      toast.error('Please provide a title for your recording');
      return;
    }

    try {
      // Upload audio file
      const fileName = `${user?.id}/${Date.now()}-recording.wav`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(fileName, recordedBlob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('recordings')
        .getPublicUrl(fileName);

      // Save recording record
      const { error: recordError } = await supabase
        .from('track_recordings')
        .insert({
          user_id: user?.id,
          title: recordingTitle,
          backing_track_id: selectedTrack?.id,
          recording_file_url: publicUrl,
          recording_file_path: fileName,
          share_level: shareLevel
        });

      if (recordError) throw recordError;

      toast.success('Recording saved successfully');
      setSaveDialogOpen(false);
      setRecordedBlob(null);
      setRecordingTitle('');
      fetchRecordings();
    } catch (error) {
      console.error('Error saving recording:', error);
      toast.error('Failed to save recording');
    }
  };

  const updateShareLevel = async (recordingId: string, newShareLevel: string) => {
    try {
      const { error } = await supabase
        .from('track_recordings')
        .update({ share_level: newShareLevel })
        .eq('id', recordingId)
        .eq('user_id', user?.id);

      if (error) throw error;
      toast.success('Share level updated');
      fetchRecordings();
    } catch (error) {
      console.error('Error updating share level:', error);
      toast.error('Failed to update share level');
    }
  };

  const deleteRecording = async (recordingId: string) => {
    if (!confirm('Are you sure you want to delete this recording?')) return;

    try {
      const { error } = await supabase
        .from('track_recordings')
        .delete()
        .eq('id', recordingId)
        .eq('user_id', user?.id);

      if (error) throw error;
      toast.success('Recording deleted');
      fetchRecordings();
    } catch (error) {
      console.error('Error deleting recording:', error);
      toast.error('Failed to delete recording');
    }
  };

  const myRecordings = recordings.filter(r => r.user_id === user?.id);
  const sharedRecordings = recordings.filter(r => r.user_id !== user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Music Studio</h1>
        <p className="text-muted-foreground">Practice tools and recording studio</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sight-reading">Sight Reading</TabsTrigger>
          <TabsTrigger value="recording-booth">Recording Booth</TabsTrigger>
          <TabsTrigger value="archive">My Archive</TabsTrigger>
          <TabsTrigger value="shared">Shared Recordings</TabsTrigger>
        </TabsList>

        <TabsContent value="sight-reading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Sight Reading Practice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <iframe
                  src="https://www.sightreadingfactory.com/app"
                  className="w-full h-full rounded-lg"
                  title="Sight Reading Factory"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Practice sight reading with Sight Reading Factory. Use this tool to improve your music reading skills.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recording-booth" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Backing Track Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Backing Track</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-64 overflow-y-auto space-y-2">
                  <Button
                    variant={!selectedTrack ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedTrack(null)}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Practice Without Track
                  </Button>
                  
                  {backingTracks.map((track) => (
                    <Button
                      key={track.id}
                      variant={selectedTrack?.id === track.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedTrack(track)}
                    >
                      <Music className="h-4 w-4 mr-2" />
                      {track.title}
                    </Button>
                  ))}
                </div>

                {selectedTrack && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">{selectedTrack.title}</p>
                    <audio controls className="w-full mt-2">
                      <source src={selectedTrack.file_url} type="audio/mpeg" />
                    </audio>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recording Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Recording Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Mic className="h-5 w-5 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      size="lg"
                      variant="destructive"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      Stop Recording
                    </Button>
                  )}

                  {isRecording && (
                    <div className="animate-pulse text-red-600 font-medium">
                      🔴 Recording in progress...
                    </div>
                  )}
                </div>

                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Tips:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use headphones to prevent feedback</li>
                    <li>Find a quiet recording environment</li>
                    <li>Position yourself close to the microphone</li>
                    <li>Select a backing track or practice without one</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="archive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                My Recordings ({myRecordings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myRecordings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No recordings yet. Use the Recording Booth to create your first recording!
                </p>
              ) : (
                <div className="space-y-4">
                  {myRecordings.map((recording) => (
                    <div key={recording.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{recording.title}</h3>
                        <div className="flex gap-2">
                          <Select
                            value={recording.share_level}
                            onValueChange={(value) => updateShareLevel(recording.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private">Private</SelectItem>
                              <SelectItem value="section">Section</SelectItem>
                              <SelectItem value="group">Group</SelectItem>
                              <SelectItem value="director">Director</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteRecording(recording.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{recording.share_level}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(recording.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <audio controls className="w-full">
                        <source src={recording.recording_file_url} type="audio/wav" />
                      </audio>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share className="h-5 w-5" />
                Shared Recordings ({sharedRecordings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sharedRecordings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No shared recordings available.
                </p>
              ) : (
                <div className="space-y-4">
                  {sharedRecordings.map((recording) => (
                    <div key={recording.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{recording.title}</h3>
                        <Badge variant="secondary">{recording.share_level}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-muted-foreground">
                          By {recording.profiles?.first_name} {recording.profiles?.last_name}
                        </span>
                        {recording.profiles?.voice_part && (
                          <Badge variant="outline">{recording.profiles.voice_part}</Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {new Date(recording.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <audio controls className="w-full">
                        <source src={recording.recording_file_url} type="audio/wav" />
                      </audio>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Recording Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Recording</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Recording Title</label>
              <Input
                value={recordingTitle}
                onChange={(e) => setRecordingTitle(e.target.value)}
                placeholder="Enter recording title"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Share Level</label>
              <Select value={shareLevel} onValueChange={setShareLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private (only you)</SelectItem>
                  <SelectItem value="section">Section (your voice part)</SelectItem>
                  <SelectItem value="group">Group (all members)</SelectItem>
                  <SelectItem value="director">Director (directors only)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {recordedBlob && (
              <div>
                <label className="text-sm font-medium">Preview</label>
                <audio controls className="w-full mt-2">
                  <source src={URL.createObjectURL(recordedBlob)} type="audio/wav" />
                </audio>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveRecording}>
              Save Recording
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
