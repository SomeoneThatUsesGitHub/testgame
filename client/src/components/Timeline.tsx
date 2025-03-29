import { PoliticalEvent } from "@shared/schema";
import { partyColorMap } from "../lib/map-utils";

interface TimelineProps {
  events: PoliticalEvent[];
}

const Timeline = ({ events }: TimelineProps) => {
  // Sort events by order
  const sortedEvents = [...events].sort((a, b) => a.order - b.order);

  const getPartyBadgeColor = (partyColor: string | null | undefined): string => {
    if (!partyColor) return "bg-gray-500";
    
    // Check if it's a recognized party
    if (partyColor in partyColorMap) {
      const color = partyColor.toLowerCase();
      
      if (color === "democratic") return "bg-secondary";
      if (color === "republican") return "bg-red-500";
      if (color === "conservative") return "bg-blue-800";
      if (color === "labour") return "bg-red-700";
    }
    
    return "bg-gray-500";
  };

  const getTagBadgeColor = (partyColor: string | null | undefined): string => {
    if (!partyColor) return "bg-gray-100 text-gray-800";
    
    const color = partyColor.toLowerCase();
    
    if (color === "democratic" || color === "labour") {
      return "bg-gray-100 text-gray-800";
    }
    
    if (color === "republican" || color === "conservative") {
      return "bg-red-100 text-red-800";
    }
    
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="relative ml-4 border-l-2 border-gray-200 pl-4 pb-4">
      {sortedEvents.map((event, index) => (
        <div key={index} className="mb-8 relative">
          <div className="absolute -left-6 mt-1.5 w-4 h-4 rounded-full bg-primary border-2 border-white"></div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-primary">{event.period}</span>
              {event.partyName && (
                <span className={`text-xs ${getPartyBadgeColor(event.partyColor)} text-white px-2 py-0.5 rounded`}>
                  {event.partyName}
                </span>
              )}
            </div>
            <h4 className="font-medium mb-1">{event.title}</h4>
            <p className="text-sm text-gray-600">{event.description}</p>
            {event.tags && event.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {event.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex} 
                    className={`inline-flex items-center text-xs ${getTagBadgeColor(event.partyColor)} px-2 py-1 rounded`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
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
