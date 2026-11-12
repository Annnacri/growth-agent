import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Check,
  Globe,
  Target,
  Sparkles,
  Shield,
  Layers,
  X,
} from 'lucide-react';
import { BusinessProfile } from '../../types/marketing.js';
import { api } from '../../services/api.js';

interface BusinessProfilesViewProps {
  profiles: BusinessProfile[];
  activeProfile: BusinessProfile;
  onSelectProfile: (profile: BusinessProfile) => void;
  onProfileSaved: (profile: BusinessProfile) => void;
  onProfileDeleted: (id: string) => void;
}

export const BusinessProfilesView: React.FC<BusinessProfilesViewProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
  onProfileSaved,
  onProfileDeleted,
}) => {
  const [editingProfile, setEditingProfile] = useState<Partial<BusinessProfile> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const startNewProfile = () => {
    setEditingProfile({
      id: `new-${Date.now()}`,
      name: '',
      website: 'https://',
      industry: 'B2B SaaS',
      productsAndServices: '',
      targetMarkets: ['North America', 'Europe'],
      targetAudience: '',
      brandPositioning: '',
      brandVoice: 'Authoritative, technical yet punchy, developer-empathetic.',
      toneKeywords: ['Modern', 'Decisive', 'Pragmatic'],
      preferredLanguages: ['en'],
      socialAccounts: {},
      marketingObjectives: ['Drive qualified self-serve signups'],
      competitors: [],
      brandGuidelines: 'Avoid generic marketing cliches.',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile || !editingProfile.name?.trim()) return;
    setIsSaving(true);
    try {
      const res = await api.saveProfile(editingProfile);
      if (res.success && res.profile) {
        onProfileSaved(res.profile);
        setEditingProfile(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save business profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (profiles.length <= 1) {
      alert('At least one business profile must remain.');
      return;
    }
    if (!confirm('Are you sure you want to delete this business profile?')) return;
    try {
      const res = await api.deleteProfile(id);
      if (res.success) {
        onProfileDeleted(id);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete profile');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
              Multi-Tenant Brand Memory
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Brand Voice Specialist</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Business & Brand Profiles</h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Configure distinct business profiles for different SaaS products or client brands. All AI
            strategist and content generation models strictly enforce the active profile guidelines.
          </p>
        </div>

        <button
          onClick={startNewProfile}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm whitespace-nowrap self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          Add Brand Profile
        </button>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {profiles.map((p) => {
          const isActive = p.id === activeProfile?.id;
          return (
            <div
              key={p.id}
              className={`bg-slate-900 border rounded-xl p-5 transition-all flex flex-col justify-between ${
                isActive ? 'border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                        {p.industry}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          Active Selection
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white">{p.name}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingProfile(p)}
                      title="Edit Profile"
                      className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {profiles.length > 1 && (
                      <button
                        onClick={() => handleDelete(p.id)}
                        title="Delete Profile"
                        className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-indigo-400 font-mono mb-3">{p.website}</div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {p.brandPositioning}
                </p>

                {/* Details Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
                    <div className="text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                      Target Audience & ICP:
                    </div>
                    <div className="text-slate-300 text-[11px] leading-relaxed">
                      {p.targetAudience}
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
                    <div className="text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                      Brand Voice Guidelines:
                    </div>
                    <div className="text-slate-300 text-[11px] italic leading-relaxed">
                      &ldquo;{p.brandVoice}&rdquo;
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono text-slate-400">
                    <span>
                      Languages: <strong className="text-slate-200">{p.preferredLanguages.join(', ').toUpperCase()}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Markets: <strong className="text-slate-200">{p.targetMarkets.join(', ')}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-800 mt-5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  Updated: {new Date(p.updatedAt).toLocaleDateString()}
                </span>
                {!isActive ? (
                  <button
                    onClick={() => onSelectProfile(p)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
                  >
                    Select Profile
                  </button>
                ) : (
                  <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Active Use
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Profile Modal */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {editingProfile.id?.startsWith('new-') ? 'Create Business Profile' : 'Edit Business Profile'}
              </h3>
              <button
                onClick={() => setEditingProfile(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProfile.name || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    required
                    value={editingProfile.website || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, website: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Industry & Category
                </label>
                <input
                  type="text"
                  required
                  value={editingProfile.industry || ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, industry: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Products & Core Offering
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProfile.productsAndServices || ''}
                  onChange={(e) =>
                    setEditingProfile({ ...editingProfile, productsAndServices: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Brand Positioning & Differentiation Hook
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProfile.brandPositioning || ''}
                  onChange={(e) =>
                    setEditingProfile({ ...editingProfile, brandPositioning: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Target Audience / Buyer Persona
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProfile.targetAudience || ''}
                  onChange={(e) =>
                    setEditingProfile({ ...editingProfile, targetAudience: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                    Brand Voice & Tone
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProfile.brandVoice || ''}
                    onChange={(e) =>
                      setEditingProfile({ ...editingProfile, brandVoice: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                    Tone Keywords (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingProfile.toneKeywords?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingProfile({
                        ...editingProfile,
                        toneKeywords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                    Target Markets (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingProfile.targetMarkets?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingProfile({
                        ...editingProfile,
                        targetMarkets: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                    Competitors (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingProfile.competitors?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingProfile({
                        ...editingProfile,
                        competitors: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Brand Guidelines & Guardrails
                </label>
                <textarea
                  rows={2}
                  value={editingProfile.brandGuidelines || ''}
                  onChange={(e) =>
                    setEditingProfile({ ...editingProfile, brandGuidelines: e.target.value })
                  }
                  placeholder="e.g. Prohibited phrases, compliance requirements, design rules..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between -mx-5 -mb-5 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
                >
                  {isSaving ? 'Saving Profile...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
