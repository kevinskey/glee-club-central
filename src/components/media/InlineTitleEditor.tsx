
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface InlineTitleEditorProps {
  title: string;
  onSave: (newTitle: string) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

export function InlineTitleEditor({ title, onSave, onCancel, className }: InlineTitleEditorProps) {
  const [value, setValue] = useState(title);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleSave = async () => {
    if (value.trim() === '' || value === title) {
      onCancel();
      return;
    }

    setIsSaving(true);
    try {
      await onSave(value.trim());
    } catch (error) {
      console.error('Failed to save title:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        className="h-8 text-sm"
        disabled={isSaving}
      />
      <Button
        size="sm"
        variant="ghost"
        onClick={handleSave}
        disabled={isSaving}
        className="h-6 w-6 p-0"
      >
        <Check className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onCancel}
        disabled={isSaving}
        className="h-6 w-6 p-0"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
