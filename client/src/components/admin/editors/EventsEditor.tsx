import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ArrowUp, ArrowDown, X, Tag } from 'lucide-react';
import type { PoliticalEvent } from '@/data/types';

interface EventsEditorProps {
  events: PoliticalEvent[];
  onChange: (events: PoliticalEvent[]) => void;
}

const EventsEditor: React.FC<EventsEditorProps> = ({ events, onChange }) => {
  const [currentTag, setCurrentTag] = useState('');
  
  // Add a new empty event
  const handleAddEvent = () => {
    const newEvent: PoliticalEvent = {
      period: '',
      title: '',
      description: '',
      partyName: '',
      partyColor: '#1E88E5',
      tags: [],
      order: events.length + 1,
    };
    
    onChange([...events, newEvent]);
  };
  
  // Delete an event
  const handleDeleteEvent = (index: number) => {
    const newEvents = events.filter((_, i) => i !== index);
    // Reorder the remaining events
    const reorderedEvents = newEvents.map((event, i) => ({
      ...event,
      order: i + 1,
    }));
    onChange(reorderedEvents);
  };
  
  // Move an event up in the list
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const newEvents = [...events];
    [newEvents[index], newEvents[index - 1]] = [newEvents[index - 1], newEvents[index]];
    
    // Update order property
    const reorderedEvents = newEvents.map((event, i) => ({
      ...event,
      order: i + 1,
    }));
    
    onChange(reorderedEvents);
  };
  
  // Move an event down in the list
  const handleMoveDown = (index: number) => {
    if (index === events.length - 1) return;
    
    const newEvents = [...events];
    [newEvents[index], newEvents[index + 1]] = [newEvents[index + 1], newEvents[index]];
    
    // Update order property
    const reorderedEvents = newEvents.map((event, i) => ({
      ...event,
      order: i + 1,
    }));
    
    onChange(reorderedEvents);
  };
  
  // Update an event field
  const handleEventChange = (index: number, field: keyof PoliticalEvent, value: any) => {
    const newEvents = [...events];
    newEvents[index] = {
      ...newEvents[index],
      [field]: value,
    };
    onChange(newEvents);
  };
  
  // Add a tag to an event
  const handleAddTag = (index: number) => {
    if (!currentTag || currentTag.trim() === '') return;
    
    const newEvents = [...events];
    const existingTags = newEvents[index].tags || [];
    
    // Only add if not already in the list
    if (!existingTags.includes(currentTag)) {
      newEvents[index] = {
        ...newEvents[index],
        tags: [...existingTags, currentTag],
      };
      onChange(newEvents);
    }
    
    setCurrentTag('');
  };
  
  // Remove a tag from an event
  const handleRemoveTag = (eventIndex: number, tagIndex: number) => {
    const newEvents = [...events];
    const newTags = [...newEvents[eventIndex].tags];
    newTags.splice(tagIndex, 1);
    
    newEvents[eventIndex] = {
      ...newEvents[eventIndex],
      tags: newTags,
    };
    
    onChange(newEvents);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Political Timeline Events</h3>
        <Button onClick={handleAddEvent}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>
      
      {events.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No events added yet. Click "Add Event" to create the first political timeline entry.
          </CardContent>
        </Card>
      )}
      
      {events.map((event, index) => (
        <Card key={index} className="relative">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{`Event ${index + 1}`}</Badge>
                <CardTitle className="text-base">
                  {event.title || 'Untitled Event'}
                </CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === events.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteEvent(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`period-${index}`}>Period</Label>
                    <Input
                      id={`period-${index}`}
                      value={event.period}
                      onChange={(e) => handleEventChange(index, 'period', e.target.value)}
                      placeholder="1990-1994"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor={`partyColor-${index}`}>Party Color</Label>
                      <div 
                        className="h-5 w-5 rounded-full border"
                        style={{ backgroundColor: event.partyColor }}
                      />
                    </div>
                    <Input
                      id={`partyColor-${index}`}
                      type="color"
                      value={event.partyColor}
                      onChange={(e) => handleEventChange(index, 'partyColor', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`title-${index}`}>Event Title</Label>
                  <Input
                    id={`title-${index}`}
                    value={event.title}
                    onChange={(e) => handleEventChange(index, 'title', e.target.value)}
                    placeholder="Major Policy Reform"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`partyName-${index}`}>Party Name</Label>
                  <Input
                    id={`partyName-${index}`}
                    value={event.partyName}
                    onChange={(e) => handleEventChange(index, 'partyName', e.target.value)}
                    placeholder="Democratic Party"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={event.description}
                    onChange={(e) => handleEventChange(index, 'description', e.target.value)}
                    placeholder="Describe the political event..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {event.tags && event.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 p-0"
                          onClick={() => handleRemoveTag(index, tagIndex)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    {(!event.tags || event.tags.length === 0) && (
                      <span className="text-sm text-muted-foreground">No tags added</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Add tag..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag(index);
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleAddTag(index)}
                    >
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventsEditor;