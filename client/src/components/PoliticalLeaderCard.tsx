import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PoliticalLeader } from "@shared/schema";
import { partyColorMap } from "@/config/countryData";

interface PoliticalLeaderCardProps {
  leader?: PoliticalLeader | null;
  isLoading?: boolean;
  className?: string;
}

const PoliticalLeaderCard: React.FC<PoliticalLeaderCardProps> = ({
  leader,
  isLoading = false,
  className = "",
}) => {
  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <div className="animate-pulse h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="animate-pulse h-16 w-16 rounded-full bg-gray-200"></div>
            <div className="space-y-2 flex-1">
              <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="animate-pulse h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="animate-pulse h-3 bg-gray-200 rounded w-full"></div>
            <div className="animate-pulse h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="animate-pulse h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!leader) {
    console.log("NO LEADER DATA PROVIDED");
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle>No leader information available</CardTitle>
          <CardDescription>
            Political leadership data is not available for this country.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  console.log("LEADER DATA AVAILABLE:", leader);

  // Get party color from the mapping or use a default
  const getPartyColor = () => {
    const partyKey = Object.keys(partyColorMap).find(
      (key) => leader.party.toLowerCase().includes(key.toLowerCase())
    );
    return partyKey ? partyColorMap[partyKey] : "#718096"; // Default gray if no match
  };

  // Generate initials for avatar fallback
  const getInitials = () => {
    return leader.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={`w-full overflow-hidden rounded-xl shadow-xl ${className}`}>
      {/* Banner with image background or gradient fallback */}
      <div className="relative h-48">
        {/* Image or Gradient as Background */}
        {leader.imageUrl ? (
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: `url(${leader.imageUrl})`,
              filter: 'brightness(0.8)'
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600" />
        )}
        
        {/* Gradient Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        {/* Content positioned over the background */}
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-white text-2xl font-bold mb-1">{leader.name}</h3>
              <div className="flex items-center text-white/90 text-sm">
                <span>{leader.title}</span>
                <span className="mx-2">•</span>
                <span>Since {leader.inPowerSince}</span>
              </div>
            </div>
            <Badge
              style={{
                backgroundColor: getPartyColor(),
                color: "white",
              }}
            >
              {leader.party}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-white p-6">
        <p className="text-gray-700 mb-6 leading-relaxed">
          {leader.description}
        </p>
        
        {/* Stats in a nicer grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="text-sm text-slate-500 mb-1">Political Party</div>
            <div className="font-semibold">{leader.party}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="text-sm text-slate-500 mb-1">Years in Power</div>
            <div className="font-semibold">{new Date().getFullYear() - parseInt(leader.inPowerSince)} years</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="text-sm text-slate-500 mb-1">Leadership Role</div>
            <div className="font-semibold">{leader.title}</div>
          </div>
        </div>
        
        {/* Edit Instructions */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Leadership data can be easily customized in country data files
          </p>
        </div>
      </div>
    </div>
  );
};

export default PoliticalLeaderCard;