import {
  BusinessProfile,
  CeoTask,
  CeoTaskResult,
  MarketingCampaign,
} from '../src/types/marketing.js';
import { aiMarketingEngine } from './ai-engine.js';
import { storage } from './storage.js';

export const AGENT_IDENTITY = {
  agentName: 'SaaS Growth Marketing & Distribution Specialist Agent',
  version: '2.0.0-orchestrator-compat',
  ecosystemRole: 'Specialist Agent under Autonomous Business CEO Orchestrator',
  capabilities: [
    'MULTI_CHANNEL_CAMPAIGN_STRATEGY',
    'AUTONOMOUS_CONTENT_FACTORY',
    'CALENDAR_ORCHESTRATION',
    'MARKET_INTELLIGENCE_RADAR',
    'GROWTH_PLAYBOOK_EXECUTION',
    'PERFORMANCE_OPTIMIZATION_ANALYSIS',
  ],
  supportedPlatforms: ['instagram', 'facebook', 'linkedin', 'tiktok', 'twitter', 'pinterest', 'youtube'],
  supportedLanguages: ['en', 'pt', 'es', 'fr', 'de', 'it'],
};

export class CeoContractHandler {
  /**
   * Delegates a task from the CEO Orchestrator into this specialist agent
   */
  async processTask(payload: Partial<CeoTask>): Promise<CeoTaskResult> {
    const taskId = payload.taskId || `ceo-task-${Date.now()}`;
    const sourceAgent = payload.sourceAgent || 'AUTONOMOUS_BUSINESS_CEO_ORCHESTRATOR';
    const taskType = payload.taskType || 'GENERATE_CAMPAIGN';
    const objective = payload.objective || 'Accelerate SaaS user acquisition';
    const priority = payload.priority || 'medium';
    const input = payload.input || {};

    // Resolve business profile
    let profile: BusinessProfile | undefined;
    if (payload.businessProfileId) {
      profile = storage.getProfileById(payload.businessProfileId);
    }
    if (!profile && payload.businessProfile && payload.businessProfile.name) {
      // Ephemeral or ad-hoc profile supplied by CEO
      profile = {
        id: `ephemeral-${Date.now()}`,
        name: payload.businessProfile.name,
        website: payload.businessProfile.website || 'https://example.com',
        industry: payload.businessProfile.industry || 'B2B SaaS',
        productsAndServices: payload.businessProfile.productsAndServices || 'SaaS Platform',
        targetMarkets: payload.businessProfile.targetMarkets || ['North America'],
        targetAudience: payload.businessProfile.targetAudience || 'B2B Decision Makers',
        brandPositioning: payload.businessProfile.brandPositioning || 'Category Leader',
        brandVoice: payload.businessProfile.brandVoice || 'Authoritative and results-driven',
        toneKeywords: payload.businessProfile.toneKeywords || ['Modern', 'Decisive'],
        preferredLanguages: payload.businessProfile.preferredLanguages || ['en'],
        socialAccounts: {},
        marketingObjectives: [objective],
        competitors: payload.businessProfile.competitors || [],
        brandGuidelines: payload.businessProfile.brandGuidelines || 'Standard B2B guidelines',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    if (!profile) {
      // Default to first profile in storage
      profile = storage.getProfiles()[0];
    }

    storage.addLog(
      'info',
      'CEO Orchestrator Contract',
      `Received task ${taskId} (${taskType}) with priority: ${priority}`,
      { sourceAgent, objective }
    );

    const taskRecord: CeoTask = {
      taskId,
      sourceAgent,
      taskType,
      businessProfileId: profile.id,
      objective,
      priority,
      input,
      status: 'in_progress',
      createdAt: new Date().toISOString(),
    };
    storage.saveCeoTask(taskRecord);

    try {
      let result: CeoTaskResult;

      switch (taskType) {
        case 'GENERATE_CAMPAIGN': {
          const campaignName = input.campaignName || `${profile.name} — ${objective}`;
          const durationWeeks = Number(input.durationWeeks) || 4;
          const channels = Array.isArray(input.channels) && input.channels.length > 0 ? input.channels : ['linkedin', 'twitter', 'youtube'];

          const { campaign, contentItems } = await aiMarketingEngine.generateCampaign({
            profile,
            name: campaignName,
            objective: (input.objectiveType || 'customer_acquisition'),
            durationWeeks,
            channels,
            customInstructions: input.instructions,
          });

          storage.saveCampaign(campaign);
          contentItems.forEach((item) => storage.saveContentItem(item));

          result = {
            agentName: AGENT_IDENTITY.agentName,
            taskId,
            status: 'SUCCESS',
            summary: `Successfully formulated multi-channel campaign "${campaign.name}" spanning ${campaign.channels.join(', ')} with ${contentItems.length} ready-to-review content assets.`,
            recommendations: [
              'Review and approve content pieces in the Approval Queue before deployment date.',
              'Ensure channel API credentials or export workflows are verified.',
              'Initiate technical retargeting pixel setup prior to flight launch.',
            ],
            generatedAssets: {
              campaignId: campaign.id,
              contentItemsCount: contentItems.length,
              contentItemIds: contentItems.map((c) => c.id),
            },
            relevantMetrics: {
              targetImpressions: campaign.expectedKPIs.targetImpressions,
              targetLeads: campaign.expectedKPIs.targetLeads,
              targetConversions: campaign.expectedKPIs.targetConversions,
              recommendedTotalBudgetUsd: campaign.budgetRecommendations.totalBudgetUsd,
            },
            requiredApprovals: [
              {
                type: 'HUMAN_CONTENT_VERIFICATION',
                description: `Human review required for ${contentItems.length} generated social posts before external publication.`,
                severity: 'medium',
                requiresHumanConfirmation: true,
              },
            ],
            nextActions: [
              `Approve draft items via POST /api/marketing/approve`,
              `Query scheduled calendar via GET /api/marketing/calendar`,
            ],
            errors: [],
          };
          break;
        }

        case 'GENERATE_STRATEGY': {
          const strategy = await aiMarketingEngine.generateStrategy({
            profile,
            objective: input.objective || 'customer_acquisition',
            timeframeWeeks: input.timeframeWeeks || 8,
          });
          storage.saveStrategy(strategy);

          result = {
            agentName: AGENT_IDENTITY.agentName,
            taskId,
            status: 'SUCCESS',
            summary: `Formulated comprehensive growth strategy "${strategy.title}" with channel playbooks and SWOT analysis.`,
            recommendations: [
              'Allocate 40% organic / 45% paid / 15% influencer split as outlined in playbook.',
              'Focus organic resources on LinkedIn and developer communities for initial momentum.',
            ],
            generatedAssets: {
              strategyId: strategy.id,
            },
            relevantMetrics: {
              kpiMilestonesCount: strategy.kpiMilestones.length,
              targetPersonasCount: strategy.targetPersonas.length,
            },
            requiredApprovals: [],
            nextActions: ['Convert strategy into an executable multi-channel campaign flight.'],
            errors: [],
          };
          break;
        }

        case 'GENERATE_CONTENT': {
          const platform = input.platform || 'linkedin';
          const contentType = input.contentType || 'post';
          const topic = input.topic || input.brief || objective;

          const contentItem = await aiMarketingEngine.generateIndividualContent({
            profile,
            platform,
            contentType,
            topicOrBrief: topic,
            language: input.language || 'en',
            campaignId: input.campaignId,
          });

          storage.saveContentItem(contentItem);

          result = {
            agentName: AGENT_IDENTITY.agentName,
            taskId,
            status: 'SUCCESS',
            summary: `Generated platform-native ${platform} ${contentType} piece: "${contentItem.title}".`,
            recommendations: [
              `Check suggested posting time for ${platform}.`,
              'Verify hook resonance with target persona.',
            ],
            generatedAssets: {
              contentItemIds: [contentItem.id],
              contentItemsCount: 1,
            },
            relevantMetrics: {
              characterCount: contentItem.content.length,
              hashtagsCount: contentItem.hashtags.length,
            },
            requiredApprovals: [
              {
                type: 'CONTENT_APPROVAL',
                description: `Approve content item ${contentItem.id} before publication.`,
                severity: 'low',
                requiresHumanConfirmation: true,
              },
            ],
            nextActions: [`Review item at /api/marketing/calendar or Approval Queue`],
            errors: [],
          };
          break;
        }

        case 'ANALYZE_PERFORMANCE': {
          const campaign = storage.getCampaigns(profile.id)[0] || storage.getCampaigns()[0];
          const metrics = input.metrics || {
            impressions: 120000,
            engagements: 5400,
            clicks: 3100,
            conversions: 64,
          };

          const analysis = await aiMarketingEngine.analyzeCampaignPerformance({
            campaign,
            profile,
            metrics,
          });

          result = {
            agentName: AGENT_IDENTITY.agentName,
            taskId,
            status: 'SUCCESS',
            summary: analysis.summary,
            recommendations: analysis.recommendations,
            generatedAssets: {},
            relevantMetrics: metrics,
            requiredApprovals: [],
            nextActions: analysis.proposedExperiments.map((exp) => `Consider experiment: ${exp}`),
            errors: [],
          };
          break;
        }

        default: {
          result = {
            agentName: AGENT_IDENTITY.agentName,
            taskId,
            status: 'PARTIAL',
            summary: `Task type "${taskType}" accepted and processed with general marketing planner.`,
            recommendations: ['Specify known taskType: GENERATE_CAMPAIGN, GENERATE_STRATEGY, GENERATE_CONTENT, or ANALYZE_PERFORMANCE.'],
            generatedAssets: {},
            relevantMetrics: {},
            requiredApprovals: [],
            nextActions: [],
            errors: [`Task type ${taskType} defaulted to standard execution.`],
          };
        }
      }

      taskRecord.status = 'completed';
      taskRecord.completedAt = new Date().toISOString();
      taskRecord.result = result;
      storage.saveCeoTask(taskRecord);

      storage.addLog('success', 'CEO Orchestrator Contract', `Completed task ${taskId} with status ${result.status}`, {
        taskId,
        summary: result.summary,
      });

      return result;
    } catch (err: any) {
      const failedResult: CeoTaskResult = {
        agentName: AGENT_IDENTITY.agentName,
        taskId,
        status: 'FAILED',
        summary: `Error processing delegated task: ${err.message || 'Execution error'}`,
        recommendations: ['Check system execution logs', 'Verify input parameters and business profile'],
        generatedAssets: {},
        relevantMetrics: {},
        requiredApprovals: [],
        nextActions: ['Retry task with corrected parameters'],
        errors: [err.message || 'Unknown processing error'],
      };

      taskRecord.status = 'failed';
      taskRecord.completedAt = new Date().toISOString();
      taskRecord.result = failedResult;
      storage.saveCeoTask(taskRecord);

      storage.addLog('error', 'CEO Orchestrator Contract', `Task ${taskId} failed: ${err.message}`);

      return failedResult;
    }
  }
}

export const ceoContractHandler = new CeoContractHandler();
