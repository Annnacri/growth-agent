import React from 'react';
import {
  Compass,
  Sparkles,
  Layers,
  Calendar,
  CheckSquare,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Send,
  Zap,
} from 'lucide-react';
import {
  BusinessProfile,
  CampaignReport,
  ChannelIntegration,
  ContentItem,
  ExecutionLog,
  MarketIntelligenceItem,
  MarketingCampaign,
} from '../../types/marketing.js';
import { ViewTab } from '../Navigation.js';
import { LeadTrendProjection } from './LeadTrendProjection.js';

interface ExecutiveOverviewProps {
  profile: BusinessProfile;
  campaigns: MarketingCampaign[];
  contentItems: ContentItem[];
  intelligence: MarketIntelligenceItem[];
  integrations: ChannelIntegration[];
  reports: CampaignReport[];
  logs: ExecutionLog[];
  onNavigate: (tab: ViewTab) => void;
  onOpenContentModal: (item: ContentItem) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  profile,
  campaigns,
  contentItems,
  intelligence,
  integrations,
  reports,
  logs,
  onNavigate,
  onOpenContentModal,
}) => {
  const activeCampaigns = campaigns.filter((c) => c.status === 'active');
  const draftCampaigns = campaigns.filter((c) => c.status === 'draft');
  const pendingApprovals = contentItems.filter((i) => i.status === 'pending_approval');
  const scheduledContent = contentItems.filter((i) => i.status === 'scheduled');
  const publishedContent = contentItems.filter((i) => i.status === 'published');
  const connectedPlatforms = integrations.filter((i) => i.connected);

  const latestReport = reports[0];

  return (
    <div className="space-y-6">
      {/* Top Banner / Brand Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
              {profile.industry}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">{profile.website}</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{profile.name}</h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
            {profile.brandPositioning}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('strategist')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            AI Strategist
          </button>
          <button
            onClick={() => onNavigate('campaigns')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            New Campaign
          </button>
          <button
            onClick={() => onNavigate('content_factory')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Content Factory
          </button>
        </div>
      </div>

      {/* KPI & Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            Active Campaigns
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {activeCampaigns.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {draftCampaigns.length} in draft pipeline
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="text-[10px] font-mono uppercase text-amber-400 tracking-wider flex items-center justify-between">
            <span>Pending Approvals</span>
            <AlertCircle className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1 tabular-nums">
            {pendingApprovals.length}
          </div>
          <button
            onClick={() => onNavigate('approvals')}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 text-left mt-1 font-medium transition-colors"
          >
            Review in queue →
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            Scheduled Posts
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {scheduledContent.length}
          </div>
          <button
            onClick={() => onNavigate('calendar')}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 text-left mt-1 font-medium transition-colors"
          >
            View calendar →
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            Published Items
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {publishedContent.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Multi-channel distributed</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            Connected Channels
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {connectedPlatforms.length}{' '}
            <span className="text-xs text-slate-500 font-normal">/ {integrations.length}</span>
          </div>
          <button
            onClick={() => onNavigate('integrations')}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 text-left mt-1 font-medium transition-colors"
          >
            Manage adapters →
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            Logged Reach
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {latestReport
              ? `${(latestReport.performanceSummary.totalImpressions / 1000).toFixed(0)}k`
              : '0'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {latestReport?.performanceSummary.isEstimate ? 'Forecast' : 'Verified metrics'}
          </div>
        </div>
      </div>

      {/* Lead Growth Trend Projection (Recharts) */}
      <LeadTrendProjection
        profileId={profile.id}
        activeCampaigns={activeCampaigns}
        contentItems={contentItems}
        reports={reports}
        onCreateCampaign={() => onNavigate('campaigns')}
      />

      {/* Main 2-Column Split: Active Campaigns & Distribution Horizon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Campaigns & Pending Approval Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Campaigns section */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Active Marketing Campaigns</h3>
                <p className="text-[11px] text-slate-400">
                  Targeted multi-channel distribution flights in flight
                </p>
              </div>
              <button
                onClick={() => onNavigate('campaigns')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
              >
                All campaigns <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {activeCampaigns.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No active campaigns. Click &ldquo;New Campaign&rdquo; above to generate one.
                </div>
              ) : (
                activeCampaigns.map((camp) => (
                  <div key={camp.id} className="p-4 hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                            {camp.objective.replace('_', ' ')}
                          </span>
                          <span className="text-slate-500 text-xs">·</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {camp.durationWeeks} weeks flight
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-100">{camp.name}</h4>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">
                        Active
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                      {camp.coreMessage}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-mono">Channels:</span>
                        <div className="flex items-center gap-1">
                          {camp.channels.map((ch) => (
                            <span
                              key={ch}
                              className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded"
                            >
                              {ch}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                        <span>
                          Target Leads:{' '}
                          <strong className="text-slate-200">
                            {camp.expectedKPIs.targetLeads.toLocaleString()}
                          </strong>
                        </span>
                        <span>·</span>
                        <span>
                          Budget:{' '}
                          <strong className="text-slate-200">
                            ${camp.budgetRecommendations.totalBudgetUsd?.toLocaleString() || 'N/A'}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Approvals Strip */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Pending Approval Queue</h3>
                {pendingApprovals.length > 0 && (
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {pendingApprovals.length} need human confirmation
                  </span>
                )}
              </div>
              <button
                onClick={() => onNavigate('approvals')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
              >
                Go to queue <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {pendingApprovals.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  All generated content has been approved or scheduled.
                </div>
              ) : (
                pendingApprovals.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-slate-800 text-indigo-300 rounded font-semibold">
                          {item.platform}
                        </span>
                        <span className="text-slate-500 text-xs">·</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {item.contentType}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200 truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.content}</p>
                    </div>

                    <button
                      onClick={() => onOpenContentModal(item)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors shrink-0"
                    >
                      Review Post
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Market Intelligence & Autonomous Agent Activity */}
        <div className="space-y-6">
          {/* Market Intelligence Radar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Market Radar</h3>
              </div>
              <button
                onClick={() => onNavigate('intelligence')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                View all
              </button>
            </div>

            <div className="p-4 space-y-3">
              {intelligence.slice(0, 3).map((intel) => (
                <div key={intel.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-mono uppercase text-indigo-400 font-semibold">
                      {intel.type.replace('_', ' ')}
                    </span>
                    <span
                      className={`font-mono text-[9px] uppercase px-1 rounded ${
                        intel.isHypothesis
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                      }`}
                    >
                      {intel.isHypothesis ? 'AI Hypothesis' : 'Verified'}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 mb-1 leading-snug">
                    {intel.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {intel.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Autonomous Execution Stream */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Agent Activity Log</h3>
              <button
                onClick={() => onNavigate('settings')}
                className="text-xs text-slate-400 hover:text-slate-200 font-mono transition-colors"
              >
                Logs →
              </button>
            </div>

            <div className="p-4 space-y-2.5 max-h-72 overflow-y-auto font-mono text-[11px]">
              {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="pb-2 border-b border-slate-800/60 last:border-0">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                    <span className="text-indigo-400">{log.module}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-slate-300 leading-tight">{log.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
