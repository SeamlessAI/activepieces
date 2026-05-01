import {
  httpClient,
  HttpMethod,
} from '@activepieces/pieces-common';
import { OAuth2PropertyValue } from '@activepieces/pieces-framework';

const MCP_PROTOCOL_VERSION = '2025-03-26';

interface McpJsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params?: Record<string, unknown>;
  id: number;
}

interface McpJsonRpcResponse {
  jsonrpc: '2.0';
  id: number;
  result?: {
    content?: Array<{ type: string; text?: string }>;
    [key: string]: unknown;
  };
  error?: { code: number; message: string; data?: unknown };
}

interface McpSession {
  sessionId: string | null;
  baseUrl: string;
  accessToken: string;
}

async function initializeSession({
  baseUrl,
  accessToken,
}: {
  baseUrl: string;
  accessToken: string;
}): Promise<McpSession> {
  const request: McpJsonRpcRequest = {
    jsonrpc: '2.0',
    method: 'initialize',
    params: {
      protocolVersion: MCP_PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: 'activepieces-seamless', version: '1.0.0' },
    },
    id: 1,
  };

  const response = await httpClient.sendRequest<McpJsonRpcResponse>({
    method: HttpMethod.POST,
    url: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: request,
  });

  const responseHeaders = response.headers ?? {};
  const sessionId = (responseHeaders['mcp-session-id'] as string) ?? null;

  return { sessionId, baseUrl, accessToken };
}

async function callTool({
  session,
  toolName,
  args,
}: {
  session: McpSession;
  toolName: string;
  args: Record<string, unknown>;
}): Promise<unknown> {
  const filteredArgs: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(args)) {
    if (value !== undefined && value !== null && value !== '') {
      filteredArgs[key] = value;
    }
  }

  const request: McpJsonRpcRequest = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: filteredArgs,
    },
    id: 2,
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.accessToken}`,
  };
  if (session.sessionId) {
    headers['Mcp-Session-Id'] = session.sessionId;
  }

  const response = await httpClient.sendRequest<McpJsonRpcResponse>({
    method: HttpMethod.POST,
    url: session.baseUrl,
    headers,
    body: request,
  });

  const body = response.body;
  if (body.error) {
    throw new Error(
      `MCP Error [${body.error.code}]: ${body.error.message}`
    );
  }

  if (body.result?.content) {
    const textContent = body.result.content.find(
      (c) => c.type === 'text' && c.text
    );
    if (textContent?.text) {
      try {
        return JSON.parse(textContent.text);
      } catch {
        return textContent.text;
      }
    }
  }

  return body.result;
}

async function executeMcpTool({
  auth,
  baseUrl,
  toolName,
  args,
}: {
  auth: OAuth2PropertyValue;
  baseUrl: string;
  toolName: string;
  args: Record<string, unknown>;
}): Promise<unknown> {
  const session = await initializeSession({
    baseUrl,
    accessToken: auth.access_token,
  });
  return callTool({ session, toolName, args });
}

export const seamlessCommon = {
  executeMcpTool,
  initializeSession,
  callTool,
};

export const BASE_URLS = {
  production: 'https://mcp.seamless.ai/mcp',
  dev: 'https://mcp-dev.seamless.ai/mcp',
  qa: 'https://mcp-qa.seamless.ai/mcp',
  staging: 'https://mcp-staging.seamless.ai/mcp',
} as const;
