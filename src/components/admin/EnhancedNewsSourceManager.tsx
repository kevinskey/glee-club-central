
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Rss, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Globe, 
  GraduationCap, 
  Music, 
  Award,
  Building,
  Users,
  Calendar,
  Hash,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface NewsSource {
  id: string;
  name: string;
  url: string;
  category: string;
  enabled: boolean;
  icon: any;
  description: string;
  priority: number;
}

interface EnhancedNewsSourceManagerProps {
  onSourcesChange?: (sources: NewsSource[]) => void;
}

export function EnhancedNewsSourceManager({ onSourcesChange }: EnhancedNewsSourceManagerProps) {
  const [activeTab, setActiveTab] = useState('predefined');
  const [customSources, setCustomSources] = useState<NewsSource[]>([]);
  const [newSourceForm, setNewSourceForm] = useState({
    name: '',
    url: '',
    category: 'education',
    description: ''
  });

  // Predefined news sources organized by category
  const predefinedSources = {
    education: [
      {
        id: 'google-hbcu',
        name: 'HBCU News',
        url: 'https://news.google.com/rss/search?q=HBCU&hl=en-US&gl=US&ceid=US:en',
        category: 'education',
        enabled: true,
        icon: GraduationCap,
        description: 'Latest news about Historically Black Colleges and Universities',
        priority: 1
      },
      {
        id: 'google-spelman',
        name: 'Spelman College',
        url: 'https://news.google.com/rss/search?q=Spelman%20College&hl=en-US&gl=US&ceid=US:en',
        category: 'education',
        enabled: true,
        icon: Building,
        description: 'News specifically about Spelman College',
        priority: 2
      },
      {
        id: 'chronicle-higher-ed',
        name: 'Chronicle of Higher Education',
        url: 'https://www.chronicle.com/section/news/rss',
        category: 'education',
        enabled: false,
        icon: Globe,
        description: 'Higher education news and trends',
        priority: 3
      },
      {
        id: 'inside-higher-ed',
        name: 'Inside Higher Ed',
        url: 'https://www.insidehighered.com/rss/news',
        category: 'education',
        enabled: false,
        icon: Globe,
        description: 'College and university news coverage',
        priority: 4
      }
    ],
    music: [
      {
        id: 'google-choral',
        name: 'Choral Music News',
        url: 'https://news.google.com/rss/search?q=choral%20music&hl=en-US&gl=US&ceid=US:en',
        category: 'music',
        enabled: true,
        icon: Music,
        description: 'Latest choral music and performance news',
        priority: 1
      },
      {
        id: 'google-glee-club',
        name: 'Glee Club News',
        url: 'https://news.google.com/rss/search?q="glee%20club"&hl=en-US&gl=US&ceid=US:en',
        category: 'music',
        enabled: false,
        icon: Users,
        description: 'News about glee clubs and collegiate choirs',
        priority: 2
      },
      {
        id: 'classical-music',
        name: 'Classical Music News',
        url: 'https://news.google.com/rss/search?q=classical%20music&hl=en-US&gl=US&ceid=US:en',
        category: 'music',
        enabled: false,
        icon: Music,
        description: 'Classical music industry updates',
        priority: 3
      }
    ],
    scholarships: [
      {
        id: 'google-scholarships',
        name: 'Scholarship Opportunities',
        url: 'https://news.google.com/rss/search?q=college%20scholarships&hl=en-US&gl=US&ceid=US:en',
        category: 'scholarships',
        enabled: false,
        icon: Award,
        description: 'College scholarship and funding news',
        priority: 1
      },
      {
        id: 'google-music-scholarships',
        name: 'Music Scholarships',
        url: 'https://news.google.com/rss/search?q=music%20scholarships&hl=en-US&gl=US&ceid=US:en',
        category: 'scholarships',
        enabled: false,
        icon: Award,
        description: 'Music-specific scholarship opportunities',
        priority: 2
      }
    ],
    events: [
      {
        id: 'google-atlanta-events',
        name: 'Atlanta Cultural Events',
        url: 'https://news.google.com/rss/search?q=Atlanta%20cultural%20events&hl=en-US&gl=US&ceid=US:en',
        category: 'events',
        enabled: false,
        icon: Calendar,
        description: 'Cultural events in the Atlanta area',
        priority: 1
      },
      {
        id: 'google-music-festivals',
        name: 'Music Festivals',
        url: 'https://news.google.com/rss/search?q=music%20festivals&hl=en-US&gl=US&ceid=US:en',
        category: 'events',
        enabled: false,
        icon: Calendar,
        description: 'Music festival and concert announcements',
        priority: 2
      }
    ]
  };

  const [enabledSources, setEnabledSources] = useState(() => {
    const initialEnabled: Record<string, boolean> = {};
    Object.values(predefinedSources).flat().forEach(source => {
      initialEnabled[source.id] = source.enabled;
    });
    return initialEnabled;
  });

  const toggleSource = (sourceId: string) => {
    setEnabledSources(prev => ({
      ...prev,
      [sourceId]: !prev[sourceId]
    }));
  };

  const addCustomSource = () => {
    if (!newSourceForm.name || !newSourceForm.url) {
      toast.error('Name and URL are required');
      return;
    }

    const newSource: NewsSource = {
      id: `custom-${Date.now()}`,
      name: newSourceForm.name,
      url: newSourceForm.url,
      category: newSourceForm.category,
      enabled: true,
      icon: Rss,
      description: newSourceForm.description,
      priority: customSources.length + 1
    };

    setCustomSources(prev => [...prev, newSource]);
    setNewSourceForm({ name: '', url: '', category: 'education', description: '' });
    toast.success('Custom news source added');
  };

  const removeCustomSource = (sourceId: string) => {
    setCustomSources(prev => prev.filter(s => s.id !== sourceId));
    toast.success('Custom source removed');
  };

  const testFeed = async (url: string, name: string) => {
    try {
      const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      
      if (data.status === 'ok' && data.items?.length > 0) {
        toast.success(`${name} feed is working! Found ${data.items.length} items.`);
      } else {
        toast.error(`${name} feed returned no items or invalid format.`);
      }
    } catch (error) {
      toast.error(`Failed to test ${name} feed.`);
    }
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    const icons = {
      education: GraduationCap,
      music: Music,
      scholarships: Award,
      events: Calendar,
      custom: Hash
    };
    const Icon = icons[category as keyof typeof icons] || Rss;
    return <Icon className="h-4 w-4" />;
  };

  const renderSourceCard = (source: NewsSource, isCustom = false) => (
    <Card key={source.id} className="relative">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <source.icon className="h-5 w-5 text-glee-columbia" />
            <div>
              <h4 className="font-medium">{source.name}</h4>
              <p className="text-sm text-muted-foreground">{source.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCustom && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCustomSource(source.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => testFeed(source.url, source.name)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Switch
              checked={isCustom ? source.enabled : enabledSources[source.id]}
              onCheckedChange={() => isCustom ? 
                setCustomSources(prev => prev.map(s => 
                  s.id === source.id ? { ...s, enabled: !s.enabled } : s
                )) : 
                toggleSource(source.id)
              }
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <CategoryIcon category={source.category} />
            <span className="ml-1 capitalize">{source.category}</span>
          </Badge>
          <Badge variant="outline" className="text-xs">
            Priority: {source.priority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rss className="h-5 w-5 text-glee-columbia" />
            Enhanced News Source Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="predefined">Predefined Sources</TabsTrigger>
              <TabsTrigger value="custom">Custom Sources</TabsTrigger>
              <TabsTrigger value="settings">Feed Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="predefined" className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select from our curated collection of news sources relevant to college choirs and education.
                </p>

                {Object.entries(predefinedSources).map(([category, sources]) => (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CategoryIcon category={category} />
                      <h3 className="text-lg font-semibold capitalize">{category}</h3>
                      <Badge variant="outline">
                        {sources.filter(s => enabledSources[s.id]).length}/{sources.length} enabled
                      </Badge>
                    </div>
                    <div className="grid gap-3">
                      {sources.map(source => renderSourceCard(source))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Custom RSS Feed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="source-name">Source Name</Label>
                      <Input
                        id="source-name"
                        placeholder="e.g., Atlanta Music Scene"
                        value={newSourceForm.name}
                        onChange={(e) => setNewSourceForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source-category">Category</Label>
                      <Select
                        value={newSourceForm.category}
                        onValueChange={(value) => setNewSourceForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="scholarships">Scholarships</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source-url">RSS Feed URL</Label>
                    <Input
                      id="source-url"
                      type="url"
                      placeholder="https://example.com/rss"
                      value={newSourceForm.url}
                      onChange={(e) => setNewSourceForm(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source-description">Description (optional)</Label>
                    <Textarea
                      id="source-description"
                      placeholder="Brief description of this news source"
                      value={newSourceForm.description}
                      onChange={(e) => setNewSourceForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <Button onClick={addCustomSource} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Source
                  </Button>
                </CardContent>
              </Card>

              {customSources.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Your Custom Sources</h3>
                  <div className="grid gap-3">
                    {customSources.map(source => renderSourceCard(source, true))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Feed Management Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Mix Multiple Sources</Label>
                        <p className="text-sm text-muted-foreground">
                          Combine items from multiple enabled sources
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Refresh Interval (minutes)</Label>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Maximum Items per Source</Label>
                      <Input type="number" defaultValue="5" min="1" max="20" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Content Filtering</Label>
                      <Textarea 
                        placeholder="Keywords to filter out (comma-separated)"
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Sources Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Enabled Sources:</span>
                      <Badge>
                        {Object.values(enabledSources).filter(Boolean).length + customSources.filter(s => s.enabled).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Education Sources:</span>
                      <Badge variant="outline">
                        {predefinedSources.education.filter(s => enabledSources[s.id]).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Music Sources:</span>
                      <Badge variant="outline">
                        {predefinedSources.music.filter(s => enabledSources[s.id]).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Custom Sources:</span>
                      <Badge variant="outline">
                        {customSources.filter(s => s.enabled).length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
