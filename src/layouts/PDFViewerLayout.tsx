
import React from "react";
import AppLayout from "./AppLayout";

export default function PDFViewerLayout() {
  return (
    <AppLayout 
      sidebarType="none" 
      showHeader={true} 
      showFooter={false}
    />
  );
}
