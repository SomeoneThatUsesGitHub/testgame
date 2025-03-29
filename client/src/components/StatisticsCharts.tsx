import { useState, useMemo } from "react";
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
import { getCountryStatistics } from "../lib/chart-data";

// Color palette for chart elements
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface StatisticsChartsProps {
  country?: Country;
}

const StatisticsCharts = ({ country }: StatisticsChartsProps) => {
  const [chartType, setChartType] = useState<"gdp" | "trade" | "employment">("gdp");

  // Get statistics data for the country
  const countryStats = useMemo(() => getCountryStatistics(country), [country]);
  
  // Get data for each chart from the countryStats
  const getGdpData = () => countryStats.gdpData;
  const getTradeData = () => countryStats.tradeData;
  const getEmploymentData = () => countryStats.employmentData;

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
            className="text-xs sm:text-sm whitespace-nowrap"
            onClick={() => setChartType("gdp")}
          >
            GDP Growth
          </Button>
          <Button 
            variant={chartType === "trade" ? "default" : "outline"} 
            size="sm"
            className="text-xs sm:text-sm whitespace-nowrap"
            onClick={() => setChartType("trade")}
          >
            Trade Balance
          </Button>
          <Button 
            variant={chartType === "employment" ? "default" : "outline"} 
            size="sm"
            className="text-xs sm:text-sm whitespace-nowrap"
            onClick={() => setChartType("employment")}
          >
            Employment
          </Button>
        </div>
      </div>

      <Card className="flex-1">
        <CardContent className="h-[300px] pt-6">
          {chartType === "gdp" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getGdpData()}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value}B`, 'GDP']}
                  labelFormatter={(label) => `Year: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="gdp" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="GDP ($B)"
                  dot={{ strokeWidth: 2 }} 
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
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'of GDP']}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                  name="% of GDP" 
                />
              </BarChart>
            </ResponsiveContainer>
          )}

          {chartType === "employment" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getEmploymentData()}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ sector, percent }) => `${sector}: ${percent}%`}
                  outerRadius={80}
                  innerRadius={0}
                  paddingAngle={2}
                  fill="#8884d8"
                  dataKey="percent"
                  nameKey="sector"
                >
                  {getEmploymentData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Employment']}
                />
                <Legend />
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