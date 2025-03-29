import { useState, useMemo, useEffect } from "react";
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
import { getCountryDemographics } from "../lib/chart-data";
import { useIsMobile } from "../hooks/use-mobile";

// Color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const GENDER_COLORS = ['#4F46E5', '#EC4899'];

interface DemographicsChartsProps {
  country?: Country;
}

const DemographicsCharts = ({ country }: DemographicsChartsProps) => {
  const [chartType, setChartType] = useState<"age" | "urban" | "education">("age");
  const [isMobileSize, setIsMobileSize] = useState(false);
  const isMobile = useIsMobile();
  
  // Check window size for responsive charts
  useEffect(() => {
    const checkSize = () => {
      setIsMobileSize(window.innerWidth < 500);
    };
    
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Get demographics data for the country
  const countryDemographics = useMemo(() => getCountryDemographics(country), [country]);
  
  // Get data for each chart from countryDemographics
  const getAgeData = () => countryDemographics.ageData;
  const getUrbanRuralTrend = () => countryDemographics.urbanRuralData;
  const getEducationData = () => countryDemographics.educationData;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Population Demographics (1993-2023)</h3>
        <p className="text-gray-600 text-sm mb-4">
          Demographic information showing age distribution, urbanization trends, and education levels.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={chartType === "age" ? "default" : "outline"} 
            size="sm"
            className="text-xs sm:text-sm whitespace-nowrap"
            onClick={() => setChartType("age")}
          >
            Age Structure
          </Button>
          <Button 
            variant={chartType === "urban" ? "default" : "outline"} 
            size="sm"
            className="text-xs sm:text-sm whitespace-nowrap"
            onClick={() => setChartType("urban")}
          >
            Urbanization
          </Button>
          <Button 
            variant={chartType === "education" ? "default" : "outline"} 
            size="sm"
            className="text-xs sm:text-sm whitespace-nowrap"
            onClick={() => setChartType("education")}
          >
            Education
          </Button>
        </div>
      </div>

      <Card className="flex-1">
        <CardContent className="h-[280px] sm:h-[300px] pt-6">
          {chartType === "age" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getAgeData()}
                  cx="50%"
                  cy="50%"
                  labelLine={!isMobileSize}
                  label={!isMobileSize ? ({ name, value }) => `${name}: ${value}%` : undefined}
                  outerRadius={isMobileSize ? 60 : 80}
                  innerRadius={0}
                  paddingAngle={2}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getAgeData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'of population']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}

          {chartType === "urban" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={getUrbanRuralTrend()}
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
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="urban" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#60A5FA" 
                  name="Urban (%)"
                />
                <Area 
                  type="monotone" 
                  dataKey="rural" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="#34D399" 
                  name="Rural (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {chartType === "education" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getEducationData()}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis dataKey="level" type="category" />
                <Tooltip />
                <Legend />
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

      <div className="mt-4 text-xs text-gray-500 italic mb-6">
        Note: Data shown represents general demographic trends for illustrative purposes.
      </div>
    </div>
  );
};

export default DemographicsCharts;