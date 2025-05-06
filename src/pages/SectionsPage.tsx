
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { UsersRound, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Section {
  id: string;
  name: string;
  description: string | null;
  section_leader_id: string | null;
  member_count?: number;
}

interface SectionLeader {
  id: string;
  name: string;
}

const sectionFormSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  description: z.string().optional(),
  section_leader_id: z.string().optional(),
});

export default function SectionsPage() {
  const { isAdmin } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [leaders, setLeaders] = useState<SectionLeader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const form = useForm<z.infer<typeof sectionFormSchema>>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      name: "",
      description: "",
      section_leader_id: "",
    },
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!openDialog) {
      form.reset();
      setEditingSection(null);
    }
  }, [openDialog, form]);

  // Set form values when editing section
  useEffect(() => {
    if (editingSection) {
      form.reset({
        name: editingSection.name,
        description: editingSection.description || "",
        section_leader_id: editingSection.section_leader_id || "",
      });
    }
  }, [editingSection, form]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch potential section leaders (admins and section leaders)
        const { data: leadersData, error: leadersError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name")
          .in("role", ["admin", "section_leader"]);

        if (leadersError) throw leadersError;

        // Format leaders for dropdown
        const formattedLeaders = leadersData.map(leader => ({
          id: leader.id,
          name: `${leader.first_name || ''} ${leader.last_name || ''}`.trim()
        }));

        setLeaders(formattedLeaders);

        // Fetch sections with member count
        const { data: sectionsData, error: sectionsError } = await supabase
          .from("sections")
          .select(`
            id,
            name,
            description,
            section_leader_id,
            profiles!section_id (id)
          `);

        if (sectionsError) throw sectionsError;

        // Count members in each section
        const sectionsWithCount = sectionsData.map(section => ({
          id: section.id,
          name: section.name,
          description: section.description,
          section_leader_id: section.section_leader_id,
          member_count: section.profiles ? section.profiles.length : 0,
        }));

        setSections(sectionsWithCount);
      } catch (error: any) {
        console.error("Error fetching sections:", error);
        toast.error(error.message || "Failed to load sections");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSaveSection = async (values: z.infer<typeof sectionFormSchema>) => {
    try {
      if (editingSection) {
        // Update existing section
        const { error } = await supabase
          .from("sections")
          .update({
            name: values.name,
            description: values.description,
            section_leader_id: values.section_leader_id || null,
          })
          .eq("id", editingSection.id);

        if (error) throw error;

        toast.success("Section updated successfully");
      } else {
        // Create new section
        const { data, error } = await supabase
          .from("sections")
          .insert({
            name: values.name,
            description: values.description,
            section_leader_id: values.section_leader_id || null,
          })
          .select();

        if (error) throw error;

        toast.success("Section created successfully");
      }

      // Refresh sections
      const { data: refreshedData, error: refreshError } = await supabase
        .from("sections")
        .select(`
          id,
          name,
          description,
          section_leader_id,
          profiles!section_id (id)
        `);

      if (refreshError) throw refreshError;

      const sectionsWithCount = refreshedData.map(section => ({
        id: section.id,
        name: section.name,
        description: section.description,
        section_leader_id: section.section_leader_id,
        member_count: section.profiles ? section.profiles.length : 0,
      }));

      setSections(sectionsWithCount);
      setOpenDialog(false);
    } catch (error: any) {
      console.error("Error saving section:", error);
      toast.error(error.message || "Failed to save section");
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      // First, update profiles to remove this section_id
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({ section_id: null })
        .eq("section_id", sectionId);

      if (profileUpdateError) throw profileUpdateError;

      // Then delete the section
      const { error: deleteError } = await supabase
        .from("sections")
        .delete()
        .eq("id", sectionId);

      if (deleteError) throw deleteError;

      // Update local state
      setSections(sections.filter(section => section.id !== sectionId));
      toast.success("Section deleted successfully");
    } catch (error: any) {
      console.error("Error deleting section:", error);
      toast.error(error.message || "Failed to delete section");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sections"
        description="Manage choir sections and groups"
        icon={<UsersRound className="h-6 w-6" />}
      />

      <div className="flex justify-end">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSection ? "Edit Section" : "Add New Section"}</DialogTitle>
              <DialogDescription>
                {editingSection ? "Update section details" : "Create a new choir section or group"}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSaveSection)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. First Soprano" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of this section"
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section_leader_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Leader (Optional)</FormLabel>
                      <Select 
                        value={field.value || ""} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a section leader" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {leaders.map((leader) => (
                            <SelectItem key={leader.id} value={leader.id}>
                              {leader.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" type="button">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">
                    {editingSection ? "Save Changes" : "Add Section"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sections</CardTitle>
          <CardDescription>
            View and manage all choir sections
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No sections found</p>
              <p className="text-muted-foreground text-sm mt-2">
                Create your first section to organize your choir members
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Section Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Leader</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections.map((section) => {
                    // Find leader name
                    const leader = leaders.find(l => l.id === section.section_leader_id);
                    const leaderName = leader ? leader.name : "None";

                    return (
                      <TableRow key={section.id}>
                        <TableCell className="font-medium">{section.name}</TableCell>
                        <TableCell>{section.description || "No description"}</TableCell>
                        <TableCell>{leaderName}</TableCell>
                        <TableCell>{section.member_count}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingSection(section);
                              setOpenDialog(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will delete the "{section.name}" section. Members assigned to this section will be unassigned.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDeleteSection(section.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
