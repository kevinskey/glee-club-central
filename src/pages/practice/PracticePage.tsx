import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  Clock, 
  Target, 
  TrendingUp,
  Calendar,
  BookOpen,
  Headphones,
  Mic,
  Settings
} from 'lucide-react';
import { PracticeLogForm } from '@/components/practice/PracticeLogForm';
import { PracticeLogsList } from '@/components/practice/PracticeLogsList';
import { PracticeStats } from '@/components/practice/PracticeStats';
import { SightReadingEmbed } from '@/components/practice/SightReadingEmbed';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

export default function PracticePage() {
  const { user, isLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();

  const [currentTab, setCurrentTab] = useState('practice-log');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading || profileLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Practice Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="practice-log" className="space-y-4">
            <TabsList>
              <TabsTrigger value="practice-log">
                <Music className="mr-2 h-4 w-4" />
                Practice Log
              </TabsTrigger>
              <TabsTrigger value="practice-stats">
                <TrendingUp className="mr-2 h-4 w-4" />
                Stats
              </TabsTrigger>
              <TabsTrigger value="sight-reading">
                <BookOpen className="mr-2 h-4 w-4" />
                Sight Reading
              </TabsTrigger>
              <TabsTrigger value="practice-tunes">
                <Headphones className="mr-2 h-4 w-4" />
                Practice Tunes
              </TabsTrigger>
              {/* Add more tabs as needed */}
            </TabsList>
            <TabsContent value="practice-log">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Log New Practice Session</h3>
                  <PracticeLogForm />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Recent Practice Logs</h3>
                  <PracticeLogsList />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="practice-stats">
              <h3 className="text-xl font-semibold mb-2">Your Practice Stats</h3>
              <PracticeStats />
            </TabsContent>
            <TabsContent value="sight-reading">
              <h3 className="text-xl font-semibold mb-2">Sight Reading Exercises</h3>
                <SightReadingEmbed />
            </TabsContent>
            <TabsContent value="practice-tunes">
              <h3 className="text-xl font-semibold mb-2">Practice Tunes</h3>
              <div>Coming Soon!</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
