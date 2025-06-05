
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Upload, Search, Filter, Eye, Edit, Trash2, FileText, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIAssistantButton } from '@/components/ai/AIAssistantButton';
import { useAISettings } from '@/components/ai/useAISettings';

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  voicing: string;
  file_url: string;
  file_path: string;
  created_at: string;
  uploaded_by: string;
  metadata?: {
    genre?: string;
    difficulty_level?: string;
    language?: string;
    tags?: string[];
    voice_parts?: string[];
  };
}

const GENRES = ['Classical', 'Gospel', 'Jazz', 'Folk', 'Contemporary', 'Spiritual', 'Pop', 'Musical Theatre'];
const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const VOICE_PARTS = ['Soprano 1', 'Soprano 2', 'Alto 1', 'Alto 2', 'Tenor', 'Bass'];
const LANGUAGES = ['English', 'Latin', 'French', 'German', 'Italian', 'Spanish', 'Other'];

export default function SheetMusicLibraryPage() {
  const [sheetMusic, setSheetMusic] = useState<SheetMusic[]>([]);
  const [filteredMusic, setFilteredMusic] = useState<SheetMusic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<SheetMusic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterVoicePart, setFilterVoicePart] = useState('all');
  const { isFeatureEnabled } = useAISettings();

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    composer: '',
    voicing: '',
    genre: '',
    difficulty_level: '',
    language: 'English',
    tags: '',
    voice_parts: [] as string[],
    file: null as File | null
  });

  useEffect(() => {
    fetchSheetMusic();
  }, []);

  useEffect(() => {
    filterMusic();
  }, [sheetMusic, searchTerm, filterGenre, filterVoicePart]);

  const fetchSheetMusic = async () => {
    try {
      const { data, error } = await supabase
        .from('sheet_music')
        .select(`
          *,
          sheet_music_metadata (
            genre,
            difficulty_level,
            language,
            tags,
            voice_parts
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const musicWithMetadata = data?.map(item => ({
        ...item,
        metadata: item.sheet_music_metadata?.[0] || {}
      })) || [];

      setSheetMusic(musicWithMetadata);
    } catch (error) {
      console.error('Error fetching sheet music:', error);
      toast.error('Failed to load sheet music');
    } finally {
      setIsLoading(false);
    }
  };

  const filterMusic = () => {
    let filtered = sheetMusic;

    if (searchTerm) {
      filtered = filtered.filter(music =>
        music.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        music.composer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        music.metadata?.tags?.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterGenre !== 'all') {
      filtered = filtered.filter(music => music.metadata?.genre === filterGenre);
    }

    if (filterVoicePart !== 'all') {
      filtered = filtered.filter(music => 
        music.metadata?.voice_parts?.includes(filterVoicePart)
      );
    }

    setFilteredMusic(filtered);
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.title || !uploadForm.composer) {
      toast.error('Please fill in all required fields and select a file');
      return;
    }

    try {
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${uploadForm.file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('sheet-music')
        .upload(fileName, uploadForm.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('sheet-music')
        .getPublicUrl(fileName);

      // Insert sheet music record
      const { data: musicData, error: musicError } = await supabase
        .from('sheet_music')
        .insert({
          title: uploadForm.title,
          composer: uploadForm.composer,
          voicing: uploadForm.voicing,
          file_url: publicUrl,
          file_path: fileName,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (musicError) throw musicError;

      // Insert metadata
      const tags = uploadForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      const { error: metadataError } = await supabase
        .from('sheet_music_metadata')
        .insert({
          sheet_music_id: musicData.id,
          genre: uploadForm.genre,
          difficulty_level: uploadForm.difficulty_level,
          language: uploadForm.language,
          tags,
          voice_parts: uploadForm.voice_parts
        });

      if (metadataError) throw metadataError;

      toast.success('Sheet music uploaded successfully');
      setUploadDialogOpen(false);
      resetUploadForm();
      fetchSheetMusic();
    } catch (error) {
      console.error('Error uploading sheet music:', error);
      toast.error('Failed to upload sheet music');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sheet music?')) return;

    try {
      const { error } = await supabase
        .from('sheet_music')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Sheet music deleted successfully');
      fetchSheetMusic();
    } catch (error) {
      console.error('Error deleting sheet music:', error);
      toast.error('Failed to delete sheet music');
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      title: '',
      composer: '',
      voicing: '',
      genre: '',
      difficulty_level: '',
      language: 'English',
      tags: '',
      voice_parts: [],
      file: null
    });
  };

  const handleVoicePartToggle = (voicePart: string) => {
    setUploadForm(prev => ({
      ...prev,
      voice_parts: prev.voice_parts.includes(voicePart)
        ? prev.voice_parts.filter(vp => vp !== voicePart)
        : [...prev.voice_parts, voicePart]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sheet Music Library</h1>
          <p className="text-muted-foreground">Manage and organize choir sheet music</p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Music
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, composer, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterGenre} onValueChange={setFilterGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {GENRES.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterVoicePart} onValueChange={setFilterVoicePart}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by voice part" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Voice Parts</SelectItem>
                {VOICE_PARTS.map(part => (
                  <SelectItem key={part} value={part}>{part}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              <Music className="h-4 w-4 mr-2" />
              {filteredMusic.length} pieces
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sheet Music Grid */}
      <div className="grid gap-4">
        {filteredMusic.map((music) => (
          <Card key={music.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{music.title}</h3>
                    {music.metadata?.genre && (
                      <Badge variant="outline">{music.metadata.genre}</Badge>
                    )}
                    {music.metadata?.difficulty_level && (
                      <Badge variant="secondary">{music.metadata.difficulty_level}</Badge>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground mb-2">
                    <strong>Composer:</strong> {music.composer} | 
                    <strong> Voicing:</strong> {music.voicing}
                  </p>

                  {music.metadata?.voice_parts && music.metadata.voice_parts.length > 0 && (
                    <div className="flex gap-1 mb-2">
                      {music.metadata.voice_parts.map(part => (
                        <Badge key={part} variant="outline" className="text-xs">
                          {part}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {music.metadata?.tags && music.metadata.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {music.metadata.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(music.file_url, '_blank')}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMusic(music);
                      setEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(music.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Sheet Music</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <div className="flex gap-2">
                  <Input
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter song title"
                  />
                  {isFeatureEnabled('content_generation') && (
                    <AIAssistantButton
                      currentValue={uploadForm.title}
                      onValueChange={(value) => setUploadForm(prev => ({ ...prev, title: value }))}
                      type="generate"
                      context="choir song title"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Composer *</label>
                <Input
                  value={uploadForm.composer}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, composer: e.target.value }))}
                  placeholder="Enter composer name"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Voicing</label>
                <Input
                  value={uploadForm.voicing}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, voicing: e.target.value }))}
                  placeholder="e.g., SATB, SSA, TTBB"
                />
              </div>

              <div>
                <label className="text-sm font-medium">PDF File *</label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setUploadForm(prev => ({ 
                    ...prev, 
                    file: e.target.files?.[0] || null 
                  }))}
                />
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Genre</label>
                  <Select 
                    value={uploadForm.genre} 
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, genre: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENRES.map(genre => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select 
                    value={uploadForm.difficulty_level} 
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, difficulty_level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_LEVELS.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Language</label>
                <Select 
                  value={uploadForm.language} 
                  onValueChange={(value) => setUploadForm(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Voice Parts</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {VOICE_PARTS.map(part => (
                    <Button
                      key={part}
                      variant={uploadForm.voice_parts.includes(part) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVoicePartToggle(part)}
                      type="button"
                    >
                      {part}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Tags</label>
                <Input
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  e.g., Christmas, Wedding, Graduation
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Music
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
