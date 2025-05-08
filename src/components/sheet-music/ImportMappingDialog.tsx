
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { UploadCloud, AlertCircle, FileUp } from "lucide-react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";

interface MappingField {
  csvField: string | null;
  appField: string;
  required: boolean;
  display: string;
}

interface ImportMappingDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onImportComplete: (records: any[]) => void;
}

export function ImportMappingDialog({ 
  isOpen, 
  onOpenChange, 
  onImportComplete 
}: ImportMappingDialogProps) {
  const { toast } = useToast();
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [fieldMapping, setFieldMapping] = useState<MappingField[]>([
    { csvField: null, appField: "title", required: true, display: "Title" },
    { csvField: null, appField: "composer", required: true, display: "Composer" },
    { csvField: null, appField: "voicing", required: true, display: "Voicing" },
    { csvField: null, appField: "amount_on_hand", required: false, display: "Quantity" },
    { csvField: null, appField: "library_number", required: false, display: "Library Number" }
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reset state when dialog closes
  React.useEffect(() => {
    if (!isOpen) {
      setCsvHeaders([]);
      setCsvData([]);
      setFileName("");
      setFieldMapping(fieldMapping.map(field => ({ ...field, csvField: null })));
    }
  }, [isOpen]);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Only CSV files are supported",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Get the headers from the first row
        const headers = results.meta.fields || [];
        setCsvHeaders(headers);
        setCsvData(results.data);
        
        // Try to auto-map fields by matching column names
        const updatedMapping = [...fieldMapping];
        
        updatedMapping.forEach((field, index) => {
          // Look for exact matches first
          const exactMatch = headers.find(
            header => header.toLowerCase() === field.appField.toLowerCase()
          );
          
          if (exactMatch) {
            updatedMapping[index].csvField = exactMatch;
            return;
          }
          
          // Then try to find partial matches
          const partialMatch = headers.find(
            header => header.toLowerCase().includes(field.appField.toLowerCase())
          );
          
          if (partialMatch) {
            updatedMapping[index].csvField = partialMatch;
          }
        });
        
        setFieldMapping(updatedMapping);
      },
      error: (error) => {
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleMappingChange = (index: number, value: string) => {
    const updatedMapping = [...fieldMapping];
    updatedMapping[index].csvField = value;
    setFieldMapping(updatedMapping);
  };

  const handleImport = () => {
    // Check if required fields are mapped
    const missingRequiredFields = fieldMapping
      .filter(field => field.required && !field.csvField)
      .map(field => field.display);
    
    if (missingRequiredFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please map the following required fields: ${missingRequiredFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Transform data based on mappings
    const transformedData = csvData.map(row => {
      const newRow: Record<string, any> = {};
      
      fieldMapping.forEach(field => {
        if (field.csvField) {
          // For amount_on_hand, ensure it's a number
          if (field.appField === 'amount_on_hand') {
            const value = row[field.csvField];
            newRow[field.appField] = value ? parseInt(value, 10) || 0 : 0;
          } else {
            newRow[field.appField] = row[field.csvField] || null;
          }
        }
      });
      
      return newRow;
    });

    onImportComplete(transformedData);
    onOpenChange(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Choral Titles from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file and map the columns to the appropriate fields.
          </DialogDescription>
        </DialogHeader>

        {csvHeaders.length === 0 ? (
          <div 
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleFileDrop}
          >
            <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-center text-muted-foreground mb-4">
              Drag and drop your CSV file here, or click the button below to browse
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <Button 
              variant="outline" 
              onClick={handleBrowseClick}
              className="gap-2"
            >
              <FileUp className="h-4 w-4" /> Browse Files
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              <Card className="p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileUp className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{fileName}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setCsvHeaders([]);
                      setCsvData([]);
                      setFileName("");
                    }}
                  >
                    Change
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {csvData.length} records found
                </p>
              </Card>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span>Map the CSV columns to the appropriate fields</span>
                </div>
                
                <div className="grid gap-3">
                  {fieldMapping.map((field, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 items-center">
                      <Label htmlFor={`field-${index}`} className="flex items-center gap-1">
                        {field.display}
                        {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      <Select
                        value={field.csvField || ""}
                        onValueChange={(value) => handleMappingChange(index, value)}
                      >
                        <SelectTrigger id={`field-${index}`}>
                          <SelectValue placeholder="Select a CSV column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">- Not Mapped -</SelectItem>
                          {csvHeaders.map((header) => (
                            <SelectItem key={header} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleImport}
                className="bg-glee-purple hover:bg-glee-purple/90"
              >
                Import Data
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
