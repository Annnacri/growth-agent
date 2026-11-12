import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Bot,
  RefreshCw,
  Layers,
  Compass,
  CheckSquare,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import {
  BusinessProfile,
  CampaignReport,
  ChannelIntegration,
  ContentItem,
  ExecutionLog,
  GrowthPlaybook,
  MarketIntelligenceItem,
  MarketingCampaign,
  StrategyBrief,
  AutonomousSchedule,
} from './types/marketing.js';
import { api } from './services/api.js';
import { Navigation, ViewTab } from './components/Navigation.js';
import { ExportPublishModal } from './components/ExportPublishModal.js';
import { ExecutiveOverview } from './components/views/ExecutiveOverview.js';
import { CampaignStrategistView } from './components/views/CampaignStrategistView.js';
import { ContentFactoryView } from './components/views/ContentFactoryView.js';
import { CampaignManagerView } from './components/views/CampaignManagerView.js';
import { CalendarView } from './components/views/CalendarView.js';
import { MarketingIntelligenceView } from './components/views/MarketingIntelligenceView.js';
import { GrowthDistributionView } from './components/views/GrowthDistributionView.js';
import { PerformanceAnalyticsView } from './components/views/PerformanceAnalyticsView.js';
import { ApprovalQueueView } from './components/views/ApprovalQueueView.js';
import { BusinessProfilesView } from './components/views/BusinessProfilesView.js';
import { IntegrationsView } from './components/views/IntegrationsView.js';
import { SettingsView } from './components/views/SettingsView.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('overview');
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<BusinessProfile | null>(null);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [strategies, setStrategies] = useState<StrategyBrief[]>([]);
  const [intelligence, setIntelligence] = useState<MarketIntelligenceItem[]>([]);
  const [growthPlaybooks, setGrowthPlaybooks] = useState<GrowthPlaybook[]>([]);
  const [reports, setReports] = useState<CampaignReport[]>([]);
  const [integrations, setIntegrations] = useState<ChannelIntegration[]>([]);
  const [schedules, setSchedules] = useState<AutonomousSchedule[]>([]);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [exportModalItem, setExportModalItem] = useState<ContentItem | null>(null);

  // Initial load
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        profRes,
        campRes,
        itemsRes,
        intelRes,
        playbookRes,
        reportsRes,
        integRes,
        schedRes,
        logsRes,
      ] = await Promise.all([
        api.getProfiles(),
        api.getCampaigns(),
        api.getCalendarItems(),
        api.getIntelligence(),
        api.getGrowthPlaybooks(),
        api.getReports(),
        api.getIntegrations(),
        api.getSchedules(),
        api.getLogs(),
      ]);

      if (profRes.success && profRes.profiles) {
        setProfiles(profRes.profiles);
        if (!activeProfile && profRes.profiles.length > 0) {
          setActiveProfile(profRes.profiles[0]);
        }
      }

      if (campRes.success && campRes.campaigns) {
        setCampaigns(campRes.campaigns);
      }

      if (itemsRes.success && itemsRes.items) {
        setContentItems(itemsRes.items);
      }

      if (intelRes.success && intelRes.intelligence) {
        setIntelligence(intelRes.intelligence);
      }

      if (playbookRes.success && playbookRes.playbooks) {
        setGrowthPlaybooks(playbookRes.playbooks);
      }

      if (reportsRes.success && reportsRes.reports) {
        setReports(reportsRes.reports);
      }

      if (integRes.success && integRes.integrations) {
        setIntegrations(integRes.integrations);
      }

      if (schedRes.success && schedRes.schedules) {
        setSchedules(schedRes.schedules);
      }

      if (logsRes.success && logsRes.logs) {
        setLogs(logsRes.logs);
      }
    } catch (err) {
      console.error('[App] Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeProfile]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handle cross-navigation
  const handleConvertToCampaign = (strategy: StrategyBrief) => {
    setCurrentTab('campaigns');
  };

  const handleNavigateToContent = (topic: string) => {
    setCurrentTab('content_factory');
  };

  const handleTriggerSchedule = async (id: string) => {
    try {
      await api.triggerSchedule(id);
      await loadInitialData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const refreshLogsOnly = async () => {
    try {
      const res = await api.getLogs();
      if (res.success && res.logs) setLogs(res.logs);
    } catch (e) {
      console.error(e);
    }
  };

  const pendingApprovalsCount = contentItems.filter(
    (i) => i.status === 'pending_approval'
  ).length;

  const scheduledCount = contentItems.filter((i) => i.status === 'scheduled').length;

  const breadcrumbLabels: Record<ViewTab, string> = {
    overview: 'Executive Dashboard / Overview',
    strategist: 'Strategy Engine / AI Campaign Strategist',
    content_factory: 'Autonomous Factory / Social Media Copywriter',
    campaigns: 'Multi-Channel Flights / Campaign Manager',
    calendar: 'Distribution Timeline / Content Calendar',
    intelligence: 'Market Radar / Market Intelligence',
    growth: 'Acquisition Architecture / Growth Engine',
    analytics: 'Performance Math / Executive Reports',
    approvals: 'Human Safety Gate / Approval Queue',
    profiles: 'Brand Voice Memory / Business Profiles',
    integrations: 'Channel Adapters / Independent Publishing',
    settings: 'CEO Orchestrator Contract / Autonomous Daemons',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-row font-sans selection:bg-indigo-500/20 selection:text-indigo-200">
      {/* Sidebar Navigation */}
      <Navigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={setActiveProfile}
        pendingApprovalsCount={pendingApprovalsCount}
        scheduledPostsCount={scheduledCount}
        isAutonomousActive={true}
        onRefreshData={loadInitialData}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* Top Bar Header */}
        <header className="h-14 shrink-0 bg-slate-900/60 border-b border-slate-800/80 px-6 flex items-center justify-between gap-8 sticky top-0 z-30 backdrop-blur-xs">
          {/* Breadcrumb / Context */}
          <div className="flex items-center gap-2 text-xs truncate">
            <span className="font-mono text-slate-400">Marketing Director</span>
            <span className="text-slate-600">/</span>
            <span className="font-semibold text-slate-200 truncate">
              {breadcrumbLabels[currentTab]}
            </span>
          </div>

          {/* Quick Header Actions & Status */}
          <div className="flex items-center gap-3 shrink-0">
            {activeProfile && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{activeProfile.name}</span>
              </div>
            )}

            <button
              onClick={() => setCurrentTab('content_factory')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Post</span>
            </button>
          </div>
        </header>

        {/* View Content Viewport */}
        <div className="p-6 max-w-7xl w-full mx-auto flex-1">
          {activeProfile ? (
            <>
              {currentTab === 'overview' && (
                <ExecutiveOverview
                  profile={activeProfile}
                  campaigns={campaigns}
                  contentItems={contentItems}
                  intelligence={intelligence}
                  integrations={integrations}
                  reports={reports}
                  logs={logs}
                  onNavigate={setCurrentTab}
                  onOpenContentModal={setExportModalItem}
                />
              )}

              {currentTab === 'strategist' && (
                <CampaignStrategistView
                  profile={activeProfile}
                  strategies={strategies}
                  onStrategyCreated={(strat) => setStrategies([strat, ...strategies])}
                  onConvertToCampaign={handleConvertToCampaign}
                />
              )}

              {currentTab === 'content_factory' && (
                <ContentFactoryView
                  profile={activeProfile}
                  onContentGenerated={(item) => setContentItems([item, ...contentItems])}
                  onOpenExportModal={setExportModalItem}
                  onScheduleInCalendar={(item) => {
                    setContentItems([item, ...contentItems.filter((i) => i.id !== item.id)]);
                    setCurrentTab('calendar');
                  }}
                />
              )}

              {currentTab === 'campaigns' && (
                <CampaignManagerView
                  profile={activeProfile}
                  campaigns={campaigns}
                  contentItems={contentItems}
                  onCampaignCreated={(camp, items) => {
                    setCampaigns([camp, ...campaigns]);
                    setContentItems([...items, ...contentItems]);
                  }}
                  onOpenContentModal={setExportModalItem}
                  onRunAnalysis={(camp) => {
                    setCurrentTab('analytics');
                  }}
                />
              )}

              {currentTab === 'calendar' && (
                <CalendarView
                  contentItems={contentItems}
                  onOpenContentModal={setExportModalItem}
                  onItemUpdated={(updated) => {
                    setContentItems(contentItems.map((i) => (i.id === updated.id ? updated : i)));
                  }}
                />
              )}

              {currentTab === 'intelligence' && (
                <MarketingIntelligenceView
                  profile={activeProfile}
                  intelligence={intelligence}
                  onAddIntelligence={(item) => setIntelligence([item, ...intelligence])}
                  onNavigateToContent={handleNavigateToContent}
                />
              )}

              {currentTab === 'growth' && (
                <GrowthDistributionView
                  playbooks={growthPlaybooks}
                  onActivatePlaybook={(playbook) => {
                    setCurrentTab('campaigns');
                  }}
                  onDraftContentForPlaybook={(topic) => {
                    setCurrentTab('content_factory');
                  }}
                />
              )}

              {currentTab === 'analytics' && (
                <PerformanceAnalyticsView
                  reports={reports}
                  campaigns={campaigns}
                  onReportGenerated={(rep) => setReports([rep, ...reports])}
                />
              )}

              {currentTab === 'approvals' && (
                <ApprovalQueueView
                  contentItems={contentItems}
                  onItemUpdated={(updated) => {
                    setContentItems(contentItems.map((i) => (i.id === updated.id ? updated : i)));
                  }}
                  onOpenContentModal={setExportModalItem}
                />
              )}

              {currentTab === 'profiles' && (
                <BusinessProfilesView
                  profiles={profiles}
                  activeProfile={activeProfile}
                  onSelectProfile={setActiveProfile}
                  onProfileSaved={(saved) => {
                    setProfiles(
                      profiles.some((p) => p.id === saved.id)
                        ? profiles.map((p) => (p.id === saved.id ? saved : p))
                        : [saved, ...profiles]
                    );
                    if (saved.id === activeProfile.id) setActiveProfile(saved);
                  }}
                  onProfileDeleted={(delId) => {
                    const remaining = profiles.filter((p) => p.id !== delId);
                    setProfiles(remaining);
                    if (activeProfile.id === delId && remaining.length > 0) {
                      setActiveProfile(remaining[0]);
                    }
                  }}
                />
              )}

              {currentTab === 'integrations' && (
                <IntegrationsView
                  integrations={integrations}
                  onIntegrationUpdated={(updated) => {
                    setIntegrations(
                      integrations.map((i) => (i.platform === updated.platform ? updated : i))
                    );
                  }}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView
                  schedules={schedules}
                  logs={logs}
                  onTriggerSchedule={handleTriggerSchedule}
                  onRefreshLogs={refreshLogsOnly}
                />
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">Loading profiles...</div>
          )}
        </div>
      </main>

      {/* Global Export & Publishing Modal */}
      {exportModalItem && (
        <ExportPublishModal
          item={exportModalItem}
          onClose={() => setExportModalItem(null)}
          onPublished={(updated) => {
            setContentItems(contentItems.map((i) => (i.id === updated.id ? updated : i)));
          }}
        />
      )}
    </div>
  );
}
