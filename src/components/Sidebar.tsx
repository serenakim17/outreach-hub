import React from 'react';
import { useOutreach } from '../context/OutreachContext';
import { PageId } from '../types';
import {
  LayoutDashboard,
  Users,
  PenSquare,
  Clock,
  Settings as SettingsIcon,
  Sparkles,
  ExternalLink,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activePage, setActivePage, contacts, settings } = useOutreach();

  const dueFollowupsCount = contacts.filter((c) => c.status === 'Follow-up Due').length;
  const draftCount = contacts.filter((c) => c.status === 'Draft Ready').length;

  const navItems: { id: PageId; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: Users,
      badge: contacts.length,
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'composer',
      label: 'Email Composer',
      icon: PenSquare,
      badge: draftCount > 0 ? draftCount : undefined,
      badgeColor: 'bg-indigo-900/60 text-indigo-200',
    },
    {
      id: 'followups',
      label: 'Follow-ups',
      icon: Clock,
      badge: dueFollowupsCount > 0 ? dueFollowupsCount : undefined,
      badgeColor: 'bg-amber-900/60 text-amber-200',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
    },
  ];

  const handleNavClick = (id: PageId) => {
    setActivePage(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              OH
            </div>
            <div>
              <h1 className="text-white font-bold text-base tracking-tight leading-none">
                Outreach Hub
              </h1>
              <p className="text-[11px] text-slate-400 mt-1 font-medium truncate max-w-[140px]">
                {settings.organizationName}
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Staging Notice */}
        <div className="px-4 py-3 mx-4 my-3 bg-slate-900/90 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Frontend Prototype</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
            Local browser storage active. APIs staged for backend integration.
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono tabular-nums ${
                      isActive ? 'bg-indigo-800 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Volunteer Profile Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
              {settings.volunteerName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'ST'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {settings.volunteerName || 'Student Volunteer'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {settings.volunteerRole || 'Outreach Member'}
              </p>
            </div>
            <button
              onClick={() => handleNavClick('settings')}
              title="Edit Profile & Settings"
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
