import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Send,
  Download,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { ContentItem } from '../types/marketing.js';
import { api } from '../services/api.js';

interface ExportPublishModalProps {
  item: ContentItem;
  onClose: () => void;
  onPublished?: (updated: ContentItem) => void;
}

export const ExportPublishModal: React.FC<ExportPublishModalProps> = ({
  item,
  onClose,
  onPublished,
}) => {
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<any>(null);
  const [allowSandboxTest, setAllowSandboxTest] = useState(false);

  const charCount = item.content.length;
  const platformLimit =
    item.platform === 'twitter'
      ? 280
      : item.platform === 'linkedin'
      ? 3000
      : item.platform === 'instagram'
      ? 2200
      : 5000;

  const handleCopyBody = () => {
    navigator.clipboard.writeText(item.content);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const handleCopyTags = () => {
    navigator.clipboard.writeText(item.hashtags.join(' '));
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(item, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${item.platform}-${item.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleAttemptPublish = async () => {
    setIsPublishing(true);
    setPublishResult(null);
    try {
      const res = await api.publishContent(item.id, allowSandboxTest);
      setPublishResult(res);
      if (res.success && onPublished) {
        onPublished({ ...item, status: 'published', publishedAt: new Date().toISOString() });
      }
    } catch (err: any) {
      setPublishResult({
        success: false,
        error: err.message || 'Network error attempting to publish',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              {item.platform}
            </span>
            <span className="text-slate-500 text-xs">/</span>
            <h3 className="text-sm font-semibold text-white truncate max-w-md">{item.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Metadata strip */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 font-mono text-[11px] pb-3 border-b border-slate-800">
            <span>
              Length: <span className={charCount > platformLimit ? 'text-rose-400 font-bold' : 'text-slate-200'}>{charCount}</span> / {platformLimit} chars
            </span>
            <span>·</span>
            <span>Status: <span className="text-indigo-300 font-semibold">{item.status.toUpperCase()}</span></span>
            <span>·</span>
            <span>Language: <span className="text-slate-200">{item.language.toUpperCase()}</span></span>
            {item.scheduledFor && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Clock className="w-3 h-3" />
                  Scheduled: {new Date(item.scheduledFor).toLocaleString()}
                </span>
              </>
            )}
          </div>

          {/* Hook Callout (if present) */}
          {item.hook && (
            <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-lg">
              <div className="text-[10px] font-mono uppercase text-indigo-400 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Primary Opening Hook
              </div>
              <div className="text-slate-200 font-medium italic">{item.hook}</div>
            </div>
          )}

          {/* Post Content Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase text-slate-400">Post Copy</label>
              <button
                onClick={handleCopyBody}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                {copiedBody ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedBody ? 'Copied' : 'Copy Content'}
              </button>
            </div>
            <textarea
              readOnly
              value={item.content}
              rows={8}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none"
            />
          </div>

          {/* Hashtags & CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Hashtags</label>
                <button
                  onClick={handleCopyTags}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  {copiedTags ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedTags ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded p-2 text-slate-300 font-mono text-[11px] break-words">
                {item.hashtags.join(' ') || 'No hashtags specified'}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Call to Action
              </label>
              <div className="bg-slate-950/80 border border-slate-800 rounded p-2 text-slate-300 text-xs">
                {item.callToAction || 'None specified'}
              </div>
            </div>
          </div>

          {/* Carousel slides preview (if present) */}
          {item.carouselSlides && item.carouselSlides.length > 0 && (
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                Carousel Structure ({item.carouselSlides.length} Slides)
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {item.carouselSlides.map((slide, i) => (
                  <div key={i} className="p-2 bg-slate-950/50 border border-slate-800/80 rounded text-[11px] text-slate-300 flex items-start gap-2">
                    <span className="font-mono text-indigo-400 shrink-0 font-semibold">#{i + 1}</span>
                    <span>{slide}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Script preview (if present) */}
          {item.videoScript && (
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-indigo-400 flex items-center justify-between">
                <span>Video Script Direction</span>
                <span>~{item.videoScript.estimatedSeconds}s</span>
              </div>
              <div className="text-slate-300 text-[11px]"><strong className="text-slate-400 font-mono">Hook:</strong> {item.videoScript.hook}</div>
              <div className="text-slate-300 text-[11px]"><strong className="text-slate-400 font-mono">Visual:</strong> {item.videoScript.visualDirection}</div>
              <div className="text-slate-300 text-[11px]"><strong className="text-slate-400 font-mono">CTA:</strong> {item.videoScript.cta}</div>
            </div>
          )}

          {/* Publishing Result / Error Banner */}
          {publishResult && (
            <div
              className={`p-3 rounded-lg border text-xs ${
                publishResult.success
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
              }`}
            >
              <div className="flex items-start gap-2">
                {publishResult.success ? (
                  <Check className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold mb-0.5">
                    {publishResult.success ? 'Published Successfully' : 'Publishing Blocked'}
                  </div>
                  <div className="text-[11px] text-slate-300">{publishResult.error || publishResult.details?.note}</div>
                  {publishResult.details?.resolution && (
                    <div className="text-[10px] text-amber-300/90 mt-1 font-mono">
                      {publishResult.details.resolution}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Autonomous Safety Policy Callout */}
          <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="text-[11px] text-slate-400 leading-tight">
                Publishing is guarded. By default, external dispatch is blocked unless live API credentials are configured in Integrations.
              </div>
            </div>
            <label className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 whitespace-nowrap cursor-pointer">
              <input
                type="checkbox"
                checked={allowSandboxTest}
                onChange={(e) => setAllowSandboxTest(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-0"
              />
              Allow Sandbox Test
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON Kit
            </button>
            <button
              onClick={handleCopyBody}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Full Copy
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleAttemptPublish}
              disabled={isPublishing}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-md transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              {isPublishing ? 'Dispatching...' : 'Publish to Platform'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
