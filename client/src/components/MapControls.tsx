interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const MapControls = ({ onZoomIn, onZoomOut, onReset }: MapControlsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <button 
        className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
        onClick={onZoomIn}
        title="Zoom in"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-dark" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>
      <button 
        className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
        onClick={onZoomOut}
        title="Zoom out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-dark" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>
      <button 
        className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
        onClick={onReset}
        title="Reset view"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-dark" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default MapControls;
