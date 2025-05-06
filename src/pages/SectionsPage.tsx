
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { UsersRound, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SectionList } from "@/components/sections/SectionList";
import { SectionForm } from "@/components/sections/SectionForm";
import { useSections } from "@/hooks/useSections";

export default function SectionsPage() {
  const { isAdmin } = useAuth();
  const {
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
  } = useSections();

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!openDialog) {
      setEditingSection(null);
    }
  }, [openDialog, setEditingSection]);

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
            <SectionForm 
              section={editingSection} 
              leaders={leaders}
              onSubmit={handleSaveSection}
            />
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
          <SectionList
            sections={sections}
            leaders={leaders}
            isLoading={isLoading}
            onEdit={handleEditSection}
            onDelete={handleDeleteSection}
          />
        </CardContent>
      </Card>
    </div>
  );
}
