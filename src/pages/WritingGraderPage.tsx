import React from 'react';
import { AIWritingGrader } from '@/components/ai/AIWritingGrader';

export default function WritingGraderPage() {
  return (
    <div className="min-h-screen">
      <div className="glee-container glee-section">
        <AIWritingGrader />
      </div>
    </div>
  );
}
