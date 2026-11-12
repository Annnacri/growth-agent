import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Rocket,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { GrowthPlaybook } from '../../types/marketing.js';

interface GrowthDistributionViewProps {
  playbooks: GrowthPlaybook[];
  onActivatePlaybook: (playbook: GrowthPlaybook) => void;
  onDraftContentForPlaybook: (title: string) => void;
}

export const GrowthDistributionView: React.FC<GrowthDistributionViewProps> = ({
  playbooks,
  onActivatePlaybook,
  onDraftContentForPlaybook,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePlaybook, setActivePlaybook] = useState<GrowthPlaybook>(playbooks[0]);

  const categories = [
    { id: 'all', label: 'All Playbooks' },
    { id: 'organic_loop', label: 'Organic Loops' },
    { id: 'lead_magnet', label: 'Lead Magnets' },
    { id: 'product_hunt_launch', label: 'Launch Blitz' },
    { id: 'paid_ads', label: 'Paid Retargeting' },
  ];

  const filteredPlaybooks = playbooks.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
            Distribution Engineering
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400">Growth Hacker</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Growth & Distribution Engine</h2>
        <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
          Operationalize high-leverage growth mechanics: viral referral loops, un-gated calculator lead magnets,
          Hacker News launches, and precision paid developer retargeting.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedCategory === cat.id
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main 2-Column Split: Playbook selector + Interactive Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Playbook List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredPlaybooks.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePlaybook(p)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                activePlaybook?.id === p.id
                  ? 'bg-indigo-950/30 border-indigo-500/60 shadow-xs'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="uppercase text-indigo-400 font-semibold">
                  {p.category.replace('_', ' ')}
                </span>
                <span
                  className={`uppercase px-1.5 py-0.2 rounded font-semibold ${
                    p.difficulty === 'low'
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : p.difficulty === 'medium'
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-rose-400 bg-rose-500/10'
                  }`}
                >
                  {p.difficulty} Effort
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{p.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{p.description}</p>
            </button>
          ))}
        </div>

        {/* Playbook Deep Dive (7 cols) */}
        <div className="lg:col-span-7">
          {activePlaybook ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
                    {activePlaybook.category.replace('_', ' ')} Blueprint
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Est. Timeline: {activePlaybook.estimatedTimeline}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{activePlaybook.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{activePlaybook.description}</p>
              </div>

              {/* Implementation Sequence */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-3">
                  Step-by-Step Implementation Sequence:
                </h4>
                <div className="space-y-2.5">
                  {activePlaybook.implementationSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-start gap-3 text-xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="text-slate-200 leading-relaxed">{step}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Impact & Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="text-[10px] font-mono uppercase text-emerald-400 font-semibold mb-1">
                    Expected Quantifiable Impact:
                  </div>
                  <div className="text-slate-200 leading-relaxed">{activePlaybook.expectedImpact}</div>
                </div>

                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="text-[10px] font-mono uppercase text-sky-400 font-semibold mb-1">
                    Target Success Metrics:
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {activePlaybook.targetMetrics.map((m, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onDraftContentForPlaybook(activePlaybook.title)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Draft Social Hooks for Playbook
                </button>

                <button
                  onClick={() => onActivatePlaybook(activePlaybook)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  Deploy as Active Flight
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">Select a playbook from the left.</div>
          )}
        </div>
      </div>
    </div>
  );
};
