
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { EventForm, EventFormValues } from "@/components/events/EventForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar, Plus } from "lucide-react";

export default function CreateEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleCreateEvent = async (values: EventFormValues) => {
    if (!user) {
      toast.error("You must be logged in to create events");
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("Creating new event with values:", values);
      
      // Format times for database storage
      const formattedDate = values.date.toISOString().split('T')[0];

      const eventData = {
        id: uuidv4(),
        user_id: user.id,
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
        
        // We'll store a simplified type for backward compatibility
        type: "concert",
        time: values.performanceTime || "00:00"
      };

      const { error } = await supabase
        .from("calendar_events")
        .insert(eventData);

      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Event created successfully!");
      navigate("/dashboard/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <PageHeader
        title="Create New Event"
        description="Add a new concert or event to the calendar"
        icon={<Calendar className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <EventForm 
          onSubmit={handleCreateEvent} 
          isSubmitting={isSubmitting}
          mode="create"
        />
      </div>
    </div>
  );
}
