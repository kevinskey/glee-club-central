
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { FileText, ArrowLeft, Upload, Download, FileSpreadsheet, ArrowDownAZ, ArrowUpAZ, ListOrdered } from "lucide-react";
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
import { ImportMappingDialog } from "@/components/sheet-music/ImportMappingDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ChoralTitle {
  id: string;
  title: string;
  composer: string;
  voicing: string;
  amount_on_hand: number;
  has_pdf: boolean;
  sheet_music_id: string | null;
  library_number: string | null;
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
  library_number: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type SortField = 'title' | 'composer' | 'voicing' | 'library_number';
type SortOrder = 'asc' | 'desc';

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
  
  // Sorting and pagination states
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      composer: "",
      voicing: "",
      amount_on_hand: 0,
      sheet_music_id: null,
      library_number: "",
    },
  });

  // Fetch choral titles data
  const fetchChoralTitles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('choral_titles')
        .select('*')
        .order(sortField, { ascending: sortOrder === 'asc' });

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
        title.voicing.toLowerCase().includes(query) ||
        (title.library_number && title.library_number.toLowerCase().includes(query))
    );
    setFilteredTitles(filtered);
    setCurrentPage(1); // Reset to first page on new search
  }, [searchQuery, choralTitles]);

  // Re-fetch data when sort preferences change
  useEffect(() => {
    fetchChoralTitles();
  }, [sortField, sortOrder]);

  // Load data on component mount
  useEffect(() => {
    fetchChoralTitles();
    fetchSheetMusic();
  }, []);

  // Handle sorting change
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTitles.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredTitles.length / itemsPerPage);

  // Handle adding new choral title
  const handleAddTitle = async (values: FormValues) => {
    try {
      if (isEditMode && currentEditId) {
        // Update existing record - Ensure all required fields are included
        const { error } = await supabase
          .from('choral_titles')
          .update({
            title: values.title,            // Required field
            composer: values.composer,      // Required field  
            voicing: values.voicing,        // Required field
            amount_on_hand: values.amount_on_hand,
            sheet_music_id: values.sheet_music_id === "none" ? null : values.sheet_music_id,
            library_number: values.library_number || null,
          })
          .eq('id', currentEditId);
          
        if (error) throw error;
      } else {
        // Insert new record - Ensure all required fields are included 
        const { error } = await supabase
          .from('choral_titles')
          .insert({
            title: values.title,            // Required field
            composer: values.composer,      // Required field
            voicing: values.voicing,        // Required field
            amount_on_hand: values.amount_on_hand,
            sheet_music_id: values.sheet_music_id === "none" ? null : values.sheet_music_id,
            library_number: values.library_number || null,
          });
          
        if (error) throw error;
      }

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
      library_number: title.library_number || "",
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

  // Handle the mapped CSV import data
  const handleImportMappedData = async (records: any[]) => {
    try {
      if (records.length === 0) {
        toast({
          title: "Import Error",
          description: "No valid records found in the file",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('choral_titles')
        .insert(records);

      if (error) throw error;

      toast({
        title: "Import Successful",
        description: `${records.length} titles were imported.`,
      });

      fetchChoralTitles();
    } catch (error: any) {
      toast({
        title: "Import Error",
        description: error.message || "Failed to import records",
        variant: "destructive",
      });
    }
  };

  // Export data to CSV
  const handleExport = () => {
    // Convert data to CSV
    const csv = Papa.unparse(choralTitles.map(title => ({
      title: title.title,
      composer: title.composer,
      voicing: title.voicing,
      amount_on_hand: title.amount_on_hand,
      has_pdf: title.has_pdf ? "Yes" : "No",
      library_number: title.library_number || ""
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

  const getSortIcon = (field: string) => {
    if (field !== sortField) return null;
    return sortOrder === 'asc' ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpAZ className="h-4 w-4" />;
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
                  library_number: "",
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
      
      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <Input
          placeholder="Search titles, composers, voicing, or library numbers..."
          className="max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ListOrdered className="h-4 w-4" /> Sort By
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSort('title')} className="gap-2">
              Title {getSortIcon('title')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('composer')} className="gap-2">
              Composer {getSortIcon('composer')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('voicing')} className="gap-2">
              Voicing {getSortIcon('voicing')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('library_number')} className="gap-2">
              Library Number {getSortIcon('library_number')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
                <TableHead className="cursor-pointer" onClick={() => handleSort('library_number')}>
                  <div className="flex items-center gap-1">
                    Library # {getSortIcon('library_number')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-1">
                    Title {getSortIcon('title')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('composer')}>
                  <div className="flex items-center gap-1">
                    Composer {getSortIcon('composer')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('voicing')}>
                  <div className="flex items-center gap-1">
                    Voicing {getSortIcon('voicing')}
                  </div>
                </TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">PDF Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getPaginatedData().map((title) => (
                <TableRow key={title.id}>
                  <TableCell>{title.library_number || '-'}</TableCell>
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

      {/* Pagination */}
      {filteredTitles.length > itemsPerPage && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              // Show pages around current page
              let pageToShow;
              if (totalPages <= 5) {
                pageToShow = i + 1;
              } else if (currentPage <= 3) {
                pageToShow = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = currentPage - 2 + i;
              }
              
              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === pageToShow}
                    onClick={() => setCurrentPage(pageToShow)}
                  >
                    {pageToShow}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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
                name="library_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Library Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter library number (optional)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                      value={field.value || "none"}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Link to PDF in library (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
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
      
      {/* CSV Import Dialog with Mapping */}
      <ImportMappingDialog 
        isOpen={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImportComplete={handleImportMappedData}
      />
    </div>
  );
}
