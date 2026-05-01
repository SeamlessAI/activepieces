import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { createCustomApiCallAction } from '@activepieces/pieces-common';
import { PieceCategory } from '@activepieces/shared';
import { createAllActions } from './lib/common/action-factory';

export const seamlessAuth = PieceAuth.OAuth2({
  required: true,
  authUrl: 'https://mcp.seamless.ai/mcp/authorize',
  tokenUrl: 'https://mcp.seamless.ai/mcp/token',
  scope: [],
  pkce: true,
});

const MCP_BASE_URL = 'https://mcp.seamless.ai/mcp';

export const seamless = createPiece({
  displayName: 'Seamless.AI',
  description:
    'AI-powered sales intelligence platform for finding verified contact emails, phone numbers, and company insights.',
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/seamless.png',
  categories: [PieceCategory.SALES_AND_CRM],
  auth: seamlessAuth,
  authors: ['jonathanestep'],
  actions: [
    ...createAllActions({ auth: seamlessAuth, baseUrl: MCP_BASE_URL }),
    createCustomApiCallAction({
      baseUrl: () => 'https://mcp.seamless.ai',
      auth: seamlessAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${(auth as { access_token: string }).access_token}`,
      }),
    }),
  ],
  triggers: [],
});
