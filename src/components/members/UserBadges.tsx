
import React from "react";
import { Badge } from "@/components/ui/badge";

export const getRoleBadge = (role: string) => {
  let className = "";
  let displayName = "";

  switch (role) {
    case "administrator":
      className = "bg-red-500";
      displayName = "Administrator";
      break;
    case "section_leader":
      className = "bg-amber-500";
      displayName = "Section Leader";
      break;
    case "singer":
      className = "bg-green-500";
      displayName = "Singer";
      break;
    case "student_conductor":
      className = "bg-purple-500";
      displayName = "Student Conductor";
      break;
    case "accompanist":
      className = "bg-blue-500";
      displayName = "Accompanist";
      break;
    case "non_singer":
      className = "bg-slate-500";
      displayName = "Non-Singer";
      break;
    default:
      className = "bg-gray-500";
      displayName = role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, ' ');
  }

  return <Badge className={className}>{displayName}</Badge>;
};

export const getStatusBadge = (status: string) => {
  let className = "";
  let displayName = "";

  switch (status) {
    case "active":
      className = "bg-emerald-500";
      displayName = "Active";
      break;
    case "inactive":
      className = "bg-gray-500";
      displayName = "Inactive";
      break;
    case "pending":
      className = "bg-yellow-500";
      displayName = "Pending";
      break;
    case "alumni":
      className = "bg-blue-500";
      displayName = "Alumni";
      break;
    case "deleted":
      className = "bg-red-500";
      displayName = "Deleted";
      break;
    default:
      className = "bg-slate-500";
      displayName = status.charAt(0).toUpperCase() + status.slice(1);
  }

  return <Badge className={className}>{displayName}</Badge>;
};
