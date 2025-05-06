
import React from "react";
import { Badge } from "@/components/ui/badge";

export const getRoleBadge = (role: string) => {
  switch (role) {
    case "admin":
      return <Badge className="bg-purple-500">Admin</Badge>;
    case "section_leader":
      return <Badge className="bg-blue-500">Section Leader</Badge>;
    case "member":
      return <Badge variant="outline">Member</Badge>;
    case "student_conductor":
      return <Badge className="bg-green-500">Student Conductor</Badge>;
    case "accompanist":
      return <Badge className="bg-amber-500">Accompanist</Badge>;
    case "singer":
      return <Badge className="bg-sky-500">Singer</Badge>;
    case "Director":
      return <Badge className="bg-red-500">Director</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">Active</Badge>;
    case "inactive":
      return <Badge variant="outline">Inactive</Badge>;
    case "alumni":
      return <Badge className="bg-blue-500">Alumni</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500">Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
