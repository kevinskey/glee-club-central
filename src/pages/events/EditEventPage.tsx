
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { EventForm, EventFormValues } from "@/components/events/EventForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar, Loader2 } from "lucide-react";

export default function EditEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState<any | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("calendar_events")
          .select("*")
          .eq("id", id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setEventData(data);
        } else {
          toast.error("Event not found");
          navigate("/dashboard/events");
        }
      } catch (error: any) {
        console.error("Error fetching event:", error);
        toast.error(error.message || "Failed to fetch event details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [id, navigate]);
  
  const handleUpdateEvent = async (values: EventFormValues) => {
    if (!user || !id) {
      toast.error("You must be logged in to update events");
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("Updating event with values:", values);
      
      // Format times for database storage
      const formattedDate = values.date.toISOString().split('T')[0];

      const eventData = {
        title: values.title,
        date: formattedDate,
        location: values.location,
        description: values.description || "",
        image_url: values.image_url || null,
        
        // Store the additional event details as JSON
        event_details: {
          archivalNotes: values.archivalNotes || "",
          callTime: values.callTime || "",
          wakeUpTime: values.wakeUpTime || "",
          departureTime: values.departureTime || "",
          performanceTime: values.performanceTime || "",
          contactName: values.contactName || "",
          contactEmail: values.contactEmail || "",
          contactPhone: values.contactPhone || "",
          transportationCompany: values.transportationCompany || "",
          transportationDetails: values.transportationDetails || "",
          contractStatus: values.contractStatus || "none",
          contractNotes: values.contractNotes || "",
        },
        
        // Update the time field for backward compatibility
        time: values.performanceTime || "00:00",
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("calendar_events")
        .update(eventData)
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Event updated successfully!");
      navigate("/dashboard/events");
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast.error(error.message || "Failed to update event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format the data for the form
  const formatEventForForm = (): Partial<EventFormValues> => {
    if (!eventData) return {};
    
    // Extract details from the event_details JSON field
    const details = eventData.event_details || {};
    
    return {
      title: eventData.title,
      date: new Date(eventData.date),
      description: eventData.description || "",
      location: eventData.location || "",
      image_url: eventData.image_url || null,
      
      // Map all the event details
      archivalNotes: details.archivalNotes || "",
      callTime: details.callTime || "",
      wakeUpTime: details.wakeUpTime || "",
      departureTime: details.departureTime || "",
      performanceTime: details.performanceTime || eventData.time || "",
      contactName: details.contactName || "",
      contactEmail: details.contactEmail || "",
      contactPhone: details.contactPhone || "",
      transportationCompany: details.transportationCompany || "",
      transportationDetails: details.transportationDetails || "",
      contractStatus: details.contractStatus || "none",
      contractNotes: details.contractNotes || "",
    };
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <PageHeader
        title="Edit Event"
        description="Update event or concert details"
        icon={<Calendar className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <EventForm 
          defaultValues={formatEventForForm()}
          onSubmit={handleUpdateEvent} 
          isSubmitting={isSubmitting}
          mode="edit"
        />
      </div>
    </div>
  );
}
