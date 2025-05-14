
import { useState, useEffect, RefObject } from "react";

interface IntersectionOptions extends IntersectionObserverInit {}

export function useIntersection(
  elementRef: RefObject<Element>,
  options: IntersectionOptions = {}
): IntersectionObserverEntry | null {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const element = elementRef?.current;
    
    if (!element || !window.IntersectionObserver) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, options]);

  return entry;
}
