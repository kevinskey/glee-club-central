import React, { useState, useEffect } from 'react';
import { AdminV2Layout } from '@/layouts/AdminV2Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Music, Upload, Search, Filter, Eye, Edit, Trash2, 
  FileText, Users, Sparkles, Download 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  voicing: string;
  file_url: string;
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

export default function SheetMusicV2Page() {
  const { user } = useAuth();
  const [sheetMusic, setSheetMusic] = useState<SheetMusic[]>([]);
  const [filteredMusic, setFilteredMusic] = useState<SheetMusic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterVoicePart, setFilterVoicePart] = useState('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
          uploaded_by: user?.id
        })
        .select()
        .single();

      if (musicError) throw musicError;

      // Insert metadata if provided
      if (uploadForm.genre || uploadForm.difficulty_level || uploadForm.tags) {
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
      }

      toast.success('Sheet music uploaded successfully');
      setIsUploadDialogOpen(false);
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

  const musicStats = {
    total: sheetMusic.length,
    genres: [...new Set(sheetMusic.map(m => m.metadata?.genre).filter(Boolean))].length,
    languages: [...new Set(sheetMusic.map(m => m.metadata?.language).filter(Boolean))].length,
    recent: sheetMusic.filter(m => {
      const uploadDate = new Date(m.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return uploadDate > weekAgo;
    }).length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminV2Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Sheet Music Library</h1>
            <p className="text-muted-foreground">Organize and manage choir sheet music collection</p>
          </div>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Music
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pieces</p>
                  <p className="text-2xl font-bold">{musicStats.total}</p>
                </div>
                <Music className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Genres</p>
                  <p className="text-2xl font-bold">{musicStats.genres}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Languages</p>
                  <p className="text-2xl font-bold">{musicStats.languages}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Recent</p>
                  <p className="text-2xl font-bold">{musicStats.recent}</p>
                </div>
                <Badge className="bg-orange-100 text-orange-800">This Week</Badge>
              </div>
            </CardContent>
          </Card>
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
                  <SelectValue placeholder="All Genres" />
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
                  <SelectValue placeholder="All Voice Parts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Voice Parts</SelectItem>
                  {VOICE_PARTS.map(part => (
                    <SelectItem key={part} value={part}>{part}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground flex items-center">
                <Filter className="h-4 w-4 mr-2" />
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
                        <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">
                          {music.metadata.genre}
                        </Badge>
                      )}
                      {music.metadata?.difficulty_level && (
                        <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-800">
                          {music.metadata.difficulty_level}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div><strong>Composer:</strong> {music.composer}</div>
                      {music.voicing && <div><strong>Voicing:</strong> {music.voicing}</div>}
                      {music.metadata?.language && (
                        <div><strong>Language:</strong> {music.metadata.language}</div>
                      )}
                    </div>

                    {music.metadata?.voice_parts && music.metadata.voice_parts.length > 0 && (
                      <div className="flex gap-1 mb-2">
                        {music.metadata.voice_parts.map(part => (
                          <Badge key={part} variant="outline" className="text-xs bg-green-50 border-green-200 text-green-800">
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
                        const link = document.createElement('a');
                        link.href = music.file_url;
                        link.download = `${music.title} - ${music.composer}.pdf`;
                        link.click();
                      }}
                    >
                      <Download className="h-3 w-3" />
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
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
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
                    <Button variant="outline" size="sm">
                      <Sparkles className="h-4 w-4" />
                    </Button>
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
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
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
    </AdminV2Layout>
  );
}
