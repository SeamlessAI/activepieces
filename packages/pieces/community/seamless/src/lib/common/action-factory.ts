import {
  createAction,
  OAuth2PropertyValue,
  PieceAuth,
  Property,
} from '@activepieces/pieces-framework';
import { seamlessCommon } from './index';

type SeamlessAuthType = ReturnType<typeof PieceAuth.OAuth2>;

function makeAction({
  auth,
  baseUrl,
  name,
  displayName,
  description,
  props,
  buildArgs,
}: {
  auth: SeamlessAuthType;
  baseUrl: string;
  name: string;
  displayName: string;
  description: string;
  props: Record<string, unknown>;
  buildArgs: (propsValue: Record<string, unknown>) => Record<string, unknown>;
}) {
  return createAction({
    auth,
    name,
    displayName,
    description,
    props: props as Record<string, never>,
    async run(context) {
      const oauthAuth = context.auth as OAuth2PropertyValue;
      return seamlessCommon.executeMcpTool({
        auth: oauthAuth,
        baseUrl,
        toolName: name,
        args: buildArgs(context.propsValue),
      });
    },
  });
}

const SENIORITY_OPTIONS = [
  { label: 'C-Level', value: 'C-Level' },
  { label: 'VP', value: 'VP' },
  { label: 'Director', value: 'Director' },
  { label: 'Manager', value: 'Manager' },
  { label: 'Senior', value: 'Senior' },
  { label: 'Entry Level', value: 'Entry Level' },
  { label: 'Mid-Level', value: 'Mid-Level' },
  { label: 'Other', value: 'Other' },
];

const DEPARTMENT_OPTIONS = [
  { label: 'Sales', value: 'Sales' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Human Resources', value: 'Human Resources' },
  { label: 'Finance', value: 'Finance' },
  { label: 'IT', value: 'IT' },
  { label: 'Operations', value: 'Operations' },
  { label: 'Support', value: 'Support' },
  { label: 'Legal', value: 'Legal' },
  { label: 'Project Management', value: 'Project Management' },
  { label: 'Other', value: 'Other' },
];

const INDUSTRY_OPTIONS = [
  { label: 'Computer Software', value: 'Computer Software' },
  { label: 'Information Technology and Services', value: 'Information Technology and Services' },
  { label: 'Financial Services', value: 'Financial Services' },
  { label: 'Hospital & Health Care', value: 'Hospital & Health Care' },
  { label: 'Marketing and Advertising', value: 'Marketing and Advertising' },
  { label: 'Real Estate', value: 'Real Estate' },
  { label: 'Construction', value: 'Construction' },
  { label: 'Retail', value: 'Retail' },
  { label: 'Insurance', value: 'Insurance' },
  { label: 'Banking', value: 'Banking' },
];

const COMPANY_SIZE_OPTIONS = [
  { label: '0 - 1 (Self-employed)', value: '0 - 1 (Self-employed)' },
  { label: '2 - 10', value: '2 - 10' },
  { label: '11 - 50', value: '11 - 50' },
  { label: '51 - 200', value: '51 - 200' },
  { label: '201 - 500', value: '201 - 500' },
  { label: '501 - 1,000', value: '501 - 1,000' },
  { label: '1,001 - 5,000', value: '1,001 - 5,000' },
  { label: '5,001 - 10,000', value: '5,001 - 10,000' },
  { label: '10,001+', value: '10,001+' },
];

const REVENUE_OPTIONS = [
  { label: '$0 - $100K', value: '$0 - $100K' },
  { label: '$100K - $1M', value: '$100K - $1M' },
  { label: '$1M - $5M', value: '$1M - $5M' },
  { label: '$5M - $20M', value: '$5M - $20M' },
  { label: '$20M - $50M', value: '$20M - $50M' },
  { label: '$50M - $100M', value: '$50M - $100M' },
  { label: '$100M - $500M', value: '$100M - $500M' },
  { label: '$500M - $1B', value: '$500M - $1B' },
  { label: '$1B+', value: '$1B+' },
];

const CAMPAIGN_STEP_TYPES = [
  { label: 'Auto Email', value: 'auto-email' },
  { label: 'Manual Email', value: 'manual-email' },
  { label: 'Call', value: 'call' },
  { label: 'LinkedIn', value: 'linkedIn' },
  { label: 'LinkedIn Message', value: 'linkedin-message' },
  { label: 'LinkedIn Connect Request', value: 'linkedin-connect-request' },
  { label: 'Custom', value: 'custom' },
];

const TEMPLATE_TYPES = [
  { label: 'Email', value: 'email' },
  { label: 'Call', value: 'call' },
  { label: 'LinkedIn Message', value: 'linkedin-message' },
  { label: 'LinkedIn Connect Request', value: 'linkedin-connect-request' },
  { label: 'Custom', value: 'custom' },
];

function parseJsonProp(value: unknown): unknown {
  if (!value) return undefined;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value as string);
  } catch {
    return undefined;
  }
}

export function createAllActions({ auth, baseUrl }: { auth: SeamlessAuthType; baseUrl: string }) {
  const a = (config: Omit<Parameters<typeof makeAction>[0], 'auth' | 'baseUrl'>) =>
    makeAction({ ...config, auth, baseUrl });

  return [
    // SEARCH
    a({
      name: 'search_contacts',
      displayName: 'Search Contacts',
      description: 'Search the Seamless.AI database for contacts matching filters. Does not consume credits.',
      props: {
        companyName: Property.Array({ displayName: 'Company Names', required: false }),
        companyDomain: Property.Array({ displayName: 'Company Domains', required: false }),
        jobTitle: Property.Array({ displayName: 'Job Titles', required: false }),
        seniority: Property.StaticMultiSelectDropdown({ displayName: 'Seniority', required: false, options: { options: SENIORITY_OPTIONS } }),
        department: Property.StaticMultiSelectDropdown({ displayName: 'Department', required: false, options: { options: DEPARTMENT_OPTIONS } }),
        industry: Property.StaticMultiSelectDropdown({ displayName: 'Industry', required: false, options: { options: INDUSTRY_OPTIONS } }),
        contactState: Property.Array({ displayName: 'State', description: 'e.g. Texas, California', required: false }),
        contactCountry: Property.Array({ displayName: 'Country', description: 'e.g. United States', required: false }),
        companySize: Property.StaticMultiSelectDropdown({ displayName: 'Company Size', required: false, options: { options: COMPANY_SIZE_OPTIONS } }),
        companyRevenue: Property.StaticMultiSelectDropdown({ displayName: 'Company Revenue', required: false, options: { options: REVENUE_OPTIONS } }),
        fullname: Property.Array({ displayName: 'Contact Names', required: false }),
        technologies: Property.Array({ displayName: 'Technologies', required: false }),
        limit: Property.Number({ displayName: 'Limit', required: false, defaultValue: 50 }),
        nextToken: Property.ShortText({ displayName: 'Next Token', required: false }),
      },
      buildArgs: (p) => p,
    }),
    a({
      name: 'search_companies',
      displayName: 'Search Companies',
      description: 'Search the Seamless.AI database for companies matching filters. Does not consume credits.',
      props: {
        companyName: Property.Array({ displayName: 'Company Names', required: false }),
        companyDomain: Property.Array({ displayName: 'Company Domains', required: false }),
        industry: Property.StaticMultiSelectDropdown({ displayName: 'Industry', required: false, options: { options: INDUSTRY_OPTIONS } }),
        companyState: Property.Array({ displayName: 'State', required: false }),
        companyCountry: Property.Array({ displayName: 'Country', required: false }),
        companySize: Property.StaticMultiSelectDropdown({ displayName: 'Company Size', required: false, options: { options: COMPANY_SIZE_OPTIONS } }),
        companyRevenue: Property.StaticMultiSelectDropdown({ displayName: 'Company Revenue', required: false, options: { options: REVENUE_OPTIONS } }),
        technologies: Property.Array({ displayName: 'Technologies', required: false }),
        companyKeyword: Property.Array({ displayName: 'Keywords', required: false }),
        limit: Property.Number({ displayName: 'Limit', required: false, defaultValue: 50 }),
        nextToken: Property.ShortText({ displayName: 'Next Token', required: false }),
      },
      buildArgs: (p) => p,
    }),
    // RESEARCH
    a({
      name: 'research_contacts',
      displayName: 'Research Contacts',
      description: 'Enrich contacts to get verified emails, phone numbers. Consumes credits.',
      props: {
        searchResultIds: Property.Array({ displayName: 'Search Result IDs', required: false }),
        contacts: Property.Json({ displayName: 'Contacts', description: 'JSON array of contacts to enrich', required: false }),
        waitForResults: Property.Checkbox({ displayName: 'Wait for Results', required: false, defaultValue: true }),
      },
      buildArgs: (p) => ({ searchResultIds: p['searchResultIds'], contacts: parseJsonProp(p['contacts']), waitForResults: p['waitForResults'] }),
    }),
    a({
      name: 'research_companies',
      displayName: 'Research Companies',
      description: 'Enrich companies to get verified details. Consumes credits.',
      props: {
        searchResultIds: Property.Array({ displayName: 'Search Result IDs', required: false }),
        companies: Property.Json({ displayName: 'Companies', description: 'JSON array of companies to research', required: false }),
        waitForResults: Property.Checkbox({ displayName: 'Wait for Results', required: false, defaultValue: true }),
      },
      buildArgs: (p) => ({ searchResultIds: p['searchResultIds'], companies: parseJsonProp(p['companies']), waitForResults: p['waitForResults'] }),
    }),
    a({
      name: 'poll_contact_research',
      displayName: 'Poll Contact Research',
      description: 'Check status of a contact research request.',
      props: { requestIds: Property.Array({ displayName: 'Request IDs', required: true }) },
      buildArgs: (p) => ({ requestIds: p['requestIds'] }),
    }),
    a({
      name: 'poll_company_research',
      displayName: 'Poll Company Research',
      description: 'Check status of a company research request.',
      props: { requestIds: Property.Array({ displayName: 'Request IDs', required: true }) },
      buildArgs: (p) => ({ requestIds: p['requestIds'] }),
    }),
    // USER
    a({
      name: 'get_credits',
      displayName: 'Get Credits',
      description: 'Get current credit balance and usage.',
      props: {},
      buildArgs: () => ({}),
    }),
    a({
      name: 'get_my_contacts',
      displayName: 'Get My Contacts',
      description: 'Retrieve previously saved/researched contacts (max 30-day range).',
      props: {
        startDate: Property.DateTime({ displayName: 'Start Date', required: false }),
        endDate: Property.DateTime({ displayName: 'End Date', required: false }),
        page: Property.Number({ displayName: 'Page', required: false, defaultValue: 1 }),
        limit: Property.Number({ displayName: 'Limit', required: false, defaultValue: 500 }),
      },
      buildArgs: (p) => p,
    }),
    a({
      name: 'get_my_companies',
      displayName: 'Get My Companies',
      description: 'Retrieve previously saved/researched companies (max 30-day range).',
      props: {
        startDate: Property.DateTime({ displayName: 'Start Date', required: false }),
        endDate: Property.DateTime({ displayName: 'End Date', required: false }),
        page: Property.Number({ displayName: 'Page', required: false, defaultValue: 1 }),
        limit: Property.Number({ displayName: 'Limit', required: false, defaultValue: 500 }),
      },
      buildArgs: (p) => p,
    }),
    // LISTS
    a({ name: 'get_lists', displayName: 'Get Lists', description: 'List all contact lists or get one by ID.', props: { listId: Property.ShortText({ displayName: 'List ID', required: false }) }, buildArgs: (p) => ({ listId: p['listId'] }) }),
    a({ name: 'create_list', displayName: 'Create List', description: 'Create a new contact list.', props: { name: Property.ShortText({ displayName: 'Name', required: true }) }, buildArgs: (p) => ({ name: p['name'] }) }),
    a({ name: 'update_list', displayName: 'Update List', description: 'Rename a contact list.', props: { id: Property.ShortText({ displayName: 'List ID', required: true }), name: Property.ShortText({ displayName: 'New Name', required: true }) }, buildArgs: (p) => ({ id: p['id'], name: p['name'] }) }),
    a({ name: 'delete_list', displayName: 'Delete List', description: 'Delete a contact list.', props: { id: Property.ShortText({ displayName: 'List ID', required: true }) }, buildArgs: (p) => ({ id: p['id'] }) }),
    // SAVED SEARCHES
    a({ name: 'list_saved_searches', displayName: 'List Saved Searches', description: 'List saved searches or get one by ID.', props: { id: Property.ShortText({ displayName: 'Saved Search ID', required: false }), type: Property.StaticDropdown({ displayName: 'Type', required: false, options: { options: [{ label: 'Contacts', value: 'contacts' }, { label: 'Companies', value: 'companies' }] } }) }, buildArgs: (p) => ({ id: p['id'], type: p['type'] }) }),
    a({ name: 'create_saved_search', displayName: 'Create Saved Search', description: 'Save search filters for reuse.', props: { name: Property.ShortText({ displayName: 'Name', required: true }), type: Property.StaticDropdown({ displayName: 'Type', required: true, options: { options: [{ label: 'Contacts', value: 'contacts' }, { label: 'Companies', value: 'companies' }] } }), values: Property.Json({ displayName: 'Filter Values', required: true }) }, buildArgs: (p) => ({ name: p['name'], type: p['type'], values: parseJsonProp(p['values']) }) }),
    a({ name: 'update_saved_search', displayName: 'Update Saved Search', description: 'Update a saved search.', props: { id: Property.ShortText({ displayName: 'ID', required: true }), name: Property.ShortText({ displayName: 'Name', required: false }), values: Property.Json({ displayName: 'Filter Values', required: false }) }, buildArgs: (p) => ({ id: p['id'], name: p['name'], values: parseJsonProp(p['values']) }) }),
    a({ name: 'delete_saved_search', displayName: 'Delete Saved Search', description: 'Delete a saved search.', props: { id: Property.ShortText({ displayName: 'ID', required: true }) }, buildArgs: (p) => ({ id: p['id'] }) }),
    // CAMPAIGNS
    a({ name: 'list_campaigns', displayName: 'List Campaigns', description: 'List campaigns or get one by ID.', props: { campaignId: Property.ShortText({ displayName: 'Campaign ID', required: false }), searchText: Property.ShortText({ displayName: 'Search', required: false }), limit: Property.Number({ displayName: 'Limit', required: false, defaultValue: 10 }) }, buildArgs: (p) => p }),
    a({ name: 'create_campaign', displayName: 'Create Campaign', description: 'Create a new campaign.', props: { name: Property.ShortText({ displayName: 'Name', required: true }), emailAccountIds: Property.Array({ displayName: 'Email Account IDs', required: false }) }, buildArgs: (p) => p }),
    a({ name: 'update_campaign', displayName: 'Update Campaign', description: 'Update a campaign.', props: { campaignId: Property.ShortText({ displayName: 'Campaign ID', required: false }), campaignIdentifier: Property.ShortText({ displayName: 'Campaign Identifier', required: false }), name: Property.ShortText({ displayName: 'Name', required: false }), isPublic: Property.Checkbox({ displayName: 'Public', required: false }), emailAccountIds: Property.Array({ displayName: 'Email Account IDs', required: false }) }, buildArgs: (p) => p }),
    a({ name: 'delete_campaign', displayName: 'Delete Campaign', description: 'Delete a campaign permanently.', props: { campaignId: Property.ShortText({ displayName: 'Campaign ID', required: false }), campaignIdentifier: Property.ShortText({ displayName: 'Campaign Identifier', required: false }) }, buildArgs: (p) => p }),
    a({ name: 'clone_campaign', displayName: 'Clone Campaign', description: 'Clone a campaign with a new name.', props: { campaignId: Property.ShortText({ displayName: 'Campaign ID', required: false }), campaignIdentifier: Property.ShortText({ displayName: 'Campaign Identifier', required: false }), name: Property.ShortText({ displayName: 'New Name', required: true }) }, buildArgs: (p) => p }),
    a({ name: 'add_contacts_to_campaign', displayName: 'Add Contacts to Campaign', description: 'Add saved contacts to a campaign.', props: { campaignId: Property.ShortText({ displayName: 'Campaign ID', required: false }), campaignIdentifier: Property.ShortText({ displayName: 'Campaign Identifier', required: false }), contactIds: Property.Array({ displayName: 'Contact IDs', required: true }) }, buildArgs: (p) => p }),
    a({ name: 'remove_contacts_from_campaign', displayName: 'Remove Contacts from Campaign', description: 'Remove contacts from a campaign.', props: { campaignId: Property.ShortText({ displayName: 'Campaign ID', required: false }), campaignIdentifier: Property.ShortText({ displayName: 'Campaign Identifier', required: false }), contactIds: Property.Array({ displayName: 'Contact IDs', required: true }) }, buildArgs: (p) => p }),
    a({ name: 'list_campaign_contacts', displayName: 'List Campaign Contacts', description: 'List contacts in a campaign.', props: { campaignId: Property.ShortText({ displayName: 'Campaign ID', required: false }), campaignIdentifier: Property.ShortText({ displayName: 'Campaign Identifier', required: false }), limit: Property.Number({ displayName: 'Limit', required: false, defaultValue: 25 }), offset: Property.Number({ displayName: 'Offset', required: false }), searchText: Property.ShortText({ displayName: 'Search', required: false }) }, buildArgs: (p) => p }),
    a({ name: 'list_campaign_steps', displayName: 'List Campaign Steps', description: 'List steps in a campaign.', props: { campaignId: Property.ShortText({ displayName: 'Campaign ID', required: false }), campaignIdentifier: Property.ShortText({ displayName: 'Campaign Identifier', required: false }) }, buildArgs: (p) => p }),
    a({
      name: 'create_campaign_step', displayName: 'Create Campaign Step', description: 'Add a step to a campaign.',
      props: { campaignId: Property.ShortText({ displayName: 'Campaign ID', required: false }), campaignIdentifier: Property.ShortText({ displayName: 'Campaign Identifier', required: false }), type: Property.StaticDropdown({ displayName: 'Step Type', required: true, options: { options: CAMPAIGN_STEP_TYPES } }), name: Property.ShortText({ displayName: 'Name', required: true }), dueDay: Property.Number({ displayName: 'Due Day', required: true }), description: Property.LongText({ displayName: 'Description', required: false }), templateId: Property.ShortText({ displayName: 'Template ID', required: false }), subject: Property.ShortText({ displayName: 'Subject', required: false }), body: Property.LongText({ displayName: 'Body', required: false }) },
      buildArgs: (p) => {
        const templateData = (p['subject'] || p['body']) ? { subject: p['subject'], template: p['body'] } : undefined;
        return { campaignId: p['campaignId'], campaignIdentifier: p['campaignIdentifier'], type: p['type'], name: p['name'], dueDay: p['dueDay'], description: p['description'], templateId: p['templateId'], templateData };
      },
    }),
    a({
      name: 'update_campaign_step', displayName: 'Update Campaign Step', description: 'Update a campaign step.',
      props: { campaignStepId: Property.ShortText({ displayName: 'Step ID', required: true }), name: Property.ShortText({ displayName: 'Name', required: false }), dueDay: Property.Number({ displayName: 'Due Day', required: true }), description: Property.LongText({ displayName: 'Description', required: false }), templateId: Property.ShortText({ displayName: 'Template ID', required: false }), subject: Property.ShortText({ displayName: 'Subject', required: false }), body: Property.LongText({ displayName: 'Body', required: false }) },
      buildArgs: (p) => {
        const templateData = (p['subject'] || p['body']) ? { subject: p['subject'], template: p['body'] } : undefined;
        return { campaignStepId: p['campaignStepId'], name: p['name'], dueDay: p['dueDay'], description: p['description'], templateId: p['templateId'], templateData };
      },
    }),
    a({ name: 'delete_campaign_step', displayName: 'Delete Campaign Step', description: 'Delete a campaign step.', props: { campaignStepId: Property.ShortText({ displayName: 'Step ID', required: true }), campaignId: Property.ShortText({ displayName: 'Campaign ID', required: false }), campaignIdentifier: Property.ShortText({ displayName: 'Campaign Identifier', required: false }) }, buildArgs: (p) => p }),
    a({ name: 'execute_campaign_action', displayName: 'Execute Campaign Action', description: 'Start, pause, resume, or complete a campaign.', props: { campaignId: Property.ShortText({ displayName: 'Campaign ID', required: false }), campaignIdentifier: Property.ShortText({ displayName: 'Campaign Identifier', required: false }), action: Property.StaticDropdown({ displayName: 'Action', required: true, options: { options: [{ label: 'Start', value: 'START' }, { label: 'Pause', value: 'PAUSE' }, { label: 'Resume', value: 'RESUME' }, { label: 'Complete', value: 'COMPLETE' }, { label: 'Archive', value: 'ARCHIVE' }, { label: 'Unarchive', value: 'UNARCHIVE' }, { label: 'Delete', value: 'DELETE' }] } }) }, buildArgs: (p) => p }),
    a({ name: 'execute_campaign_step_action', displayName: 'Execute Campaign Step Action', description: 'Pause, resume, or skip a step.', props: { campaignStepId: Property.ShortText({ displayName: 'Step ID', required: true }), action: Property.StaticDropdown({ displayName: 'Action', required: true, options: { options: [{ label: 'Pause', value: 'PAUSE' }, { label: 'Resume', value: 'RESUME' }, { label: 'Skip', value: 'SKIP' }] } }) }, buildArgs: (p) => p }),
    a({ name: 'get_campaign_metrics', displayName: 'Get Campaign Metrics', description: 'Get engagement metrics for a campaign.', props: { campaignId: Property.ShortText({ displayName: 'Campaign ID', required: false }), campaignIdentifier: Property.ShortText({ displayName: 'Campaign Identifier', required: false }) }, buildArgs: (p) => p }),
    // TEMPLATES
    a({ name: 'list_templates', displayName: 'List Templates', description: 'List templates or get one by ID.', props: { templateId: Property.ShortText({ displayName: 'Template ID', required: false }), searchText: Property.ShortText({ displayName: 'Search', required: false }), type: Property.StaticDropdown({ displayName: 'Type', required: false, options: { options: TEMPLATE_TYPES } }), limit: Property.Number({ displayName: 'Limit', required: false, defaultValue: 15 }), page: Property.Number({ displayName: 'Page', required: false, defaultValue: 1 }) }, buildArgs: (p) => p }),
    a({ name: 'create_template', displayName: 'Create Template', description: 'Create a new template.', props: { name: Property.ShortText({ displayName: 'Name', required: true }), type: Property.StaticDropdown({ displayName: 'Type', required: false, defaultValue: 'email', options: { options: TEMPLATE_TYPES } }), subject: Property.ShortText({ displayName: 'Subject', required: false }), body: Property.LongText({ displayName: 'Body', required: false }) }, buildArgs: (p) => p }),
    a({ name: 'update_template', displayName: 'Update Template', description: 'Update a template.', props: { templateId: Property.ShortText({ displayName: 'Template ID', required: true }), type: Property.StaticDropdown({ displayName: 'Type', required: true, options: { options: TEMPLATE_TYPES } }), name: Property.ShortText({ displayName: 'Name', required: false }), subject: Property.ShortText({ displayName: 'Subject', required: false }), body: Property.LongText({ displayName: 'Body', required: false }) }, buildArgs: (p) => p }),
    a({ name: 'delete_template', displayName: 'Delete Template', description: 'Delete a template.', props: { templateId: Property.ShortText({ displayName: 'Template ID', required: true }), type: Property.StaticDropdown({ displayName: 'Type', required: false, defaultValue: 'email', options: { options: TEMPLATE_TYPES } }) }, buildArgs: (p) => p }),
    // EMAIL ACCOUNTS
    a({ name: 'list_email_accounts', displayName: 'List Email Accounts', description: 'List connected email accounts.', props: { searchText: Property.ShortText({ displayName: 'Search', required: false }), limit: Property.Number({ displayName: 'Limit', required: false, defaultValue: 25 }), page: Property.Number({ displayName: 'Page', required: false, defaultValue: 1 }) }, buildArgs: (p) => p }),
    // EMAIL
    a({ name: 'create_email_draft', displayName: 'Create Email Draft', description: 'Create an email draft (not sent until you use Send Email Draft).', props: { contactId: Property.ShortText({ displayName: 'Contact ID', required: true }), from: Property.ShortText({ displayName: 'From', description: 'Sender email from a connected account', required: true }), to: Property.ShortText({ displayName: 'To', required: true }), subject: Property.ShortText({ displayName: 'Subject', required: false }), body: Property.LongText({ displayName: 'Body', required: false }), cc: Property.ShortText({ displayName: 'CC', required: false }), bcc: Property.ShortText({ displayName: 'BCC', required: false }), templateId: Property.ShortText({ displayName: 'Template ID', required: false }) }, buildArgs: (p) => p }),
    a({ name: 'get_email_draft', displayName: 'Get Email Draft', description: 'Retrieve an email draft by ID.', props: { emailId: Property.ShortText({ displayName: 'Email Draft ID', required: true }) }, buildArgs: (p) => p }),
    a({ name: 'update_email_draft', displayName: 'Update Email Draft', description: 'Update an email draft.', props: { emailId: Property.ShortText({ displayName: 'Email Draft ID', required: true }), subject: Property.ShortText({ displayName: 'Subject', required: false }), body: Property.LongText({ displayName: 'Body', required: false }), to: Property.ShortText({ displayName: 'To', required: false }), cc: Property.ShortText({ displayName: 'CC', required: false }), bcc: Property.ShortText({ displayName: 'BCC', required: false }) }, buildArgs: (p) => p }),
    a({ name: 'send_email_draft', displayName: 'Send Email Draft', description: 'Send a previously created email draft.', props: { emailId: Property.ShortText({ displayName: 'Email Draft ID', required: true }), from: Property.ShortText({ displayName: 'From', required: false }) }, buildArgs: (p) => p }),
    a({ name: 'send_email', displayName: 'Send Email', description: 'Send an email directly to a contact.', props: { contactId: Property.ShortText({ displayName: 'Contact ID', required: true }), from: Property.ShortText({ displayName: 'From', required: true }), to: Property.ShortText({ displayName: 'To', required: true }), subject: Property.ShortText({ displayName: 'Subject', required: false }), body: Property.LongText({ displayName: 'Body', required: false }), cc: Property.ShortText({ displayName: 'CC', required: false }), bcc: Property.ShortText({ displayName: 'BCC', required: false }), templateId: Property.ShortText({ displayName: 'Template ID', required: false }) }, buildArgs: (p) => p }),
    a({ name: 'send_bulk_email', displayName: 'Send Bulk Email', description: 'Send emails to multiple contacts matching filters.', props: { from: Property.ShortText({ displayName: 'From', required: true }), subject: Property.ShortText({ displayName: 'Subject', required: false }), body: Property.LongText({ displayName: 'Body', required: false }), templateId: Property.ShortText({ displayName: 'Template ID', required: false }), filters: Property.Json({ displayName: 'Filters', description: 'JSON filter criteria: contactIds, lists, queryText, etc.', required: false }) }, buildArgs: (p) => ({ from: p['from'], subject: p['subject'], body: p['body'], templateId: p['templateId'], filters: parseJsonProp(p['filters']) }) }),
    // CALLS
    a({ name: 'log_call', displayName: 'Log Call', description: 'Log a call outcome for a contact.', props: { contactId: Property.ShortText({ displayName: 'Contact ID', required: true }), toNumber: Property.ShortText({ displayName: 'To Number', required: false }), fromNumber: Property.ShortText({ displayName: 'From Number', required: false }), callDispositionId: Property.ShortText({ displayName: 'Disposition ID', required: false }), callSentimentId: Property.ShortText({ displayName: 'Sentiment ID', required: false }), callScript: Property.LongText({ displayName: 'Notes', required: false }), durationMs: Property.Number({ displayName: 'Duration (ms)', required: false }) }, buildArgs: (p) => p }),
    a({ name: 'list_call_dispositions', displayName: 'List Call Dispositions', description: 'List available call disposition options.', props: {}, buildArgs: () => ({}) }),
    a({ name: 'list_call_sentiments', displayName: 'List Call Sentiments', description: 'List available call sentiment options.', props: {}, buildArgs: () => ({}) }),
    // TASKS
    a({ name: 'list_tasks', displayName: 'List Tasks', description: 'List tasks or get one by ID.', props: { taskId: Property.ShortText({ displayName: 'Task ID', required: false }), campaignId: Property.ShortText({ displayName: 'Campaign ID', required: false }), status: Property.StaticDropdown({ displayName: 'Status', required: false, options: { options: [{ label: 'Scheduled', value: 'scheduled' }, { label: 'In Progress', value: 'in-progress' }, { label: 'Completed', value: 'completed' }, { label: 'Paused', value: 'paused' }, { label: 'Errored', value: 'errored' }, { label: 'Cancelled', value: 'cancelled' }, { label: 'Skipped', value: 'skipped' }] } }), limit: Property.Number({ displayName: 'Limit', required: false, defaultValue: 25 }), offset: Property.Number({ displayName: 'Offset', required: false }) }, buildArgs: (p) => p }),
    a({ name: 'create_task', displayName: 'Create Task', description: 'Create a standalone task.', props: { name: Property.ShortText({ displayName: 'Name', required: true }), taskType: Property.StaticDropdown({ displayName: 'Type', required: true, options: { options: [{ label: 'Manual Email', value: 'manual-email' }, { label: 'Call', value: 'call' }, { label: 'Action Item', value: 'action-item' }, { label: 'LinkedIn', value: 'linkedin' }] } }), contactId: Property.ShortText({ displayName: 'Contact ID', required: false }), dueAt: Property.DateTime({ displayName: 'Due Date', required: false }), description: Property.LongText({ displayName: 'Description', required: false }), priority: Property.StaticDropdown({ displayName: 'Priority', required: false, defaultValue: '0', options: { options: [{ label: 'Normal', value: '0' }, { label: 'High', value: '1' }, { label: 'Urgent', value: '2' }] } }), templateId: Property.ShortText({ displayName: 'Template ID', required: false }) }, buildArgs: (p) => ({ ...p, priority: p['priority'] ? Number(p['priority']) : undefined }) }),
    a({ name: 'update_task', displayName: 'Update Task', description: 'Update a task.', props: { taskId: Property.ShortText({ displayName: 'Task ID', required: true }), name: Property.ShortText({ displayName: 'Name', required: false }), dueAt: Property.DateTime({ displayName: 'Due Date', required: false }), description: Property.LongText({ displayName: 'Description', required: false }), priority: Property.StaticDropdown({ displayName: 'Priority', required: false, options: { options: [{ label: 'Normal', value: '0' }, { label: 'High', value: '1' }, { label: 'Urgent', value: '2' }] } }) }, buildArgs: (p) => ({ ...p, priority: p['priority'] ? Number(p['priority']) : undefined }) }),
    a({ name: 'delete_task', displayName: 'Delete Task', description: 'Delete a task.', props: { taskId: Property.ShortText({ displayName: 'Task ID', required: true }) }, buildArgs: (p) => p }),
    a({ name: 'execute_task_action', displayName: 'Execute Task Action', description: 'Execute an action on a task.', props: { taskId: Property.ShortText({ displayName: 'Task ID', required: true }), action: Property.StaticDropdown({ displayName: 'Action', required: true, options: { options: [{ label: 'Pause', value: 'pause' }, { label: 'Reschedule', value: 'reschedule' }, { label: 'Unpause', value: 'unpause' }, { label: 'Cancel', value: 'cancel' }, { label: 'Start', value: 'start' }, { label: 'Delete', value: 'delete' }, { label: 'Skip', value: 'skip' }, { label: 'Complete', value: 'complete' }, { label: 'Schedule', value: 'schedule' }] } }) }, buildArgs: (p) => p }),
    // ACTIVITY
    a({ name: 'get_activity_feed', displayName: 'Get Activity Feed', description: 'Get engagement activity feed.', props: { contactId: Property.ShortText({ displayName: 'Contact ID', required: false }), campaignIdentifier: Property.ShortText({ displayName: 'Campaign Identifier', required: false }), searchText: Property.ShortText({ displayName: 'Search', required: false }), limit: Property.Number({ displayName: 'Limit', required: false, defaultValue: 25 }), offset: Property.Number({ displayName: 'Offset', required: false }) }, buildArgs: (p) => p }),
    // CONFIG
    a({ name: 'list_email_footers', displayName: 'List Email Footers', description: 'List email footers.', props: { limit: Property.Number({ displayName: 'Limit', required: false, defaultValue: 25 }), page: Property.Number({ displayName: 'Page', required: false, defaultValue: 1 }) }, buildArgs: (p) => p }),
    a({ name: 'send_email_preview', displayName: 'Send Email Preview', description: 'Send a preview email to yourself.', props: { to: Property.ShortText({ displayName: 'To', description: 'Your email to receive the preview', required: true }), subject: Property.ShortText({ displayName: 'Subject', required: true }), body: Property.LongText({ displayName: 'Body', required: true }), templateId: Property.ShortText({ displayName: 'Template ID', required: false }), from: Property.ShortText({ displayName: 'From', required: false }) }, buildArgs: (p) => p }),
  ];
}
