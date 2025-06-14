
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface InlineMediaTitleEditProps {
  title: string;
  onSave: (newTitle: string) => Promise<void>;
  className?: string;
}

export function InlineMediaTitleEdit({ title, onSave, className = "" }: InlineMediaTitleEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStart = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setEditValue(title);
    setIsEditing(true);
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setEditValue(title);
    setIsEditing(false);
  };

  const handleSave = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (editValue.trim() === '') {
      toast.error('Title cannot be empty');
      return;
    }

    if (editValue.trim() === title.trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editValue.trim());
      setIsEditing(false);
    } catch (error) {
      // Error already handled in parent
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`} onClick={(e) => e.stopPropagation()}>
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 h-8 text-sm"
          disabled={isSaving}
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          disabled={isSaving}
          className="h-8 w-8 p-0"
        >
          <Check className="h-4 w-4 text-green-600" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          disabled={isSaving}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span 
        className="flex-1 font-medium text-sm truncate cursor-pointer"
        onClick={handleStart}
      >
        {title}
      </span>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleStart}
        className="h-6 w-6 p-0 opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
      >
        <Edit className="h-3 w-3" />
      </Button>
    </div>
  );
}
