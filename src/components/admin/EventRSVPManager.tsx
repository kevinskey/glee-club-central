
import React, { useState } from 'react';
import { useEventRSVPs, EventRSVP } from '@/hooks/useEventRSVPs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Filter, Search, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface EventRSVPManagerProps {
  eventId: string;
  eventTitle: string;
}

export const EventRSVPManager: React.FC<EventRSVPManagerProps> = ({ 
  eventId, 
  eventTitle 
}) => {
  const { rsvps, rsvpStats, loading } = useEventRSVPs(eventId);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredRSVPs = rsvps.filter(rsvp => {
    const matchesSearch = rsvp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rsvp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rsvp.status === statusFilter;
    const matchesRole = roleFilter === 'all' || rsvp.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const downloadCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Status', 'RSVP Date'];
    const csvData = filteredRSVPs.map(rsvp => [
      rsvp.name,
      rsvp.email,
      rsvp.role,
      rsvp.status,
      format(new Date(rsvp.created_at), 'MMM d, yyyy h:mm a')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_rsvps.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'going':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Attending</Badge>;
      case 'maybe':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Maybe</Badge>;
      case 'not_going':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Can't Attend</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      member: 'bg-purple-100 text-purple-800',
      fan: 'bg-blue-100 text-blue-800',
      guest: 'bg-gray-100 text-gray-800',
      family: 'bg-green-100 text-green-800',
    };
    
    return (
      <Badge className={colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glee-spelman"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-glee-spelman">{rsvpStats.total}</div>
            <div className="text-sm text-muted-foreground">Total RSVPs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{rsvpStats.going}</div>
            <div className="text-sm text-muted-foreground">Attending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{rsvpStats.maybe}</div>
            <div className="text-sm text-muted-foreground">Maybe</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{rsvpStats.notGoing}</div>
            <div className="text-sm text-muted-foreground">Can't Attend</div>
          </CardContent>
        </Card>
      </div>

      {/* RSVP Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Event RSVPs
          </CardTitle>
          <Button onClick={downloadCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="going">Attending</SelectItem>
                <SelectItem value="maybe">Maybe</SelectItem>
                <SelectItem value="not_going">Can't Attend</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="member">Members</SelectItem>
                <SelectItem value="fan">Fans</SelectItem>
                <SelectItem value="guest">Guests</SelectItem>
                <SelectItem value="family">Family/Friends</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* RSVP Table */}
          {filteredRSVPs.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>RSVP Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRSVPs.map((rsvp) => (
                    <TableRow key={rsvp.id}>
                      <TableCell className="font-medium">{rsvp.name}</TableCell>
                      <TableCell>{rsvp.email}</TableCell>
                      <TableCell>{getRoleBadge(rsvp.role)}</TableCell>
                      <TableCell>{getStatusBadge(rsvp.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(rsvp.created_at), 'MMM d, yyyy h:mm a')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {rsvps.length === 0 ? 'No RSVPs yet' : 'No RSVPs match your filters'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
