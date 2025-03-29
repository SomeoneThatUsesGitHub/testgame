/**
 * Country Data Syncer
 * Utility to synchronize country data from frontend files to the backend
 */

import { initializeBackendData } from './countryLoader';
import { apiRequest } from '../lib/queryClient';
import { queryClient } from '../lib/queryClient';

/**
 * Sync all country data to the backend
 * This should be called whenever country files are modified and you want
 * to update the backend with the new data
 */
export async function syncCountriesToBackend() {
  try {
    console.log('Starting country data synchronization...');
    
    // Get the formatted data from all country files
    const countryData = await initializeBackendData();
    
    // Send to the backend
    const response = await apiRequest(
      'POST',
      '/api/sync-countries',
      countryData
    );
    
    // Check response
    if (response.ok) {
      // Invalidate all country-related queries to force a refresh
      queryClient.invalidateQueries({ queryKey: ['/api/countries'] });
      console.log('Country data synchronized successfully!');
      return true;
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sync country data');
    }
  } catch (error) {
    console.error('Error synchronizing country data:', error);
    return false;
  }
}

/**
 * Development helper function to synchronize on demand
 * This can be called from the browser console for testing:
 * import { syncNow } from './data/countrySyncer'; syncNow();
 */
export async function syncNow() {
  const result = await syncCountriesToBackend();
  if (result) {
    console.log('✅ Synchronization complete - refresh the page to see updates');
  } else {
    console.error('❌ Synchronization failed');
  }
  return result;
}

// Export a default function for easy importing
export default syncCountriesToBackend;