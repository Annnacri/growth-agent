import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Download,
  Share2,
  Layers,
  ArrowUpRight,
  PieChart,
} from 'lucide-react';
import { CampaignReport, MarketingCampaign } from '../../types/marketing.js';
import { api } from '../../services/api.js';

interface PerformanceAnalyticsViewProps {
  reports: CampaignReport[];
  campaigns: MarketingCampaign[];
  onReportGenerated: (report: CampaignReport) => void;
}

export const PerformanceAnalyticsView: React.FC<PerformanceAnalyticsViewProps> = ({
  reports,
  campaigns,
  onReportGenerated,
}) => {
  const [activeReportIndex, setActiveReportIndex] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id || ''
  );

  const currentReport = reports[activeReportIndex] || null;

  const handleRunDiagnostic = async () => {
    if (!selectedCampaignId) return;
    setIsAnalyzing(true);
    try {
      const res = await api.runPerformanceAnalysis(selectedCampaignId);
      if (res.success && res.report) {
        onReportGenerated(res.report);
        setActiveReportIndex(0);
      }
    } catch (err: any) {
      alert(err.message || 'Error running analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReportMarkdown = () => {
    if (!currentReport) return;
    const md = `# ${currentReport.title}
Period: ${currentReport.period}
Generated: ${new Date(currentReport.generatedAt).toLocaleString()}

## Executive Summary
${currentReport.executiveSummary}

## Performance Metrics (${currentReport.performanceSummary.isEstimate ? 'FORECAST / ESTIMATE' : 'VERIFIED LOGGED DATA'})
- Total Impressions: ${currentReport.performanceSummary.totalImpressions.toLocaleString()}
- Total Engagements: ${currentReport.performanceSummary.totalEngagements.toLocaleString()}
- Engagement Rate: ${currentReport.performanceSummary.averageEngagementRate}%
- Total Clicks: ${currentReport.performanceSummary.totalClicks.toLocaleString()}
- Conversions: ${currentReport.performanceSummary.totalConversions.toLocaleString()}
- Conversion Rate: ${currentReport.performanceSummary.conversionRate}%

## Channel Efficiency
${currentReport.channelBreakdown.map((ch) => `- ${ch.channel.toUpperCase()}: ${ch.postsCount} posts, Reach: ${ch.reach.toLocaleString()}, Efficiency: ${ch.efficiencyRating}`).join('\n')}

## Key Wins
${currentReport.keyWins.map((w) => `- ${w}`).join('\n')}

## Underperforming Areas
${currentReport.underperformingAreas.map((u) => `- ${u}`).join('\n')}

## Strategic Recommendations
${currentReport.recommendations.map((r) => `- ${r}`).join('\n')}

## Proposed A/B Experiments
${currentReport.proposedExperiments.map((e) => `- ${e}`).join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `executive-report-${currentReport.id}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
              Performance Intelligence & Optimization
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Marketing Analyst</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Performance & Optimization</h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Real campaign performance analytics, channel efficiency ratings, and automated optimization
            recommendations. All data strictly labeled as verified logs vs algorithmic estimates.
          </p>
        </div>

        {/* Diagnostic Launcher */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleRunDiagnostic}
            disabled={isAnalyzing || !selectedCampaignId}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing Metrics...' : 'Run AI Diagnostic'}
          </button>
        </div>
      </div>

      {currentReport ? (
        <div className="space-y-6">
          {/* Executive Overview Strip */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
                    Executive Briefing
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-400 font-mono">{currentReport.period}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{currentReport.title}</h3>
              </div>

              <button
                onClick={handleDownloadReportMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors self-start sm:self-center"
              >
                <Download className="w-3.5 h-3.5" />
                Export Executive Report (.md)
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              {currentReport.executiveSummary}
            </p>
          </div>

          {/* Core Metrics Grid with Strict Data Labeling */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                Flight Telemetry & Conversion Math
              </span>
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold border ${
                  currentReport.performanceSummary.isEstimate
                    ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                    : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                }`}
              >
                {currentReport.performanceSummary.isEstimate
                  ? 'Algorithmic Forecast Model'
                  : 'Verified Platform Data'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                <div className="text-[10px] font-mono uppercase text-slate-400">Impressions</div>
                <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
                  {currentReport.performanceSummary.totalImpressions.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Total across channels</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                <div className="text-[10px] font-mono uppercase text-slate-400">Engagements</div>
                <div className="text-xl font-bold font-mono text-indigo-400 mt-1 tabular-nums">
                  {currentReport.performanceSummary.totalEngagements.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Likes, comments, shares</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                <div className="text-[10px] font-mono uppercase text-slate-400">Engagement Rate</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                  {currentReport.performanceSummary.averageEngagementRate}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Industry avg: 2.4%</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                <div className="text-[10px] font-mono uppercase text-slate-400">Total Clicks</div>
                <div className="text-xl font-bold font-mono text-sky-400 mt-1 tabular-nums">
                  {currentReport.performanceSummary.totalClicks.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Inbound site visits</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                <div className="text-[10px] font-mono uppercase text-slate-400">Conversions</div>
                <div className="text-xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                  {currentReport.performanceSummary.totalConversions.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Trials & demo signups</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                <div className="text-[10px] font-mono uppercase text-slate-400">Conversion Rate</div>
                <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
                  {currentReport.performanceSummary.conversionRate}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Click-to-lead efficiency</div>
              </div>
            </div>
          </div>

          {/* Channel Efficiency Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h4 className="text-sm font-semibold text-white">Channel Efficiency Matrix</h4>
              <p className="text-[11px] text-slate-400">Comparative ROI per distributed network</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-[10px] font-mono uppercase text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Channel</th>
                    <th className="py-2.5 px-4 font-medium">Posts Distributed</th>
                    <th className="py-2.5 px-4 font-medium">Reach</th>
                    <th className="py-2.5 px-4 font-medium">Engagements</th>
                    <th className="py-2.5 px-4 font-medium text-right">Efficiency Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {currentReport.channelBreakdown.map((ch, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-4 font-semibold uppercase text-slate-200">
                        {ch.channel}
                      </td>
                      <td className="py-3 px-4 tabular-nums">{ch.postsCount}</td>
                      <td className="py-3 px-4 tabular-nums">{ch.reach.toLocaleString()}</td>
                      <td className="py-3 px-4 tabular-nums">{ch.engagements.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            ch.efficiencyRating === 'High'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : ch.efficiencyRating === 'Moderate'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {ch.efficiencyRating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Qualitative Analysis: Key Wins vs Underperforming Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Key Inbound Wins & Breakouts
              </h4>
              <ul className="space-y-2 text-xs">
                {currentReport.keyWins.map((win, i) => (
                  <li
                    key={i}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-slate-300 leading-relaxed"
                  >
                    {win}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Underperforming Assets & Friction
              </h4>
              <ul className="space-y-2 text-xs">
                {currentReport.underperformingAreas.map((area, i) => (
                  <li
                    key={i}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-slate-300 leading-relaxed"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Recommendations & Proposed Experiments */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Strategic Optimization Playbook & Next Experiments
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-2">
                  Optimization Recommendations:
                </span>
                <div className="space-y-2">
                  {currentReport.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-slate-200 leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-indigo-400 font-mono font-bold">{i + 1}.</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-2">
                  Recommended A/B Growth Experiments:
                </span>
                <div className="space-y-2">
                  {currentReport.proposedExperiments.map((exp, i) => (
                    <div
                      key={i}
                      className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-lg text-indigo-200 leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-indigo-400 font-mono font-bold">🧪</span>
                      <span>{exp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500 text-xs bg-slate-900/50 border border-slate-800 rounded-xl">
          No performance reports recorded yet. Click &ldquo;Run AI Diagnostic&rdquo; above to synthesize campaign results.
        </div>
      )}
    </div>
  );
};
