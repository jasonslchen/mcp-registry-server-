import express, { Request, Response } from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ServerEntry, ServersResponse, ErrorResponse } from './types';

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Load hardcoded servers from JSON file
const SERVERS: ServerEntry[] = JSON.parse(
  readFileSync(join(__dirname, 'servers.json'), 'utf-8')
);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', servers: SERVERS.length });
});

// GET /v0.1/servers - List all servers with optional filtering
app.get('/v0.1/servers', (req: Request, res: Response) => {
  const { search, limit, cursor, version, updated_since } = req.query;
  
  let results = [...SERVERS];
  
  // Apply search filter (case-insensitive substring match on name)
  if (search && typeof search === 'string') {
    const searchLower = search.toLowerCase();
    results = results.filter(s => 
      s.server.name.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply version filter (for this implementation, we can ignore or support "latest")
  if (version && version !== 'latest') {
    results = results.filter(s => s.server.version === version);
  }
  
  // Apply limit (default: 100, max: 1000)
  const limitNum = limit ? Math.min(parseInt(limit as string, 10), 1000) : 100;
  results = results.slice(0, limitNum);
  
  // Return response with metadata
  res.json({
    servers: results,
    metadata: {
      count: results.length,
      nextCursor: null // No pagination needed for 3 servers
    }
  });
});

// GET /v0.1/servers/{name} - Get specific server by name
// Use :name(*) to capture the full path including slashes
app.get('/v0.1/servers/:name(*)', (req: Request, res: Response) => {
  const serverName = req.params.name;
  
  // Find server by exact name match
  const server = SERVERS.find((s: ServerEntry) => s.server.name === serverName);
  
  if (!server) {
    return res.status(404).json({
      error: 'Server not found',
      message: `Server with name '${serverName}' does not exist`
    });
  }
  
  res.json(server);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MCP Registry Server running on http://localhost:${PORT}`);
  console.log(`📦 Loaded ${SERVERS.length} servers:`);
  SERVERS.forEach((s: ServerEntry) => {
    console.log(`   - ${s.server.name} (v${s.server.version})`);
  });
  console.log(`\n📖 API Endpoints:`);
  console.log(`   GET /v0.1/servers`);
  console.log(`   GET /v0.1/servers/{name}`);
  console.log(`   GET /health\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});
