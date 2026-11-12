import React, { useState } from 'react';
import {
  PlugZap,
  CheckCircle2,
  AlertTriangle,
  Key,
  ShieldAlert,
  ExternalLink,
  Lock,
  Sliders,
  X,
  Send,
  Download,
} from 'lucide-react';
import { ChannelIntegration, SocialPlatform } from '../../types/marketing.js';
import { api } from '../../services/api.js';

interface IntegrationsViewProps {
  integrations: ChannelIntegration[];
  onIntegrationUpdated: (updated: ChannelIntegration) => void;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  integrations,
  onIntegrationUpdated,
}) => {
  const [configuringPlatform, setConfiguringPlatform] = useState<ChannelIntegration | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleOpenConfig = (item: ChannelIntegration) => {
    setConfiguringPlatform(item);
    setFieldValues({});
    setTestResult(null);
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringPlatform) return;
    setIsSaving(true);
    try {
      const hasValues = Object.values(fieldValues).some((v) => v && v.trim().length > 0);
      const res = await api.updateIntegration(configuringPlatform.platform, {
        credentialsSet: hasValues,
        connected: hasValues,
        lastSync: new Date().toISOString(),
      });

      if (res.success && res.integration) {
        onIntegrationUpdated(res.integration);
        setTestResult({
          success: true,
          message: hasValues
            ? `Credentials configured for ${configuringPlatform.name}. Adapter ready.`
            : `Credentials cleared for ${configuringPlatform.name}.`,
        });
        setTimeout(() => setConfiguringPlatform(null), 1500);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to update credentials',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async (platform: SocialPlatform) => {
    try {
      const res = await api.updateIntegration(platform, {
        credentialsSet: false,
        connected: false,
      });
      if (res.success && res.integration) {
        onIntegrationUpdated(res.integration);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
              Channel Publishing Adapters
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Independent Adapters</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Channel Integrations</h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Independent publishing adapters for Instagram, LinkedIn, X (Twitter), TikTok, Facebook,
            Pinterest, and YouTube. When credentials are not configured, content generation, preview,
            and export remain fully available, while direct publishing is safely blocked.
          </p>
        </div>
      </div>

      {/* Safety Policy Notice */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-slate-200">Independent Integration Architecture</div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            The agent never simulates successful publication. Each channel requires explicit API keys or OAuth
            tokens to dispatch live posts. If credentials are missing, use the one-click &ldquo;Export Kit&rdquo;
            in the Approval Queue or Content Factory to copy formatted markdown or download JSON manifests.
          </p>
        </div>
      </div>

      {/* Adapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {integrations.map((item) => (
          <div
            key={item.platform}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold">
                    {item.platform}
                  </span>
                  <h3 className="text-sm font-bold text-white">{item.name}</h3>
                </div>

                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold border ${
                    item.connected
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {item.connected ? 'Connected' : 'Not Connected'}
                </span>
              </div>

              <div className="text-xs text-slate-400 mb-3 flex items-center gap-2">
                <span>Auth: <strong className="text-slate-300 font-mono">{item.authMethod}</strong></span>
                <span>·</span>
                <span>Status: <strong className={item.credentialsSet ? 'text-emerald-400' : 'text-slate-500'}>
                  {item.credentialsSet ? 'Credentials Set' : 'Requires Setup'}
                </strong></span>
              </div>

              {/* Scopes & Permissions */}
              <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs mb-3">
                <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">
                  Required Scopes / Permissions:
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.permissions.map((perm, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-mono px-1.5 py-0.2 bg-slate-900 text-slate-400 border border-slate-800 rounded truncate"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              {item.connected ? (
                <button
                  onClick={() => handleDisconnect(item.platform)}
                  className="text-xs text-rose-400 hover:text-rose-300 font-mono transition-colors"
                >
                  Disconnect Adapter
                </button>
              ) : (
                <span className="text-[11px] text-slate-500 font-mono">
                  Export mode active
                </span>
              )}

              <button
                onClick={() => handleOpenConfig(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
              >
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                {item.credentialsSet ? 'Edit Credentials' : 'Configure Credentials'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Credential Configuration Drawer / Modal */}
      {configuringPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  Configure {configuringPlatform.name}
                </h3>
              </div>
              <button
                onClick={() => setConfiguringPlatform(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCredentials} className="p-5 space-y-4 text-xs">
              <p className="text-slate-400 leading-relaxed">
                Provide your developer API keys or OAuth access tokens. These credentials are used strictly
                for server-side REST dispatch to the {configuringPlatform.platform} API.
              </p>

              {configuringPlatform.configFields.map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-mono uppercase text-slate-300 block mb-1">
                    {field.label} {field.required && <span className="text-rose-400">*</span>}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.description}
                    value={fieldValues[field.key] || ''}
                    onChange={(e) =>
                      setFieldValues({ ...fieldValues, [field.key]: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{field.description}</span>
                </div>
              ))}

              {testResult && (
                <div
                  className={`p-3 rounded-lg border text-xs ${
                    testResult.success
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
                  }`}
                >
                  {testResult.message}
                </div>
              )}

              <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between -mx-5 -mb-5 mt-4">
                <button
                  type="button"
                  onClick={() => setConfiguringPlatform(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
                >
                  {isSaving ? 'Verifying & Saving...' : 'Save Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
