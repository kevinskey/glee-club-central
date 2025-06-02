import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, Search, Edit, Trash2, FileText, Calendar as CalendarIcon, Package } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function EventsListPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [contractViewEvent, setContractViewEvent] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        throw error;
      }

      setEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast.error(error.message || "Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteEventId) return;

    try {
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", deleteEventId);

      if (error) {
        throw error;
      }

      toast.success("Event deleted successfully");
      setDeleteEventId(null);
      fetchEvents();
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast.error(error.message || "Failed to delete event");
    }
  };

  const getContractStatus = (event: any) => {
    const details = event.event_details || {};
    const status = details.contractStatus || "none";
    
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Draft</Badge>;
      case "sent":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Sent</Badge>;
      case "signed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Signed</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Completed</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">None</Badge>;
    }
  };

  const filteredEvents = events.filter((event: any) => {
    return (
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="container py-8">
      <PageHeader
        title="Events & Concerts"
        description="Manage Glee Club events and performances"
        icon={<Calendar className="h-6 w-6" />}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search events..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button onClick={() => navigate("/dashboard/events/create")}>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Performance Time</TableHead>
              <TableHead>Contract</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <span className="mt-4">Loading events...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center">
                    <CalendarIcon className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No events found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchQuery 
                        ? "Try adjusting your search" 
                        : "Get started by creating a new event"}
                    </p>
                    {!searchQuery && (
                      <Button
                        onClick={() => navigate("/dashboard/events/create")}
                        className="mt-4"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        New Event
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event: any) => {
                const eventDetails = event.event_details || {};
                const isPerformanceEvent = event.event_types?.some((type: string) => 
                  ['performance', 'concert', 'tour_concert'].includes(type)
                );
                
                return (
                  <TableRow key={event.id}>
                    <TableCell>
                      {event.date && format(new Date(event.date), "PPP")}
                    </TableCell>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                      {eventDetails.performanceTime || event.time || "N/A"}
                    </TableCell>
                    <TableCell>
                      {getContractStatus(event)}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/dashboard/events/edit/${event.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {isPerformanceEvent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/dashboard/tour-merch/${event.id}`)}
                          title="Tour Merch Assignment"
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setContractViewEvent(event)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteEventId(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteEventId} onOpenChange={(open) => !open && setDeleteEventId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteEventId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contract View Dialog */}
      <Dialog open={!!contractViewEvent} onOpenChange={(open) => !open && setContractViewEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
          </DialogHeader>
          {contractViewEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Event</h3>
                <p>{contractViewEvent.title}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Status</h3>
                <div>{getContractStatus(contractViewEvent)}</div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Notes</h3>
                <p className="text-sm text-muted-foreground">
                  {(contractViewEvent.event_details?.contractNotes) || "No contract notes available."}
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button onClick={() => setContractViewEvent(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
