
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  imageUrl?: string;
  isPublic?: boolean;
}

interface EventScrollerProps {
  events: Event[];
  title?: string;
  showViewAllButton?: boolean;
  onViewAll?: () => void;
  className?: string;
}

export function EventScroller({
  events = [],
  title = "Upcoming Events",
  showViewAllButton = true,
  onViewAll,
  className = ""
}: EventScrollerProps) {
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (events.length === 0) {
    return (
      <div className={`text-center ${className}`}>
        <h2 className="glee-text-headline mb-4 dark:text-white">{title}</h2>
        <p className="glee-text-body dark:text-gray-300">No upcoming events at this time.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="glee-text-headline dark:text-white">{title}</h2>
        {showViewAllButton && (
          <button
            onClick={onViewAll}
            className="text-glee-spelman hover:text-glee-spelman/80 dark:text-white dark:hover:text-gray-300 font-medium transition-colors"
          >
            View All →
          </button>
        )}
      </div>

      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {events.map((event) => (
            <CarouselItem key={event.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/2 xl:basis-1/3">
              <Card className="glee-card-base h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] overflow-hidden glee-corners-lg">
                    <img
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.title}
                      className="glee-image-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="glee-text-subhead mb-2 line-clamp-2 dark:text-white">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 glee-text-caption mb-2">
                      <Calendar className="h-4 w-4 dark:text-gray-300" />
                      <span>{formatEventDate(event.date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 glee-text-caption">
                        <MapPin className="h-4 w-4 dark:text-gray-300" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
