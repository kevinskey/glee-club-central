
import React from "react";

interface DirectoryCountSummaryProps {
  count: number;
}

export function DirectoryCountSummary({ count }: DirectoryCountSummaryProps) {
  return (
    <div className="mt-4 text-sm text-gray-500" key={`member-count-${count}`}>
      {count} member{count !== 1 ? 's' : ''} found
    </div>
  );
}
