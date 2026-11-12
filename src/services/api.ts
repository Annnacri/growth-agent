import {
  BusinessProfile,
  CampaignObjective,
  CampaignReport,
  ChannelIntegration,
  ContentItem,
  ExecutionLog,
  GrowthPlaybook,
  MarketIntelligenceItem,
  MarketingCampaign,
  SocialPlatform,
  StrategyBrief,
  CeoTask,
  CeoTaskResult,
} from '../types/marketing.js';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  // CEO Orchestrator Contract & Tasks
  async getCeoContract() {
    const res = await fetch('/api/ceo/contract');
    return res.json();
  },

  async getCeoTasks(): Promise<{ success: boolean; tasks: CeoTask[] }> {
    const res = await fetch('/api/ceo/tasks');
    return res.json();
  },

  async delegateCeoTask(taskPayload: Partial<CeoTask>): Promise<CeoTaskResult> {
    const res = await fetch('/api/ceo/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskPayload),
    });
    return res.json();
  },

  // Profiles
  async getProfiles(): Promise<{ success: boolean; profiles: BusinessProfile[] }> {
    const res = await fetch('/api/marketing/profiles');
    return res.json();
  },

  async saveProfile(profile: Partial<BusinessProfile>): Promise<{ success: boolean; profile: BusinessProfile }> {
    const method = profile.id && !profile.id.startsWith('new-') ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `/api/marketing/profiles/${profile.id}` : '/api/marketing/profiles';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return res.json();
  },

  async deleteProfile(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/marketing/profiles/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Campaigns
  async getCampaigns(profileId?: string): Promise<{ success: boolean; campaigns: MarketingCampaign[] }> {
    const url = profileId ? `/api/marketing/campaigns?profileId=${profileId}` : '/api/marketing/campaigns';
    const res = await fetch(url);
    return res.json();
  },

  async getCampaignById(id: string): Promise<{ success: boolean; campaign: MarketingCampaign; contentItems: ContentItem[] }> {
    const res = await fetch(`/api/marketing/campaigns/${id}`);
    return res.json();
  },

  async createCampaign(params: {
    businessProfileId: string;
    name: string;
    objective: CampaignObjective;
    durationWeeks: number;
    channels: SocialPlatform[];
    customInstructions?: string;
  }): Promise<{ success: boolean; campaign: MarketingCampaign; contentItems: ContentItem[] }> {
    const res = await fetch('/api/marketing/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // Strategy
  async generateStrategy(params: {
    businessProfileId: string;
    objective: CampaignObjective;
    timeframeWeeks: number;
    targetMarkets?: string[];
  }): Promise<{ success: boolean; strategy: StrategyBrief }> {
    const res = await fetch('/api/marketing/strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // Content
  async generateContent(params: {
    businessProfileId: string;
    platform: SocialPlatform;
    contentType: ContentItem['contentType'];
    topicOrBrief: string;
    language?: string;
    campaignId?: string;
  }): Promise<{ success: boolean; item: ContentItem }> {
    const res = await fetch('/api/marketing/content/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // Calendar
  async getCalendarItems(filters?: { campaignId?: string; profileId?: string; status?: string }): Promise<{ success: boolean; items: ContentItem[] }> {
    const params = new URLSearchParams();
    if (filters?.campaignId) params.append('campaignId', filters.campaignId);
    if (filters?.profileId) params.append('profileId', filters.profileId);
    if (filters?.status) params.append('status', filters.status);
    const res = await fetch(`/api/marketing/calendar?${params.toString()}`);
    return res.json();
  },

  async saveCalendarItem(item: Partial<ContentItem>): Promise<{ success: boolean; item: ContentItem }> {
    const res = await fetch('/api/marketing/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },

  // Approvals
  async approveContent(params: {
    contentId: string;
    action: 'approve' | 'reject' | 'schedule';
    notes?: string;
    rejectionReason?: string;
    scheduledFor?: string;
  }): Promise<{ success: boolean; item: ContentItem }> {
    const res = await fetch('/api/marketing/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // Publishing
  async publishContent(contentId: string, allowSandboxTest = false) {
    const res = await fetch('/api/marketing/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentId, allowSandboxTest }),
    });
    return res.json();
  },

  async getExportKit(contentId: string) {
    const res = await fetch(`/api/marketing/export/${contentId}`);
    return res.json();
  },

  // Performance & Reports
  async getReports(): Promise<{ success: boolean; reports: CampaignReport[]; latestReport: CampaignReport | null }> {
    const res = await fetch('/api/marketing/report');
    return res.json();
  },

  async runPerformanceAnalysis(campaignId: string, metrics?: Record<string, any>): Promise<{ success: boolean; report: CampaignReport }> {
    const res = await fetch('/api/marketing/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId, metrics }),
    });
    return res.json();
  },

  // Market Intelligence
  async getIntelligence(): Promise<{ success: boolean; intelligence: MarketIntelligenceItem[] }> {
    const res = await fetch('/api/marketing/intelligence');
    return res.json();
  },

  async addIntelligenceItem(item: Partial<MarketIntelligenceItem>): Promise<{ success: boolean; item: MarketIntelligenceItem }> {
    const res = await fetch('/api/marketing/intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },

  // Growth Playbooks
  async getGrowthPlaybooks(): Promise<{ success: boolean; playbooks: GrowthPlaybook[] }> {
    const res = await fetch('/api/marketing/growth-playbooks');
    return res.json();
  },

  // Integrations
  async getIntegrations(): Promise<{ success: boolean; integrations: ChannelIntegration[] }> {
    const res = await fetch('/api/marketing/integrations');
    return res.json();
  },

  async updateIntegration(platform: string, data: Partial<ChannelIntegration>): Promise<{ success: boolean; integration: ChannelIntegration }> {
    const res = await fetch(`/api/marketing/integrations/${platform}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Schedules
  async getSchedules() {
    const res = await fetch('/api/marketing/schedules');
    return res.json();
  },

  async triggerSchedule(id: string) {
    const res = await fetch(`/api/marketing/schedules/${id}/run`, { method: 'POST' });
    return res.json();
  },

  // Logs
  async getLogs(): Promise<{ success: boolean; logs: ExecutionLog[] }> {
    const res = await fetch('/api/marketing/logs');
    return res.json();
  },
};
