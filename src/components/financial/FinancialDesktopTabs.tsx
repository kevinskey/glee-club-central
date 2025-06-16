
import React from 'react';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  FileText,
  PiggyBank,
  Calculator,
  BarChart3,
  Download
} from 'lucide-react';

interface FinancialDesktopTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const FinancialDesktopTabs: React.FC<FinancialDesktopTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="hidden md:block">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="ledger" className="flex items-center gap-2 data-[state=active]:bg-[#0072CE] data-[state=active]:text-white">
            <FileText className="h-4 w-4" />
            Ledger
          </TabsTrigger>
          <TabsTrigger value="budget-builder" className="flex items-center gap-2 data-[state=active]:bg-[#0072CE] data-[state=active]:text-white">
            <PiggyBank className="h-4 w-4" />
            Budget Builder
          </TabsTrigger>
          <TabsTrigger value="budget-tracker" className="flex items-center gap-2 data-[state=active]:bg-[#0072CE] data-[state=active]:text-white">
            <Calculator className="h-4 w-4" />
            Budget Tracker
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2 data-[state=active]:bg-[#0072CE] data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-[#0072CE] data-[state=active]:text-white">
            <Download className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
