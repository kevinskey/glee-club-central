import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Download,
  Upload,
  Trash2,
  Edit,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
}

export function UserManagementSimplified() {
  const { user, profile, isAdmin, signUp } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Mock data loading - replace with actual API call
    setLoading(true);
    setTimeout(() => {
      const mockUsers: User[] = [
        { id: '1', email: 'kevin@example.com', firstName: 'Kevin', lastName: 'Key', role: 'admin', status: 'active' },
        { id: '2', email: 'member1@example.com', firstName: 'Alice', lastName: 'Smith', role: 'member', status: 'active' },
        { id: '3', email: 'member2@example.com', firstName: 'Bob', lastName: 'Johnson', role: 'member', status: 'inactive' },
        { id: '4', email: 'pending@example.com', firstName: 'Eve', lastName: 'Williams', role: 'member', status: 'pending' },
      ];
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  const handleCreateUser = async (email: string, firstName: string, lastName: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
  
    try {
      // Basic email validation
      if (!email.includes('@')) {
        throw new Error('Invalid email format.');
      }
  
      // Generate a random password for the user
      const randomPassword = Math.random().toString(36).slice(-8);
  
      // Call the signUp function from AuthContext
      const { error, data } = await signUp(email, randomPassword, firstName, lastName);
  
      if (error) {
        console.error('Signup error:', error.message);
        setError(`Failed to create user: ${error.message}`);
      } else {
        console.log('User created successfully:', data);
        setSuccessMessage('User created successfully. Temporary password sent to user.');
        // Refresh user list or add the new user to the state
        setUsers(prevUsers => [...prevUsers, {
          id: data.user.id,
          email: data.user.email || email,
          firstName: firstName,
          lastName: lastName,
          role: 'member', // Default role
          status: 'pending', // Or 'active' if you auto-activate
        }]);
      }
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(`Error creating user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchMatch = searchTerm ? 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) : 
      true;
    const roleMatch = filterRole === 'all' || user.role === filterRole;
    return searchMatch && roleMatch;
  });

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <Input
              type="search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="md:w-1/2"
            />
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="border rounded px-3 py-2 md:w-1/4"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          </div>

          {/* User List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary">{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Create User Form */}
          <div className="border-t pt-4 mt-4">
            <CardTitle className="text-lg font-semibold">Create New User</CardTitle>
            <CreateUserForm onCreate={handleCreateUser} loading={loading} error={error} successMessage={successMessage} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface CreateUserFormProps {
  onCreate: (email: string, firstName: string, lastName: string) => void;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onCreate, loading, error, successMessage }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(email, firstName, lastName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {successMessage && (
        <Alert>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          type="text"
          id="firstName"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          type="text"
          id="lastName"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </Button>
    </form>
  );
};
