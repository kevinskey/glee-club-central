
import React from "react";
import { AudioPageCategory } from "@/types/audio";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AudioCategoryIcon } from "./AudioCategoryIcon";

interface AudioCategorySelectorProps {
  value: AudioPageCategory;
  onChange: (value: string) => void;
  includeBackingTracks?: boolean;
  disabled?: boolean;
}

export function AudioCategorySelector({
  value,
  onChange,
  includeBackingTracks = false,
  disabled = false
}: AudioCategorySelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <AudioCategoryIcon category="all" />
            <span>All Audio</span>
          </div>
        </SelectItem>
        
        <SelectItem value="recordings">
          <div className="flex items-center gap-2">
            <AudioCategoryIcon category="recordings" />
            <span>Recordings</span>
          </div>
        </SelectItem>
        
        <SelectItem value="part_tracks">
          <div className="flex items-center gap-2">
            <AudioCategoryIcon category="part_tracks" />
            <span>Part Tracks</span>
          </div>
        </SelectItem>
        
        <SelectItem value="my_tracks">
          <div className="flex items-center gap-2">
            <AudioCategoryIcon category="my_tracks" />
            <span>My Tracks</span>
          </div>
        </SelectItem>
        
        {includeBackingTracks && (
          <SelectItem value="backing_tracks">
            <div className="flex items-center gap-2">
              <AudioCategoryIcon category="backing_tracks" />
              <span>Backing Tracks</span>
            </div>
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
