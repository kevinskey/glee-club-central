
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useUserManagement } from "@/hooks/user/useUserManagement";
import { Spinner } from "@/components/ui/spinner";

export function UserCountCard() {
  const { users, isLoading, refreshUsers } = useUserManagement();

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-10">
            <Spinner size="sm" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Total registered members
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
