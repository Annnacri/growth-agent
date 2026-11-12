import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Layers,
  Plus,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { ContentItem, ContentStatus, SocialPlatform } from '../../types/marketing.js';
import { api } from '../../services/api.js';

interface CalendarViewProps {
  contentItems: ContentItem[];
  onOpenContentModal: (item: ContentItem) => void;
  onItemUpdated: (updatedItem: ContentItem) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  contentItems,
  onOpenContentModal,
  onItemUpdated,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarMode, setCalendarMode] = useState<'month' | 'week' | 'list'>('month');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Reschedule / Edit modal
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [editDate, setEditDate] = useState<string>('');
  const [editStatus, setEditStatus] = useState<ContentStatus>('scheduled');

  const platforms: SocialPlatform[] = [
    'linkedin',
    'twitter',
    'youtube',
    'instagram',
    'tiktok',
    'facebook',
    'pinterest',
  ];

  // Filter items
  const filteredItems = contentItems.filter((item) => {
    if (selectedChannel !== 'all' && item.platform !== selectedChannel) return false;
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    return true;
  });

  const nextPeriod = () => {
    const next = new Date(currentDate);
    if (calendarMode === 'month') {
      next.setMonth(next.getMonth() + 1);
    } else {
      next.setDate(next.getDate() + 7);
    }
    setCurrentDate(next);
  };

  const prevPeriod = () => {
    const prev = new Date(currentDate);
    if (calendarMode === 'month') {
      prev.setMonth(prev.getMonth() - 1);
    } else {
      prev.setDate(prev.getDate() - 7);
    }
    setCurrentDate(prev);
  };

  const resetToday = () => {
    setCurrentDate(new Date());
  };

  const handleSaveReschedule = async () => {
    if (!editingItem) return;
    try {
      const updated: ContentItem = {
        ...editingItem,
        scheduledFor: editDate ? new Date(editDate).toISOString() : editingItem.scheduledFor,
        status: editStatus,
      };
      const res = await api.saveCalendarItem(updated);
      if (res.success && res.item) {
        onItemUpdated(res.item);
        setEditingItem(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update schedule');
    }
  };

  // Month grid calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getItemsForDay = (day: number) => {
    return filteredItems.filter((item) => {
      const d = item.scheduledFor ? new Date(item.scheduledFor) : new Date(item.createdAt);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const statusColors: Record<ContentStatus, string> = {
    draft: 'bg-slate-800 text-slate-400 border-slate-700',
    pending_approval: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    approved: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60',
    scheduled: 'bg-sky-950/60 text-sky-300 border-sky-800/60',
    published: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    rejected: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
              Content Pipeline
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Multi-Channel Distribution Calendar</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Social Media Calendar</h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Manage scheduled publications, draft queues, approved assets, and flight dates across all 7
            social networks.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 self-start md:self-center">
          <button
            onClick={() => setCalendarMode('month')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              calendarMode === 'month'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setCalendarMode('list')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              calendarMode === 'list'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Chronological List
          </button>
        </div>
      </div>

      {/* Calendar Controls & Filters Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Navigation & Month Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={prevPeriod}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextPeriod}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-sm font-bold text-white font-mono">
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={resetToday}
            className="text-[11px] font-mono uppercase px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            Today
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Channel filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-slate-500">Channel:</span>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Channels</option>
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Month Grid View */}
      {calendarMode === 'month' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950 text-center text-[11px] font-mono uppercase text-slate-500 py-2.5">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-800/60 bg-slate-950/40">
            {/* Leading empty cells */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-28 p-2 bg-slate-950/80 opacity-40" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;
              const items = getItemsForDay(day);

              return (
                <div
                  key={`day-${day}`}
                  className={`min-h-28 p-2 transition-colors flex flex-col justify-between ${
                    isToday ? 'bg-indigo-950/20' : 'hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center'
                          : 'text-slate-400'
                      }`}
                    >
                      {day}
                    </span>
                    {items.length > 0 && (
                      <span className="text-[10px] font-mono text-slate-500">
                        {items.length} {items.length === 1 ? 'post' : 'posts'}
                      </span>
                    )}
                  </div>

                  {/* Day's Content Items */}
                  <div className="space-y-1 overflow-y-auto max-h-24">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setEditingItem(item);
                          setEditDate(
                            item.scheduledFor ? item.scheduledFor.slice(0, 16) : new Date().toISOString().slice(0, 16)
                          );
                          setEditStatus(item.status);
                        }}
                        className={`w-full text-left p-1.5 rounded border text-[10px] transition-all truncate block ${
                          statusColors[item.status]
                        }`}
                      >
                        <div className="flex items-center gap-1 font-mono uppercase font-bold text-[9px]">
                          <span>{item.platform}</span>
                          <span>·</span>
                          <span className="truncate">{item.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chronological List View */}
      {calendarMode === 'list' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No content items match the selected channel and status filters.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold">
                      {item.platform}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      {item.contentType}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border font-semibold ${
                        statusColors[item.status]
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                    {item.scheduledFor && (
                      <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.scheduledFor).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100 truncate">{item.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {item.content}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setEditDate(
                        item.scheduledFor ? item.scheduledFor.slice(0, 16) : new Date().toISOString().slice(0, 16)
                      );
                      setEditStatus(item.status);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                  >
                    Reschedule / Status
                  </button>
                  <button
                    onClick={() => onOpenContentModal(item)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
                  >
                    View / Publish Kit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reschedule & Status Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Edit Schedule & Status</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold block mb-0.5">
                  {editingItem.platform} Post
                </span>
                <div className="font-semibold text-slate-200">{editingItem.title}</div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Scheduled Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Content Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ContentStatus)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="draft">Draft</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between -mx-5 -mb-5 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveReschedule}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
                >
                  Save Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
