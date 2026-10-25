/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OutreachProvider, useOutreach } from './context/OutreachContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { ContactModal } from './components/ContactModal';
import { DashboardView } from './components/DashboardView';
import { ContactsView } from './components/ContactsView';
import { ComposerView } from './components/ComposerView';
import { FollowUpsView } from './components/FollowUpsView';
import { SettingsView } from './components/SettingsView';

const MainLayout: React.FC = () => {
  const { activePage, addContact } = useOutreach();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'contacts':
        return <ContactsView />;
      case 'composer':
        return <ComposerView />;
      case 'followups':
        return <FollowUpsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Sidebar (Fixed on Desktop, Drawer on Mobile) */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        {/* Top Header */}
        <Header
          onOpenMobile={() => setMobileSidebarOpen(true)}
          onOpenNewContact={() => setIsNewContactModalOpen(true)}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Quiet Clean Footer */}
        <footer className="border-t border-slate-200 px-6 py-4 text-xs text-slate-500 bg-white/70 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Outreach Hub</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Student Organization Outreach Management System</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Frontend Prototype</span>
            <span aria-hidden="true">·</span>
            <span>Local Storage Active</span>
          </div>
        </footer>
      </div>

      {/* Global Add Contact Modal from Header CTA */}
      <ContactModal
        isOpen={isNewContactModalOpen}
        onClose={() => setIsNewContactModalOpen(false)}
        onSubmit={(data) => addContact(data)}
      />

      {/* Global Toast Feedback Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <OutreachProvider>
      <MainLayout />
    </OutreachProvider>
  );
}
