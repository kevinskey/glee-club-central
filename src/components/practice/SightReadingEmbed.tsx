
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Stop, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { logPracticeSession } from "@/utils/supabase/practiceLogs";
import { toast } from "sonner";

export function SightReadingEmbed() {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const intervalRef = useRef<number | null>(null);
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Start and manage timer
  useEffect(() => {
    if (isTimerActive) {
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTimerActive]);

  const startTimer = () => {
    setIsTimerActive(true);
    toast.info("Practice timer started");
  };

  const pauseTimer = () => {
    setIsTimerActive(false);
    toast.info("Practice timer paused");
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setElapsedTime(0);
    toast.info("Practice timer reset");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogPractice = async () => {
    if (elapsedTime < 60) {
      toast.warning("Please practice for at least one minute before logging");
      return;
    }

    setIsSaving(true);
    try {
      const minutes = Math.ceil(elapsedTime / 60);
      const practiceDescription = description || "Sight reading practice with SightReadingFactory.com";
      
      const success = await logPracticeSession(
        minutes,
        "sightreading",
        practiceDescription
      );

      if (success) {
        toast.success(`${minutes} minutes of sight reading practice logged!`);
        resetTimer();
        setDescription("");
      }
    } catch (error) {
      console.error("Error logging practice:", error);
      toast.error("Failed to log practice time");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-4">SightReadingFactory.com Integration</h3>
        
        {/* Timer display */}
        <div className="mb-4 p-3 bg-muted rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl">{formatTime(elapsedTime)}</span>
            <span className="text-sm text-muted-foreground">Practice time</span>
          </div>
          
          <div className="flex gap-2">
            {!isTimerActive ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1" 
                onClick={startTimer}
              >
                <Play className="h-4 w-4" /> 
                Start
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1" 
                onClick={pauseTimer}
              >
                <Pause className="h-4 w-4" /> 
                Pause
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1" 
              onClick={resetTimer}
            >
              <Stop className="h-4 w-4" /> 
              Reset
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="gap-1" 
              onClick={handleLogPractice}
              disabled={elapsedTime < 60 || isSaving}
            >
              <Save className="h-4 w-4" /> 
              {isSaving ? "Saving..." : "Log Practice"}
            </Button>
          </div>
        </div>
        
        {/* Embedded SightReadingFactory iframe */}
        <div className="aspect-video w-full mb-4">
          <iframe 
            src="https://www.sightreadingfactory.com/app"
            className="w-full h-full border-0 rounded-md shadow-md"
            title="Sight Reading Factory"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        {/* Optional description for practice log */}
        <div className="mt-4">
          <textarea
            className="w-full p-2 border rounded-md"
            rows={2}
            placeholder="Add notes about your practice session (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
