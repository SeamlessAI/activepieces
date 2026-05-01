import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { createCustomApiCallAction } from '@activepieces/pieces-common';
import { PieceCategory } from '@activepieces/shared';
import { createAllActions } from '@activepieces/piece-seamless/src/lib/common/action-factory';

const MCP_BASE_URL = 'https://mcp-qa.seamless.ai/mcp';

export const seamlessQaAuth = PieceAuth.OAuth2({
  required: true,
  authUrl: 'https://mcp-qa.seamless.ai/mcp/authorize',
  tokenUrl: 'https://mcp-qa.seamless.ai/mcp/token',
  scope: [],
  pkce: true,
});

export const seamlessQa = createPiece({
  displayName: 'Seamless.AI (QA)',
  description:
    'Seamless.AI QA environment - AI-powered sales intelligence platform.',
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/seamless.png',
  categories: [PieceCategory.SALES_AND_CRM],
  auth: seamlessQaAuth,
  authors: ['jonathanestep'],
  actions: [
    ...createAllActions({ auth: seamlessQaAuth, baseUrl: MCP_BASE_URL }),
    createCustomApiCallAction({
      baseUrl: () => 'https://mcp-qa.seamless.ai',
      auth: seamlessQaAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${(auth as { access_token: string }).access_token}`,
      }),
    }),
  ],
  triggers: [],
});
