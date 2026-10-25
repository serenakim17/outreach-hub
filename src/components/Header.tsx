import React from 'react';
import { useOutreach } from '../context/OutreachContext';
import { Menu, Plus, UserPlus, RefreshCw, PenSquare } from 'lucide-react';
import { PageId } from '../types';

interface HeaderProps {
  onOpenMobile: () => void;
  onOpenNewContact: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobile, onOpenNewContact }) => {
  const { activePage, setActivePage, resetToSampleData } = useOutreach();

  const getPageTitle = (page: PageId) => {
    switch (page) {
      case 'dashboard':
        return { section: 'Overview', title: 'Executive Dashboard' };
      case 'contacts':
        return { section: 'Directory', title: 'Outreach Contacts' };
      case 'composer':
        return { section: 'Communications', title: 'Personalized Email Composer' };
      case 'followups':
        return { section: 'Pipeline', title: 'Follow-up Schedule' };
      case 'settings':
        return { section: 'Configuration', title: 'Integration & Settings' };
      default:
        return { section: 'Workspace', title: 'Dashboard' };
    }
  };

  const { section, title } = getPageTitle(activePage);

  const handleReset = () => {
    if (window.confirm('Reset local contacts and settings back to default sample state? Any custom contacts added will be replaced.')) {
      resetToSampleData();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Outreach Hub</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="font-semibold text-slate-900">{section}</span>
          </nav>
        </div>

        {/* Right Action Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleReset}
            title="Reset to initial sample demo data"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          {activePage !== 'composer' && (
            <button
              onClick={() => setActivePage('composer')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Write Email</span>
              <span className="sm:hidden">Write</span>
            </button>
          )}

          <button
            onClick={onOpenNewContact}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>
    </header>
  );
};
