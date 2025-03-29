declare module 'react-simple-maps' {
  import React from 'react';

  // Define types for Geography
  export interface GeographyProps {
    geography: any;
    key?: string;
    onClick?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    [key: string]: any;
  }

  export const Geography: React.FC<GeographyProps>;

  // Define types for Geographies
  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: any[] }) => React.ReactNode;
    [key: string]: any;
  }

  export const Geographies: React.FC<GeographiesProps>;

  // Define types for ZoomableGroup
  export interface ZoomableGroupProps {
    zoom?: number;
    center?: [number, number];
    onMoveStart?: (position: { coordinates: [number, number], zoom: number }) => void;
    onMoveEnd?: (position: { coordinates: [number, number], zoom: number }) => void;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const ZoomableGroup: React.FC<ZoomableGroupProps>;

  // Define types for ComposableMap
  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: object;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
}