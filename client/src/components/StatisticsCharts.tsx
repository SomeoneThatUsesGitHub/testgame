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
  Cell
} from "recharts";
import { Country } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Color palette for chart elements
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface StatisticsChartsProps {
  country?: Country;
}

const StatisticsCharts = ({ country }: StatisticsChartsProps) => {
  const [chartType, setChartType] = useState<"gdp" | "trade" | "employment">("gdp");

  // Economic data based on country (this would normally come from your API)
  const getGdpData = () => [
    { year: '1993', gdp: 3000 },
    { year: '1998', gdp: 3600 },
    { year: '2003', gdp: 4200 },
    { year: '2008', gdp: 5100 },
    { year: '2013', gdp: 5900 },
    { year: '2018', gdp: 6800 },
    { year: '2023', gdp: 7400 },
  ];

  const getTradeData = () => [
    { name: 'Exports', value: 68 },
    { name: 'Imports', value: 72 },
    { name: 'Trade Balance', value: -4 },
  ];

  const getEmploymentData = () => [
    { sector: 'Agriculture', percent: 12 },
    { sector: 'Industry', percent: 32 },
    { sector: 'Services', percent: 56 },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Economic Statistics (1993-2023)</h3>
        <p className="text-gray-600 text-sm mb-4">
          Historical economic data showing trends in GDP growth, trade balance, and employment sectors.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={chartType === "gdp" ? "default" : "outline"} 
            size="sm"
            onClick={() => setChartType("gdp")}
            className="text-xs md:text-sm"
          >
            GDP Growth
          </Button>
          <Button 
            variant={chartType === "trade" ? "default" : "outline"} 
            size="sm"
            onClick={() => setChartType("trade")}
            className="text-xs md:text-sm"
          >
            Trade Balance
          </Button>
          <Button 
            variant={chartType === "employment" ? "default" : "outline"} 
            size="sm"
            onClick={() => setChartType("employment")}
            className="text-xs md:text-sm"
          >
            Employment
          </Button>
        </div>
      </div>

      <Card className="flex-1 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-2 pt-4 md:p-6 md:pt-6 h-[min(400px,calc(100vh-270px))] md:h-[min(500px,calc(100vh-250px))]">
          {chartType === "gdp" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getGdpData()}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                <XAxis 
                  dataKey="year" 
                  tick={{ fill: '#4B5563' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                />
                <YAxis 
                  tick={{ fill: '#4B5563' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                  tickFormatter={(value) => `$${value}B`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}B`, 'GDP']}
                  labelFormatter={(label) => `Year: ${label}`}
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
                <Line 
                  type="monotone" 
                  dataKey="gdp" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="GDP ($B)"
                  dot={{ strokeWidth: 2, r: 6, fill: '#fff' }}
                  activeDot={{ r: 8, stroke: '#2563EB', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {chartType === "trade" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getTradeData()}
                margin={{
                  top: 5,
                  right: 5,
                  left: 0,
                  bottom: 5,
                }}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.7} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#4B5563' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                />
                <YAxis 
                  tick={{ fill: '#4B5563' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'of GDP']}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
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
                  dataKey="value" 
                  fill="#3B82F6" 
                  radius={[8, 8, 0, 0]}
                  name="% of GDP"
                  barSize={80}
                />
              </BarChart>
            </ResponsiveContainer>
          )}

          {chartType === "employment" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart
                margin={{
                  top: 5,
                  right: 0,
                  left: 0,
                  bottom: 5,
                }}
              >
                <Pie
                  data={getEmploymentData()}
                  cx="50%"
                  cy="45%"
                  labelLine={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '2 2' }}
                  label={({ 
                    cx, 
                    cy, 
                    midAngle, 
                    innerRadius, 
                    outerRadius, 
                    percent, 
                    index, 
                    name,
                    sector 
                  }) => {
                    // Better label positioning
                    const RADIAN = Math.PI / 180;
                    // Distance from center to label
                    const radius = outerRadius * 1.3;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    
                    const displayName = sector || name;
                    
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        fill="#4B5563"
                        textAnchor={x > cx ? 'start' : 'end'} 
                        dominantBaseline="central"
                        fontSize="14"
                        fontWeight="500"
                      >
                        {`${displayName}: ${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                  outerRadius="80%"
                  innerRadius="40%" // Adding a donut hole
                  fill="#8884d8"
                  dataKey="percent"
                  nameKey="sector"
                  paddingAngle={2} // Add spacing between segments
                >
                  {getEmploymentData().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="#fff"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Employment']}
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
                    paddingTop: '20px',
                    fontSize: '12px',
                    margin: '0 auto',
                    width: '80%'
                  }}
                  layout="horizontal"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 text-xs text-gray-500 italic">
        Note: Data shown represents general economic trends for illustrative purposes.
      </div>
    </div>
  );
};

export default StatisticsCharts;