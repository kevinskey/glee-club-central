
import React from "react";
import { PageHeader } from "./page-header";

interface PageHeaderWithToggleProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeaderWithToggle({ title, description, icon, children }: PageHeaderWithToggleProps) {
  return (
    <PageHeader title={title} description={description} icon={icon}>
      {children}
    </PageHeader>
  );
}
