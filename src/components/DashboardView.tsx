import React from 'react';
import { useOutreach } from '../context/OutreachContext';
import { StatusBadge } from './StatusBadge';
import { ContactStatus } from '../types';
import {
  Users,
  FileEdit,
  Send,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  PenSquare,
  UserPlus,
  AlertCircle,
  HelpCircle,
  Activity,
  ChevronRight,
} from 'lucide-react';

const STATUS_CATEGORIES: ContactStatus[] = [
  'Not Contacted',
  'Draft Ready',
  'Sent',
  'Follow-up Due',
  'Replied',
  'Paused',
  'Opted Out',
];

export const DashboardView: React.FC = () => {
  const { contacts, activities, setActivePage, openComposerForContact } = useOutreach();

  // Metrics
  const totalContacts = contacts.length;
  const draftEmails = contacts.filter((c) => c.status === 'Draft Ready' || (c.draftBody && c.draftBody.length > 0)).length;
  const emailsSent = contacts.filter((c) => c.status === 'Sent' || c.lastContacted !== null).length;
  const repliesReceived = contacts.filter((c) => c.status === 'Replied').length;
  const followUpsDue = contacts.filter((c) => c.status === 'Follow-up Due').length;

  const statCards = [
    {
      label: 'Total Contacts',
      value: totalContacts,
      subtext: 'Directory size',
      icon: Users,
      color: 'text-slate-900',
      bgColor: 'bg-slate-50',
      action: () => setActivePage('contacts'),
    },
    {
      label: 'Draft Emails',
      value: draftEmails,
      subtext: 'Ready for review',
      icon: FileEdit,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      action: () => setActivePage('composer'),
    },
    {
      label: 'Emails Sent',
      value: emailsSent,
      subtext: 'Local sent logs',
      icon: Send,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      action: () => setActivePage('contacts'),
      badgeNote: 'Simulated',
    },
    {
      label: 'Replies Received',
      value: repliesReceived,
      subtext: 'Positive responses',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      action: () => setActivePage('contacts'),
    },
    {
      label: 'Follow-ups Due',
      value: followUpsDue,
      subtext: 'Requires action',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      action: () => setActivePage('followups'),
      urgent: followUpsDue > 0,
    },
  ];

  // Distribution
  const statusCounts = STATUS_CATEGORIES.map((status) => {
    const count = contacts.filter((c) => c.status === status).length;
    const percentage = totalContacts > 0 ? Math.round((count / totalContacts) * 100) : 0;
    return { status, count, percentage };
  });

  return (
    <div className="space-y-6">
      {/* Sample Statistics Notice Banner */}
      <div className="p-4 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg mt-0.5 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              Local Prototype Foundation · Sample Statistics
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              These metrics reflect local browser data and 3 fictional demonstration contacts.
              Live synchronization with Google Sheets, Gemini AI synthesis, and Gmail sending will activate upon backend connection.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActivePage('settings')}
          className="shrink-0 text-xs font-medium text-indigo-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors inline-flex items-center gap-1.5"
        >
          <span>View Integrations</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              onClick={card.action}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  card.action();
                }
              }}
              className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-500 truncate">{card.label}</span>
                <div className={`p-1.5 rounded-md ${card.bgColor} ${card.color} shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="my-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                  {card.value}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span className="truncate">{card.subtext}</span>
                <span className="text-indigo-600 font-semibold group-hover:underline">View &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Grid: Status Breakdown + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Contact Status Pipeline */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Outreach Pipeline Distribution</h3>
                <p className="text-xs text-slate-500 mt-0.5">Contact distribution across current communication stages</p>
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-500 font-medium">
                {totalContacts} Contacts Total
              </span>
            </div>

            {/* Visual stacked percentage bar */}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex my-4">
              {statusCounts.map((sc) => {
                if (sc.count === 0) return null;
                const colorMap: Record<ContactStatus, string> = {
                  'Not Contacted': 'bg-slate-300',
                  'Draft Ready': 'bg-indigo-500',
                  'Sent': 'bg-sky-500',
                  'Follow-up Due': 'bg-amber-500',
                  'Replied': 'bg-emerald-500',
                  'Paused': 'bg-slate-400',
                  'Opted Out': 'bg-rose-400',
                };
                return (
                  <div
                    key={sc.status}
                    style={{ width: `${Math.max(sc.percentage, 5)}%` }}
                    className={`${colorMap[sc.status]} h-full transition-all`}
                    title={`${sc.status}: ${sc.count} (${sc.percentage}%)`}
                  />
                );
              })}
            </div>

            {/* List breakdown */}
            <div className="space-y-2 mt-4">
              {statusCounts.map((sc) => (
                <div
                  key={sc.status}
                  className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2">
                    <StatusBadge status={sc.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-mono tabular-nums">
                    <span className="font-semibold text-slate-800">{sc.count} contacts</span>
                    <span className="text-slate-400 text-[11px] w-9 text-right">{sc.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need to update candidate records?</span>
            <button
              onClick={() => setActivePage('contacts')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Open Contacts Directory &rarr;
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Recent Outreach Activity */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
              </div>
              <span className="text-xs text-slate-400">Audit log</span>
            </div>

            <div className="divide-y divide-slate-100 mt-2 max-h-[340px] overflow-y-auto">
              {activities.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No recent activity recorded.</p>
              ) : (
                activities.slice(0, 6).map((act) => (
                  <div key={act.id} className="py-2.5 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-800 truncate">{act.contactName}</span>
                      <span className="text-[11px] text-slate-400 font-mono tabular-nums shrink-0">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-medium text-slate-700 mt-0.5">{act.action}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">{act.details}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Scheduled reminders</span>
            <button
              onClick={() => setActivePage('followups')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-800"
            >
              Manage Follow-ups &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Volunteer Quick Guidance Banner */}
      <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-indigo-900">Student Volunteer Outreach Protocol</h4>
          <p className="text-xs text-indigo-800/80 mt-1 leading-relaxed max-w-2xl">
            1. Research contacts thoroughly and add personal notes before writing.
            2. In the Email Composer, use research cues to tailor each pitch.
            3. Follow-up cycle is automatically tracked with a default 3-day turnaround.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActivePage('composer')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            Open Email Composer
          </button>
        </div>
      </div>
    </div>
  );
};
