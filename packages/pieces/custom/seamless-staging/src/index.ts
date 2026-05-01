import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { createCustomApiCallAction } from '@activepieces/pieces-common';
import { PieceCategory } from '@activepieces/shared';
import { createAllActions } from '@activepieces/piece-seamless/src/lib/common/action-factory';

const MCP_BASE_URL = 'https://mcp-staging.seamless.ai/mcp';

export const seamlessStagingAuth = PieceAuth.OAuth2({
  required: true,
  authUrl: 'https://mcp-staging.seamless.ai/mcp/authorize',
  tokenUrl: 'https://mcp-staging.seamless.ai/mcp/token',
  scope: [],
  pkce: true,
});

export const seamlessStaging = createPiece({
  displayName: 'Seamless.AI (Staging)',
  description:
    'Seamless.AI Staging environment - AI-powered sales intelligence platform.',
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/seamless.png',
  categories: [PieceCategory.SALES_AND_CRM],
  auth: seamlessStagingAuth,
  authors: ['jonathanestep'],
  actions: [
    ...createAllActions({ auth: seamlessStagingAuth, baseUrl: MCP_BASE_URL }),
    createCustomApiCallAction({
      baseUrl: () => 'https://mcp-staging.seamless.ai',
      auth: seamlessStagingAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${(auth as { access_token: string }).access_token}`,
      }),
    }),
  ],
  triggers: [],
});
