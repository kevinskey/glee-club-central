
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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

  // Show loading state
  if (isLoading) {
    return (
      <MobileOptimizedContainer className="py-6">
        <div className="flex items-center justify-center h-40">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </MobileOptimizedContainer>
    );
  }

  // Redirect if not authorized
  if (!isAuthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MobileOptimizedContainer className="py-6">
      <PageHeader
        title="Treasurer Dashboard"
        description="Manage Glee Club finances, dues, and budget"
        icon={<DollarSign className="h-8 w-8 text-glee-spelman" />}
      />

      {/* Warning for unauthorized users */}
      {!profile?.role_tags?.includes('Treasurer') && !profile?.is_super_admin && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You do not have Treasurer privileges. Please contact an administrator.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <Accordion type="multiple" defaultValue={["dues", "budget", "cashbox", "notes"]}>
          {/* Dues Tracker */}
          <AccordionItem value="dues">
            <AccordionTrigger className="text-lg font-semibold">
              📋 Dues Tracker
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <DuesTracker />
            </AccordionContent>
          </AccordionItem>

          {/* Budget Overview */}
          <AccordionItem value="budget">
            <AccordionTrigger className="text-lg font-semibold">
              💰 Budget Overview
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <BudgetOverview />
            </AccordionContent>
          </AccordionItem>

          {/* Cashbox Log */}
          <AccordionItem value="cashbox">
            <AccordionTrigger className="text-lg font-semibold">
              🧾 Cashbox Log
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <CashboxLog />
            </AccordionContent>
          </AccordionItem>

          {/* Treasurer Notes */}
          <AccordionItem value="notes">
            <AccordionTrigger className="text-lg font-semibold">
              📝 Treasurer Notes
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <TreasurerNotes />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </MobileOptimizedContainer>
  );
}
