import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

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

createRoot(document.getElementById("root")!).render(<App />);
