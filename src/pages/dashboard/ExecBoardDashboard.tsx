import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/ui/page-header';
import { MobileOptimizedContainer } from '@/components/mobile/MobileOptimizedContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, Calendar, FileText, DollarSign, Camera, Megaphone, Brain, User } from 'lucide-react';

// Import all section components
import { ExecEventsSection } from '@/components/execboard/ExecEventsSection';
import { ExecDocumentsSection } from '@/components/execboard/ExecDocumentsSection';
import { ExecBudgetSection } from '@/components/execboard/ExecBudgetSection';
import { ExecMediaSection } from '@/components/execboard/ExecMediaSection';
import { ExecCommsSection } from '@/components/execboard/ExecCommsSection';
import { ExecAISection } from '@/components/execboard/ExecAISection';
import { ExecMyRoleSection } from '@/components/execboard/ExecMyRoleSection';

export default function ExecBoardDashboard() {
  const { profile } = useAuth() as { profile: Profile | null };
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <MobileOptimizedContainer className="pt-4 pb-12 px-3 sm:px-6">
      <PageHeader
        title="Executive Board Dashboard"
        description="Manage your executive responsibilities and collaborate with the board"
        icon={<Shield className="h-6 w-6 sm:h-8 sm:w-8 text-glee-spelman" />}
      />
      
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-glee-spelman/10 to-blue-50 dark:from-glee-spelman/5 dark:to-gray-800 rounded-lg border">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Welcome, {profile?.first_name}! 👑
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-3">
          You are serving as <strong>{profile?.exec_board_role}</strong> on the Executive Board.
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-glee-spelman/10 text-glee-spelman text-xs">
            {profile?.exec_board_role}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Executive Board
          </Badge>
        </div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview" className="text-xs">
            <User className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="text-xs">
            <Calendar className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">
            <FileText className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">Docs</span>
          </TabsTrigger>
          <TabsTrigger value="budget" className="text-xs">
            <DollarSign className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">Budget</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="text-xs">
            <Camera className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">Media</span>
          </TabsTrigger>
          <TabsTrigger value="comms" className="text-xs">
            <Megaphone className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">Comms</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-xs">
            <Brain className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">AI</span>
          </TabsTrigger>
          <TabsTrigger value="role" className="text-xs">
            <Shield className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">My Role</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExecMyRoleSection />
            <ExecEventsSection />
          </div>
        </TabsContent>

        <TabsContent value="events">
          <ExecEventsSection />
        </TabsContent>

        <TabsContent value="documents">
          <ExecDocumentsSection />
        </TabsContent>

        <TabsContent value="budget">
          <ExecBudgetSection />
        </TabsContent>

        <TabsContent value="media">
          <ExecMediaSection />
        </TabsContent>

        <TabsContent value="comms">
          <ExecCommsSection />
        </TabsContent>

        <TabsContent value="ai">
          <ExecAISection />
        </TabsContent>

        <TabsContent value="role">
          <ExecMyRoleSection />
        </TabsContent>
      </Tabs>
    </MobileOptimizedContainer>
  );
}
