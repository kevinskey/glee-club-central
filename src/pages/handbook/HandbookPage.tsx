
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { BookOpen } from "lucide-react";
import { PDFViewer } from "@/components/PDFViewer";

// URL of the club handbook PDF file
// In a real application, this could come from your Supabase storage or other source
const HANDBOOK_PDF_URL = "https://firebasestorage.googleapis.com/v0/b/glee-app.appspot.com/o/handbook%2Fglee_club_handbook.pdf?alt=media";

export default function HandbookPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Club Handbook"
        description="Official guidelines, policies, and information for members"
        icon={<BookOpen className="h-6 w-6" />}
      />
      
      <div className="rounded-lg">
        <PDFViewer 
          url={HANDBOOK_PDF_URL} 
          title="Glee Club Handbook 2025" 
        />
      </div>
    </div>
  );
}
