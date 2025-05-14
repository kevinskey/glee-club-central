
import React, { useState, useEffect } from "react";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileFitCheck } from "./MobileFitCheck";

interface EventModalProps {
  onClose: () => void;
  onSave: (eventData: any) => void;
  initialDate?: Date | null;
  existingEvent?: any;
}

export const EventModal = ({
  onClose,
  onSave,
  initialDate,
  existingEvent,
}: EventModalProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState("12:00");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"concert" | "rehearsal" | "sectional" | "special">("rehearsal");
  const [isLoading, setIsLoading] = useState(false);
  
  const isMobile = useIsMobile();

  useEffect(() => {
    // Set initial values when initialDate or existingEvent changes
    if (existingEvent) {
      setTitle(existingEvent.title || "");
      setTime(existingEvent.time || "12:00");
      setLocation(existingEvent.location || "");
      setDescription(existingEvent.description || "");
      setType(existingEvent.type || "rehearsal");
      
      // Handle date from existing event
      if (existingEvent.date) {
        const eventDate = existingEvent.date instanceof Date 
          ? existingEvent.date 
          : new Date(existingEvent.date);
        setDate(format(eventDate, "yyyy-MM-dd"));
      }
    } else if (initialDate) {
      setDate(format(initialDate, "yyyy-MM-dd"));
    } else {
      setDate(format(new Date(), "yyyy-MM-dd"));
    }
  }, [initialDate, existingEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const eventData = {
      title,
      date,
      time,
      location,
      description,
      type,
      id: existingEvent?.id,
    };
    
    onSave(eventData);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {existingEvent ? "Edit Event" : "Create Event"}
        </DialogTitle>
      </DialogHeader>
      
      <div className={`grid ${isMobile ? 'gap-4' : 'gap-4 grid-cols-2'}`}>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={type} onValueChange={setType as any}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rehearsal">Rehearsal</SelectItem>
              <SelectItem value="concert">Concert</SelectItem>
              <SelectItem value="sectional">Sectional</SelectItem>
              <SelectItem value="special">Special Event</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className={`grid ${isMobile ? 'gap-4' : 'gap-4 grid-cols-2'}`}>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Event location"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Event description"
          rows={3}
        />
      </div>
      
      {/* Mobile fit check - proactively show issues */}
      {isMobile && (
        <MobileFitCheck 
          title={title} 
          location={location} 
          description={description} 
        />
      )}
      
      <DialogFooter className={isMobile ? "flex-col gap-2" : ""}>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose} 
          disabled={isLoading}
          className={isMobile ? "w-full" : ""}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className={`${isMobile ? "w-full" : ""} bg-glee-purple hover:bg-glee-purple/90`}
        >
          {isLoading ? "Saving..." : existingEvent ? "Update Event" : "Create Event"}
        </Button>
      </DialogFooter>
    </form>
  );
};
