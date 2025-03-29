import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { PoliticalLeader } from '@shared/schema';
import { partyColorMap } from '@/lib/map-utils';

interface LeadershipSectionProps {
  countryCode: string | null;
  leader: PoliticalLeader | undefined;
  isLoading?: boolean;
}

const LeadershipSection: React.FC<LeadershipSectionProps> = ({ 
  countryCode, 
  leader, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="w-full p-6 bg-white border border-gray-200 rounded-lg">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-40 w-40 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!leader) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Leadership Data</CardTitle>
          <CardDescription>
            Leadership information for this country is currently unavailable.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please check back later for updates on political leadership.</p>
        </CardContent>
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
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-primary">Current Leadership</h2>
        <p className="text-gray-600">Information about the political leadership of this country</p>
      </div>
      
      <Card className="w-full shadow-lg border-primary/10">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle>{leader.name}</CardTitle>
            <Badge
              style={{
                backgroundColor: getPartyColor(),
                color: "white",
              }}
            >
              {leader.party}
            </Badge>
          </div>
          <CardDescription>{leader.title} • Since {leader.inPowerSince}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-32 w-32 border shadow-sm">
              <AvatarImage src={leader.imageUrl || ""} alt={leader.name} />
              <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <p className="text-gray-700 mb-4 leading-relaxed">
                {leader.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadershipSection;