// local.js - Helper script for running the application locally
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