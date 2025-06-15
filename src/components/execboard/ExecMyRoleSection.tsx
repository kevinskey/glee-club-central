
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, FileText, DollarSign, Camera, Megaphone, Heart, UserCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface RoleInfo {
  title: string;
  description: string;
  responsibilities: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const roleDefinitions: { [key: string]: RoleInfo } = {
  'President': {
    title: 'President',
    description: 'Leads all board meetings and general membership meetings. Serves as liaison to faculty advisor and oversees all organizational operations.',
    responsibilities: [
      'Lead board meetings and general membership meetings',
      'Serve as liaison to faculty advisor',
      'Oversee all organizational operations',
      'Have final approval on decisions, messages, and finances',
      'Assign or reassign tasks if a board member is absent'
    ],
    icon: Crown,
    color: 'bg-purple-100 text-purple-800'
  },
  'Vice President': {
    title: 'Vice President',
    description: 'Assists the President, coordinates rehearsals and sectionals, and manages conflict resolution among members.',
    responsibilities: [
      'Assist the President in all duties',
      'Coordinate rehearsals and sectionals',
      'Manage conflict resolution among members',
      'Step in for President as needed',
      'Support organizational leadership'
    ],
    icon: Users,
    color: 'bg-blue-100 text-blue-800'
  },
  'Secretary': {
    title: 'Secretary',
    description: 'Records minutes at meetings, maintains attendance records, and keeps historical documentation organized.',
    responsibilities: [
      'Record minutes at all meetings',
      'Maintain records of attendance',
      'Send weekly newsletters or updates',
      'Keep historical documentation organized',
      'Manage official communications'
    ],
    icon: FileText,
    color: 'bg-green-100 text-green-800'
  },
  'Treasurer': {
    title: 'Treasurer',
    description: 'Manages all financial transactions, tracks dues and fundraisers, and reports monthly financial status.',
    responsibilities: [
      'Manage all financial transactions',
      'Track dues, fundraisers, and reimbursements',
      'Collaborate with Business Manager on purchases',
      'Report monthly financial status to Executive Board',
      'Oversee budget planning and monitoring'
    ],
    icon: DollarSign,
    color: 'bg-yellow-100 text-yellow-800'
  },
  'Business Manager': {
    title: 'Business Manager',
    description: 'Orders uniforms and merchandise, tracks equipment and supplies, and works with Treasurer on pricing.',
    responsibilities: [
      'Order uniforms and merchandise',
      'Track equipment and supplies (folders, binders, robes)',
      'Work closely with Treasurer on pricing and inventory',
      'Manage vendor relationships',
      'Coordinate uniform fittings and distribution'
    ],
    icon: UserCheck,
    color: 'bg-indigo-100 text-indigo-800'
  },
  'Historian': {
    title: 'Historian',
    description: 'Documents all major events and curates archives for year-end reports and senior gifts.',
    responsibilities: [
      'Document all major events (photos, videos, flyers)',
      'Curate archives for year-end report or senior gift',
      'Work with Social Media Chair to post approved materials',
      'Maintain digital and physical archives',
      'Create annual memory books or collections'
    ],
    icon: Camera,
    color: 'bg-pink-100 text-pink-800'
  },
  'Social Media Chair': {
    title: 'Social Media Chair',
    description: 'Plans and schedules social content, designs graphics, and promotes community outreach online.',
    responsibilities: [
      'Plan and schedule social content (IG, TikTok, YouTube)',
      'Design graphics or captions for events',
      'Collaborate with Historian for content sourcing',
      'Promote community outreach and online presence',
      'Manage official social media accounts'
    ],
    icon: Megaphone,
    color: 'bg-orange-100 text-orange-800'
  },
  'Chaplain': {
    title: 'Chaplain',
    description: 'Leads devotions before performances, sends weekly reflections, and supports the group spiritually.',
    responsibilities: [
      'Lead devotions before performances or meetings',
      'Send weekly reflections or scripture',
      'Support the group emotionally and spiritually',
      'Coordinate prayer requests or group support',
      'Organize spiritual activities and moments'
    ],
    icon: Heart,
    color: 'bg-red-100 text-red-800'
  },
  'Section Leader': {
    title: 'Section Leader',
    description: 'Manages vocal quality, attendance, and morale of their voice section.',
    responsibilities: [
      'Manage vocal quality, attendance, and morale of section',
      'Lead sectionals and help with part learning',
      'Report vocal issues or conflicts to VP or President',
      'Support section members academically and personally',
      'Coordinate section-specific activities'
    ],
    icon: Users,
    color: 'bg-gray-100 text-gray-800'
  }
};

export function ExecMyRoleSection() {
  const { profile } = useAuth();
  const roleInfo = roleDefinitions[profile?.exec_board_role || ''];

  if (!roleInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            My Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No executive board role assigned</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const IconComponent = roleInfo.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconComponent className="h-5 w-5" />
          My Role
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Role Overview */}
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${roleInfo.color}`}>
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{roleInfo.title}</h3>
            <Badge className={roleInfo.color}>
              Executive Board
            </Badge>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-medium mb-2">Role Description</h4>
          <p className="text-sm text-muted-foreground">{roleInfo.description}</p>
        </div>

        {/* Responsibilities */}
        <div>
          <h4 className="font-medium mb-3">Key Responsibilities</h4>
          <div className="space-y-2">
            {roleInfo.responsibilities.map((responsibility, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <p className="text-sm">{responsibility}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Access */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Your Dashboard Access</h4>
          <p className="text-sm text-muted-foreground">
            As {roleInfo.title}, you have access to specific sections of this executive dashboard based on your responsibilities. 
            Some features may be read-only or require approval from other board members.
          </p>
        </div>

        {/* Quick Actions based on role */}
        <div>
          <h4 className="font-medium mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            {profile?.exec_board_role === 'President' && (
              <>
                <Badge variant="outline" className="justify-center py-2">📅 Schedule Meeting</Badge>
                <Badge variant="outline" className="justify-center py-2">📢 Send Announcement</Badge>
              </>
            )}
            {profile?.exec_board_role === 'Secretary' && (
              <>
                <Badge variant="outline" className="justify-center py-2">📝 Meeting Notes</Badge>
                <Badge variant="outline" className="justify-center py-2">📧 Newsletter</Badge>
              </>
            )}
            {profile?.exec_board_role === 'Treasurer' && (
              <>
                <Badge variant="outline" className="justify-center py-2">💰 View Budget</Badge>
                <Badge variant="outline" className="justify-center py-2">🧾 Reimbursements</Badge>
              </>
            )}
            {profile?.exec_board_role === 'Historian' && (
              <>
                <Badge variant="outline" className="justify-center py-2">📸 Upload Media</Badge>
                <Badge variant="outline" className="justify-center py-2">📚 Organize Archive</Badge>
              </>
            )}
            {profile?.exec_board_role === 'Social Media Chair' && (
              <>
                <Badge variant="outline" className="justify-center py-2">📱 Schedule Post</Badge>
                <Badge variant="outline" className="justify-center py-2">✨ Generate Caption</Badge>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
