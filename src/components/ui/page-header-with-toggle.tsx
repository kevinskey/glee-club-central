
import React from "react";
import { PageHeader } from "./page-header";

interface PageHeaderWithToggleProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeaderWithToggle({ title, description, children }: PageHeaderWithToggleProps) {
  return (
    <PageHeader title={title} description={description}>
      {children}
    </PageHeader>
  );
}
