
import React from 'react';
import { dashboardModules, getModulesByRole, DashboardModule } from '@/utils/dashboardModules';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/utils/permissionChecker';
import { 
  CreditCard, DollarSign, FileText, CheckSquare, Shirt, Scissors,
  Upload, Map, Layout, Heart, Bell, Calendar, Users, Settings,
  BarChart, Search, Music, MessageSquare, CalendarPlus, User
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const iconMap: Record<string, React.ReactNode> = {
  CreditCard: <CreditCard className="h-5 w-5" />,
  DollarSign: <DollarSign className="h-5 w-5" />,
  FileText: <FileText className="h-5 w-5" />,
  CheckSquare: <CheckSquare className="h-5 w-5" />,
  Shirt: <Shirt className="h-5 w-5" />,
  Scissors: <Scissors className="h-5 w-5" />,
  Upload: <Upload className="h-5 w-5" />,
  Map: <Map className="h-5 w-5" />,
  Layout: <Layout className="h-5 w-5" />,
  Heart: <Heart className="h-5 w-5" />,
  Bell: <Bell className="h-5 w-5" />,
  BarChart: <BarChart className="h-5 w-5" />,
  Search: <Search className="h-5 w-5" />,
  Calendar: <Calendar className="h-5 w-5" />,
  CalendarPlus: <Calendar className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  Settings: <Settings className="h-5 w-5" />,
  Music: <Music className="h-5 w-5" />,
  MessageSquare: <MessageSquare className="h-5 w-5" />,
  User: <User className="h-5 w-5" />
};

interface GroupedModules {
  [category: string]: DashboardModule[];
}

const modulePermissions: Record<string, string> = {
  "media_manager": "upload_media",
  "event_manager": "edit_events",
  "user_management": "manage_members",
  "analytics": "view_budget",
  "settings": "manage_members"
};

const groupModulesByCategory = (modules: DashboardModule[]): GroupedModules => {
  return modules.reduce<GroupedModules>((acc, module) => {
    const category = module.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(module);
    return acc;
  }, {});
};

export function DashboardModules() {
  const { isAdmin, user, profile } = useAuth();
  
  const currentUser = {
    ...user,
    role_tags: profile?.role_tags || []
  };
  
  const availableModules = getModulesByRole(isAdmin());
  
  const permissionFilteredModules = availableModules.filter(module => {
    if (module.adminOnly && !isAdmin()) {
      return false;
    }
    
    const requiredPermission = modulePermissions[module.id];
    if (requiredPermission) {
      return hasPermission(currentUser, requiredPermission);
    }
    
    return true;
  });
  
  const groupedModules = groupModulesByCategory(permissionFilteredModules);
  
  return (
    <div className="space-y-4">
      {Object.keys(groupedModules).length === 0 ? (
        <div className="col-span-full p-6 text-center border rounded-lg">
          <div className="text-muted-foreground mb-2">
            No modules available for your role
          </div>
          <p className="text-sm">
            Contact an administrator if you need access to specific features
          </p>
        </div>
      ) : (
        Object.entries(groupedModules).map(([category, modules]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium">{category}</h3>
              <Badge variant="outline" className="text-xs">
                {modules.length}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {modules.map((module: DashboardModule) => (
                <Link 
                  key={module.id}
                  to={module.path}
                  className="border rounded-lg p-3 hover:shadow-md transition-shadow flex flex-col h-full hover:border-glee-purple no-underline group"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`${module.color || 'bg-glee-purple'} text-white p-2 rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0`}>
                      {iconMap[module.icon] || <FileText className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1 group-hover:text-glee-purple transition-colors">
                        {module.title}
                      </h4>
                      <p className="text-muted-foreground text-xs line-clamp-2">
                        {module.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      {isAdmin() ? 'Admin' : 'Member'}
                    </span>
                    <span className="px-2 py-1 bg-muted rounded-full">
                      Available
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
