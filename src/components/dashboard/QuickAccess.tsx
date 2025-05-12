
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Music, 
  Headphones,
  CheckSquare,
  User 
} from "lucide-react";

export const QuickAccess: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-accent" />
          <span>Quick Access</span>
        </CardTitle>
        <CardDescription>
          Frequently used resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-auto flex-col py-6 px-3 hover:bg-accent/5 hover:text-accent hover:border-accent/20 min-h-[90px] whitespace-normal text-center"
            onClick={() => navigate("/dashboard/sheet-music")}
          >
            <Music className="h-6 w-6 mb-2 text-accent" />
            <span className="text-sm">Sheet Music</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col py-6 px-3 hover:bg-accent/5 hover:text-accent hover:border-accent/20 min-h-[90px] whitespace-normal text-center"
            onClick={() => navigate("/dashboard/practice")}
          >
            <Headphones className="h-6 w-6 mb-2 text-accent" />
            <span className="text-sm">Practice Tracks</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col py-6 px-3 hover:bg-accent/5 hover:text-accent hover:border-accent/20 min-h-[90px] whitespace-normal text-center"
            onClick={() => navigate("/dashboard/attendance")}
          >
            <CheckSquare className="h-6 w-6 mb-2 text-accent" />
            <span className="text-sm">Attendance</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col py-6 px-3 hover:bg-accent/5 hover:text-accent hover:border-accent/20 min-h-[90px] whitespace-normal text-center"
            onClick={() => navigate("/dashboard/profile")}
          >
            <User className="h-6 w-6 mb-2 text-accent" />
            <span className="text-sm">My Profile</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
