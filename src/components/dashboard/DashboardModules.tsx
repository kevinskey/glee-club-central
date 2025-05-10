
import React from 'react';
import { dashboardModules, getPermittedModules } from '@/utils/dashboardModules';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  CreditCard, DollarSign, FileText, CheckSquare, Shirt, Scissors,
  Upload, Map, Layout, Heart, Bell, Calendar, Users, Settings,
  BarChart, Search, Music
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const iconMap: Record<string, React.ReactNode> = {
  CreditCard: <CreditCard className="h-6 w-6" />,
  DollarSign: <DollarSign className="h-6 w-6" />,
  FileText: <FileText className="h-6 w-6" />,
  CheckSquare: <CheckSquare className="h-6 w-6" />,
  Shirt: <Shirt className="h-6 w-6" />,
  Scissors: <Scissors className="h-6 w-6" />,
  Upload: <Upload className="h-6 w-6" />,
  Map: <Map className="h-6 w-6" />,
  Layout: <Layout className="h-6 w-6" />,
  Heart: <Heart className="h-6 w-6" />,
  Bell: <Bell className="h-6 w-6" />,
  BarChart: <BarChart className="h-6 w-6" />,
  Search: <Search className="h-6 w-6" />,
  Calendar: <Calendar className="h-6 w-6" />,
  Users: <Users className="h-6 w-6" />,
  Settings: <Settings className="h-6 w-6" />,
  Music: <Music className="h-6 w-6" />
};

// Group modules by category
const groupModulesByCategory = (modules: any[]) => {
  return modules.reduce((acc, module) => {
    const category = module.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(module);
    return acc;
  }, {});
};

export function DashboardModules() {
  const { permissions, profile } = useAuth();
  const { isSuperAdmin } = usePermissions();
  
  const availableModules = getPermittedModules(permissions, isSuperAdmin);
  const groupedModules = groupModulesByCategory(availableModules);
  
  return (
    <div className="space-y-6">
      {Object.keys(groupedModules).length === 0 ? (
        <div className="col-span-full p-8 text-center border rounded-lg">
          <div className="text-muted-foreground mb-2">
            No modules available for your permission level
          </div>
          <p className="text-sm">
            Contact an administrator if you need access to specific features
          </p>
        </div>
      ) : (
        Object.entries(groupedModules).map(([category, modules]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{category}</h3>
              <Badge variant="outline" className="ml-2">
                {modules.length} {modules.length === 1 ? 'module' : 'modules'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((module: any) => (
                <Link 
                  key={module.id}
                  to={module.path}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col h-full hover:border-glee-purple no-underline"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${module.color || 'bg-glee-purple'} text-white p-3 rounded-lg w-12 h-12 flex items-center justify-center`}>
                      {iconMap[module.icon] || <FileText className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{module.title}</h3>
                      <p className="text-muted-foreground text-sm">{module.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {profile?.title || 'Member'}
                    </span>
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">
                      Access Granted
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
