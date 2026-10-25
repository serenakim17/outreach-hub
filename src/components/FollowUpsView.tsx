import React, { useState } from 'react';
import { useOutreach } from '../context/OutreachContext';
import { StatusBadge } from './StatusBadge';
import { Contact } from '../types';
import {
  Clock,
  PauseCircle,
  PlayCircle,
  PenSquare,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Sparkles,
  Info,
  CalendarPlus,
  ArrowRight,
} from 'lucide-react';

export const FollowUpsView: React.FC = () => {
  const {
    contacts,
    settings,
    updateSettings,
    openComposerForContact,
    pauseFollowUp,
    updateContactStatus,
    markAsReplied,
    postponeFollowUp,
  } = useOutreach();

  const [filterMode, setFilterMode] = useState<'all' | 'due' | 'upcoming' | 'paused'>('all');
  const [delayInput, setDelayInput] = useState<number>(settings.defaultFollowUpDays || 3);

  const todayStr = new Date().toISOString().split('T')[0];

  // Contacts relevant to follow-ups:
  // Either status === 'Follow-up Due', or has a nextFollowUp date, or status === 'Paused' or 'Sent'
  const followUpCandidates = contacts.filter((c) => {
    if (c.status === 'Follow-up Due' || c.status === 'Paused') return true;
    if (c.nextFollowUp !== null) return true;
    if (c.status === 'Sent') return true;
    return false;
  });

  const filteredContacts = followUpCandidates.filter((c) => {
    if (filterMode === 'paused') return c.status === 'Paused';
    if (filterMode === 'due') {
      return (
        c.status === 'Follow-up Due' ||
        (c.nextFollowUp && c.nextFollowUp <= todayStr && c.status !== 'Paused' && c.status !== 'Replied')
      );
    }
    if (filterMode === 'upcoming') {
      return (
        c.nextFollowUp &&
        c.nextFollowUp > todayStr &&
        c.status !== 'Paused' &&
        c.status !== 'Replied'
      );
    }
    return true;
  });

  const handleUpdateDelay = (newDelay: number) => {
    setDelayInput(newDelay);
    updateSettings({ defaultFollowUpDays: newDelay });
  };

  const getUrgencyBadge = (contact: Contact) => {
    if (contact.status === 'Paused') {
      return {
        text: 'Follow-ups Paused',
        color: 'text-slate-600 bg-slate-100 border-slate-200',
      };
    }
    if (!contact.nextFollowUp) {
      if (contact.status === 'Follow-up Due') {
        return {
          text: 'Action Due Now',
          color: 'text-amber-800 bg-amber-50 border-amber-200 font-semibold',
        };
      }
      return {
        text: 'No Date Set',
        color: 'text-slate-500 bg-slate-50 border-slate-200',
      };
    }

    if (contact.nextFollowUp <= todayStr) {
      return {
        text: 'Due Today / Overdue',
        color: 'text-amber-800 bg-amber-50 border-amber-300 font-bold',
      };
    }

    return {
      text: `Scheduled: ${contact.nextFollowUp}`,
      color: 'text-sky-800 bg-sky-50 border-sky-200',
    };
  };

  return (
    <div className="space-y-5">
      {/* Informational Callout regarding backend integration */}
      <div className="p-4 bg-indigo-900 text-indigo-100 rounded-xl border border-indigo-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-800/80 rounded-lg text-indigo-300 mt-0.5 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Automated Follow-up Pipeline Staging
            </h3>
            <p className="text-xs text-indigo-200/90 mt-0.5 leading-relaxed max-w-3xl">
              Automatic email dispatch and Gmail thread reply detection will be activated when backend integration is complete.
              In this frontend release, volunteers can review due reminders, reschedule deadlines, or pause follow-up tracking locally.
            </p>
          </div>
        </div>

        {/* Configurable Follow-up Delay Quick Setting */}
        <div className="bg-indigo-950/80 p-3 rounded-lg border border-indigo-800 shrink-0 flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-indigo-300" />
          <div className="text-xs">
            <span className="text-indigo-300 block text-[11px] font-medium">Default Follow-up Delay</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <input
                type="number"
                min="1"
                max="30"
                value={delayInput}
                onChange={(e) => handleUpdateDelay(parseInt(e.target.value) || 3)}
                className="w-12 px-1.5 py-0.5 bg-slate-900 text-white rounded border border-indigo-700 text-xs font-mono tabular-nums text-center focus:outline-hidden focus:border-indigo-400"
              />
              <span className="text-indigo-200 font-medium">days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
          {[
            { id: 'all', label: `All Queue (${followUpCandidates.length})` },
            {
              id: 'due',
              label: `Due Now (${followUpCandidates.filter((c) => c.status === 'Follow-up Due' || (c.nextFollowUp && c.nextFollowUp <= todayStr && c.status !== 'Paused')).length})`,
            },
            {
              id: 'upcoming',
              label: `Upcoming (${followUpCandidates.filter((c) => c.nextFollowUp && c.nextFollowUp > todayStr && c.status !== 'Paused').length})`,
            },
            {
              id: 'paused',
              label: `Paused (${followUpCandidates.filter((c) => c.status === 'Paused').length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id as typeof filterMode)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                filterMode === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-mono tabular-nums">
          Current date reference: {todayStr}
        </span>
      </div>

      {/* Follow-up Contact List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {filteredContacts.length === 0 ? (
          <div className="py-16 text-center px-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2.5 opacity-80" />
            <h4 className="text-sm font-semibold text-slate-800">No Follow-ups in this View</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              All reminders for this category are up to date. You can schedule new follow-up reminders from the Contacts directory.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredContacts.map((contact) => {
              const urgency = getUrgencyBadge(contact);
              return (
                <div
                  key={contact.id}
                  className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Left: Contact Info & Dates */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">
                        {contact.firstName} {contact.lastName}
                      </span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs font-medium text-slate-700 truncate">
                        {contact.organization}
                      </span>
                      <StatusBadge status={contact.status} size="sm" />
                      <span className={`text-[11px] px-2 py-0.5 rounded border ${urgency.color}`}>
                        {urgency.text}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {contact.role || 'Member'} — <span className="font-mono text-[11px]">{contact.email}</span>
                    </p>

                    {/* Timeline & Research Summary */}
                    <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-500 flex-wrap">
                      <div className="flex items-center gap-1.5 font-mono tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Last Contact: {contact.lastContacted || 'None recorded'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono tabular-nums">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Target Follow-up: {contact.nextFollowUp || 'Manual'}</span>
                      </div>
                      {contact.draftSubject && (
                        <span className="text-indigo-600 font-medium truncate max-w-xs">
                          Draft: "{contact.draftSubject}"
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {/* Open Composer */}
                    <button
                      onClick={() => openComposerForContact(contact.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                    >
                      <PenSquare className="w-3.5 h-3.5" />
                      <span>Compose Follow-up</span>
                    </button>

                    {/* Postpone +3 Days */}
                    <button
                      onClick={() => postponeFollowUp(contact.id, settings.defaultFollowUpDays || 3)}
                      title={`Postpone follow-up by ${settings.defaultFollowUpDays || 3} days`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-slate-500" />
                      <span>+{settings.defaultFollowUpDays || 3}d</span>
                    </button>

                    {/* Mark Replied */}
                    <button
                      onClick={() => markAsReplied(contact.id)}
                      title="Mark as Replied (removes from follow-up queue)"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Replied</span>
                    </button>

                    {/* Pause or Resume */}
                    {contact.status !== 'Paused' ? (
                      <button
                        onClick={() => pauseFollowUp(contact.id)}
                        title="Pause reminders for this contact"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <PauseCircle className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => updateContactStatus(contact.id, 'Follow-up Due')}
                        title="Resume reminders for this contact"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-lg transition-colors"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
