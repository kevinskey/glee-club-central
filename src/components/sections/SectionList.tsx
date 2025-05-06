
import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Section } from "@/utils/supabaseQueries";
import { DeleteSectionDialog } from "./DeleteSectionDialog";

interface SectionListProps {
  sections: Section[];
  leaders: { id: string; name: string }[];
  isLoading: boolean;
  onEdit: (section: Section) => void;
  onDelete: (sectionId: string) => void;
}

export function SectionList({ 
  sections, 
  leaders, 
  isLoading, 
  onEdit, 
  onDelete 
}: SectionListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No sections found</p>
        <p className="text-muted-foreground text-sm mt-2">
          Create your first section to organize your choir members
        </p>
      </div>
    );
  }

  return (
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
                    onClick={() => onEdit(section)}
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
                    <DeleteSectionDialog 
                      section={section}
                      onDelete={onDelete}
                    />
                  </AlertDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
