import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Sparkles,
  Target,
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Sliders,
  X,
} from 'lucide-react';
import {
  BusinessProfile,
  CampaignObjective,
  ContentItem,
  MarketingCampaign,
  SocialPlatform,
} from '../../types/marketing.js';
import { api } from '../../services/api.js';

interface CampaignManagerViewProps {
  profile: BusinessProfile;
  campaigns: MarketingCampaign[];
  contentItems: ContentItem[];
  onCampaignCreated: (campaign: MarketingCampaign, items: ContentItem[]) => void;
  onOpenContentModal: (item: ContentItem) => void;
  onRunAnalysis: (campaign: MarketingCampaign) => void;
}

export const CampaignManagerView: React.FC<CampaignManagerViewProps> = ({
  profile,
  campaigns,
  contentItems,
  onCampaignCreated,
  onOpenContentModal,
  onRunAnalysis,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaign | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [objective, setObjective] = useState<CampaignObjective>('customer_acquisition');
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [selectedChannels, setSelectedChannels] = useState<SocialPlatform[]>([
    'linkedin',
    'twitter',
    'youtube',
  ]);
  const [customInstructions, setCustomInstructions] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const allChannels: SocialPlatform[] = [
    'linkedin',
    'twitter',
    'youtube',
    'instagram',
    'tiktok',
    'facebook',
    'pinterest',
  ];

  const toggleChannel = (ch: SocialPlatform) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((c) => c !== ch));
      }
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsCreating(true);
    try {
      const res = await api.createCampaign({
        businessProfileId: profile.id,
        name,
        objective,
        durationWeeks,
        channels: selectedChannels,
        customInstructions,
      });

      if (res.success && res.campaign) {
        onCampaignCreated(res.campaign, res.contentItems || []);
        setShowCreateModal(false);
        setName('');
        setCustomInstructions('');
        setSelectedCampaign(res.campaign);
      }
    } catch (err: any) {
      alert(err.message || 'Error creating campaign');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredCampaigns = campaigns.filter((c) => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
              Autonomous Campaign Generator
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Multi-Channel Flights</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Campaign Manager</h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Architect, deploy, and monitor multi-channel marketing flights with coordinated publishing beats,
            budget models, and conversion tracking.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm whitespace-nowrap self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          Create New Campaign
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {['all', 'active', 'draft', 'completed'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
              filterStatus === st
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {st === 'all' ? 'All Campaigns' : st}
          </button>
        ))}
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCampaigns.map((camp) => {
          const campItems = contentItems.filter((i) => i.campaignId === camp.id);
          const approvedCount = campItems.filter((i) => i.status === 'approved' || i.status === 'scheduled' || i.status === 'published').length;

          return (
            <div
              key={camp.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                      {camp.objective.replace('_', ' ')}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {camp.durationWeeks} Weeks
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold ${
                      camp.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {camp.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5">{camp.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {camp.coreMessage}
                </p>

                {/* Target channels strip */}
                <div className="mb-4">
                  <div className="text-[10px] font-mono uppercase text-slate-500 mb-1.5">
                    Distribution Channels:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {camp.channels.map((ch) => (
                      <span
                        key={ch}
                        className="text-[10px] font-mono uppercase px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 rounded"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics / Budget pill */}
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-center font-mono text-[11px] mb-4">
                  <div>
                    <div className="text-[9px] uppercase text-slate-500">Target Leads</div>
                    <div className="font-bold text-slate-200 mt-0.5">
                      {camp.expectedKPIs.targetLeads.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase text-slate-500">Est. CAC</div>
                    <div className="font-bold text-emerald-400 mt-0.5">
                      ${camp.expectedKPIs.estimatedCAC || 65}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase text-slate-500">Assets</div>
                    <div className="font-bold text-indigo-300 mt-0.5">
                      {campItems.length} items
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {approvedCount} / {campItems.length} assets ready
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRunAnalysis(camp)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                  >
                    <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
                    Analyze
                  </button>
                  <button
                    onClick={() => setSelectedCampaign(camp)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Drill Down
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold">
                  Campaign Architecture Blueprint
                </span>
                <h3 className="text-base font-bold text-white">{selectedCampaign.name}</h3>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Strategic Persona & Core Message */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="font-mono text-[10px] uppercase text-indigo-400 font-semibold mb-1">
                    Customer Persona & Buying Motivations
                  </div>
                  <div className="font-bold text-slate-200 mb-2">
                    {selectedCampaign.customerPersona.name} ({selectedCampaign.customerPersona.role})
                  </div>
                  <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">Pain Points:</div>
                  <ul className="space-y-1 text-slate-300 text-[11px] mb-3">
                    {selectedCampaign.customerPersona.painPoints.map((p, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-rose-400">·</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">Motivations:</div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {selectedCampaign.customerPersona.buyingMotivations.map((m, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-emerald-400">·</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase text-indigo-400 font-semibold mb-1">
                      Conversion Strategy & Thesis
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-3">
                      {selectedCampaign.conversionStrategy}
                    </p>
                    <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">
                      Expected Outcomes:
                    </div>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {selectedCampaign.expectedOutcomes.map((o, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>
                      Total Budget: ${selectedCampaign.budgetRecommendations.totalBudgetUsd?.toLocaleString()}
                    </span>
                    <span>
                      Daily Recommended: ${selectedCampaign.budgetRecommendations.recommendedDailyUsd}/day
                    </span>
                  </div>
                </div>
              </div>

              {/* Associated Content Items */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">
                  Scheduled Campaign Content Pieces
                </h4>
                <div className="space-y-2">
                  {contentItems
                    .filter((i) => i.campaignId === selectedCampaign.id)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-slate-800 text-indigo-300 rounded font-bold">
                              {item.platform}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {item.contentType}
                            </span>
                            <span className="text-slate-600">·</span>
                            <span
                              className={`text-[10px] font-mono uppercase font-semibold ${
                                item.status === 'published'
                                  ? 'text-emerald-400'
                                  : item.status === 'approved'
                                  ? 'text-indigo-400'
                                  : 'text-amber-400'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <div className="font-semibold text-slate-200 truncate">{item.title}</div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedCampaign(null);
                            onOpenContentModal(item);
                          }}
                          className="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors shrink-0"
                        >
                          Review Asset
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Duration: {selectedCampaign.durationWeeks} Weeks
              </span>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Campaign Wizard Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Create Multi-Channel Campaign</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q2 Serverless Cost Optimization Blitz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                    Objective
                  </label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value as CampaignObjective)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="customer_acquisition">Customer Acquisition</option>
                    <option value="product_launch">Product Launch</option>
                    <option value="lead_generation">Lead Generation</option>
                    <option value="brand_awareness">Brand Awareness</option>
                    <option value="customer_retention">Customer Retention</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                    Flight Duration
                  </label>
                  <select
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value={2}>2 Weeks (Flash Blitz)</option>
                    <option value={4}>4 Weeks (Standard Flight)</option>
                    <option value={6}>6 Weeks (Major Launch)</option>
                    <option value={8}>8 Weeks (Quarterly Initiative)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
                  Target Channels (Multi-select)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {allChannels.map((ch) => (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => toggleChannel(ch)}
                      className={`px-3 py-1.5 rounded text-xs font-mono uppercase transition-colors ${
                        selectedChannels.includes(ch)
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Custom Strategy Instructions (Optional)
                </label>
                <textarea
                  rows={3}
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Focus on our new zero-downtime container migration feature and offer a free infrastructure audit."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between -mx-5 -mb-5 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !name.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isCreating ? 'animate-spin' : ''}`} />
                  {isCreating ? 'AI Generating Multi-Channel Campaign...' : 'Generate Full Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
