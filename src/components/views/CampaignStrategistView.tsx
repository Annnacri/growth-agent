import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Target,
  Layers,
  ArrowRight,
  CheckCircle2,
  PieChart,
  Calendar,
  Shield,
  Zap,
} from 'lucide-react';
import { BusinessProfile, CampaignObjective, StrategyBrief } from '../../types/marketing.js';
import { api } from '../../services/api.js';

interface CampaignStrategistViewProps {
  profile: BusinessProfile;
  strategies: StrategyBrief[];
  onStrategyCreated: (strategy: StrategyBrief) => void;
  onConvertToCampaign: (strategy: StrategyBrief) => void;
}

export const CampaignStrategistView: React.FC<CampaignStrategistViewProps> = ({
  profile,
  strategies,
  onStrategyCreated,
  onConvertToCampaign,
}) => {
  const [objective, setObjective] = useState<CampaignObjective>('customer_acquisition');
  const [timeframeWeeks, setTimeframeWeeks] = useState<number>(8);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState<StrategyBrief | null>(
    strategies.find((s) => s.businessProfileId === profile.id) || strategies[0] || null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const res = await api.generateStrategy({
        businessProfileId: profile.id,
        objective,
        timeframeWeeks,
        targetMarkets: profile.targetMarkets,
      });
      if (res.success && res.strategy) {
        onStrategyCreated(res.strategy);
        setActiveStrategy(res.strategy);
      } else {
        setErrorMessage('Failed to generate strategy. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with AI Marketing Strategist');
    } finally {
      setIsGenerating(false);
    }
  };

  const objectivesList: { id: CampaignObjective; label: string; desc: string }[] = [
    {
      id: 'customer_acquisition',
      label: 'Customer Acquisition',
      desc: 'Rapidly drive new self-serve sign-ups and qualified demo bookings',
    },
    {
      id: 'product_launch',
      label: 'Product / Feature Launch',
      desc: 'High-impact launch blitz across Product Hunt, Hacker News & social channels',
    },
    {
      id: 'lead_generation',
      label: 'Enterprise Lead Generation',
      desc: 'Targeted executive lead magnets, gated reports & high-intent webinars',
    },
    {
      id: 'brand_awareness',
      label: 'Category Positioning & Awareness',
      desc: 'Establish technical authority, podcast appearances & narrative dominance',
    },
    {
      id: 'customer_retention',
      label: 'Expansion & Retention',
      desc: 'Deepen account engagement, feature adoption and community advocacy',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
                Specialized AI Reasoning Mode
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Marketing Strategist</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">AI Campaign Strategist</h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Formulate comprehensive go-to-market strategies, positioning playbooks, SWOT evaluations,
              and channel allocation models tailored to {profile.name}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeStrategy && (
              <button
                onClick={() => onConvertToCampaign(activeStrategy)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                <Layers className="w-3.5 h-3.5" />
                Convert to Campaign Flight
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Generator Configuration Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-400" />
          Strategy Parameters
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Objective selection */}
          <div className="lg:col-span-2 space-y-2">
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
              Primary Objective
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {objectivesList.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => setObjective(obj.id)}
                  className={`p-3 rounded-lg text-left border transition-all ${
                    objective === obj.id
                      ? 'bg-indigo-950/40 border-indigo-500/60 text-white shadow-xs'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-indigo-300 mb-0.5">{obj.label}</div>
                  <div className="text-[11px] text-slate-400 leading-snug">{obj.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Timeframe & Action */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                Campaign Horizon
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[4, 8, 12].map((w) => (
                  <button
                    key={w}
                    onClick={() => setTimeframeWeeks(w)}
                    className={`py-2 text-xs font-mono rounded border transition-colors ${
                      timeframeWeeks === w
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {w} Weeks
                  </button>
                ))}
              </div>

              <div className="mt-3 p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs">
                <span className="text-slate-400 text-[11px] block mb-1 font-mono uppercase">
                  Target Markets:
                </span>
                <div className="text-slate-200 font-medium text-xs">
                  {profile.targetMarkets.join(', ') || 'Global'}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'AI Strategist Formulating...' : 'Generate GTM Strategy'}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Render Active Strategy */}
      {activeStrategy ? (
        <div className="space-y-6">
          {/* Executive Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
                Strategy Blueprint
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Created: {new Date(activeStrategy.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{activeStrategy.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              {activeStrategy.executiveSummary}
            </p>
          </div>

          {/* SWOT & Market Positioning Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-400" />
                Strategic SWOT Matrix
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="font-mono text-[10px] uppercase text-emerald-400 font-semibold mb-1">
                    Strengths
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {activeStrategy.marketAnalysis.swotOverview.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-emerald-500">·</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="font-mono text-[10px] uppercase text-amber-400 font-semibold mb-1">
                    Weaknesses
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {activeStrategy.marketAnalysis.swotOverview.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-amber-500">·</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="font-mono text-[10px] uppercase text-sky-400 font-semibold mb-1">
                    Opportunities
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {activeStrategy.marketAnalysis.swotOverview.opportunities.map((o, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-sky-500">·</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="font-mono text-[10px] uppercase text-rose-400 font-semibold mb-1">
                    Threats
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {activeStrategy.marketAnalysis.swotOverview.threats.map((t, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-rose-500">·</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Target Personas & Value Hooks */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                Target Personas & Buying Triggers
              </h4>

              <div className="space-y-3">
                {activeStrategy.targetPersonas.map((persona, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">{persona.title}</span>
                      <span className="text-[10px] font-mono text-slate-500">{persona.demographics}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mb-2 italic">
                      Hook: &ldquo;{persona.valuePropHook}&rdquo;
                    </div>
                    <div className="text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                      Core Pain Points:
                    </div>
                    <ul className="space-y-0.5 text-slate-300 text-[11px]">
                      {persona.corePains.map((p, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-rose-400 text-xs">×</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Channel Playbook & Cadence */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Channel Playbook & Flight Cadence
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeStrategy.channelPlaybook.map((ch, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono uppercase text-indigo-400 font-bold tracking-wider">
                      {ch.platform}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">
                      {ch.cadence}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{ch.rationale}</p>
                  <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">Content Pillars:</div>
                  <div className="flex flex-wrap gap-1">
                    {ch.contentPillars.map((pillar, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300 font-mono"
                      >
                        {pillar}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget & KPI Milestones Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" />
                Budget Allocation Model ({activeStrategy.budgetAllocation.tier.toUpperCase()})
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1 text-slate-300 text-[11px]">
                    <span>Organic Production & Distribution</span>
                    <span className="font-mono">{activeStrategy.budgetAllocation.organicSplit}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${activeStrategy.budgetAllocation.organicSplit}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1 text-slate-300 text-[11px]">
                    <span>Paid Retargeting & Acceleration Ads</span>
                    <span className="font-mono">{activeStrategy.budgetAllocation.paidSplit}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500"
                      style={{ width: `${activeStrategy.budgetAllocation.paidSplit}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1 text-slate-300 text-[11px]">
                    <span>Creator / Influencer Sponsorships</span>
                    <span className="font-mono">{activeStrategy.budgetAllocation.influencerSplit}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${activeStrategy.budgetAllocation.influencerSplit}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Milestone Forecasts
              </h4>
              <div className="space-y-2 text-xs">
                {activeStrategy.kpiMilestones.map((kpi, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-indigo-400 text-[11px] font-semibold">
                        {kpi.timeline}
                      </span>
                      <span className="text-slate-300 text-xs">{kpi.metric}</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">{kpi.target}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-xl text-slate-500 text-xs">
          Select an objective above and click &ldquo;Generate GTM Strategy&rdquo; to formulate your first strategic flight.
        </div>
      )}
    </div>
  );
};
