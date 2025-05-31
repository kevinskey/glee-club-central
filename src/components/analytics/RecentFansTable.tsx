
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit3 } from 'lucide-react';
import { FanTagEditor } from './FanTagEditor';
import { FanTagFilter } from './FanTagFilter';

interface Fan {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  tags?: string[];
  notes?: string;
}

interface RecentFansTableProps {
  data: Fan[];
  isLoading?: boolean;
  onFanUpdate?: (fanId: string, tags: string[], notes: string) => Promise<void>;
  showFilter?: boolean;
}

export function RecentFansTable({ data, isLoading, onFanUpdate, showFilter = false }: RecentFansTableProps) {
  const [selectedFan, setSelectedFan] = useState<Fan | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEditFan = (fan: Fan) => {
    setSelectedFan(fan);
    setIsEditorOpen(true);
  };

  const handleSaveFan = async (fanId: string, tags: string[], notes: string) => {
    if (onFanUpdate) {
      await onFanUpdate(fanId, tags, notes);
    }
  };

  // Get all unique tags from the data
  const availableTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    data.forEach(fan => {
      fan.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [data]);

  // Filter data based on selected tags
  const filteredData = React.useMemo(() => {
    if (selectedTags.length === 0) return data;
    return data.filter(fan => 
      selectedTags.every(selectedTag => 
        fan.tags?.includes(selectedTag)
      )
    );
  }, [data, selectedTags]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Fan Signups</CardTitle>
          <CardDescription>
            {showFilter ? 'Manage fan tags and segmentation' : 'Latest fans who joined our community'}
          </CardDescription>
          {showFilter && availableTags.length > 0 && (
            <FanTagFilter
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Spinner size="lg" />
                <p className="mt-2 text-sm text-muted-foreground">Loading fans...</p>
              </div>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fan</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Joined</TableHead>
                    {onFanUpdate && <TableHead className="w-12"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((fan) => (
                    <TableRow key={fan.id}>
                      <TableCell className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-glee-spelman text-white text-xs">
                            {getInitials(fan.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{fan.full_name}</span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {fan.email}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {fan.tags && fan.tags.length > 0 ? (
                            fan.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">No tags</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(fan.created_at).toLocaleDateString()}
                      </TableCell>
                      {onFanUpdate && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditFan(fan)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>{selectedTags.length > 0 ? 'No fans match the selected tags' : 'No fans have signed up yet'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <FanTagEditor
        fan={selectedFan}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedFan(null);
        }}
        onSave={handleSaveFan}
      />
    </>
  );
}
