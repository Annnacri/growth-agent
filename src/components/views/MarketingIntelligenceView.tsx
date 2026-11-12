import React, { useState } from 'react';
import {
  Radar,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  Search,
  Calendar,
  Users,
  Building,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { BusinessProfile, MarketIntelligenceItem } from '../../types/marketing.js';
import { api } from '../../services/api.js';

interface MarketingIntelligenceViewProps {
  profile: BusinessProfile;
  intelligence: MarketIntelligenceItem[];
  onAddIntelligence: (item: MarketIntelligenceItem) => void;
  onNavigateToContent: (topic: string) => void;
}

export const MarketingIntelligenceView: React.FC<MarketingIntelligenceViewProps> = ({
  profile,
  intelligence,
  onAddIntelligence,
  onNavigateToContent,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterHypothesis, setFilterHypothesis] = useState<string>('all');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const filteredItems = intelligence.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterHypothesis === 'verified' && item.isHypothesis) return false;
    if (filterHypothesis === 'hypothesis' && !item.isHypothesis) return false;
    return true;
  });

  const handleSynthesizeMore = async () => {
    setIsSynthesizing(true);
    try {
      const newItem: Partial<MarketIntelligenceItem> = {
        type: 'trend',
        title: `Rising Cloud Observability Shift in ${profile.targetMarkets[0] || 'Enterprise Tech'}`,
        description: `Engineering leaders are actively replacing fragmented tracing dashboards with unified autonomous orchestration to slash monitoring SaaS bills by ~30%.`,
        impactScore: 'high',
        isHypothesis: true,
        sourceOrRationale: `AI Hypothesis synthesized from Q1 dev tool migration trends and discussion telemetry.`,
        recommendedAction: `Create a dedicated LinkedIn carousel: "The Hidden Cost of 5 Separate Monitoring Tabs in 2026."`,
        relevantChannels: ['linkedin', 'twitter'],
      };

      const res = await api.addIntelligenceItem(newItem);
      if (res.success && res.item) {
        onAddIntelligence(res.item);
      }
    } catch (err: any) {
      alert(err.message || 'Error synthesizing intelligence');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const getTypeIcon = (type: MarketIntelligenceItem['type']) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-4 h-4 text-indigo-400" />;
      case 'competitor':
        return <Building className="w-4 h-4 text-rose-400" />;
      case 'keyword':
        return <Search className="w-4 h-4 text-sky-400" />;
      case 'seasonal':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'audience_shift':
        return <Users className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
              Market Intelligence Radar
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Audience Researcher</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Marketing Intelligence</h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Continuously evaluate competitor positioning, keyword spikes, seasonal procurement cycles,
            and audience sentiment. Verified facts are strictly distinguished from AI-generated hypotheses.
          </p>
        </div>

        <button
          onClick={handleSynthesizeMore}
          disabled={isSynthesizing}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors shadow-sm whitespace-nowrap self-start md:self-center"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
          {isSynthesizing ? 'Synthesizing Radar...' : 'Scan New Opportunities'}
        </button>
      </div>

      {/* Verification Legend Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-emerald-300">Verified Market Telemetry</div>
            <p className="text-[11px] text-slate-400">
              Grounded in verified historical buyer data, competitor changelogs, or documented procurement cycles.
            </p>
          </div>
        </div>

        <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-amber-300">AI-Generated Hypothesis</div>
            <p className="text-[11px] text-slate-400">
              Algorithmic pattern deduction requiring validation or experimental campaign testing.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-slate-500">Category:</span>
          {['all', 'trend', 'competitor', 'keyword', 'seasonal'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded text-xs capitalize transition-colors ${
                filterType === t
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'all' ? 'All Categories' : t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-slate-500">Credibility:</span>
          <select
            value={filterHypothesis}
            onChange={(e) => setFilterHypothesis(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Intelligence</option>
            <option value="verified">Verified Only</option>
            <option value="hypothesis">Hypotheses Only</option>
          </select>
        </div>
      </div>

      {/* Intelligence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-slate-900 border rounded-xl p-5 flex flex-col justify-between transition-all ${
              item.isHypothesis ? 'border-amber-800/30' : 'border-emerald-800/30'
            }`}
          >
            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-1.5 font-mono uppercase text-[10px] text-slate-400">
                  {getTypeIcon(item.type)}
                  <span className="font-semibold text-slate-300">{item.type.replace('_', ' ')}</span>
                </div>

                <span
                  className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-semibold border ${
                    item.isHypothesis
                      ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                  }`}
                >
                  {item.isHypothesis ? 'AI Hypothesis' : 'Verified Reality'}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-2 leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.description}</p>

              {/* Source & Rationale Box */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs mb-4">
                <div className="text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                  Source & Diagnostic Rationale:
                </div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  {item.sourceOrRationale}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-lg text-xs">
                <div className="text-[10px] font-mono uppercase text-indigo-400 font-semibold mb-0.5">
                  Recommended Distribution Counter-Move:
                </div>
                <div className="text-indigo-200 text-xs font-medium">
                  {item.recommendedAction}
                </div>
              </div>
            </div>

            {/* Footer with action */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {item.relevantChannels.map((ch) => (
                  <span
                    key={ch}
                    className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded"
                  >
                    {ch}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onNavigateToContent(item.recommendedAction)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Draft Content Response <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
