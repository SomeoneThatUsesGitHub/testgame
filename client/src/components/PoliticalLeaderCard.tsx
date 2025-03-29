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
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center justify-between">
          <span>Political Leadership</span>
          <Badge
            className="ml-2"
            style={{
              backgroundColor: getPartyColor(),
              color: "white",
            }}
          >
            {leader.party}
          </Badge>
        </CardTitle>
        <CardDescription>Current leadership information</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <Avatar className="h-32 w-32 border shadow-sm">
            <AvatarImage src={leader.imageUrl || ""} alt={leader.name} />
            <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-1">{leader.name}</h3>
            <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm mb-3">
              <span className="font-medium">{leader.title}</span>
              <span className="mx-2">•</span>
              <span>In power since <strong>{leader.inPowerSince}</strong></span>
            </div>
            <p className="text-base leading-relaxed">{leader.description}</p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold uppercase text-gray-500 mb-3">Political Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Political Party</p>
              <p className="font-medium">{leader.party}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Years in Power</p>
              <p className="font-medium">{new Date().getFullYear() - parseInt(leader.inPowerSince)} years</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoliticalLeaderCard;