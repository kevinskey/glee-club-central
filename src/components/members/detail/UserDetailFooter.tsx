
import React from "react";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface UserDetailFooterProps {
  userId: string;
}

export const UserDetailFooter: React.FC<UserDetailFooterProps> = ({ userId }) => {
  return (
    <SheetFooter className="flex-col sm:flex-row gap-2">
      <SheetClose asChild>
        <Button variant="outline">Close</Button>
      </SheetClose>
      <Button variant="default" asChild>
        <Link to={`/dashboard/members/${userId}`}>View Full Profile</Link>
      </Button>
    </SheetFooter>
  );
};
