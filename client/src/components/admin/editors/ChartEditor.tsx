import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, X, Save } from 'lucide-react';
import type { DataPoint } from '@/data/types';

interface ChartEditorProps {
  title: string;
  data: DataPoint[];
  onChange: (data: DataPoint[]) => void;
}

/**
 * Component for editing chart data (demographics, statistics)
 */
const ChartEditor: React.FC<ChartEditorProps> = ({ title, data, onChange }) => {
  // Colors for the pie chart segments
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#F06292', '#9575CD'];
  
  // State for tracking if all values sum to 100
  const [sumWarning, setSumWarning] = useState(false);
  
  // Calculate the sum of all values
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Handle name change
  const handleNameChange = (index: number, name: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], name };
    onChange(newData);
  };
  
  // Handle value change
  const handleValueChange = (index: number, valueStr: string) => {
    const value = parseFloat(valueStr) || 0;
    const newData = [...data];
    newData[index] = { ...newData[index], value };
    onChange(newData);
    
    // Check if the values sum to approximately 100
    const newTotal = newData.reduce((sum, item) => sum + item.value, 0);
    setSumWarning(newTotal < 99 || newTotal > 101);
  };
  
  // Add a new data point
  const handleAddDataPoint = () => {
    const newData = [...data, { name: `New Item ${data.length + 1}`, value: 0 }];
    onChange(newData);
  };
  
  // Remove a data point
  const handleRemoveDataPoint = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };
  
  // Normalize values to sum to 100
  const handleNormalizeValues = () => {
    if (total === 0) return;
    
    const normalizedData = data.map(item => ({
      ...item,
      value: parseFloat(((item.value / total) * 100).toFixed(1))
    }));
    
    onChange(normalizedData);
    setSumWarning(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <div className="flex gap-2">
            {sumWarning && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNormalizeValues}
              >
                <Save className="h-4 w-4 mr-1" /> Normalize to 100%
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddDataPoint}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sumWarning && (
          <div className="text-amber-500 mb-2 text-sm font-medium">
            Warning: Values sum to {total.toFixed(1)}%, not 100%
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={item.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder="Category name"
                  className="flex-[3]"
                />
                <Input
                  type="number"
                  value={item.value || ''}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  placeholder="Value (%)"
                  className="flex-[2]"
                  step="0.1"
                  min="0"
                  max="100"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveDataPoint(index)}
                  disabled={data.length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mt-4">
          <Label className="block mb-1 text-sm">Distribution</Label>
          <div className="flex items-center h-4">
            {data.map((item, index) => (
              <div 
                key={index}
                className="h-full"
                style={{ 
                  width: `${(item.value / Math.max(total, 100)) * 100}%`,
                  backgroundColor: COLORS[index % COLORS.length],
                }}
                title={`${item.name}: ${item.value.toFixed(1)}%`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartEditor;