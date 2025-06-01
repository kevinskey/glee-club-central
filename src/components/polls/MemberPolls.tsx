
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

interface Poll {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'closed';
  endDate: string;
  responses: number;
  hasVoted: boolean;
}

export function MemberPolls() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual data fetching
    const mockPolls: Poll[] = [
      {
        id: '1',
        title: 'Spring Concert Repertoire Selection',
        description: 'Help us choose the final piece for our spring concert program.',
        status: 'active',
        endDate: '2024-03-15',
        responses: 12,
        hasVoted: false
      },
      {
        id: '2',
        title: 'Rehearsal Schedule Preference',
        description: 'Vote on your preferred rehearsal time for the upcoming semester.',
        status: 'closed',
        endDate: '2024-02-28',
        responses: 28,
        hasVoted: true
      }
    ];
    
    setPolls(mockPolls);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading polls...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Member Polls</h3>
      
      {polls.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <p>No active polls at this time.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        polls.map((poll) => (
          <Card key={poll.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{poll.title}</CardTitle>
                  <CardDescription>{poll.description}</CardDescription>
                </div>
                <Badge variant={poll.status === 'active' ? 'default' : 'secondary'}>
                  {poll.status === 'active' ? (
                    <>
                      <Clock className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Closed
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {poll.responses} responses • Ends {poll.endDate}
                </span>
                {poll.status === 'active' && !poll.hasVoted && (
                  <Button size="sm">
                    Vote Now
                  </Button>
                )}
                {poll.hasVoted && (
                  <Badge variant="outline">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Voted
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
