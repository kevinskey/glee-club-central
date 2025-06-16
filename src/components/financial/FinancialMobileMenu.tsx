
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDown,
  FileText,
  PiggyBank,
  Calculator,
  BarChart3,
  Download
} from 'lucide-react';

interface FinancialMobileMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const FinancialMobileMenu: React.FC<FinancialMobileMenuProps> = ({
  activeTab,
  onTabChange
}) => {
  const menuItems = [
    { value: 'ledger', label: 'Ledger', icon: <FileText className="h-4 w-4" /> },
    { value: 'budget-builder', label: 'Budget Builder', icon: <PiggyBank className="h-4 w-4" /> },
    { value: 'budget-tracker', label: 'Budget Tracker', icon: <Calculator className="h-4 w-4" /> },
    { value: 'summary', label: 'Summary', icon: <BarChart3 className="h-4 w-4" /> },
    { value: 'reports', label: 'Reports', icon: <Download className="h-4 w-4" /> }
  ];

  const currentItem = menuItems.find(item => item.value === activeTab);

  return (
    <div className="md:hidden mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          >
            <div className="flex items-center gap-2">
              {currentItem?.icon}
              <span>{currentItem?.label}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-full min-w-[280px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" 
          align="start"
        >
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => onTabChange(item.value)}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 py-3 px-4"
            >
              {item.icon}
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
