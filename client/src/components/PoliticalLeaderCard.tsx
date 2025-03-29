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
      <CardHeader>
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
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={leader.imageUrl || ""} alt={leader.name} />
            <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{leader.name}</h3>
            <p className="text-sm text-muted-foreground">
              {leader.title} • In power since {leader.inPowerSince}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm">{leader.description}</p>
      </CardContent>
    </Card>
  );
};

export default PoliticalLeaderCard;