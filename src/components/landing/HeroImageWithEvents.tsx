
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  imageUrl?: string;
}

interface HeroImageWithEventsProps {
  backgroundImage?: string;
  events?: Event[];
}

export default function HeroImageWithEvents({ 
  backgroundImage, 
  events = [] 
}: HeroImageWithEventsProps) {
  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop'})`
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center p-6">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to GleeWorld</h1>
          <p className="text-xl mb-6">Experience the magic of the Spelman College Glee Club</p>
          
          {events.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.slice(0, 3).map((event) => (
                  <Card key={event.id} className="bg-white/90 text-black">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
