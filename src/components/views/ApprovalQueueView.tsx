import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Send,
  Eye,
  ShieldCheck,
  Edit3,
  Sparkles,
} from 'lucide-react';
import { ContentItem } from '../../types/marketing.js';
import { api } from '../../services/api.js';

interface ApprovalQueueViewProps {
  contentItems: ContentItem[];
  onItemUpdated: (updatedItem: ContentItem) => void;
  onOpenContentModal: (item: ContentItem) => void;
}

export const ApprovalQueueView: React.FC<ApprovalQueueViewProps> = ({
  contentItems,
  onItemUpdated,
  onOpenContentModal,
}) => {
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [rejectionModalItem, setRejectionModalItem] = useState<ContentItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const pendingItems = contentItems.filter((i) => i.status === 'pending_approval');
  const approvedItems = contentItems.filter((i) => i.status === 'approved' || i.status === 'scheduled');
  const rejectedItems = contentItems.filter((i) => i.status === 'rejected');

  const displayedItems = contentItems.filter((i) => {
    if (filter === 'pending') return i.status === 'pending_approval';
    if (filter === 'approved') return i.status === 'approved' || i.status === 'scheduled';
    if (filter === 'rejected') return i.status === 'rejected';
    return true;
  });

  const handleApprove = async (item: ContentItem) => {
    setIsProcessing(true);
    try {
      const res = await api.approveContent({
        contentId: item.id,
        action: 'approve',
        notes: 'Approved via human operator review',
      });
      if (res.success && res.item) {
        onItemUpdated(res.item);
      }
    } catch (err: any) {
      alert(err.message || 'Error approving content item');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchApprovePending = async () => {
    if (pendingItems.length === 0) return;
    setIsProcessing(true);
    try {
      for (const item of pendingItems) {
        const res = await api.approveContent({
          contentId: item.id,
          action: 'approve',
          notes: 'Batch approved by operator',
        });
        if (res.success && res.item) {
          onItemUpdated(res.item);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Batch approval error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmRejection = async () => {
    if (!rejectionModalItem) return;
    setIsProcessing(true);
    try {
      const res = await api.approveContent({
        contentId: rejectionModalItem.id,
        action: 'reject',
        rejectionReason: rejectionReason || 'Content did not meet brand positioning criteria',
      });
      if (res.success && res.item) {
        onItemUpdated(res.item);
        setRejectionModalItem(null);
        setRejectionReason('');
      }
    } catch (err: any) {
      alert(err.message || 'Error rejecting content');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Human-In-The-Loop Safety Gate
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Autonomous Compliance Rule</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Approval Queue</h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Autonomous AI content generation operates continuously, but external publication and public-facing
            posts require human operator approval. Review copy, hooks, and timing before dispatch.
          </p>
        </div>

        {/* Batch action */}
        {pendingItems.length > 0 && (
          <button
            onClick={handleBatchApprovePending}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg transition-colors shadow-sm whitespace-nowrap self-start md:self-center"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve All ({pendingItems.length}) Pending
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setFilter('pending')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            filter === 'pending'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Pending Review</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-200">
            {pendingItems.length}
          </span>
        </button>

        <button
          onClick={() => setFilter('approved')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            filter === 'approved'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Approved / Scheduled</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
            {approvedItems.length}
          </span>
        </button>

        <button
          onClick={() => setFilter('rejected')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            filter === 'rejected'
              ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Rejected / Returned</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
            {rejectedItems.length}
          </span>
        </button>

        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            filter === 'all'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Items ({contentItems.length})
        </button>
      </div>

      {/* Queue Items List */}
      <div className="space-y-4">
        {displayedItems.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-500 text-xs">
            No items in the {filter} queue.
          </div>
        ) : (
          displayedItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all space-y-3"
            >
              {/* Header meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                    {item.platform}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-mono uppercase text-slate-400">
                    {item.contentType}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-mono text-slate-400">
                    {item.content.length} chars
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.scheduledFor && (
                    <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Target: {new Date(item.scheduledFor).toLocaleString()}
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold border ${
                      item.status === 'approved' || item.status === 'scheduled'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                        : item.status === 'rejected'
                        ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                        : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Title & Hook */}
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                {item.hook && (
                  <div className="p-2.5 bg-indigo-950/20 border border-indigo-900/40 rounded-lg text-xs text-indigo-200 mb-2 italic">
                    <strong className="text-indigo-400 font-mono text-[10px] uppercase not-italic mr-1">
                      Hook:
                    </strong>
                    &ldquo;{item.hook}&rdquo;
                  </div>
                )}
              </div>

              {/* Body snippet */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {item.content}
              </div>

              {/* Rejection reason if present */}
              {item.rejectionReason && (
                <div className="p-2.5 bg-rose-950/30 border border-rose-800/50 rounded-lg text-xs text-rose-300">
                  <strong className="font-mono uppercase text-[10px] block mb-0.5">
                    Operator Feedback / Return Note:
                  </strong>
                  {item.rejectionReason}
                </div>
              )}

              {/* Action Buttons Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="text-[11px] text-slate-400 font-mono">
                  Hashtags: {item.hashtags.join(' ') || 'None'}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenContentModal(item)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Review & Export Kit
                  </button>

                  {item.status === 'pending_approval' && (
                    <>
                      <button
                        onClick={() => setRejectionModalItem(item)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/50 rounded-md transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject with Note
                      </button>

                      <button
                        onClick={() => handleApprove(item)}
                        className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve Post
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject Note Modal */}
      {rejectionModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden p-5 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              Reject Content Piece
            </h3>
            <p className="text-slate-400">
              Provide feedback to guide the AI Copywriter or record reason for returning this piece to draft.
            </p>

            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Tone is too aggressive; adjust hook to emphasize enterprise security rather than cost savings."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectionModalItem(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejection}
                disabled={isProcessing}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
