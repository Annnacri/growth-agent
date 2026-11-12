export type SocialPlatform =
  | 'instagram'
  | 'linkedin'
  | 'twitter'
  | 'tiktok'
  | 'facebook'
  | 'pinterest'
  | 'youtube';

export type CampaignStatus = 'draft' | 'active' | 'scheduled' | 'completed' | 'paused';

export type ContentStatus = 'draft' | 'pending_approval' | 'approved' | 'scheduled' | 'published' | 'rejected';

export type CampaignObjective =
  | 'customer_acquisition'
  | 'product_launch'
  | 'brand_awareness'
  | 'lead_generation'
  | 'customer_retention'
  | 'community_growth';

export type ReasoningMode =
  | 'marketing_strategist'
  | 'social_copywriter'
  | 'campaign_planner'
  | 'audience_researcher'
  | 'growth_hacker'
  | 'marketing_analyst'
  | 'brand_voice_specialist';

export type SupportedLanguage = 'en' | 'pt' | 'es' | 'fr' | 'de' | 'it' | 'custom';

export interface BusinessProfile {
  id: string;
  name: string;
  website: string;
  industry: string;
  productsAndServices: string;
  targetMarkets: string[];
  targetAudience: string;
  brandPositioning: string;
  brandVoice: string;
  toneKeywords: string[];
  preferredLanguages: string[];
  socialAccounts: {
    [key in SocialPlatform]?: {
      handle: string;
      connected: boolean;
      followers?: number;
    };
  };
  marketingObjectives: string[];
  competitors: string[];
  brandGuidelines: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostAsset {
  id: string;
  type: 'image_prompt' | 'image_url' | 'video_script' | 'carousel_slides' | 'infographic_brief';
  content: string;
  suggestedDimensions?: string;
}

export interface ContentItem {
  id: string;
  campaignId?: string;
  businessProfileId: string;
  platform: SocialPlatform;
  title: string;
  content: string;
  hook?: string;
  hashtags: string[];
  callToAction: string;
  contentType: 'post' | 'carousel' | 'video_script' | 'thread' | 'story' | 'article';
  assets?: PostAsset[];
  carouselSlides?: string[];
  videoScript?: {
    hook: string;
    body: string;
    cta: string;
    visualDirection: string;
    estimatedSeconds: number;
  };
  scheduledFor?: string; // ISO date-time
  publishedAt?: string;
  status: ContentStatus;
  approvalNotes?: string;
  rejectionReason?: string;
  language: string;
  metrics?: {
    impressions?: number;
    engagements?: number;
    clicks?: number;
    conversions?: number;
    estimatedReach?: number;
  };
  publishingLog?: {
    attemptedAt?: string;
    success?: boolean;
    error?: string;
    externalId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MarketingCampaign {
  id: string;
  businessProfileId: string;
  name: string;
  objective: CampaignObjective;
  targetAudience: string;
  customerPersona: {
    name: string;
    role: string;
    painPoints: string[];
    buyingMotivations: string[];
    preferredChannels: SocialPlatform[];
  };
  coreMessage: string;
  positioning: string;
  durationWeeks: number;
  startDate: string;
  endDate: string;
  budgetRecommendations: {
    totalBudgetUsd?: number;
    paidAdsUsd?: number;
    contentProductionUsd?: number;
    influencerUsd?: number;
    recommendedDailyUsd?: number;
  };
  expectedKPIs: {
    targetImpressions: number;
    targetClicks: number;
    targetLeads: number;
    targetConversions: number;
    estimatedCAC?: number;
  };
  conversionStrategy: string;
  expectedOutcomes: string[];
  assumptions: string[];
  status: CampaignStatus;
  channels: SocialPlatform[];
  contentItemIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StrategyBrief {
  id: string;
  businessProfileId: string;
  title: string;
  executiveSummary: string;
  marketAnalysis: {
    tamSamSomNotes: string;
    competitorPositioning: string;
    swotOverview: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
  };
  targetPersonas: Array<{
    title: string;
    demographics: string;
    corePains: string[];
    valuePropHook: string;
  }>;
  channelPlaybook: Array<{
    platform: SocialPlatform;
    cadence: string;
    contentPillars: string[];
    rationale: string;
  }>;
  budgetAllocation: {
    tier: 'bootstrapped' | 'growth' | 'scale';
    organicSplit: number;
    paidSplit: number;
    influencerSplit: number;
  };
  kpiMilestones: Array<{
    timeline: string;
    metric: string;
    target: string;
  }>;
  createdAt: string;
}

export interface MarketIntelligenceItem {
  id: string;
  type: 'trend' | 'competitor' | 'keyword' | 'seasonal' | 'audience_shift';
  title: string;
  description: string;
  impactScore: 'high' | 'medium' | 'low';
  isHypothesis: boolean; // clearly distinguish verified info from AI hypothesis
  sourceOrRationale: string;
  recommendedAction: string;
  relevantChannels: SocialPlatform[];
  createdAt: string;
}

export interface GrowthPlaybook {
  id: string;
  category: 'organic_loop' | 'paid_ads' | 'influencer_partner' | 'seo_cluster' | 'lead_magnet' | 'product_hunt_launch' | 'retention';
  title: string;
  description: string;
  implementationSteps: string[];
  expectedImpact: string;
  difficulty: 'low' | 'medium' | 'high';
  estimatedTimeline: string;
  targetMetrics: string[];
}

export interface CampaignReport {
  id: string;
  campaignId?: string;
  title: string;
  period: string;
  generatedAt: string;
  executiveSummary: string;
  performanceSummary: {
    totalImpressions: number;
    totalEngagements: number;
    averageEngagementRate: number;
    totalClicks: number;
    totalConversions: number;
    conversionRate: number;
    isEstimate: boolean;
  };
  channelBreakdown: Array<{
    channel: SocialPlatform;
    postsCount: number;
    reach: number;
    engagements: number;
    efficiencyRating: 'High' | 'Moderate' | 'Underperforming';
  }>;
  keyWins: string[];
  underperformingAreas: string[];
  recommendations: string[];
  proposedExperiments: string[];
}

export interface CeoTask {
  taskId: string;
  sourceAgent: string;
  taskType:
    | 'GENERATE_CAMPAIGN'
    | 'GENERATE_STRATEGY'
    | 'GENERATE_CONTENT'
    | 'ANALYZE_PERFORMANCE'
    | 'SCHEDULE_POSTS'
    | 'EXECUTE_GROWTH_EXPERIMENT';
  businessProfileId?: string;
  businessProfile?: Partial<BusinessProfile>;
  objective: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  input: Record<string, any>;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'requires_approval';
  result?: CeoTaskResult;
  createdAt: string;
  completedAt?: string;
}

export interface CeoTaskResult {
  agentName: string;
  taskId: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'PENDING_APPROVAL';
  summary: string;
  recommendations: string[];
  generatedAssets: {
    campaignId?: string;
    strategyId?: string;
    contentItemsCount?: number;
    contentItemIds?: string[];
    assetUrls?: string[];
  };
  relevantMetrics: Record<string, any>;
  requiredApprovals: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    requiresHumanConfirmation: boolean;
  }>;
  nextActions: string[];
  errors: string[];
}

export interface ChannelIntegration {
  platform: SocialPlatform;
  name: string;
  connected: boolean;
  accountHandle?: string;
  authMethod: 'OAuth 2.0' | 'API Key' | 'Webhook' | 'None';
  permissions: string[];
  lastSync?: string;
  requiresConfig: boolean;
  configFields: Array<{
    key: string;
    label: string;
    type: 'text' | 'password';
    required: boolean;
    description: string;
  }>;
  credentialsSet: boolean;
}

export interface AutonomousSchedule {
  id: string;
  name: string;
  enabled: boolean;
  frequency: 'daily' | 'twice_weekly' | 'weekly' | 'hourly';
  action: 'generate_weekly_batch' | 'analyze_performance' | 'refresh_market_intelligence' | 'rebalance_queue';
  lastRun?: string;
  nextRun?: string;
  autoApproveSafeDrafts: boolean;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  module: string;
  message: string;
  details?: Record<string, any>;
}
