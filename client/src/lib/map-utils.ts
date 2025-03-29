import { geoPath, geoOrthographic, geoEqualEarth } from "d3-geo";
import { Feature } from "geojson";

// Initial map settings
export const initialMapSettings = {
  scale: 150,
  center: [0, 0],
  rotation: [0, 0, 0]
};

// Map zoom settings
export const zoomSettings = {
  minZoom: 1,
  maxZoom: 3,
  zoomFactor: 1.2
};

// Function to find a country feature by its ISO code
export function findFeatureByCountryCode(
  features: Array<Feature>,
  countryCode: string
): Feature | undefined {
  return features.find(
    (feature) => 
      feature.properties && 
      (feature.properties.ISO_A3?.toLowerCase() === countryCode.toLowerCase() ||
       feature.properties.ISO_A2?.toLowerCase() === countryCode.toLowerCase())
  );
}

// Function to get the centroid of a map feature
export function getFeatureCentroid(feature: Feature): [number, number] | null {
  if (!feature || !feature.geometry) return null;
  
  // Create a path generator
  const pathGenerator = geoPath().projection(geoEqualEarth());
  
  // Find the centroid
  const centroid = pathGenerator.centroid(feature);
  if (isNaN(centroid[0]) || isNaN(centroid[1])) return null;
  
  return centroid as [number, number];
}

// Function to interpolate colors for low-poly effect
export function getPolygonColor(countryCode: string, colorMap: Record<string, string>, defaultColor: string): string {
  return colorMap[countryCode] || defaultColor;
}

// Function to format population numbers
export function formatPopulation(population: number): string {
  if (population >= 1000000000) {
    return `${(population / 1000000000).toFixed(2)} billion`;
  } else if (population >= 1000000) {
    return `${(population / 1000000).toFixed(1)} million`;
  } else if (population >= 1000) {
    return `${(population / 1000).toFixed(1)} thousand`;
  }
  return population.toString();
}

// Map color scales
export const regionColors: Record<string, string> = {
  "North America": "#DBEAFE",
  "South America": "#60A5FA",
  "Europe": "#93C5FD",
  "Asia": "#60A5FA",
  "Africa": "#DBEAFE",
  "Oceania": "#93C5FD",
  "Europe/Asia": "#93C5FD"
};

// Political party color map
export const partyColorMap: Record<string, string> = {
  "Democratic": "#3B82F6",
  "Republican": "#EF4444",
  "Conservative": "#1E40AF",
  "Labour": "#DC2626",
  "Liberal": "#FB923C",
  "Single-Party": "#6B7280",
  "Various": "#6B7280"
};
