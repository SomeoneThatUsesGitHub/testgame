import { useState, useRef, useEffect } from "react";
import { PoliticalEvent } from "@shared/schema";
import { partyColorMap } from "../lib/map-utils";
import { Clock, Tag } from "lucide-react";

interface TimelineProps {
  events?: PoliticalEvent[] | null;
}

const Timeline = ({ events }: TimelineProps) => {
  // Animation state
  const [visibleEvents, setVisibleEvents] = useState<number[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Check if events exist and are iterable
  const eventsArray = events || [];
  
  // Sort events by order
  const sortedEvents = [...eventsArray].sort((a, b) => a.order - b.order);

  // Animate timeline items as they come into view
  useEffect(() => {
    if (!sortedEvents.length) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index) && !visibleEvents.includes(index)) {
              setVisibleEvents(prev => [...prev, index]);
            }
          }
        });
      },
      { threshold: 0.3 }
    );
    
    // Reset visible events when events change
    setVisibleEvents([]);
    
    // Observe all timeline items
    const timelineItems = timelineRef.current?.querySelectorAll(".timeline-item");
    if (timelineItems) {
      timelineItems.forEach(item => observer.observe(item));
    }
    
    return () => {
      if (timelineItems) {
        timelineItems.forEach(item => observer.unobserve(item));
      }
    };
  }, [sortedEvents]);

  const getPartyBadgeColor = (partyColor: string | null | undefined): string => {
    if (!partyColor) return "bg-gray-500";
    
    // Check if it's a recognized party
    if (partyColor in partyColorMap) {
      const color = partyColor.toLowerCase();
      
      if (color === "democratic") return "bg-blue-600";
      if (color === "republican") return "bg-red-600";
      if (color === "conservative") return "bg-blue-800";
      if (color === "labour") return "bg-red-700";
      if (color === "single-party") return "bg-purple-600";
    }
    
    return "bg-gray-600";
  };

  const getTagBadgeColor = (partyColor: string | null | undefined): string => {
    if (!partyColor) return "bg-gray-100 text-gray-800";
    
    const color = partyColor?.toLowerCase() || "";
    
    if (color === "democratic" || color === "labour") {
      return "bg-blue-50 text-blue-700";
    }
    
    if (color === "republican" || color === "conservative") {
      return "bg-red-50 text-red-700";
    }
    
    if (color === "single-party") {
      return "bg-purple-50 text-purple-700";
    }
    
    return "bg-gray-100 text-gray-800";
  };

  if (sortedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium">No Events Available</h3>
        <p className="text-sm mt-2">Historical timeline data is not available for this country.</p>
      </div>
    );
  }

  return (
    <div ref={timelineRef} className="relative ml-4 border-l-2 border-gray-200 pl-4 pb-4">
      {sortedEvents.map((event, index) => (
        <div 
          key={index} 
          data-index={index}
          className={`timeline-item mb-8 relative transform transition-all duration-500 ease-out
                     ${visibleEvents.includes(index) 
                       ? 'opacity-100 translate-x-0' 
                       : 'opacity-0 -translate-x-4'}`}
          style={{ transitionDelay: `${index * 150}ms` }}
        >
          <div className="absolute -left-6 mt-1.5 w-4 h-4 rounded-full bg-primary border-2 border-white shadow-sm"></div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-primary flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                {event.period}
              </span>
              {event.partyName && (
                <span className={`text-xs ${getPartyBadgeColor(event.partyColor)} text-white px-2 py-0.5 rounded font-medium shadow-sm`}>
                  {event.partyName}
                </span>
              )}
            </div>
            <h4 className="font-semibold mb-2 text-gray-800">{event.title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
            {event.tags && event.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {event.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex} 
                    className={`inline-flex items-center text-xs ${getTagBadgeColor(event.partyColor)} px-2 py-1 rounded-md`}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
