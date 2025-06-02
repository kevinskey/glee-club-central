import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Mail, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Registration {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

export default function AdminRegistrationPage() {
  const { user, isLoading } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'member'
  });

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        // Fetch registrations logic here
      } catch (error) {
        toast.error('Failed to fetch registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Registration logic here
      toast.success('Registration invitation sent successfully');
      setFormData({ email: '', firstName: '', lastName: '', role: 'member' });
    } catch (error) {
      toast.error('Failed to send registration invitation');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Send Registration Invitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="section_leader">Section Leader</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" onClick={handleSubmit}>
              <Mail className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading registrations...</div>
            ) : registrations.length > 0 ? (
              <div className="space-y-2">
                {registrations.map((reg: any) => (
                  <div key={reg.id} className="flex justify-between items-center p-2 border rounded">
                    <span>{reg.firstName} {reg.lastName}</span>
                    <Badge variant="outline">{reg.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent registrations</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Registrations
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
