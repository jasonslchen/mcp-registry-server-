# MCP Local Registry Server

A minimal, in-memory MCP (Model Context Protocol) registry server that returns 3 hardcoded MCP servers for testing and development purposes. This is a read-only implementation compliant with the official MCP Registry API specification (v0.1).

## 🎯 Overview

This server provides a lightweight, zero-configuration registry for MCP servers without requiring database setup or authentication. Perfect for local development, testing, and learning about the MCP ecosystem.

## 📦 Servers Included

The registry includes three official MCP servers:

1. **GitHub MCP Server** (`io.github.modelcontextprotocol/server-github`)
   - GitHub API integration for repositories, issues, and pull requests
   - Requires: `GITHUB_PERSONAL_ACCESS_TOKEN`

2. **Filesystem MCP Server** (`io.github.modelcontextprotocol/server-filesystem`)
   - Secure file system operations with access controls

3. **Memory MCP Server** (`io.github.modelcontextprotocol/server-memory`)
   - Knowledge graph-based persistent memory for AI agents

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or navigate to the project directory
cd mcp-registry-server

# Install dependencies
npm install
```

### Running the Server

```bash
# Build TypeScript
npm run build

# Start the server
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on **http://localhost:8080** by default.

### Configuration

Set the `PORT` environment variable to change the default port:

```bash
PORT=3000 npm start
```

## 📖 API Endpoints

### 1. List All Servers

**Endpoint:** `GET /v0.1/servers`

**Query Parameters:**
- `search` (string, optional): Filter servers by name (case-insensitive substring match)
- `limit` (integer, optional): Number of results (default: 100, max: 1000)
- `version` (string, optional): Filter by version
- `cursor` (string, optional): Pagination cursor (not used in this implementation)

**Examples:**

```bash
# Get all servers
curl http://localhost:8080/v0.1/servers | jq

# Search for GitHub server
curl "http://localhost:8080/v0.1/servers?search=github" | jq

# Limit results
curl "http://localhost:8080/v0.1/servers?limit=2" | jq
```

**Response:**

```json
{
  "servers": [
    {
      "server": {
        "$schema": "https://static.modelcontextprotocol.io/schemas/2025-09-29/server.schema.json",
        "name": "io.github.modelcontextprotocol/server-github",
        "description": "MCP server for GitHub API integration...",
        "version": "0.7.0",
        "packages": [...]
      },
      "_meta": {
        "io.modelcontextprotocol.registry/official": {
          "status": "active",
          "publishedAt": "2025-01-15T10:00:00Z",
          "updatedAt": "2025-01-15T10:00:00Z",
          "isLatest": true
        }
      }
    }
  ],
  "metadata": {
    "count": 3,
    "nextCursor": null
  }
}
```

### 2. Get Specific Server

**Endpoint:** `GET /v0.1/servers/{name}`

**Path Parameter:**
- `name` (string): Full server name (e.g., `io.github.modelcontextprotocol/server-github`)

**Examples:**

```bash
# Get GitHub server details
curl http://localhost:8080/v0.1/servers/io.github.modelcontextprotocol/server-github | jq

# Get Filesystem server
curl http://localhost:8080/v0.1/servers/io.github.modelcontextprotocol/server-filesystem | jq

# Get Memory server
curl http://localhost:8080/v0.1/servers/io.github.modelcontextprotocol/server-memory | jq
```

**Success Response (200):**

```json
{
  "server": {
    "$schema": "https://static.modelcontextprotocol.io/schemas/2025-09-29/server.schema.json",
    "name": "io.github.modelcontextprotocol/server-github",
    "description": "MCP server for GitHub API integration...",
    "version": "0.7.0",
    "packages": [...]
  },
  "_meta": {...}
}
```

**Error Response (404):**

```json
{
  "error": "Server not found",
  "message": "Server with name 'io.github.example/nonexistent' does not exist"
}
```

### 3. Health Check

**Endpoint:** `GET /health`

```bash
curl http://localhost:8080/health
```

**Response:**

```json
{
  "status": "ok",
  "servers": 3
}
```

## 🧪 Testing

Run these curl commands to verify the implementation:

```bash
# 1. Check server health
curl http://localhost:8080/health

# 2. List all servers
curl http://localhost:8080/v0.1/servers | jq '.metadata.count'
# Expected: 3

# 3. Search for GitHub server
curl "http://localhost:8080/v0.1/servers?search=github" | jq '.servers[0].server.name'
# Expected: "io.github.modelcontextprotocol/server-github"

# 4. Get specific server
curl http://localhost:8080/v0.1/servers/io.github.modelcontextprotocol/server-memory | jq '.server.description'

# 5. Test 404 error
curl http://localhost:8080/v0.1/servers/nonexistent | jq
# Expected: 404 error message
```

## 🐳 Docker Support

### Build and Run with Docker

```bash
# Build image
docker build -t mcp-registry-server .

# Run container
docker run -p 8080:8080 mcp-registry-server
```

### Using Docker Compose

```bash
docker-compose up
```

The server will be available at http://localhost:8080

## 📁 Project Structure

```
mcp-registry-server/
├── src/
│   ├── index.ts          # Main Express server
│   ├── types.ts          # TypeScript type definitions
│   └── servers.json      # Hardcoded server data (3 servers)
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript configuration
├── Dockerfile            # Docker image definition
├── docker-compose.yml    # Docker Compose configuration
├── .gitignore
└── README.md
```

## 🔧 Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled server
- `npm run dev` - Run in development mode with ts-node
- `npm run watch` - Watch TypeScript files for changes

### Adding More Servers

To add more servers, edit `src/servers.json` and add new server entries following the MCP server schema.

## ✅ Features

- ✅ Returns 3 hardcoded MCP servers (GitHub, Filesystem, Memory)
- ✅ In-memory storage (no database required)
- ✅ Compliant with MCP Registry API v0.1 (read endpoints)
- ✅ Case-insensitive search filtering
- ✅ Pagination support (limit parameter)
- ✅ CORS enabled for browser access
- ✅ TypeScript for type safety
- ✅ Health check endpoint
- ✅ Proper error handling with 404 responses
- ✅ Docker support
- ✅ Zero authentication (read-only)

## 🚫 Out of Scope

This is a simplified implementation. The following features are **not included**:

- ❌ Database persistence
- ❌ Authentication/Authorization
- ❌ Publishing capabilities (POST/PUT/DELETE endpoints)
- ❌ User management
- ❌ Server versioning beyond basic filtering
- ❌ Advanced pagination with cursors

## 📚 Resources

- [MCP Specification](https://spec.modelcontextprotocol.io)
- [Official MCP Registry API](https://registry.modelcontextprotocol.io/docs)
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)
- [MCP Registry GitHub](https://github.com/modelcontextprotocol/registry)

## 📝 License

MIT

## 🤝 Contributing

This is a reference implementation for learning and testing. Feel free to fork and modify for your needs!

---

**Made with ❤️ for the MCP community**
