
import React from "react";
import { Button } from "@/components/ui/button";

export function SightReadingEmbed() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-4">SightReadingFactory.com Integration</h3>
        
        {/* Embedded SightReadingFactory iframe */}
        <div className="aspect-video w-full">
          <iframe 
            src="https://www.sightreadingfactory.com/app"
            className="w-full h-full border-0 rounded-md shadow-md"
            title="Sight Reading Factory"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        <div className="mt-4 p-4 bg-muted rounded-md">
          <h4 className="font-medium mb-2">About Sight Reading Factory</h4>
          <p className="text-sm text-muted-foreground">
            SightReadingFactory.com provides customizable sight reading exercises for vocalists of all levels.
            Practice regularly to improve your score reading skills!
          </p>
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => window.open("https://www.sightreadingfactory.com", "_blank")}
              className="flex items-center gap-2"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
