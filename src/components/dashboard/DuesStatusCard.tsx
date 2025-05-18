
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DollarSign } from "lucide-react";

export const DuesStatusCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-glee-columbia" />
          <span>Dues Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Academic Year 2025</span>
            <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
              Paid
            </div>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Amount: $100.00</span>
            <span>Paid on: April 15, 2025</span>
          </div>
          <Button 
            onClick={() => navigate("/dashboard/dues")}
            variant="outline" 
            className="w-full mt-2 text-glee-columbia border-glee-columbia/20 hover:bg-glee-columbia/5"
          >
            View Payment History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
