
import React from "react";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Section } from "@/utils/supabaseQueries";

interface DeleteSectionDialogProps {
  section: Section;
  onDelete: (sectionId: string) => void;
}

export function DeleteSectionDialog({ section, onDelete }: DeleteSectionDialogProps) {
  return (
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
          onClick={() => onDelete(section.id)}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
