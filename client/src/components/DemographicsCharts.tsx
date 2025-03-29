import { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { Country } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const GENDER_COLORS = ['#4F46E5', '#EC4899'];

interface DemographicsChartsProps {
  country?: Country;
}

const DemographicsCharts = ({ country }: DemographicsChartsProps) => {
  const [chartType, setChartType] = useState<"age" | "urban" | "education">("age");

  // Demographic data (this would normally come from your API)
  const getAgeData = () => [
    { name: '0-14', value: 16 },
    { name: '15-24', value: 13 },
    { name: '25-54', value: 40 },
    { name: '55-64', value: 14 },
    { name: '65+', value: 17 },
  ];

  const getUrbanRuralTrend = () => [
    { year: '1993', urban: 74, rural: 26 },
    { year: '1998', urban: 76, rural: 24 },
    { year: '2003', urban: 78, rural: 22 },
    { year: '2008', urban: 80, rural: 20 },
    { year: '2013', urban: 82, rural: 18 },
    { year: '2018', urban: 83, rural: 17 },
    { year: '2023', urban: 85, rural: 15 },
  ];

  const getEducationData = () => [
    { level: 'Primary', male: 98, female: 99 },
    { level: 'Secondary', male: 88, female: 90 },
    { level: 'Tertiary', male: 45, female: 50 },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Population Demographics (1993-2023)</h3>
        <p className="text-gray-600 text-sm mb-4">
          Demographic information showing age distribution, urbanization trends, and education levels.
        </p>
        
        <div className="flex space-x-2 mb-6">
          <Button 
            variant={chartType === "age" ? "default" : "outline"} 
            size="sm"
            onClick={() => setChartType("age")}
          >
            Age Structure
          </Button>
          <Button 
            variant={chartType === "urban" ? "default" : "outline"} 
            size="sm"
            onClick={() => setChartType("urban")}
          >
            Urbanization
          </Button>
          <Button 
            variant={chartType === "education" ? "default" : "outline"} 
            size="sm"
            onClick={() => setChartType("education")}
          >
            Education
          </Button>
        </div>
      </div>

      <Card className="flex-1 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardContent className="pt-6 h-[min(350px,calc(100vh-350px))]">
          {chartType === "age" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getAgeData()}
                  cx="50%"
                  cy="45%"
                  labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  innerRadius={40} // Donut chart
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={3}
                >
                  {getAgeData().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="#fff"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'of population']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '6px',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{
                    paddingTop: '10px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}

          {chartType === "urban" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={getUrbanRuralTrend()}
                margin={{
                  top: 10,
                  right: 20,
                  left: 20,
                  bottom: 20,
                }}
              >
                <defs>
                  <linearGradient id="urbanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="ruralGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                <XAxis 
                  dataKey="year" 
                  tick={{ fill: '#4B5563' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                />
                <YAxis 
                  tick={{ fill: '#4B5563' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '6px',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{
                    paddingTop: '10px',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="urban" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="url(#urbanGradient)" 
                  name="Urban (%)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="rural" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="url(#ruralGradient)" 
                  name="Rural (%)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {chartType === "education" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getEducationData()}
                margin={{
                  top: 10,
                  right: 20,
                  left: 30, // Give more space for axis labels
                  bottom: 20,
                }}
                layout="vertical"
                barGap={8}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.7} horizontal={true} vertical={false} />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  unit="%" 
                  tick={{ fill: '#4B5563' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                />
                <YAxis 
                  dataKey="level" 
                  type="category" 
                  tick={{ fill: '#4B5563' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                  width={85}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, '']}
                  cursor={{ fill: 'rgba(30, 41, 59, 0.05)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '6px',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{
                    paddingTop: '10px',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="male" 
                  name="Male" 
                  fill={GENDER_COLORS[0]} 
                  radius={[0, 4, 4, 0]}
                />
                <Bar 
                  dataKey="female" 
                  name="Female" 
                  fill={GENDER_COLORS[1]} 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 text-xs text-gray-500 italic">
        Note: Data shown represents general demographic trends for illustrative purposes.
      </div>
    </div>
  );
};

export default DemographicsCharts;