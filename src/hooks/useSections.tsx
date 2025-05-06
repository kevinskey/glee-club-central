
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchSectionsWithMemberCount, Section } from "@/utils/supabaseQueries";
import { SectionFormValues } from "@/components/sections/SectionForm";

interface SectionLeader {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
}

export function useSections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [leaders, setLeaders] = useState<SectionLeader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch potential section leaders with direct query
      const { data: leadersData, error: leadersError } = await supabase.rpc<SectionLeader[], null>('get_potential_section_leaders');

      if (leadersError) throw leadersError;

      // Format leaders for dropdown
      const formattedLeaders = leadersData ? (leadersData as any[]).map((leader) => ({
        id: leader.id,
        name: `${leader.first_name || ''} ${leader.last_name || ''}`.trim()
      })) : [];

      setLeaders(formattedLeaders);

      // Use our custom function to fetch sections data safely
      const sectionsData = await fetchSectionsWithMemberCount();
      setSections(sectionsData);
    } catch (error: any) {
      console.error("Error fetching sections:", error);
      toast.error(error.message || "Failed to load sections");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSection = async (values: SectionFormValues) => {
    try {
      if (editingSection) {
        // Update existing section - using RPC function
        const { error } = await supabase.rpc<void, {
          p_id: string;
          p_name: string;
          p_description: string | null;
          p_section_leader_id: string | null;
        }>('update_section', {
          p_id: editingSection.id,
          p_name: values.name,
          p_description: values.description || null,
          p_section_leader_id: values.section_leader_id || null
        });

        if (error) throw error;
        toast.success("Section updated successfully");
      } else {
        // Create new section - using RPC function
        const { error } = await supabase.rpc<string, {
          p_name: string;
          p_description: string | null;
          p_section_leader_id: string | null;
        }>('create_section', {
          p_name: values.name,
          p_description: values.description || null,
          p_section_leader_id: values.section_leader_id || null
        });

        if (error) throw error;
        toast.success("Section created successfully");
      }

      // Refresh sections
      fetchData();
      setOpenDialog(false);
    } catch (error: any) {
      console.error("Error saving section:", error);
      toast.error(error.message || "Failed to save section");
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setOpenDialog(true);
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      // Use RPC function to delete section
      const { error } = await supabase.rpc<void, {
        p_section_id: string;
      }>('delete_section', {
        p_section_id: sectionId
      });

      if (error) throw error;

      // Update local state
      setSections(sections.filter(section => section.id !== sectionId));
      toast.success("Section deleted successfully");
    } catch (error: any) {
      console.error("Error deleting section:", error);
      toast.error(error.message || "Failed to delete section");
    }
  };

  return {
    sections,
    leaders,
    isLoading,
    openDialog,
    setOpenDialog,
    editingSection,
    setEditingSection,
    handleSaveSection,
    handleEditSection,
    handleDeleteSection,
  };
}
