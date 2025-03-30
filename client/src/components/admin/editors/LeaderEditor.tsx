import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { PoliticalLeader } from '@/data/types';

interface LeaderEditorProps {
  leader: PoliticalLeader;
  onChange: (field: string, value: string) => void;
  errors: {[key: string]: string};
}

const LeaderEditor: React.FC<LeaderEditorProps> = ({ leader, onChange, errors }) => {
  // Generate initials for fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Political Leader</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col items-center justify-start gap-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={leader.imageUrl || ''} alt={leader.name} />
              <AvatarFallback className="text-2xl">
                {getInitials(leader.name || 'NA')}
              </AvatarFallback>
            </Avatar>
            
            <div className="w-full space-y-2">
              <Label 
                htmlFor="imageUrl"
                className={errors['leader.imageUrl'] ? 'text-destructive' : ''}
              >
                Leader Image URL
              </Label>
              <Input
                id="imageUrl"
                value={leader.imageUrl || ''}
                onChange={(e) => onChange('imageUrl', e.target.value)}
                placeholder="https://example.com/leader.jpg"
                className={errors['leader.imageUrl'] ? 'border-destructive' : ''}
              />
              {errors['leader.imageUrl'] && (
                <p className="text-sm text-destructive">{errors['leader.imageUrl']}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter a URL to the leader's image. Leave blank to use initials.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="name"
                  className={errors['leader.name'] ? 'text-destructive' : ''}
                >
                  Leader Name
                </Label>
                <Input
                  id="name"
                  value={leader.name}
                  onChange={(e) => onChange('name', e.target.value)}
                  placeholder="Emmanuel Macron"
                  className={errors['leader.name'] ? 'border-destructive' : ''}
                />
                {errors['leader.name'] && (
                  <p className="text-sm text-destructive">{errors['leader.name']}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="title"
                  className={errors['leader.title'] ? 'text-destructive' : ''}
                >
                  Official Title
                </Label>
                <Input
                  id="title"
                  value={leader.title}
                  onChange={(e) => onChange('title', e.target.value)}
                  placeholder="President"
                  className={errors['leader.title'] ? 'border-destructive' : ''}
                />
                {errors['leader.title'] && (
                  <p className="text-sm text-destructive">{errors['leader.title']}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="party"
                  className={errors['leader.party'] ? 'text-destructive' : ''}
                >
                  Political Party
                </Label>
                <Input
                  id="party"
                  value={leader.party}
                  onChange={(e) => onChange('party', e.target.value)}
                  placeholder="Renaissance"
                  className={errors['leader.party'] ? 'border-destructive' : ''}
                />
                {errors['leader.party'] && (
                  <p className="text-sm text-destructive">{errors['leader.party']}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="inPowerSince"
                  className={errors['leader.inPowerSince'] ? 'text-destructive' : ''}
                >
                  In Power Since
                </Label>
                <Input
                  id="inPowerSince"
                  value={leader.inPowerSince}
                  onChange={(e) => onChange('inPowerSince', e.target.value)}
                  placeholder="2017"
                  className={errors['leader.inPowerSince'] ? 'border-destructive' : ''}
                />
                {errors['leader.inPowerSince'] && (
                  <p className="text-sm text-destructive">{errors['leader.inPowerSince']}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Year or specific date (e.g., 2017 or May 14, 2017)
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label 
                htmlFor="description"
                className={errors['leader.description'] ? 'text-destructive' : ''}
              >
                Leader Description
              </Label>
              <Textarea
                id="description"
                value={leader.description}
                onChange={(e) => onChange('description', e.target.value)}
                placeholder="Brief biography and notable achievements..."
                className={`min-h-[120px] ${errors['leader.description'] ? 'border-destructive' : ''}`}
              />
              {errors['leader.description'] && (
                <p className="text-sm text-destructive">{errors['leader.description']}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderEditor;