
import React, { useState } from "react";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Profile, useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, UserCog, CalendarClock, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface MemberDetailsSheetProps {
  member: Profile;
}

export function MemberDetailsSheet({ member }: MemberDetailsSheetProps) {
  const { isAdmin } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);
  const [notesData, setNotesData] = useState([]);
  const [isLoading, setIsLoading] = useState({
    attendance: true,
    payments: true,
    notes: true,
  });

  // Function to load attendance data
  React.useEffect(() => {
    async function loadAttendanceData() {
      if (member && (isAdmin() || member.role === "section_leader")) {
        try {
          setIsLoading(prev => ({ ...prev, attendance: true }));
          const { data, error } = await supabase
            .from("attendance")
            .select(`
              *,
              calendar_events (title, date, time, location)
            `)
            .eq("member_id", member.id)
            .order("created_at", { ascending: false })
            .limit(10);
            
          if (error) throw error;
          setAttendanceData(data || []);
        } catch (error: any) {
          console.error("Error fetching attendance:", error);
        } finally {
          setIsLoading(prev => ({ ...prev, attendance: false }));
        }
      }
    }
    
    async function loadPaymentsData() {
      if (member && (isAdmin() || member.role === "section_leader")) {
        try {
          setIsLoading(prev => ({ ...prev, payments: true }));
          const { data, error } = await supabase
            .from("payments")
            .select("*")
            .eq("member_id", member.id)
            .order("payment_date", { ascending: false })
            .limit(10);
            
          if (error) throw error;
          setPaymentsData(data || []);
        } catch (error: any) {
          console.error("Error fetching payments:", error);
        } finally {
          setIsLoading(prev => ({ ...prev, payments: false }));
        }
      }
    }
    
    async function loadNotesData() {
      if (member && isAdmin()) {
        try {
          setIsLoading(prev => ({ ...prev, notes: true }));
          const { data, error } = await supabase
            .from("member_notes")
            .select(`
              *,
              created_by_profile:profiles!created_by (first_name, last_name)
            `)
            .eq("member_id", member.id)
            .order("created_at", { ascending: false });
            
          if (error) throw error;
          setNotesData(data || []);
        } catch (error: any) {
          console.error("Error fetching notes:", error);
        } finally {
          setIsLoading(prev => ({ ...prev, notes: false }));
        }
      }
    }
    
    loadAttendanceData();
    loadPaymentsData();
    loadNotesData();
  }, [member, isAdmin]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      case "alumni":
        return <Badge className="bg-blue-500">Alumni</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <SheetHeader className="mb-5">
        <SheetTitle>Member Details</SheetTitle>
        <SheetDescription>
          View detailed information about this member
        </SheetDescription>
      </SheetHeader>
      
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            {member.avatar_url ? (
              <AvatarImage src={member.avatar_url} alt={`${member.first_name} ${member.last_name}`} />
            ) : (
              <AvatarFallback className="text-lg">
                {member.first_name?.[0]}{member.last_name?.[0]}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div>
            <h2 className="text-xl font-semibold">{`${member.first_name || ''} ${member.last_name || ''}`}</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {getStatusBadge(member.status)}
              {member.voice_part && (
                <Badge variant="secondary">{member.voice_part}</Badge>
              )}
              {member.role === "admin" && <Badge className="bg-purple-500">Admin</Badge>}
              {member.role === "section_leader" && <Badge className="bg-blue-500">Section Leader</Badge>}
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">
              <UserCog className="h-4 w-4 mr-2" />
              Info
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <CalendarClock className="h-4 w-4 mr-2" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="payments">
              <DollarSign className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{member.email || "Not provided"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <p>{member.phone || "Not provided"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Join Date</h3>
                <p>{member.join_date ? new Date(member.join_date).toLocaleDateString() : "Not set"}</p>
              </div>
              
              {isAdmin() && (
                <div className="flex justify-end mt-6">
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Member
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="attendance" className="p-4">
            {isLoading.attendance ? (
              <div className="flex justify-center py-4">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              </div>
            ) : attendanceData.length > 0 ? (
              <div className="space-y-3">
                {/* @ts-ignore */}
                {attendanceData.map((record: any) => (
                  <div key={record.id} className="border rounded-md p-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{record.calendar_events.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.calendar_events.date).toLocaleDateString()} at {record.calendar_events.time}
                        </p>
                      </div>
                      <Badge 
                        className={
                          record.status === "present" ? "bg-green-500" : 
                          record.status === "excused" ? "bg-yellow-500" : 
                          record.status === "late" ? "bg-blue-500" : 
                          "bg-red-500"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                    {record.notes && (
                      <p className="text-sm mt-2 text-muted-foreground">{record.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No attendance records found</p>
            )}
          </TabsContent>
          
          <TabsContent value="payments" className="p-4">
            {isLoading.payments ? (
              <div className="flex justify-center py-4">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              </div>
            ) : paymentsData.length > 0 ? (
              <div className="space-y-3">
                {/* @ts-ignore */}
                {paymentsData.map((payment: any) => (
                  <div key={payment.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">${payment.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.payment_method} • {new Date(payment.payment_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        className={payment.status === "completed" ? "bg-green-500" : "bg-yellow-500"}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                    {payment.description && (
                      <p className="text-sm mt-2 text-muted-foreground">{payment.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No payment records found</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
