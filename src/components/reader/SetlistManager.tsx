
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useSetlists, usePDFLibrary, PDFFile, Setlist } from '@/hooks/usePDFLibrary';
import { useAuth } from '@/contexts/AuthContext';
import { ListMusic, Plus, Trash2, Edit, Music, Eye } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { PDFThumbnail } from '@/components/pdf/PDFThumbnail';

interface SetlistManagerProps {
  onViewPDF?: (pdf: PDFFile) => void;
}

export function SetlistManager({ onViewPDF }: SetlistManagerProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const { setlists, loading: setlistsLoading, createSetlist, deleteSetlist, addPDFToSetlist, removePDFFromSetlist } = useSetlists();
  const { pdfFiles, loading: pdfsLoading } = usePDFLibrary();
  
  const [selectedSetlist, setSelectedSetlist] = useState<Setlist | null>(null);
  const [newSetlistName, setNewSetlistName] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAddPDFDialog, setShowAddPDFDialog] = useState(false);

  const canEditSetlist = (setlist: Setlist) => {
    if (!isAuthenticated) return false;
    return isAdmin() || setlist.user_id === useAuth().user?.id;
  };

  const canDeleteSetlist = (setlist: Setlist) => {
    return canEditSetlist(setlist);
  };

  const handleCreateSetlist = async () => {
    if (!newSetlistName.trim()) return;
    
    try {
      await createSetlist(newSetlistName);
      setNewSetlistName('');
      setShowCreateDialog(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleDeleteSetlist = async (setlistId: string) => {
    if (!confirm('Are you sure you want to delete this setlist?')) return;
    
    try {
      await deleteSetlist(setlistId);
      if (selectedSetlist?.id === setlistId) {
        setSelectedSetlist(null);
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleAddPDFToSetlist = async (pdfId: string) => {
    if (!selectedSetlist) return;
    
    try {
      await addPDFToSetlist(selectedSetlist.id, pdfId);
      setShowAddPDFDialog(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleRemovePDFFromSetlist = async (pdfId: string) => {
    if (!selectedSetlist) return;
    
    try {
      await removePDFFromSetlist(selectedSetlist.id, pdfId);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const getSetlistPDFs = (setlist: Setlist): PDFFile[] => {
    if (!setlist.sheet_music_ids) return [];
    return pdfFiles.filter(pdf => setlist.sheet_music_ids.includes(pdf.id));
  };

  const getAvailablePDFs = (): PDFFile[] => {
    if (!selectedSetlist) return pdfFiles;
    const setlistPDFIds = selectedSetlist.sheet_music_ids || [];
    return pdfFiles.filter(pdf => !setlistPDFIds.includes(pdf.id));
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <ListMusic className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Sign In Required</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in to create and manage setlists
          </p>
        </CardContent>
      </Card>
    );
  }

  if (setlistsLoading || pdfsLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#003366] dark:text-white">Setlist Manager</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Create and manage your sheet music setlists
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              New Setlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Setlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="setlist-name">Setlist Name</Label>
                <Input
                  id="setlist-name"
                  value={newSetlistName}
                  onChange={(e) => setNewSetlistName(e.target.value)}
                  placeholder="Enter setlist name"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSetlist} disabled={!newSetlistName.trim()}>
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Setlists List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListMusic className="h-5 w-5" />
              My Setlists
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {setlists.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center py-4">
                No setlists yet. Create your first one!
              </p>
            ) : (
              setlists.map((setlist) => (
                <div
                  key={setlist.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedSetlist?.id === setlist.id
                      ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedSetlist(setlist)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{setlist.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {setlist.sheet_music_ids?.length || 0} PDFs
                      </p>
                    </div>
                    {canDeleteSetlist(setlist) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSetlist(setlist.id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Setlist Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedSetlist ? selectedSetlist.name : 'Select a Setlist'}
              </CardTitle>
              {selectedSetlist && canEditSetlist(selectedSetlist) && (
                <Dialog open={showAddPDFDialog} onOpenChange={setShowAddPDFDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add PDF
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add PDF to Setlist</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {getAvailablePDFs().map((pdf) => (
                        <Card 
                          key={pdf.id} 
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => handleAddPDFToSetlist(pdf.id)}
                        >
                          <div className="h-32 bg-gray-100 rounded-t-lg overflow-hidden">
                            <PDFThumbnail 
                              url={pdf.file_url} 
                              title={pdf.title}
                              className="w-full h-full"
                            />
                          </div>
                          <CardContent className="p-3">
                            <h4 className="font-medium text-sm truncate">{pdf.title}</h4>
                            {pdf.voice_part && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                {pdf.voice_part}
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedSetlist ? (
              <div className="text-center py-8">
                <Music className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Select a setlist to view its contents
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getSetlistPDFs(selectedSetlist).length === 0 ? (
                  <div className="text-center py-8">
                    <Music className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      This setlist is empty. Add some PDFs to get started!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {getSetlistPDFs(selectedSetlist).map((pdf) => (
                      <Card key={pdf.id} className="group">
                        <div className="relative">
                          <div className="h-32 bg-gray-100 rounded-t-lg overflow-hidden">
                            <PDFThumbnail 
                              url={pdf.file_url} 
                              title={pdf.title}
                              className="w-full h-full"
                            />
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1">
                            {onViewPDF && (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onViewPDF(pdf)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {canEditSetlist(selectedSetlist) && (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemovePDFFromSetlist(pdf.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h4 className="font-medium text-sm truncate">{pdf.title}</h4>
                          {pdf.voice_part && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {pdf.voice_part}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
