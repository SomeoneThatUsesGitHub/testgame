# World Political Map

An interactive geopolitical visualization platform that transforms complex global data into engaging, accessible insights through dynamic charts, maps, and interactive storytelling.

## Features

- Interactive 2D low poly world map
- Detailed country profiles with political recaps
- Timeline of significant political events over the past 30 years
- Demographic and statistical data visualization with charts
- Political leadership profiles
- Mobile responsive design

## Running the Application

### Running on Replit

Simply click the "Run" button in Replit to start the application.

### Running Locally

To run the application locally, you'll need to use a slightly modified server configuration to avoid binding issues on some systems.

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a local.js file in the project root with the following content:
   ```javascript
   // local.js
   import { spawn } from 'child_process';
   
   // Start the development server
   const server = spawn('tsx', ['server/local.ts'], { stdio: 'inherit' });
   
   // Log any errors
   server.on('error', (err) => {
     console.error('Failed to start server:', err);
   });
   
   // Handle clean exit
   process.on('SIGINT', () => {
     console.log('Shutting down server...');
     server.kill('SIGINT');
     process.exit(0);
   });
   ```

4. Run the local server:
   ```bash
   node local.js
   ```

5. Access the application at `http://localhost:5000`

## Adding New Countries

This application includes tools to make adding new countries easier:

### Country Scripts

1. Run the country documentation generator:
   ```bash
   node scripts/generate-readme.js
   ```
   This will create a COUNTRY_GUIDE.md file with detailed instructions.

2. Add a new country with the interactive script:
   ```bash
   node scripts/add-country.js
   ```
   Follow the prompts to generate code snippets for your country data.

3. Add country coordinates with:
   ```bash
   node scripts/add-coordinates.js
   ```

### Countries Data Structure

Each country requires the following information:

```typescript
// Country basic data
{
  code: string;        // 3-letter ISO code (lowercase)
  name: string;        // Full country name
  capital: string;     // Capital city name
  population: number;  // Approximate population
  color: string;       // Hex color code
  region: string;      // Geographic region
}

// Political leader data
{
  countryCode: string;    // Same 3-letter ISO code
  name: string;           // Leader's full name
  title: string;          // Official title
  party: string;          // Political party
  inPowerSince: string;   // Year they took power
  imageUrl: string;       // URL to leader image
  description: string;    // Brief description
}
```

For more detailed instructions, refer to the generated COUNTRY_GUIDE.md file.

## Technologies Used

- React with TypeScript
- D3-Geo and React Simple Maps for geospatial visualization
- Recharts for data visualization
- Tailwind CSS with ShadCN UI components
- Express backend server

## License

MIT