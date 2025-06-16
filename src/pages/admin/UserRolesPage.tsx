
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { PageHeader } from '@/components/ui/page-header';
import { RefreshCw, Users, Search, Shield } from 'lucide-react';
import { useUserRolePermissions } from '@/hooks/useUserRolePermissions';

const UserRolesPage = () => {
  const { permissions, loading, updatePermission, refetch } = useUserRolePermissions();
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique roles and permission keys
  const roles = [...new Set(permissions.map(p => p.role))].sort();
  const permissionKeys = [...new Set(permissions.map(p => p.permission_key))].sort();

  // Filter permissions based on search
  const filteredPermissions = permissions.filter(permission =>
    permission.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.permission_key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group permissions by role
  const permissionsByRole = roles.reduce((acc, role) => {
    acc[role] = permissionKeys.map(key => 
      filteredPermissions.find(p => p.role === role && p.permission_key === key)
    );
    return acc;
  }, {} as Record<string, (typeof permissions[0] | undefined)[]>);

  const formatPermissionName = (key: string) => {
    return key.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'section_leader': return 'default';
      case 'member': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glee-spelman mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading user roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader
        title="User Role Management"
        description="Control permissions for different user roles"
        icon={<Users className="h-6 w-6" />}
      />

      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search roles or permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button onClick={refetch} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Permissions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-glee-spelman" />
            Role Permissions Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Permission</TableHead>
                  {roles.map(role => (
                    <TableHead key={role} className="text-center min-w-32">
                      <Badge variant={getRoleBadgeVariant(role)}>
                        {role.replace('_', ' ')}
                      </Badge>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionKeys.map(permissionKey => (
                  <TableRow key={permissionKey}>
                    <TableCell className="font-medium">
                      {formatPermissionName(permissionKey)}
                    </TableCell>
                    {roles.map(role => {
                      const permission = permissionsByRole[role]?.find(p => 
                        p?.permission_key === permissionKey
                      );
                      
                      return (
                        <TableCell key={`${role}-${permissionKey}`} className="text-center">
                          {permission ? (
                            <Switch
                              checked={permission.enabled}
                              onCheckedChange={(enabled) => 
                                updatePermission(permission.id, enabled)
                              }
                            />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-glee-spelman">{roles.length}</div>
              <p className="text-sm text-muted-foreground">Total Roles</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-glee-spelman">{permissionKeys.length}</div>
              <p className="text-sm text-muted-foreground">Total Permissions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-glee-spelman">
                {permissions.filter(p => p.enabled).length}
              </div>
              <p className="text-sm text-muted-foreground">Enabled Permissions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRolesPage;
