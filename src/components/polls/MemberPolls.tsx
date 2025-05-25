
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Vote, Clock, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Poll {
  id: string;
  title: string;
  description: string;
  options: string[];
  expires_at: string | null;
  created_at: string;
}

interface PollVote {
  poll_id: string;
  option_index: number;
}

interface PollResult {
  option_index: number;
  count: number;
}

export const MemberPolls: React.FC = () => {
  const { profile } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [userVotes, setUserVotes] = useState<PollVote[]>([]);
  const [pollResults, setPollResults] = useState<{ [key: string]: PollResult[] }>({});
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      loadPolls();
      loadUserVotes();
    }
  }, [profile?.id]);

  const loadPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPolls(data || []);

      // Load results for all polls
      for (const poll of data || []) {
        await loadPollResults(poll.id);
      }
    } catch (error) {
      console.error('Error loading polls:', error);
      toast.error('Failed to load polls');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserVotes = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('poll_votes')
        .select('poll_id, option_index')
        .eq('member_id', profile.id);

      if (error) throw error;
      setUserVotes(data || []);
    } catch (error) {
      console.error('Error loading user votes:', error);
    }
  };

  const loadPollResults = async (pollId: string) => {
    try {
      const { data, error } = await supabase
        .from('poll_votes')
        .select('option_index')
        .eq('poll_id', pollId);

      if (error) throw error;

      const results: PollResult[] = [];
      const votes = data || [];
      
      // Count votes for each option
      const poll = polls.find(p => p.id === pollId) || { options: [] };
      poll.options.forEach((_, index) => {
        const count = votes.filter(vote => vote.option_index === index).length;
        results.push({ option_index: index, count });
      });

      setPollResults(prev => ({ ...prev, [pollId]: results }));
    } catch (error) {
      console.error('Error loading poll results:', error);
    }
  };

  const handleVote = async (pollId: string) => {
    if (!profile?.id || selectedOptions[pollId] === undefined) {
      toast.error('Please select an option');
      return;
    }

    try {
      const { error } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: pollId,
          member_id: profile.id,
          option_index: selectedOptions[pollId]
        });

      if (error) throw error;

      toast.success('Vote submitted successfully');
      await loadUserVotes();
      await loadPollResults(pollId);
      
      // Clear selection
      setSelectedOptions(prev => ({ ...prev, [pollId]: undefined }));
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast.error('Failed to submit vote');
    }
  };

  const getUserVote = (pollId: string): number | undefined => {
    return userVotes.find(vote => vote.poll_id === pollId)?.option_index;
  };

  const getTotalVotes = (pollId: string): number => {
    const results = pollResults[pollId] || [];
    return results.reduce((total, result) => total + result.count, 0);
  };

  const isExpired = (expiresAt: string | null): boolean => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No Active Polls</h3>
          <p className="text-muted-foreground">
            There are currently no polls available for voting.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Vote className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Active Polls</h3>
      </div>

      {polls.map((poll) => {
        const userVote = getUserVote(poll.id);
        const hasVoted = userVote !== undefined;
        const expired = isExpired(poll.expires_at);
        const totalVotes = getTotalVotes(poll.id);
        const results = pollResults[poll.id] || [];

        return (
          <Card key={poll.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{poll.title}</CardTitle>
                  {poll.description && (
                    <CardDescription className="mt-1">
                      {poll.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {expired && <Badge variant="secondary">Expired</Badge>}
                  {hasVoted && <Badge variant="outline">Voted</Badge>}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {totalVotes} votes
                </div>
                {poll.expires_at && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Expires {new Date(poll.expires_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {hasVoted || expired ? (
                // Show results
                <div className="space-y-3">
                  {poll.options.map((option, index) => {
                    const result = results.find(r => r.option_index === index);
                    const voteCount = result?.count || 0;
                    const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                    const isUserChoice = userVote === index;

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${isUserChoice ? 'text-primary' : ''}`}>
                            {option} {isUserChoice && '✓'}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {voteCount} votes ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Show voting form
                <div className="space-y-4">
                  <RadioGroup
                    value={selectedOptions[poll.id]?.toString() || ''}
                    onValueChange={(value) => 
                      setSelectedOptions(prev => ({ ...prev, [poll.id]: parseInt(value) }))
                    }
                  >
                    {poll.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`${poll.id}-${index}`} />
                        <Label htmlFor={`${poll.id}-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  <Button 
                    onClick={() => handleVote(poll.id)}
                    disabled={selectedOptions[poll.id] === undefined}
                    className="w-full"
                  >
                    Submit Vote
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
