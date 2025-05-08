
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { FileText, ArrowLeft, Upload, Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Papa from "papaparse";

interface ChoralTitle {
  id: string;
  title: string;
  composer: string;
  voicing: string;
  amount_on_hand: number;
  has_pdf: boolean;
  sheet_music_id: string | null;
  created_at: string;
  updated_at: string;
}

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
}

// Form schema for adding/editing choral titles
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  composer: z.string().min(1, "Composer is required"),
  voicing: z.string().min(1, "Voicing is required"),
  amount_on_hand: z.coerce.number().int().min(0).default(0),
  sheet_music_id: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ChoralTitlesPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [choralTitles, setChoralTitles] = useState<ChoralTitle[]>([]);
  const [sheetMusicOptions, setSheetMusicOptions] = useState<SheetMusic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTitles, setFilteredTitles] = useState<ChoralTitle[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  // Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      composer: "",
      voicing: "",
      amount_on_hand: 0,
      sheet_music_id: null,
    },
  });

  // Fetch choral titles data
  const fetchChoralTitles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('choral_titles')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;

      if (data) {
        setChoralTitles(data as ChoralTitle[]);
        setFilteredTitles(data as ChoralTitle[]);
      }
    } catch (error: any) {
      console.error("Error fetching choral titles:", error);
      toast({
        title: "Error loading choral titles",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch sheet music for linking
  const fetchSheetMusic = async () => {
    try {
      const { data, error } = await supabase
        .from('sheet_music')
        .select('id, title, composer')
        .order('title', { ascending: true });

      if (error) throw error;

      if (data) {
        setSheetMusicOptions(data as SheetMusic[]);
      }
    } catch (error: any) {
      console.error("Error fetching sheet music options:", error);
      toast({
        description: "Could not load sheet music options",
        variant: "destructive",
      });
    }
  };

  // Filter titles based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTitles(choralTitles);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = choralTitles.filter(
      title => 
        title.title.toLowerCase().includes(query) || 
        title.composer.toLowerCase().includes(query) ||
        title.voicing.toLowerCase().includes(query)
    );
    setFilteredTitles(filtered);
  }, [searchQuery, choralTitles]);

  // Load data on component mount
  useEffect(() => {
    fetchChoralTitles();
    fetchSheetMusic();
  }, []);

  // Handle adding new choral title
  const handleAddTitle = async (values: FormValues) => {
    try {
      const newTitle = {
        ...values,
        sheet_music_id: values.sheet_music_id || null,
      };

      let response;
      
      if (isEditMode && currentEditId) {
        // Update existing record
        response = await supabase
          .from('choral_titles')
          .update(newTitle)
          .eq('id', currentEditId);
      } else {
        // Insert new record
        response = await supabase
          .from('choral_titles')
          .insert(newTitle);
      }

      const { error } = response;
      
      if (error) throw error;

      toast({
        title: isEditMode ? "Updated Successfully" : "Added Successfully",
        description: `"${values.title}" ${isEditMode ? "updated" : "added"} to the choral library.`,
      });

      fetchChoralTitles();
      setIsAddDialogOpen(false);
      form.reset();
      setIsEditMode(false);
      setCurrentEditId(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save choral title",
        variant: "destructive",
      });
    }
  };

  // Handle editing an existing title
  const handleEdit = (title: ChoralTitle) => {
    form.reset({
      title: title.title,
      composer: title.composer,
      voicing: title.voicing,
      amount_on_hand: title.amount_on_hand,
      sheet_music_id: title.sheet_music_id || null,
    });
    
    setIsEditMode(true);
    setCurrentEditId(title.id);
    setIsAddDialogOpen(true);
  };

  // Handle deleting a title
  const handleDelete = async (id: string) => {
    // Confirm before delete
    if (!window.confirm("Are you sure you want to delete this choral title?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('choral_titles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Deleted Successfully",
        description: "The choral title has been removed.",
      });

      fetchChoralTitles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete choral title",
        variant: "destructive",
      });
    }
  };

  // Handle file import for CSV/Excel
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const csvData = e.target?.result;
      if (typeof csvData === 'string') {
        try {
          Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
              const records = results.data as any[];
              
              if (records.length === 0) {
                toast({
                  title: "Error",
                  description: "No valid records found in the file",
                  variant: "destructive",
                });
                return;
              }

              try {
                // Format the data according to our schema
                const formattedRecords = records.map(record => ({
                  title: record.title || "",
                  composer: record.composer || "",
                  voicing: record.voicing || "",
                  amount_on_hand: parseInt(record.amount_on_hand || "0", 10),
                  // Optional linking of sheet_music_id would need to be done manually
                }));

                const { error } = await supabase
                  .from('choral_titles')
                  .insert(formattedRecords);

                if (error) throw error;

                toast({
                  title: "Import Successful",
                  description: `${formattedRecords.length} records were imported.`,
                });

                fetchChoralTitles();
                setIsImportDialogOpen(false);
              } catch (error: any) {
                toast({
                  title: "Import Error",
                  description: error.message || "Failed to import records",
                  variant: "destructive",
                });
              }
            },
            error: (error) => {
              toast({
                title: "Parse Error",
                description: error.message || "Failed to parse the file",
                variant: "destructive",
              });
            }
          });
        } catch (error: any) {
          toast({
            title: "File Error",
            description: "Failed to read the file. Please check the format.",
            variant: "destructive",
          });
        }
      }
    };
    fileReader.readAsText(file);
  };

  // Export data to CSV
  const handleExport = () => {
    // Convert data to CSV
    const csv = Papa.unparse(choralTitles.map(title => ({
      title: title.title,
      composer: title.composer,
      voicing: title.voicing,
      amount_on_hand: title.amount_on_hand,
      has_pdf: title.has_pdf ? "Yes" : "No"
    })));
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const href = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = "choral_titles_export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Choral Titles Database"
        description="Browse, search and manage the choral sheet music library"
        icon={<FileText className="h-6 w-6" />}
        actions={
          <>
            <Button 
              variant="outline"
              asChild
              className="mr-2"
            >
              <Link to="/dashboard/sheet-music" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Sheet Music
              </Link>
            </Button>
            <Button 
              onClick={() => setIsImportDialogOpen(true)}
              variant="outline"
              className="gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" /> Import CSV
            </Button>
            <Button 
              onClick={handleExport}
              variant="outline"
              className="gap-2 mr-2"
            >
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button 
              onClick={() => {
                setIsEditMode(false);
                setCurrentEditId(null);
                form.reset({
                  title: "",
                  composer: "",
                  voicing: "",
                  amount_on_hand: 0,
                  sheet_music_id: null,
                });
                setIsAddDialogOpen(true);
              }}
              className="gap-2 bg-glee-purple hover:bg-glee-purple/90"
            >
              <Upload className="h-4 w-4" /> Add Title
            </Button>
          </>
        }
      />
      
      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search titles, composers, or voicing..."
          className="max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Choral Titles Table */}
      {loading ? (
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-md bg-muted animate-pulse" />
          ))}
        </div>
      ) : filteredTitles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">No choral titles found</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {searchQuery ? 
              "Try a different search term" : 
              "Add your first choral title to the database"}
          </p>
          <Button 
            onClick={() => {
              form.reset();
              setIsAddDialogOpen(true);
            }}
            className="gap-2 bg-glee-purple hover:bg-glee-purple/90"
          >
            <Upload className="h-4 w-4" /> Add Title
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Composer</TableHead>
                <TableHead>Voicing</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">PDF Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTitles.map((title) => (
                <TableRow key={title.id}>
                  <TableCell className="font-medium">{title.title}</TableCell>
                  <TableCell>{title.composer}</TableCell>
                  <TableCell>{title.voicing}</TableCell>
                  <TableCell className="text-center">{title.amount_on_hand}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={title.has_pdf ? "default" : "outline"}>
                      {title.has_pdf ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(title)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(title.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Choral Title" : "Add Choral Title"}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddTitle)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="composer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Composer</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter composer" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="voicing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voicing</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select voicing" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SATB">SATB</SelectItem>
                        <SelectItem value="SSA">SSA</SelectItem>
                        <SelectItem value="SSAA">SSAA</SelectItem>
                        <SelectItem value="TTBB">TTBB</SelectItem>
                        <SelectItem value="SAB">SAB</SelectItem>
                        <SelectItem value="TB">TB</SelectItem>
                        <SelectItem value="SA">SA</SelectItem>
                        <SelectItem value="Unison">Unison</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount_on_hand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity on Hand</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sheet_music_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Associated Sheet Music</FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Link to PDF in library (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {sheetMusicOptions.map((sheet) => (
                          <SelectItem key={sheet.id} value={sheet.id}>
                            {sheet.title} - {sheet.composer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="flex justify-between sm:justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-glee-purple hover:bg-glee-purple/90">
                  {isEditMode ? "Update" : "Add"} Title
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* CSV Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Choral Titles</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Upload a CSV file with the following columns: title, composer, voicing, amount_on_hand
              </p>
              <Input
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileUpload}
              />
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">CSV Format Example</h4>
              <pre className="text-xs overflow-x-auto">
                title,composer,voicing,amount_on_hand<br />
                "Gloria","Mozart","SATB",25<br />
                "Hallelujah","Handel","SATB",40
              </pre>
            </div>
            
            <DialogFooter className="flex justify-end mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsImportDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
