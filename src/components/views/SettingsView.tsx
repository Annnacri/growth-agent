import React, { useState } from 'react';
import {
  Sliders,
  Play,
  Bot,
  RefreshCw,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Copy,
  Check,
  Send,
  Zap,
} from 'lucide-react';
import { AutonomousSchedule, CeoTask, CeoTaskResult, ExecutionLog } from '../../types/marketing.js';
import { api } from '../../services/api.js';

interface SettingsViewProps {
  schedules: AutonomousSchedule[];
  logs: ExecutionLog[];
  onTriggerSchedule: (id: string) => void;
  onRefreshLogs: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  schedules,
  logs,
  onTriggerSchedule,
  onRefreshLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'ceo_contract' | 'schedules' | 'logs'>('ceo_contract');
  const [copiedContract, setCopiedContract] = useState(false);

  // CEO Task simulator
  const [simTaskType, setSimTaskType] = useState<CeoTask['taskType']>('GENERATE_CAMPAIGN');
  const [simObjective, setSimObjective] = useState('Scale Q2 self-serve ARR through developer advocacy');
  const [simPriority, setSimPriority] = useState<CeoTask['priority']>('high');
  const [simInputJson, setSimInputJson] = useState(
    JSON.stringify(
      {
        campaignName: 'Serverless Compute Cost Slash Blitz',
        durationWeeks: 4,
        channels: ['linkedin', 'twitter', 'youtube'],
        instructions: 'Focus on declarative YAML automation and ephemeral cluster destruction.',
      },
      null,
      2
    )
  );
  const [isSendingCeoTask, setIsSendingCeoTask] = useState(false);
  const [ceoTaskResponse, setCeoTaskResponse] = useState<CeoTaskResult | null>(null);

  const handleSendCeoTask = async () => {
    setIsSendingCeoTask(true);
    setCeoTaskResponse(null);
    try {
      let parsedInput = {};
      try {
        parsedInput = JSON.parse(simInputJson);
      } catch (e) {
        alert('Invalid JSON in task input parameters');
        setIsSendingCeoTask(false);
        return;
      }

      const payload: Partial<CeoTask> = {
        taskId: `ceo-delegation-${Date.now()}`,
        sourceAgent: 'AUTONOMOUS_BUSINESS_CEO_ORCHESTRATOR',
        taskType: simTaskType,
        objective: simObjective,
        priority: simPriority,
        input: parsedInput,
      };

      const result = await api.delegateCeoTask(payload);
      setCeoTaskResponse(result);
      onRefreshLogs();
    } catch (err: any) {
      alert(err.message || 'Error processing CEO task');
    } finally {
      setIsSendingCeoTask(false);
    }
  };

  const handleCopyContractSpec = () => {
    const spec = {
      agentIdentity: {
        agentName: 'SaaS Growth Marketing & Distribution Specialist Agent',
        ecosystemRole: 'Specialist Agent under Autonomous Business CEO Orchestrator',
      },
      endpoints: {
        taskDelegation: 'POST /api/ceo/tasks or POST /api/marketing/generate',
        campaigns: 'POST /api/marketing/campaigns, GET /api/marketing/campaigns',
        strategy: 'POST /api/marketing/strategy',
        content: 'POST /api/marketing/content/generate',
        calendar: 'GET /api/marketing/calendar, POST /api/marketing/calendar',
        approve: 'POST /api/marketing/approve',
        publish: 'POST /api/marketing/publish',
        report: 'GET /api/marketing/report, POST /api/marketing/analyze',
        health: 'GET /api/health',
      },
    };
    navigator.clipboard.writeText(JSON.stringify(spec, null, 2));
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
              Ecosystem Coordination & Runtime
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Autonomous Business CEO Orchestrator</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">CEO Integration & Autonomy</h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Manage the standardized API contract for delegations from the Autonomous Business CEO Orchestrator,
            configure 24/7 autonomous scheduling tasks, and monitor system execution logs.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('ceo_contract')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'ceo_contract'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          CEO Orchestrator Contract & Tester
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'schedules'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          24/7 Autonomous Scheduler
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'logs'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Execution Logs ({logs.length})
        </button>
      </div>

      {/* TAB 1: CEO CONTRACT & TESTER */}
      {activeTab === 'ceo_contract' && (
        <div className="space-y-6">
          {/* Contract Overview Strip */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  Autonomous Business CEO Orchestrator Specification Contract
                </h3>
              </div>
              <button
                onClick={handleCopyContractSpec}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-mono transition-colors"
              >
                {copiedContract ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedContract ? 'Spec Copied' : 'Copy API Contract'}
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              This specialist agent is designed to receive delegated marketing directives from the central
              Autonomous Business CEO Orchestrator. When a directive arrives, it formulates campaign
              playbooks, executes reasoning models, and returns structured assets, metrics, and required human
              approvals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                <div className="text-[10px] uppercase text-slate-500 mb-1 font-bold">
                  Delegation Input Schema (CEO → Specialist):
                </div>
                <div className="text-slate-400 space-y-0.5 text-[11px]">
                  <div>• taskId: string (Unique ID)</div>
                  <div>• sourceAgent: &quot;CEO_ORCHESTRATOR&quot;</div>
                  <div>• taskType: GENERATE_CAMPAIGN | STRATEGY...</div>
                  <div>• objective: string</div>
                  <div>• priority: low | medium | high | critical</div>
                  <div>• input: object (Flight parameters)</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                <div className="text-[10px] uppercase text-emerald-400 mb-1 font-bold">
                  Standard Response Contract (Specialist → CEO):
                </div>
                <div className="text-slate-400 space-y-0.5 text-[11px]">
                  <div>• agentName: &quot;SaaS Growth Marketing Agent&quot;</div>
                  <div>• status: SUCCESS | PARTIAL | PENDING_APPROVAL</div>
                  <div>• summary: string</div>
                  <div>• recommendations: string[]</div>
                  <div>• generatedAssets: object (IDs & counts)</div>
                  <div>• requiredApprovals: ApprovalItem[]</div>
                  <div>• nextActions: string[]</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive CEO Delegation Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">CEO Task Delegation Simulator</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Live API Endpoint Tester</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Task Type
                </label>
                <select
                  value={simTaskType}
                  onChange={(e) => setSimTaskType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="GENERATE_CAMPAIGN">GENERATE_CAMPAIGN</option>
                  <option value="GENERATE_STRATEGY">GENERATE_STRATEGY</option>
                  <option value="GENERATE_CONTENT">GENERATE_CONTENT</option>
                  <option value="ANALYZE_PERFORMANCE">ANALYZE_PERFORMANCE</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Directive Priority
                </label>
                <select
                  value={simPriority}
                  onChange={(e) => setSimPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="high">HIGH (Immediate execution)</option>
                  <option value="critical">CRITICAL (Executive escalation)</option>
                  <option value="medium">MEDIUM (Standard batch)</option>
                  <option value="low">LOW (Background fill)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Core Objective
                </label>
                <input
                  type="text"
                  value={simObjective}
                  onChange={(e) => setSimObjective(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Input Payload (JSON)
              </label>
              <textarea
                rows={5}
                value={simInputJson}
                onChange={(e) => setSimInputJson(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleSendCeoTask}
              disabled={isSendingCeoTask}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-sm w-full md:w-auto"
            >
              <Send className={`w-3.5 h-3.5 ${isSendingCeoTask ? 'animate-spin' : ''}`} />
              {isSendingCeoTask ? 'Delegating Directives to Specialist...' : 'Send Task Directive as CEO'}
            </button>

            {/* CEO Response Display */}
            {ceoTaskResponse && (
              <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-indigo-400 uppercase font-semibold">
                      Specialist Return Payload
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 font-mono">Task #{ceoTaskResponse.taskId}</span>
                  </div>
                  <span
                    className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded font-bold ${
                      ceoTaskResponse.status === 'SUCCESS'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {ceoTaskResponse.status}
                  </span>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed font-sans">
                  {ceoTaskResponse.summary}
                </div>

                {ceoTaskResponse.recommendations?.length > 0 && (
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">
                      Recommendations to CEO:
                    </div>
                    <ul className="space-y-1 text-slate-300 text-xs font-sans">
                      {ceoTaskResponse.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {ceoTaskResponse.requiredApprovals?.length > 0 && (
                  <div className="p-2.5 bg-amber-950/20 border border-amber-800/40 rounded-lg text-xs">
                    <div className="text-[10px] font-mono uppercase text-amber-400 font-semibold mb-0.5">
                      Required Operator Approvals:
                    </div>
                    {ceoTaskResponse.requiredApprovals.map((app, i) => (
                      <div key={i} className="text-amber-200 text-[11px]">
                        • {app.description}
                      </div>
                    ))}
                  </div>
                )}

                <details className="text-[11px] text-slate-400">
                  <summary className="cursor-pointer font-mono hover:text-slate-200">
                    View Raw JSON Return Object
                  </summary>
                  <pre className="mt-2 p-3 bg-slate-900 rounded border border-slate-800 overflow-x-auto text-[10px] text-slate-300">
                    {JSON.stringify(ceoTaskResponse, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: 24/7 AUTONOMOUS SCHEDULES */}
      {activeTab === 'schedules' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">24/7 Continuous Execution Daemons</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Background tasks execute automatically to replenish social queues and synthesize metrics.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded">
              Daemons Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {schedules.map((sched) => (
              <div
                key={sched.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className="text-indigo-400 uppercase font-semibold">{sched.frequency}</span>
                    <span
                      className={`uppercase px-1.5 py-0.2 rounded font-semibold ${
                        sched.enabled
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-slate-500 bg-slate-800'
                      }`}
                    >
                      {sched.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2">{sched.name}</h4>

                  <div className="space-y-1.5 text-xs text-slate-400 font-mono mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[10px]">Action:</span>
                      <span className="text-slate-300">{sched.action}</span>
                    </div>
                    {sched.lastRun && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[10px]">Last Run:</span>
                        <span className="text-slate-300">
                          {new Date(sched.lastRun).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    {sched.nextRun && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[10px]">Next Due:</span>
                        <span className="text-amber-300">
                          {new Date(sched.nextRun).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Auto-Approve: {sched.autoApproveSafeDrafts ? 'ON' : 'OFF (Safe)'}
                  </span>
                  <button
                    onClick={() => onTriggerSchedule(sched.id)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                  >
                    <Play className="w-3 h-3 text-indigo-400" />
                    Run Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM EXECUTION LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">System Runtime & Execution Logs</h3>
            </div>
            <button
              onClick={onRefreshLogs}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white font-mono transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          <div className="p-4 overflow-x-auto max-h-[600px] font-mono text-xs divide-y divide-slate-800/60">
            {logs.map((log) => {
              const levelColor =
                log.level === 'error'
                  ? 'text-rose-400'
                  : log.level === 'warn'
                  ? 'text-amber-400'
                  : log.level === 'success'
                  ? 'text-emerald-400'
                  : 'text-indigo-400';

              return (
                <div key={log.id} className="py-2.5 flex items-start gap-3">
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-950 shrink-0 ${levelColor}`}
                  >
                    {log.level}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold shrink-0">
                    [{log.module}]
                  </span>
                  <span className="text-slate-200 leading-relaxed">{log.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
