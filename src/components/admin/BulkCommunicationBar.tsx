
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X, MessageSquare } from 'lucide-react';
import { MemberCommunicationActions } from './MemberCommunicationActions';

interface Member {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

interface BulkCommunicationBarProps {
  selectedMembers: Member[];
  onClearSelection: () => void;
  onSelectAll: () => void;
  totalMembers: number;
}

export function BulkCommunicationBar({ 
  selectedMembers, 
  onClearSelection, 
  onSelectAll, 
  totalMembers 
}: BulkCommunicationBarProps) {
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  if (selectedMembers.length === 0) return null;

  const handleSelectAllChange = (checked: boolean) => {
    setIsSelectAllChecked(checked);
    if (checked) {
      onSelectAll();
    } else {
      onClearSelection();
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isSelectAllChecked}
                onCheckedChange={handleSelectAllChange}
              />
              <span className="text-sm font-medium">
                {selectedMembers.length} of {totalMembers} members selected
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClearSelection}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <MemberCommunicationActions 
              members={selectedMembers} 
              variant="bulk" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
