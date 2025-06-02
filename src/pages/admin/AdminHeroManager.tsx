import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Image, Save, Trash2, Eye, Settings, Plus, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminHeroManager() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [heroes, setHeroes] = useState([
    {
      id: 1,
      title: 'Welcome to Spelman College Glee Club',
      subtitle: 'A tradition of excellence since 1925',
      description: 'The Spelman College Glee Club has maintained a reputation of choral excellence for over 90 years.',
      image: '/images/hero-1.jpg',
      page: 'home',
      active: true,
    },
    {
      id: 2,
      title: 'Upcoming Performances',
      subtitle: 'Join us for our Spring Concert Series',
      description: 'Experience the beauty and power of our voices at our upcoming performances.',
      image: '/images/hero-2.jpg',
      page: 'events',
      active: true,
    },
    {
      id: 3,
      title: 'Our History',
      subtitle: 'A legacy of musical excellence',
      description: 'Learn about our rich history and the impact we\'ve made in choral music.',
      image: '/images/hero-3.jpg',
      page: 'about',
      active: true,
    }
  ]);
  
  const [editingHero, setEditingHero] = useState(null);
  const [newHero, setNewHero] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    page: 'home',
    active: true
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [previewHero, setPreviewHero] = useState(null);
  
  const handleEditHero = (hero) => {
    setEditingHero({...hero});
    setIsEditing(true);
    setIsAdding(false);
  };
  
  const handleAddHero = () => {
    setIsAdding(true);
    setIsEditing(false);
    setEditingHero(null);
  };
  
  const handleSaveHero = () => {
    if (isEditing && editingHero) {
      setHeroes(heroes.map(h => h.id === editingHero.id ? editingHero : h));
      setIsEditing(false);
      setEditingHero(null);
    } else if (isAdding) {
      const newId = Math.max(...heroes.map(h => h.id)) + 1;
      setHeroes([...heroes, {...newHero, id: newId}]);
      setIsAdding(false);
      setNewHero({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        page: 'home',
        active: true
      });
    }
  };
  
  const handleDeleteHero = (id) => {
    setHeroes(heroes.filter(h => h.id !== id));
    if (editingHero && editingHero.id === id) {
      setIsEditing(false);
      setEditingHero(null);
    }
  };
  
  const handlePreviewHero = (hero) => {
    setPreviewHero(hero);
  };
  
  const handleClosePreview = () => {
    setPreviewHero(null);
  };
  
  const filteredHeroes = heroes.filter(hero => hero.page === activeTab);
  
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Image className="h-6 w-6" />
            Hero Banner Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="home">Home Page</TabsTrigger>
                <TabsTrigger value="about">About Page</TabsTrigger>
                <TabsTrigger value="events">Events Page</TabsTrigger>
                <TabsTrigger value="contact">Contact Page</TabsTrigger>
              </TabsList>
              
              <Button onClick={handleAddHero} className="gap-1">
                <Plus className="h-4 w-4" /> Add Hero
              </Button>
            </div>
            
            <TabsContent value="home" className="space-y-4">
              {filteredHeroes.length === 0 ? (
                <Alert>
                  <AlertDescription>No hero banners found for this page. Add one to get started.</AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredHeroes.map(hero => (
                    <Card key={hero.id} className="overflow-hidden">
                      <div className="relative h-40 bg-gray-100">
                        {hero.image ? (
                          <img 
                            src={hero.image} 
                            alt={hero.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Image className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button size="sm" variant="secondary" onClick={() => handlePreviewHero(hero)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleEditHero(hero)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteHero(hero.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {!hero.active && (
                          <Badge variant="secondary" className="absolute bottom-2 left-2">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold truncate">{hero.title}</h3>
                        <p className="text-sm text-gray-500 truncate">{hero.subtitle}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="about" className="space-y-4">
              {/* Same structure as home tab */}
              {filteredHeroes.length === 0 ? (
                <Alert>
                  <AlertDescription>No hero banners found for this page. Add one to get started.</AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredHeroes.map(hero => (
                    <Card key={hero.id} className="overflow-hidden">
                      {/* Same card content as in home tab */}
                      <div className="relative h-40 bg-gray-100">
                        {hero.image ? (
                          <img 
                            src={hero.image} 
                            alt={hero.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Image className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button size="sm" variant="secondary" onClick={() => handlePreviewHero(hero)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleEditHero(hero)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteHero(hero.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {!hero.active && (
                          <Badge variant="secondary" className="absolute bottom-2 left-2">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold truncate">{hero.title}</h3>
                        <p className="text-sm text-gray-500 truncate">{hero.subtitle}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="events" className="space-y-4">
              {/* Same structure as home tab */}
              {filteredHeroes.length === 0 ? (
                <Alert>
                  <AlertDescription>No hero banners found for this page. Add one to get started.</AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredHeroes.map(hero => (
                    <Card key={hero.id} className="overflow-hidden">
                      {/* Same card content as in home tab */}
                      <div className="relative h-40 bg-gray-100">
                        {hero.image ? (
                          <img 
                            src={hero.image} 
                            alt={hero.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Image className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button size="sm" variant="secondary" onClick={() => handlePreviewHero(hero)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleEditHero(hero)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteHero(hero.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {!hero.active && (
                          <Badge variant="secondary" className="absolute bottom-2 left-2">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold truncate">{hero.title}</h3>
                        <p className="text-sm text-gray-500 truncate">{hero.subtitle}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              {/* Same structure as home tab */}
              {filteredHeroes.length === 0 ? (
                <Alert>
                  <AlertDescription>No hero banners found for this page. Add one to get started.</AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredHeroes.map(hero => (
                    <Card key={hero.id} className="overflow-hidden">
                      {/* Same card content as in home tab */}
                      <div className="relative h-40 bg-gray-100">
                        {hero.image ? (
                          <img 
                            src={hero.image} 
                            alt={hero.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Image className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button size="sm" variant="secondary" onClick={() => handlePreviewHero(hero)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleEditHero(hero)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteHero(hero.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {!hero.active && (
                          <Badge variant="secondary" className="absolute bottom-2 left-2">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold truncate">{hero.title}</h3>
                        <p className="text-sm text-gray-500 truncate">{hero.subtitle}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Edit/Add Form */}
          {(isEditing || isAdding) && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{isEditing ? 'Edit Hero Banner' : 'Add New Hero Banner'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        value={isEditing ? editingHero.title : newHero.title}
                        onChange={(e) => isEditing 
                          ? setEditingHero({...editingHero, title: e.target.value})
                          : setNewHero({...newHero, title: e.target.value})
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input 
                        id="subtitle" 
                        value={isEditing ? editingHero.subtitle : newHero.subtitle}
                        onChange={(e) => isEditing 
                          ? setEditingHero({...editingHero, subtitle: e.target.value})
                          : setNewHero({...newHero, subtitle: e.target.value})
                        }
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      rows={3}
                      value={isEditing ? editingHero.description : newHero.description}
                      onChange={(e) => isEditing 
                        ? setEditingHero({...editingHero, description: e.target.value})
                        : setNewHero({...newHero, description: e.target.value})
                      }
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input 
                      id="image" 
                      value={isEditing ? editingHero.image : newHero.image}
                      onChange={(e) => isEditing 
                        ? setEditingHero({...editingHero, image: e.target.value})
                        : setNewHero({...newHero, image: e.target.value})
                      }
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="page">Page</Label>
                      <select 
                        id="page"
                        className="w-full p-2 border rounded"
                        value={isEditing ? editingHero.page : newHero.page}
                        onChange={(e) => isEditing 
                          ? setEditingHero({...editingHero, page: e.target.value})
                          : setNewHero({...newHero, page: e.target.value})
                        }
                      >
                        <option value="home">Home</option>
                        <option value="about">About</option>
                        <option value="events">Events</option>
                        <option value="contact">Contact</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <input 
                        type="checkbox" 
                        id="active"
                        checked={isEditing ? editingHero.active : newHero.active}
                        onChange={(e) => isEditing 
                          ? setEditingHero({...editingHero, active: e.target.checked})
                          : setNewHero({...newHero, active: e.target.checked})
                        }
                      />
                      <Label htmlFor="active">Active</Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setIsAdding(false);
                      setEditingHero(null);
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveHero} className="gap-1">
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Preview Modal */}
          {previewHero && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-bold">Hero Preview</h2>
                  <Button variant="ghost" onClick={handleClosePreview}>
                    ✕
                  </Button>
                </div>
                <div className="p-0">
                  <div className="relative h-64 md:h-96">
                    {previewHero.image ? (
                      <img 
                        src={previewHero.image} 
                        alt={previewHero.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <Image className="h-24 w-24 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                      <h1 className="text-2xl md:text-4xl font-bold mb-2">{previewHero.title}</h1>
                      <h2 className="text-xl md:text-2xl mb-4">{previewHero.subtitle}</h2>
                      <p className="max-w-xl">{previewHero.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t flex justify-end">
                  <Button onClick={handleClosePreview}>Close Preview</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
