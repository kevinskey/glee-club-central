
import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { useAuth } from '@/contexts/AuthContext';
import { useEventRSVPs } from '@/hooks/useEventRSVPs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, Clock, XCircle, Users } from 'lucide-react';

interface EventRSVPFormProps {
  event: CalendarEvent;
}

export const EventRSVPForm: React.FC<EventRSVPFormProps> = ({ event }) => {
  const { user } = useAuth();
  const { userRSVP, rsvpStats, createOrUpdateRSVP, deleteRSVP, loading } = useEventRSVPs(event.id);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'fan',
    status: 'going' as 'going' | 'maybe' | 'not_going'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email || '',
        email: user.email || '',
        role: 'member'
      }));
    }

    if (userRSVP) {
      setFormData(prev => ({
        ...prev,
        name: userRSVP.name,
        email: userRSVP.email,
        role: userRSVP.role,
        status: userRSVP.status
      }));
    }
  }, [user, userRSVP]);

  if (!event.allow_rsvp) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    setIsSubmitting(true);
    try {
      await createOrUpdateRSVP({
        event_id: event.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        status: formData.status
      });
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveRSVP = async () => {
    if (!userRSVP) return;
    
    setIsSubmitting(true);
    try {
      await deleteRSVP(userRSVP.id);
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: 'going', label: 'Attending', icon: CheckCircle, color: 'text-green-600' },
    { value: 'maybe', label: 'Maybe', icon: Clock, color: 'text-yellow-600' },
    { value: 'not_going', label: "Can't Attend", icon: XCircle, color: 'text-red-600' }
  ];

  return (
    <div className="space-y-4">
      {/* RSVP Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-glee-spelman" />
            <h3 className="font-semibold">Event RSVPs</h3>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-glee-spelman">{rsvpStats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{rsvpStats.going}</div>
              <div className="text-xs text-muted-foreground">Going</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{rsvpStats.maybe}</div>
              <div className="text-xs text-muted-foreground">Maybe</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{rsvpStats.notGoing}</div>
              <div className="text-xs text-muted-foreground">Can't Go</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RSVP Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {userRSVP ? 'Update Your RSVP' : 'RSVP for This Event'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                  required
                  disabled={isSubmitting || !!user}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                disabled={isSubmitting || !!user}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fan">Fan</SelectItem>
                  <SelectItem value="member">Glee Club Member</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                  <SelectItem value="family">Family/Friend</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">Response *</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(value: 'going' | 'maybe' | 'not_going') => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
                className="mt-2"
                disabled={isSubmitting}
              >
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label 
                        htmlFor={option.value} 
                        className={`flex items-center gap-2 cursor-pointer ${option.color}`}
                      >
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.name.trim() || !formData.email.trim()}
                className="flex-1"
              >
                {isSubmitting ? 'Saving...' : (userRSVP ? 'Update RSVP' : 'Submit RSVP')}
              </Button>
              
              {userRSVP && (
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleRemoveRSVP}
                  disabled={isSubmitting}
                >
                  Remove RSVP
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
