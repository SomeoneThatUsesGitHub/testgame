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
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">Current Leadership</h2>
        <p className="text-gray-600">Key information about the political leadership</p>
      </div>
      
      {/* Premium Card Design */}
      <div className="relative rounded-xl overflow-hidden shadow-xl">
        {/* Header with Image and Gradient Overlay */}
        <div className="relative h-60 overflow-hidden">
          {/* Image or Gradient Fallback */}
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
          
          {/* Gradient Overlay - always present */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
          />
          
          {/* Leader Name and Position */}
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h3 className="text-white text-3xl font-bold mb-1">{leader.name}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white/90">{leader.title}</span>
                <span className="text-white/60">•</span>
                <span className="text-white/90">Since {leader.inPowerSince}</span>
              </div>
              <Badge
                className="ml-auto"
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
        
        {/* Content Section */}
        <div className="bg-white p-6">
          {/* Description without scrolling */}
          <div className="mb-6 pr-2">
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              {leader.description}
            </p>
          </div>
          
          {/* Stats - Arranged vertically instead of horizontally */}
          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="text-sm text-slate-500 mb-1">Political Party</div>
              <div className="font-semibold text-lg">{leader.party}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="text-sm text-slate-500 mb-1">Years in Power</div>
              <div className="font-semibold text-lg">{new Date().getFullYear() - parseInt(leader.inPowerSince)} years</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="text-sm text-slate-500 mb-1">Country</div>
              <div className="font-semibold text-lg">{countryCode?.toUpperCase()}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hint about editing */}
      <div className="mt-4 text-sm text-gray-500">
        <p>Customize leadership data in server/storage.ts by editing the leaderData objects.</p>
      </div>
    </div>
  );
};

export default LeadershipSection;