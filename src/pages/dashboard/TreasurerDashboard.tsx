
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { MobileOptimizedContainer } from '@/components/mobile/MobileOptimizedContainer';
import { DuesTracker } from '@/components/treasurer/DuesTracker';
import { BudgetOverview } from '@/components/treasurer/BudgetOverview';
import { CashboxLog } from '@/components/treasurer/CashboxLog';
import { TreasurerNotes } from '@/components/treasurer/TreasurerNotes';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { DollarSign, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function TreasurerDashboard() {
  const { user, profile, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading && profile) {
      const roleTags = profile.role_tags || [];
      const hasAccess = roleTags.includes('Treasurer') || profile.is_super_admin;
      setIsAuthorized(hasAccess);
      
      if (!hasAccess) {
        toast.error('Access denied: Treasurer privileges required');
      }
    }
  }, [profile, isLoading]);

  if (isLoading) {
    return (
      <MobileOptimizedContainer className="pt-4 pb-12">
        <div className="flex items-center justify-center h-40">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </MobileOptimizedContainer>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MobileOptimizedContainer className="pt-4 pb-12 px-3 sm:px-6">
      <PageHeader
        title="Treasurer Dashboard"
        description="Manage Glee Club finances, dues, and budget"
        icon={<DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-glee-spelman" />}
      />

      {!profile?.role_tags?.includes('Treasurer') && !profile?.is_super_admin && (
        <Alert variant="destructive" className="mb-4 sm:mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You do not have Treasurer privileges. Please contact an administrator.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 sm:space-y-6">
        <Accordion type="multiple" defaultValue={["dues", "budget", "cashbox", "notes"]} className="w-full">
          <AccordionItem value="dues" className="border rounded-lg px-4 sm:px-6">
            <AccordionTrigger className="text-sm sm:text-lg font-semibold py-3 sm:py-4">
              📋 Dues Tracker
            </AccordionTrigger>
            <AccordionContent className="pt-2 sm:pt-4 pb-4 sm:pb-6">
              <DuesTracker />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="budget" className="border rounded-lg px-4 sm:px-6">
            <AccordionTrigger className="text-sm sm:text-lg font-semibold py-3 sm:py-4">
              💰 Budget Overview
            </AccordionTrigger>
            <AccordionContent className="pt-2 sm:pt-4 pb-4 sm:pb-6">
              <BudgetOverview />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cashbox" className="border rounded-lg px-4 sm:px-6">
            <AccordionTrigger className="text-sm sm:text-lg font-semibold py-3 sm:py-4">
              🧾 Cashbox Log
            </AccordionTrigger>
            <AccordionContent className="pt-2 sm:pt-4 pb-4 sm:pb-6">
              <CashboxLog />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="notes" className="border rounded-lg px-4 sm:px-6">
            <AccordionTrigger className="text-sm sm:text-lg font-semibold py-3 sm:py-4">
              📝 Treasurer Notes
            </AccordionTrigger>
            <AccordionContent className="pt-2 sm:pt-4 pb-4 sm:pb-6">
              <TreasurerNotes />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </MobileOptimizedContainer>
  );
}
