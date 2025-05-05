
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { BookOpen, Download } from "lucide-react";
import { PDFViewer } from "@/components/PDFViewer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Use a more reliable PDF hosting service - PDF.js Express free sample PDF
const HANDBOOK_PDF_URL = "https://pdfjs-express.s3-us-west-2.amazonaws.com/docs/choosing-a-pdf-technology.pdf";

export default function HandbookPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDownload = async () => {
    setIsLoading(true);
    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = HANDBOOK_PDF_URL;
      link.download = "glee_club_handbook.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your handbook PDF download has started.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the handbook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Glee Club Handbook"
        description="Official guidelines, policies, and information for members"
        icon={<BookOpen className="h-6 w-6" />}
      />
      
      <div className="flex flex-wrap gap-4 mb-4">
        <Button 
          onClick={handleDownload}
          variant="outline"
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Handbook
        </Button>
      </div>
      
      <div className="rounded-lg">
        <PDFViewer 
          url={HANDBOOK_PDF_URL} 
          title="Glee Club Handbook 2025" 
        />
      </div>
    </div>
  );
}
