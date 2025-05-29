
import React from 'react';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkData {
  id: string;
  page_number: number;
  title: string;
  created_at: string;
}

interface PDFBookmarksSidebarProps {
  bookmarks: BookmarkData[];
  currentPage: number;
  onJumpToBookmark: (bookmark: BookmarkData) => void;
}

export const PDFBookmarksSidebar: React.FC<PDFBookmarksSidebarProps> = ({
  bookmarks,
  currentPage,
  onJumpToBookmark
}) => {
  if (bookmarks.length === 0) return null;

  return (
    <div className="w-64 border-l bg-background p-4 overflow-y-auto">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <Bookmark className="h-4 w-4" />
        Bookmarks
      </h4>
      <div className="space-y-2">
        {bookmarks.map((bookmark) => (
          <button
            key={bookmark.id}
            onClick={() => onJumpToBookmark(bookmark)}
            className={cn(
              "w-full text-left p-2 rounded-md text-sm hover:bg-accent",
              bookmark.page_number === currentPage && "bg-accent"
            )}
          >
            <div className="font-medium">{bookmark.title}</div>
            <div className="text-muted-foreground text-xs">
              Page {bookmark.page_number}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
