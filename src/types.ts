// Type definitions for MCP Registry Server

export interface EnvironmentVariable {
  name: string;
  description: string;
  isRequired: boolean;
  isSecret: boolean;
}

export interface Transport {
  type: string;
}

export interface Package {
  registryType: string;
  registryBaseUrl: string;
  identifier: string;
  version: string;
  transport: Transport;
  environmentVariables?: EnvironmentVariable[];
}

export interface Repository {
  url: string;
  source: string;
}

export interface Server {
  $schema: string;
  name: string;
  description: string;
  repository: Repository;
  version: string;
  packages: Package[];
}

export interface Metadata {
  'io.modelcontextprotocol.registry/official': {
    status: string;
    publishedAt: string;
    updatedAt: string;
    isLatest: boolean;
  };
}

export interface ServerEntry {
  server: Server;
  _meta: Metadata;
}

export interface ServersResponse {
  servers: ServerEntry[];
  metadata: {
    count: number;
    nextCursor: string | null;
  };
}

export interface ErrorResponse {
  error: string;
  message: string;
}
