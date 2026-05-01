import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { createCustomApiCallAction } from '@activepieces/pieces-common';
import { PieceCategory } from '@activepieces/shared';
import { createAllActions } from '@activepieces/piece-seamless/src/lib/common/action-factory';

const MCP_BASE_URL = 'https://mcp-dev.seamless.ai/mcp';

export const seamlessDevAuth = PieceAuth.OAuth2({
  required: true,
  authUrl: 'https://mcp-dev.seamless.ai/mcp/authorize',
  tokenUrl: 'https://mcp-dev.seamless.ai/mcp/token',
  scope: [],
  pkce: true,
});

export const seamlessDev = createPiece({
  displayName: 'Seamless.AI (Dev)',
  description:
    'Seamless.AI Dev environment - AI-powered sales intelligence platform.',
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/seamless.png',
  categories: [PieceCategory.SALES_AND_CRM],
  auth: seamlessDevAuth,
  authors: ['jonathanestep'],
  actions: [
    ...createAllActions({ auth: seamlessDevAuth, baseUrl: MCP_BASE_URL }),
    createCustomApiCallAction({
      baseUrl: () => 'https://mcp-dev.seamless.ai',
      auth: seamlessDevAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${(auth as { access_token: string }).access_token}`,
      }),
    }),
  ],
  triggers: [],
});
