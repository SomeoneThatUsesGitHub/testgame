import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import country data loader to ensure it runs at startup
import { countryDataCollection } from "./data/countryLoader";
console.log(`Country data loaded from files: ${countryDataCollection.length} countries`);

// Debug logging for fetch calls
const originalFetch = window.fetch;
window.fetch = async function(input, init) {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input instanceof Request ? input.url : String(input);
  console.log(`🔄 Fetch request: ${url}`);
  
  try {
    const response = await originalFetch(input, init);
    console.log(`✅ Fetch response for ${url}: ${response.status}`);
    return response;
  } catch (error) {
    console.error(`❌ Fetch error for ${url}:`, error);
    throw error;
  }
};

// This could be used to initialize the backend with country data if needed:
/*
import { initializeBackendData } from "./data/countryLoader";
initializeBackendData().then(data => {
  console.log(`Initialized backend with ${data.countries.length} countries from data files`);
});
*/

createRoot(document.getElementById("root")!).render(<App />);
