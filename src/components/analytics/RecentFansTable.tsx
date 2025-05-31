
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Fan {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

interface RecentFansTableProps {
  data: Fan[];
  isLoading?: boolean;
}

export function RecentFansTable({ data, isLoading }: RecentFansTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Fan Signups</CardTitle>
        <CardDescription>Latest 5 fans who joined our community</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-2 text-sm text-muted-foreground">Loading recent fans...</p>
            </div>
          </div>
        ) : data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fan</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((fan) => (
                  <TableRow key={fan.id}>
                    <TableCell className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-glee-spelman text-white text-xs">
                          {getInitials(fan.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{fan.full_name}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {fan.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(fan.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No fans have signed up yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
