import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Send,
  Calendar,
  Layers,
  Video,
  FileText,
  Hash,
  Globe,
  Sliders,
  CheckSquare,
} from 'lucide-react';
import { BusinessProfile, ContentItem, SocialPlatform } from '../../types/marketing.js';
import { api } from '../../services/api.js';

interface ContentFactoryViewProps {
  profile: BusinessProfile;
  onContentGenerated: (item: ContentItem) => void;
  onOpenExportModal: (item: ContentItem) => void;
  onScheduleInCalendar: (item: ContentItem) => void;
}

export const ContentFactoryView: React.FC<ContentFactoryViewProps> = ({
  profile,
  onContentGenerated,
  onOpenExportModal,
  onScheduleInCalendar,
}) => {
  const [platform, setPlatform] = useState<SocialPlatform>('linkedin');
  const [contentType, setContentType] = useState<ContentItem['contentType']>('post');
  const [topicOrBrief, setTopicOrBrief] = useState<string>(
    'The 3 architecture bottlenecks that cause mid-market SaaS cloud bills to surge'
  );
  const [language, setLanguage] = useState<string>(profile.preferredLanguages[0] || 'en');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<ContentItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const platforms: { id: SocialPlatform; label: string; icon: string }[] = [
    { id: 'linkedin', label: 'LinkedIn', icon: 'LI' },
    { id: 'twitter', label: 'X (Twitter)', icon: 'X' },
    { id: 'youtube', label: 'YouTube', icon: 'YT' },
    { id: 'instagram', label: 'Instagram', icon: 'IG' },
    { id: 'tiktok', label: 'TikTok', icon: 'TT' },
    { id: 'facebook', label: 'Facebook', icon: 'FB' },
    { id: 'pinterest', label: 'Pinterest', icon: 'PIN' },
  ];

  const contentTypes: { id: ContentItem['contentType']; label: string; desc: string }[] = [
    { id: 'post', label: 'Thought Leadership Post', desc: 'Narrative or analytical post with clear takeaway' },
    { id: 'carousel', label: 'Educational Carousel', desc: 'Slide-by-slide visual breakdown outline' },
    { id: 'video_script', label: 'Short-Form Video Script', desc: 'Hook, visual staging & verbal script' },
    { id: 'thread', label: 'Multi-Part Thread', desc: 'Concise numbered insights for X/Twitter' },
    { id: 'story', label: 'Promotional Teaser', desc: 'Fast, high-urgency call to action' },
  ];

  const promptPresets = [
    'How we cut cloud infrastructure waste by 38% without breaking production',
    'Why 70% of enterprise CRM pipeline is phantom revenue before quarter-end',
    'Contrarian systems architecture: Why we ditched microservices for a modular monolith',
    'Case study breakdown: Scaling from 10k to 1M events per second',
    '5 questions engineering leaders must ask before signing annual cloud contracts',
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const res = await api.generateContent({
        businessProfileId: profile.id,
        platform,
        contentType,
        topicOrBrief,
        language,
      });

      if (res.success && res.item) {
        setCurrentItem(res.item);
        onContentGenerated(res.item);
      } else {
        setErrorMsg('Failed to generate content. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Generation error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!currentItem) return;
    navigator.clipboard.writeText(currentItem.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
            Autonomous Content Factory
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400">Social Media Copywriter</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Social Media Content Factory</h2>
        <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
          Generate platform-native content, carousel slides, video scripts, hooks, and hashtag sets adapted to
          the selected channel and brand voice.
        </p>
      </div>

      {/* Main Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Controls & Configuration */}
        <div className="lg:col-span-5 space-y-4">
          {/* Platform Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <label className="text-xs font-mono uppercase text-slate-400 block mb-2">
              Target Channel
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPlatform(p.id);
                    if (p.id === 'tiktok' || p.id === 'youtube') setContentType('video_script');
                    if (p.id === 'instagram') setContentType('carousel');
                    if (p.id === 'twitter') setContentType('thread');
                  }}
                  className={`py-2 px-2 rounded-lg text-center border text-xs font-mono transition-colors ${
                    platform === p.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-[10px] text-slate-500 mb-0.5">{p.icon}</div>
                  <div className="truncate text-[11px]">{p.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Format Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <label className="text-xs font-mono uppercase text-slate-400 block mb-2">
              Content Format
            </label>
            <div className="space-y-1.5">
              {contentTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setContentType(t.id)}
                  className={`w-full p-2.5 rounded-lg text-left border text-xs transition-colors flex items-center justify-between ${
                    contentType === t.id
                      ? 'bg-indigo-950/40 border-indigo-500/60 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-200">{t.label}</div>
                    <div className="text-[10px] text-slate-400">{t.desc}</div>
                  </div>
                  {contentType === t.id && (
                    <span className="text-[10px] font-mono text-indigo-400">Selected</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Topic & Language */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono uppercase text-slate-400">
                  Topic / Strategic Thesis
                </label>
                <span className="text-[10px] text-slate-500">Freeform or preset</span>
              </div>
              <textarea
                value={topicOrBrief}
                onChange={(e) => setTopicOrBrief(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                placeholder="Enter topic or angle..."
              />
            </div>

            {/* Presets */}
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                High-Converting Presets:
              </span>
              <div className="space-y-1">
                {promptPresets.slice(0, 3).map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => setTopicOrBrief(preset)}
                    className="w-full text-left p-1.5 rounded text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors truncate"
                  >
                    ↳ {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="en">English (US/Global)</option>
                <option value="pt">Portuguese (Português)</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
                <option value="it">Italian (Italiano)</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topicOrBrief.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Synthesizing Platform Copy...' : `Generate ${platform.toUpperCase()} Asset`}
            </button>

            {errorMsg && (
              <div className="p-2 bg-rose-950/40 border border-rose-800/60 rounded text-xs text-rose-300">
                {errorMsg}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 cols): Live Generated Asset & Action Dock */}
        <div className="lg:col-span-7 space-y-4">
          {currentItem ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
              {/* Asset Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                    {currentItem.platform}
                  </span>
                  <span className="text-slate-600">/</span>
                  <span className="text-xs text-slate-400 font-mono uppercase">
                    {currentItem.contentType}
                  </span>
                  <span className="text-slate-600">/</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {currentItem.content.length} chars
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => onOpenExportModal(currentItem)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    Publish / Export Kit
                  </button>
                </div>
              </div>

              {/* Body & Previews */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                {/* Title */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Internal Campaign Title
                  </label>
                  <input
                    type="text"
                    value={currentItem.title}
                    onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 font-medium"
                  />
                </div>

                {/* Opening Hook (Editable) */}
                {currentItem.hook && (
                  <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-lg">
                    <label className="text-[10px] font-mono uppercase text-indigo-400 block mb-1">
                      Opening Hook
                    </label>
                    <input
                      type="text"
                      value={currentItem.hook}
                      onChange={(e) => setCurrentItem({ ...currentItem, hook: e.target.value })}
                      className="w-full bg-transparent border-b border-indigo-800/60 text-xs text-slate-200 font-semibold focus:outline-none focus:border-indigo-400 pb-1"
                    />
                  </div>
                )}

                {/* Main Content Area */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Post Body (Markdown / Social Format)
                  </label>
                  <textarea
                    rows={10}
                    value={currentItem.content}
                    onChange={(e) => setCurrentItem({ ...currentItem, content: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Carousel outline view */}
                {currentItem.carouselSlides && currentItem.carouselSlides.length > 0 && (
                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg">
                    <div className="text-[10px] font-mono uppercase text-indigo-400 font-semibold mb-2">
                      Carousel Slide Outline ({currentItem.carouselSlides.length} Slides)
                    </div>
                    <div className="space-y-1.5">
                      {currentItem.carouselSlides.map((slide, i) => (
                        <div
                          key={i}
                          className="p-2 bg-slate-900 border border-slate-800/80 rounded text-[11px] text-slate-300 flex items-start gap-2"
                        >
                          <span className="font-mono text-indigo-400 font-semibold shrink-0">
                            Slide {i + 1}:
                          </span>
                          <span>{slide}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Script view */}
                {currentItem.videoScript && (
                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase text-indigo-400 font-semibold">
                      <span>Video Script Blueprint</span>
                      <span>Est: {currentItem.videoScript.estimatedSeconds}s</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      <strong className="text-slate-400 font-mono">Hook:</strong> {currentItem.videoScript.hook}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      <strong className="text-slate-400 font-mono">Body:</strong> {currentItem.videoScript.body}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      <strong className="text-slate-400 font-mono">Direction:</strong>{' '}
                      {currentItem.videoScript.visualDirection}
                    </div>
                  </div>
                )}

                {/* Hashtags & CTA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      Hashtags
                    </label>
                    <input
                      type="text"
                      value={currentItem.hashtags.join(' ')}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          hashtags: e.target.value.split(' ').filter(Boolean),
                        })
                      }
                      className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-indigo-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      Call to Action (CTA)
                    </label>
                    <input
                      type="text"
                      value={currentItem.callToAction}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, callToAction: e.target.value })
                      }
                      className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Action Bar Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between mt-auto">
                <div className="text-[11px] text-slate-400">
                  Status: <span className="text-amber-400 font-mono uppercase font-semibold">{currentItem.status}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onScheduleInCalendar(currentItem)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    Place on Calendar
                  </button>
                  <button
                    onClick={() => onOpenExportModal(currentItem)}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Publish / Export
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center h-full text-slate-500 text-xs">
              <Sparkles className="w-8 h-8 text-indigo-500/40 mb-3" />
              <div className="font-semibold text-slate-400 mb-1">Content Factory Ready</div>
              <p className="max-w-sm text-slate-500 text-[11px] leading-relaxed">
                Select your target channel, pick a format, and generate platform-optimized copy, carousels, or video scripts in seconds.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
