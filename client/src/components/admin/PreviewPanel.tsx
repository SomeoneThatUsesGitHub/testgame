import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { formatPopulation } from '@/lib/map-utils';
import type { CountryData } from '@/data/types';

interface PreviewPanelProps {
  countryData: CountryData;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ countryData }) => {
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#F06292', '#9575CD'];
  
  // Generate initials for leader avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if a section has valid data
  const hasValidChartData = (data: any[]) => {
    return data && data.length > 0 && data.some(item => item.value > 0);
  };

  return (
    <Card className="h-[600px]">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between">
          <div>
            {countryData.name || 'Country Preview'}
            <span className="text-muted-foreground ml-2 text-sm">
              ({countryData.code || 'code'})
            </span>
          </div>
          <Badge variant="outline">
            Population: {formatPopulation(countryData.population)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[530px]">
          <div className="p-4">
            <Tabs defaultValue="basic">
              <TabsList className="mb-4">
                <TabsTrigger value="basic">Overview</TabsTrigger>
                <TabsTrigger value="leader">Leadership</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="events">Timeline</TabsTrigger>
              </TabsList>
              
              {/* Basic Info Tab */}
              <TabsContent value="basic">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Capital</h3>
                      <p>{countryData.capital || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Region</h3>
                      <p>{countryData.region || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Coordinates</h3>
                      <p>
                        {countryData.flagCoordinates ? 
                          `${countryData.flagCoordinates[0].toFixed(1)}, ${countryData.flagCoordinates[1].toFixed(1)}` : 
                          'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Political Events</h3>
                    <p>{countryData.events.length} events in timeline</p>
                  </div>
                </div>
              </TabsContent>
              
              {/* Leader Tab */}
              <TabsContent value="leader">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={countryData.leader.imageUrl || ''} alt={countryData.leader.name} />
                    <AvatarFallback className="text-xl">
                      {getInitials(countryData.leader.name || 'NA')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="text-xl font-medium">{countryData.leader.name || 'Name not specified'}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{countryData.leader.title || 'Title not specified'}</Badge>
                        <span className="text-sm text-muted-foreground">
                          In power since {countryData.leader.inPowerSince || '(not specified)'}
                        </span>
                      </div>
                      <p className="text-sm mt-1">
                        Party: {countryData.leader.party || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                      <p className="text-sm">
                        {countryData.leader.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Charts Tab */}
              <TabsContent value="charts">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Demographics Charts */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Demographics</h3>
                      <div className="space-y-6">
                        {hasValidChartData(countryData.demographics.ageGroups) && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Age Groups</h4>
                            <div className="h-[180px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={countryData.demographics.ageGroups}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                  >
                                    {countryData.demographics.ageGroups.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}
                        
                        {hasValidChartData(countryData.demographics.religions) && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Religions</h4>
                            <div className="h-[180px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={countryData.demographics.religions}>
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                                  <Bar dataKey="value" fill="#8884d8">
                                    {countryData.demographics.religions.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Statistics Charts */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Statistics</h3>
                      <div className="space-y-6">
                        {hasValidChartData(countryData.statistics.gdpSectors) && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">GDP by Sector</h4>
                            <div className="h-[180px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={countryData.statistics.gdpSectors}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                  >
                                    {countryData.statistics.gdpSectors.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}
                        
                        {hasValidChartData(countryData.statistics.employment) && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Employment</h4>
                            <div className="h-[180px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={countryData.statistics.employment}>
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                                  <Bar dataKey="value" fill="#8884d8">
                                    {countryData.statistics.employment.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Events Timeline Tab */}
              <TabsContent value="events">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Political Timeline</h3>
                  
                  {countryData.events.length === 0 ? (
                    <p className="text-muted-foreground">No timeline events have been added.</p>
                  ) : (
                    <div className="space-y-4">
                      {countryData.events
                        .sort((a, b) => a.order - b.order)
                        .map((event, index) => (
                          <div key={index} className="border-l-4 pl-4 pb-4" style={{ borderColor: event.partyColor || '#666' }}>
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{event.title}</h4>
                                <p className="text-sm text-muted-foreground">{event.period}</p>
                              </div>
                              <Badge style={{ backgroundColor: event.partyColor, color: 'white' }}>
                                {event.partyName}
                              </Badge>
                            </div>
                            <p className="text-sm mt-2">{event.description}</p>
                            {event.tags && event.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {event.tags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PreviewPanel;