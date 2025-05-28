
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export interface QuickAccessItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
  onClick?: () => void;
}

interface QuickAccessProps {
  items?: QuickAccessItem[];
}

const defaultItems: QuickAccessItem[] = [
  {
    title: "Sheet Music",
    description: "Access your sheet music collection",
    icon: <span>🎵</span>,
    link: "/dashboard/sheet-music",
  },
  {
    title: "Audio Library",
    description: "Listen to recordings and practice tracks",
    icon: <span>🎧</span>,
    link: "/dashboard/recordings",
  },
  {
    title: "Announcements",
    description: "View important updates and notices",
    icon: <span>📢</span>,
    link: "/dashboard/announcements",
  },
  {
    title: "Profile",
    description: "Update your member information",
    icon: <span>👤</span>,
    link: "/dashboard/profile",
  },
];

export const QuickAccess: React.FC<QuickAccessProps> = ({ items = defaultItems }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {item.onClick ? (
                <div 
                  className="flex items-start space-x-3 cursor-pointer group"
                  onClick={item.onClick}
                >
                  <div className="flex-shrink-0 text-xl group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1 group-hover:text-glee-spelman transition-colors duration-200">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ) : item.link ? (
                <Link to={item.link} className="flex items-start space-x-3 no-underline group">
                  <div className="flex-shrink-0 text-xl group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1 group-hover:text-glee-spelman transition-colors duration-200">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
