
import React, { useState, useEffect } from "react";
import { Clock as ClockIcon, Calendar } from "lucide-react";

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-sm">
        <ClockIcon className="h-4 w-4 text-glee-purple" />
        <span className="font-medium">{formattedTime}</span>
      </div>
      <div className="flex items-center gap-1.5 text-sm">
        <Calendar className="h-4 w-4 text-glee-purple" />
        <span className="font-medium">{formattedDate}</span>
      </div>
    </div>
  );
}
