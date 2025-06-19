
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Image, 
  Store, 
  Settings, 
  MessageSquare, 
  DollarSign, 
  BarChart,
  Music,
  Download
} from 'lucide-react';

const AdminNavItems: React.FC = () => {
  const navItems = [
    { to: '/admin', icon: BarChart, label: 'Dashboard', end: true },
    { to: '/admin/members', icon: Users, label: 'Members' },
    { to: '/admin/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/admin/media', icon: Image, label: 'Media' },
    { to: '/admin/sheet-music', icon: Music, label: 'Sheet Music' },
    { to: '/admin/reader-import', icon: Download, label: 'Reader Import' },
    { to: '/admin/store', icon: Store, label: 'Store' },
    { to: '/admin/communications', icon: MessageSquare, label: 'Communications' },
    { to: '/admin/finances', icon: DollarSign, label: 'Finances' },
    { to: '/admin/analytics', icon: BarChart, label: 'Analytics' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminNavItems;
