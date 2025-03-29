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

  const httpServer = createServer(app);
  return httpServer;
}
