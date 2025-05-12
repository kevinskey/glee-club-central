
import { useState, useEffect, useRef } from "react";
import { Music, Minimize2, Maximize2, X } from "lucide-react";
import { EnhancedMetronome } from "@/components/ui/enhanced-metronome";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalMetronome() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Clean up audio context when component is unmounted or hidden
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);

  // Handle visibility toggle
  const toggleVisibility = () => {
    // If hiding and active, deactivate first to ensure proper cleanup
    if (isVisible && isActive) {
      setIsActive(false);
    }
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-20 left-4 z-50"
      >
        <Button
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur"
          onClick={toggleVisibility}
          aria-label="Show metronome"
        >
          <Music className="h-4 w-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed top-20 left-4 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`shadow-md transition-all duration-300 ${isExpanded ? 'w-80' : 'w-auto'} bg-background/80 backdrop-blur`}>
          <div className="flex items-center justify-between p-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs"
              onClick={() => setIsActive(!isActive)}
            >
              <Music className="h-3.5 w-3.5" /> 
              <span className={isExpanded ? '' : 'sr-only'}>Global Metronome</span>
            </Button>
            
            <div className="flex gap-1">
              <Toggle
                pressed={isExpanded}
                onPressedChange={setIsExpanded}
                size="sm"
                aria-label={isExpanded ? "Minimize metronome" : "Expand metronome"}
              >
                {isExpanded ? (
                  <Minimize2 className="h-3.5 w-3.5" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
              </Toggle>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={toggleVisibility}
                aria-label="Hide metronome"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          {isActive && isExpanded && (
            <div className="px-2 pb-2">
              <EnhancedMetronome 
                showControls={true} 
                size="sm" 
                audioContextRef={audioContextRef}
              />
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
