
import React from 'react';
import { AdminV2Layout } from '@/layouts/AdminV2Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Music, 
  Store, 
  FileImage, 
  Settings,
  BarChart3,
  MessageSquare,
  Mic
} from 'lucide-react';

export default function AdminDashboardV2() {
  const navigate = useNavigate();

  const adminCards = [
    {
      title: 'Members Management',
      description: 'Manage club members, roles, and permissions',
      icon: Users,
      path: '/admin/members-v2',
      color: 'bg-blue-500'
    },
    {
      title: 'Calendar & Events',
      description: 'Schedule rehearsals, performances, and events',
      icon: Calendar,
      path: '/admin/calendar-v2',
      color: 'bg-green-500'
    },
    {
      title: 'Sheet Music Library',
      description: 'Upload and organize sheet music collections',
      icon: Music,
      path: '/admin/sheet-music-v2',
      color: 'bg-purple-500'
    },
    {
      title: 'Music Studio',
      description: 'Recording tools and practice materials',
      icon: Mic,
      path: '/admin/music-studio-v2',
      color: 'bg-red-500'
    },
    {
      title: 'Store & Merch',
      description: 'Manage products, inventory, and orders',
      icon: Store,
      path: '/admin/store-v2',
      color: 'bg-yellow-500'
    },
    {
      title: 'Media Library',
      description: 'Upload and manage images, videos, and files',
      icon: FileImage,
      path: '/admin/media-library',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <AdminV2Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your Glee Club from one central location
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Music className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sheet Music</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Store className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Store Orders</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.path} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`${card.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                      <Button 
                        onClick={() => navigate(card.path)}
                        className="w-full"
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-16">
                <MessageSquare className="h-5 w-5 mr-2" />
                Send Announcement
              </Button>
              <Button variant="outline" className="h-16">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Event
              </Button>
              <Button variant="outline" className="h-16">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminV2Layout>
  );
}
