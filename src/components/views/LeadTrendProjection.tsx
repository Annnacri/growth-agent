import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, Layers } from 'lucide-react';
import {
  CampaignReport,
  ContentItem,
  MarketingCampaign,
} from '../../types/marketing.js';

interface LeadTrendProjectionProps {
  profileId: string;
  activeCampaigns: MarketingCampaign[];
  contentItems: ContentItem[];
  reports: CampaignReport[];
  onCreateCampaign: () => void;
}

type ScenarioKey = 'conservative' | 'baseline' | 'accelerated';
type MetricMode = 'cumulative' | 'weekly';

interface ProjectionPoint {
  week: string;
  weekIndex: number;
  loggedLeads: number | null;
  projectedLeads: number;
  targetBenchmark: number;
  confidenceLow: number;
  confidenceHigh: number;
  isCurrentOrPast: boolean;
}

const SCENARIO_MULTIPLIERS: Record<ScenarioKey, { label: string; factor: number; desc: string }> = {
  conservative: {
    label: 'Conservative (0.8x)',
    factor: 0.8,
    desc: 'Assumes slower channel ramp and higher funnel friction',
  },
  baseline: {
    label: 'Target Plan (1.0x)',
    factor: 1.0,
    desc: 'Tracks active campaign KPI targets and current conversion run-rate',
  },
  accelerated: {
    label: 'Accelerated (1.25x)',
    factor: 1.25,
    desc: 'Assumes compound organic reach from approved content & optimization',
  },
};

export const LeadTrendProjection: React.FC<LeadTrendProjectionProps> = ({
  profileId,
  activeCampaigns,
  contentItems,
  reports,
  onCreateCampaign,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all');
  const [scenario, setScenario] = useState<ScenarioKey>('baseline');
  const [metricMode, setMetricMode] = useState<MetricMode>('cumulative');

  // Prefer active campaigns for the current profile, falling back to all active campaigns if none match profileId
  const profileActiveCampaigns = useMemo(() => {
    const matching = activeCampaigns.filter((c) => c.businessProfileId === profileId);
    return matching.length > 0 ? matching : activeCampaigns;
  }, [activeCampaigns, profileId]);

  const scopedCampaigns = useMemo(() => {
    if (selectedCampaignId === 'all') return profileActiveCampaigns;
    const found = profileActiveCampaigns.find((c) => c.id === selectedCampaignId);
    return found ? [found] : profileActiveCampaigns;
  }, [profileActiveCampaigns, selectedCampaignId]);

  const projection = useMemo(() => {
    if (scopedCampaigns.length === 0) {
      return null;
    }

    const maxWeeks = Math.max(
      4,
      Math.min(12, Math.max(...scopedCampaigns.map((c) => c.durationWeeks || 4)))
    );

    const totalTargetLeads = scopedCampaigns.reduce(
      (sum, c) => sum + (c.expectedKPIs?.targetLeads || 0),
      0
    );

    // Determine content readiness modifier from real scheduled/approved/published assets
    const scopedIds = new Set(scopedCampaigns.map((c) => c.id));
    const scopedContent = contentItems.filter(
      (item) => item.campaignId && scopedIds.has(item.campaignId)
    );
    const readyContentCount = scopedContent.filter(
      (item) =>
        item.status === 'approved' ||
        item.status === 'scheduled' ||
        item.status === 'published'
    ).length;
    const readinessRatio =
      scopedContent.length > 0 ? readyContentCount / scopedContent.length : 0.5;

    // Extract verified logged performance from matching reports (only non-estimate reports)
    const matchingReports = reports.filter(
      (r) => !r.performanceSummary.isEstimate && (!r.campaignId || scopedIds.has(r.campaignId))
    );
    const verifiedClicks = matchingReports.reduce(
      (sum, r) => sum + (r.performanceSummary.totalClicks || 0),
      0
    );
    const verifiedConversions = matchingReports.reduce(
      (sum, r) => sum + (r.performanceSummary.totalConversions || 0),
      0
    );

    // Derive observed lead run-rate from verified clicks/conversions when available, else 0 logged
    // Note: if reports have verifiedConversions or clicks, we compute current elapsed flight progress
    const now = Date.now();
    const avgElapsedWeeks =
      scopedCampaigns.reduce((sum, c) => {
        const start = new Date(c.startDate).getTime();
        const elapsed = Math.max(0, (now - start) / (7 * 86400000));
        return sum + Math.min(c.durationWeeks || maxWeeks, elapsed);
      }, 0) / scopedCampaigns.length;

    const currentWeekIndex = Math.max(1, Math.min(maxWeeks - 1, Math.round(avgElapsedWeeks)));

    // Use verified report data for Week 0..currentWeekIndex if available; clearly label if 0 verified leads
    const hasVerifiedReportData = matchingReports.length > 0 && verifiedConversions > 0;
    const observedConversionMomentum =
      hasVerifiedReportData && verifiedClicks > 0
        ? Math.min(1.35, Math.max(0.75, (verifiedConversions / verifiedClicks) / 0.015))
        : 1.0;

    // Readiness gently boosts or dampens compounding velocity (0.92x to 1.08x)
    const readinessFactor = 0.92 + readinessRatio * 0.16;
    const scenarioFactor = SCENARIO_MULTIPLIERS[scenario].factor;
    const effectiveMultiplier = scenarioFactor * observedConversionMomentum * readinessFactor;

    // S-curve / ramp weights across weeks (campaigns ramp up in early weeks, peak mid-to-late flight)
    const rawWeights: number[] = [];
    for (let w = 1; w <= maxWeeks; w++) {
      const t = w / maxWeeks;
      // Ramp curve: starts around 0.55x average, builds to 1.3x as content compounds
      rawWeights.push(0.55 + Math.sin(t * Math.PI * 0.85) * 0.75 + t * 0.15);
    }
    const weightSum = rawWeights.reduce((a, b) => a + b, 0);
    const normalizedWeights = rawWeights.map((w) => w / weightSum);

    const points: ProjectionPoint[] = [];
    let cumulativeTarget = 0;
    let cumulativeProjected = 0;
    let cumulativeLogged = 0;

    for (let i = 0; i < maxWeeks; i++) {
      const weekNum = i + 1;
      const weeklyTarget = Math.round(totalTargetLeads * normalizedWeights[i]);
      const weeklyProjected = Math.round(weeklyTarget * effectiveMultiplier);

      // For elapsed weeks, anchor logged baseline proportionally to verified conversions if available
      const isPastOrCurrent = weekNum <= currentWeekIndex;
      let weeklyLogged: number | null = null;
      if (isPastOrCurrent && hasVerifiedReportData) {
        const pastWeightSum = normalizedWeights
          .slice(0, currentWeekIndex)
          .reduce((a, b) => a + b, 0);
        // Scale verified conversions as lead proxy (with clear label)
        const baseLoggedTotal = Math.round(
          verifiedConversions * (totalTargetLeads / Math.max(1, scopedCampaigns.reduce((s, c) => s + (c.expectedKPIs?.targetConversions || 150), 0)))
        );
        weeklyLogged = Math.round((baseLoggedTotal * normalizedWeights[i]) / Math.max(0.01, pastWeightSum));
        cumulativeLogged += weeklyLogged;
      }

      cumulativeTarget += weeklyTarget;
      cumulativeProjected += weeklyProjected;

      const valTarget = metricMode === 'cumulative' ? cumulativeTarget : weeklyTarget;
      const valProjected = metricMode === 'cumulative' ? cumulativeProjected : weeklyProjected;
      const valLogged =
        weeklyLogged === null
          ? null
          : metricMode === 'cumulative'
          ? cumulativeLogged
          : weeklyLogged;

      points.push({
        week: `Wk ${weekNum}`,
        weekIndex: weekNum,
        loggedLeads: valLogged,
        projectedLeads: valProjected,
        targetBenchmark: valTarget,
        confidenceLow: Math.round(valProjected * 0.85),
        confidenceHigh: Math.round(valProjected * 1.15),
        isCurrentOrPast: isPastOrCurrent,
      });
    }

    const finalProjectedTotal = cumulativeProjected;
    const peakWeeklyVelocity = Math.max(
      ...points.map((p) =>
        metricMode === 'weekly'
          ? p.projectedLeads
          : Math.round((totalTargetLeads * effectiveMultiplier) / maxWeeks)
      )
    );

    const deltaPct =
      totalTargetLeads > 0
        ? Math.round(((finalProjectedTotal - totalTargetLeads) / totalTargetLeads) * 100)
        : 0;

    return {
      points,
      maxWeeks,
      totalTargetLeads,
      finalProjectedTotal,
      cumulativeLogged,
      hasVerifiedReportData,
      readyContentCount,
      totalContentCount: scopedContent.length,
      peakWeeklyVelocity,
      deltaPct,
      currentWeekLabel: `Wk ${currentWeekIndex}`,
    };
  }, [scopedCampaigns, contentItems, reports, scenario, metricMode]);

  if (profileActiveCampaigns.length === 0 || !projection) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-indigo-400 font-semibold mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Lead Growth Projection
          </div>
          <h3 className="text-sm font-semibold text-white">No Active Campaign Flights to Project</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Launch or activate a multi-channel campaign to model weekly lead acquisition velocity and
            track progress against campaign KPI targets.
          </p>
        </div>
        <button
          onClick={onCreateCampaign}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <Layers className="w-3.5 h-3.5" />
          Launch Campaign
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-0.5">
            <span className="uppercase text-indigo-400 font-semibold">Forecast Model</span>
            <span aria-hidden="true">·</span>
            <span>Estimated Lead Trajectory ({projection.maxWeeks}-Week Horizon)</span>
          </div>
          <h3 className="text-sm font-semibold text-white">
            Campaign Lead Growth Projection
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Campaign Scope Selector */}
          <select
            aria-label="Select campaign scope"
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 max-w-[220px] truncate"
          >
            <option value="all">
              All Active Campaigns ({profileActiveCampaigns.length})
            </option>
            {profileActiveCampaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Scenario Segmented Buttons */}
          <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
            {(Object.keys(SCENARIO_MULTIPLIERS) as ScenarioKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setScenario(key)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap ${
                  scenario === key
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {SCENARIO_MULTIPLIERS[key].label}
              </button>
            ))}
          </div>

          {/* Metric Mode Toggle */}
          <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setMetricMode('cumulative')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap ${
                metricMode === 'cumulative'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cumulative
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('weekly')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap ${
                metricMode === 'weekly'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 border-b border-slate-800 bg-slate-950/40">
        <div className="p-3.5">
          <div className="text-[10px] font-mono uppercase text-slate-400">
            Projected Total Leads (Est.)
          </div>
          <div className="text-lg font-bold font-mono text-indigo-300 mt-0.5 tabular-nums flex items-baseline gap-2">
            <span>{projection.finalProjectedTotal.toLocaleString()}</span>
            <span
              className={`text-[11px] font-medium ${
                projection.deltaPct >= 0 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {projection.deltaPct >= 0 ? `+${projection.deltaPct}%` : `${projection.deltaPct}%`} vs plan
            </span>
          </div>
        </div>

        <div className="p-3.5">
          <div className="text-[10px] font-mono uppercase text-slate-400">
            Campaign KPI Target
          </div>
          <div className="text-lg font-bold font-mono text-slate-100 mt-0.5 tabular-nums">
            {projection.totalTargetLeads.toLocaleString()}
          </div>
        </div>

        <div className="p-3.5">
          <div className="text-[10px] font-mono uppercase text-slate-400">
            Verified Logged Baseline
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
            {projection.hasVerifiedReportData
              ? projection.cumulativeLogged.toLocaleString()
              : 'No data yet'}
          </div>
        </div>

        <div className="p-3.5">
          <div className="text-[10px] font-mono uppercase text-slate-400">
            Content Pipeline Readiness
          </div>
          <div className="text-lg font-bold font-mono text-slate-200 mt-0.5 tabular-nums">
            {projection.readyContentCount}{' '}
            <span className="text-xs font-normal text-slate-500">
              / {projection.totalContentCount} assets ready
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Visualization */}
      <div className="p-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={projection.points}
              margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="projectedLeadsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.32} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="loggedLeadsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

              <XAxis
                dataKey="week"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={false}
              />

              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={(val: number) =>
                  val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`
                }
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const point = payload[0].payload as ProjectionPoint;
                  return (
                    <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 shadow-xl text-xs space-y-1.5 min-w-[200px]">
                      <div className="font-mono font-semibold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between">
                        <span>{label}</span>
                        <span className="text-[10px] text-slate-400">
                          {metricMode === 'cumulative' ? 'Cumulative' : 'Weekly'}
                        </span>
                      </div>
                      {point.loggedLeads !== null && (
                        <div className="flex items-center justify-between gap-4 font-mono">
                          <span className="text-emerald-400">Logged Baseline:</span>
                          <span className="text-white font-semibold tabular-nums">
                            {point.loggedLeads.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-4 font-mono">
                        <span className="text-indigo-400">Projected (Est.):</span>
                        <span className="text-white font-semibold tabular-nums">
                          {point.projectedLeads.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 font-mono">
                        <span className="text-slate-400">KPI Target Pace:</span>
                        <span className="text-slate-300 tabular-nums">
                          {point.targetBenchmark.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 font-mono">
                        Est. Range: {point.confidenceLow.toLocaleString()} –{' '}
                        {point.confidenceHigh.toLocaleString()}
                      </div>
                    </div>
                  );
                }}
              />

              <ReferenceLine
                x={projection.currentWeekLabel}
                stroke="#475569"
                strokeDasharray="4 4"
                label={{
                  value: 'Flight Now',
                  position: 'insideTopRight',
                  fill: '#94a3b8',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              />

              <Area
                type="monotone"
                dataKey="projectedLeads"
                name="Projected Leads (Estimate)"
                stroke="#818cf8"
                strokeWidth={2}
                strokeDasharray="5 4"
                fill="url(#projectedLeadsFill)"
                activeDot={{ r: 4, fill: '#818cf8', stroke: '#0f172a', strokeWidth: 2 }}
              />

              <Line
                type="monotone"
                dataKey="targetBenchmark"
                name="KPI Target Pace"
                stroke="#64748b"
                strokeWidth={1.5}
                dot={false}
              />

              {projection.hasVerifiedReportData && (
                <Area
                  type="monotone"
                  dataKey="loggedLeads"
                  name="Verified Logged Baseline"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#loggedLeadsFill)"
                  connectNulls={false}
                  activeDot={{ r: 4, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Footer Legend & Methodology Disclosure */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-4 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-indigo-400 inline-block border-b border-dashed border-indigo-300" />
              Projected Trajectory (Estimate)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500 inline-block" />
              KPI Target Pace
            </span>
            {projection.hasVerifiedReportData && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
                Verified Logged Baseline
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500">
            {SCENARIO_MULTIPLIERS[scenario].desc}. Estimates only.
          </span>
        </div>
      </div>
    </div>
  );
};
