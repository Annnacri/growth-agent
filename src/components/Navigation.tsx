import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Layers,
  Calendar,
  Radar,
  TrendingUp,
  BarChart3,
  CheckSquare,
  Building2,
  PlugZap,
  Sliders,
  Bot,
  RefreshCw,
} from 'lucide-react';
import { BusinessProfile } from '../types/marketing.js';

export type ViewTab =
  | 'overview'
  | 'strategist'
  | 'content_factory'
  | 'campaigns'
  | 'calendar'
  | 'intelligence'
  | 'growth'
  | 'analytics'
  | 'approvals'
  | 'profiles'
  | 'integrations'
  | 'settings';

interface NavigationProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  profiles: BusinessProfile[];
  activeProfile: BusinessProfile | null;
  onSelectProfile: (profile: BusinessProfile) => void;
  pendingApprovalsCount: number;
  scheduledPostsCount: number;
  isAutonomousActive: boolean;
  onRefreshData: () => void;
  isLoading: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  profiles,
  activeProfile,
  onSelectProfile,
  pendingApprovalsCount,
  isAutonomousActive,
  onRefreshData,
  isLoading,
}) => {
  interface NavItem {
    id: ViewTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'strategist', label: 'AI Strategist', icon: Compass },
    { id: 'content_factory', label: 'Content Factory', icon: Sparkles },
    { id: 'campaigns', label: 'Campaign Manager', icon: Layers },
    { id: 'calendar', label: 'Content Calendar', icon: Calendar },
    { id: 'intelligence', label: 'Marketing Intel', icon: Radar },
    { id: 'growth', label: 'Growth Engine', icon: TrendingUp },
    { id: 'analytics', label: 'Performance', icon: BarChart3 },
    {
      id: 'approvals',
      label: 'Approval Queue',
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    { id: 'profiles', label: 'Brand Profiles', icon: Building2 },
    { id: 'integrations', label: 'Integrations', icon: PlugZap },
    { id: 'settings', label: 'CEO & Autonomy', icon: Sliders },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 select-none">
      {/* Top Header / Branding */}
      <div>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-tight text-white uppercase font-mono">
                Growth Agent
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Marketing Director</div>
            </div>
          </div>
          <button
            onClick={onRefreshData}
            title="Refresh agent state"
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>

        {/* Profile Switcher */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/40">
          <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
            Active Brand Profile
          </label>
          <select
            value={activeProfile?.id || ''}
            onChange={(e) => {
              const found = profiles.find((p) => p.id === e.target.value);
              if (found) onSelectProfile(found);
            }}
            className="w-full text-xs bg-slate-900 border border-slate-700/80 rounded px-2 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-medium truncate"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Links */}
        <nav className="p-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-270px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as ViewTab)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="ml-2 px-1.5 py-0.2 text-[10px] font-mono font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Orchestrator Status */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-slate-400 font-mono text-[10px] uppercase">CEO Orchestrator</span>
          <span className="text-indigo-400 font-mono text-[10px] font-medium">Connected</span>
        </div>
        <div className="flex items-center justify-between text-[11px] mb-2">
          <span className="text-slate-400 font-mono text-[10px] uppercase">Autonomous Mode</span>
          <span
            className={`font-mono text-[10px] font-medium ${
              isAutonomousActive ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            {isAutonomousActive ? 'Continuous 24/7' : 'Manual Trigger'}
          </span>
        </div>
        <div className="text-[10px] text-slate-400 leading-tight">
          Specialist Agent: SaaS Distribution & Campaign Strategy
        </div>
      </div>
    </aside>
  );
};
