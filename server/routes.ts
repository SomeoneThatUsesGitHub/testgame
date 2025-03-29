import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to get all countries
  app.get("/api/countries", async (req: Request, res: Response) => {
    try {
      const countries = await storage.getCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });

  // API route to get a specific country
  app.get("/api/countries/:code", async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const country = await storage.getCountry(code);
      
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      res.json(country);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch country" });
    }
  });

  // API route to get political events for a country
  app.get("/api/countries/:code/events", async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const events = await storage.getPoliticalEvents(code);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch political events" });
    }
  });

  // API route to get a country with its political events
  app.get("/api/countries/:code/with-events", async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const countryWithEvents = await storage.getCountryWithEvents(code);
      
      if (!countryWithEvents) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      res.json(countryWithEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch country with events" });
    }
  });

  // API route to get a political leader for a country
  app.get("/api/countries/:code/leader", async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const leader = await storage.getPoliticalLeader(code);
      
      if (!leader) {
        return res.status(404).json({ message: "Leader not found for this country" });
      }
      
      res.json(leader);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch political leader" });
    }
  });

  // API route to search for countries
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string || "";
      const countries = await storage.searchCountries(query);
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: "Failed to search countries" });
    }
  });
  
  // API endpoint to sync country data from files to backend
  // This would be called from the frontend when country files are modified
  app.post("/api/sync-countries", async (req: Request, res: Response) => {
    try {
      const countryData = req.body;
      if (!countryData || typeof countryData !== 'object') {
        return res.status(400).json({ message: "Invalid country data format" });
      }
      
      // In a real application, we would reset the database here
      // For the in-memory implementation, we'd need a reset method
      
      // Initialize from the provided data
      await (storage as any).initializeFromFiles(countryData);
      
      res.json({ success: true, message: "Country data synchronized successfully" });
    } catch (error) {
      console.error("Error synchronizing country data:", error);
      res.status(500).json({ message: "Failed to synchronize country data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
