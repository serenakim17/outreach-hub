import React, { useState, useEffect } from 'react';
import { OutreachProvider, useOutreach } from './context/OutreachContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { ContactModal } from './components/ContactModal';
import { DashboardView } from './components/DashboardView';
import { ContactsView } from './components/ContactsView';
import { ComposerView } from './components/ComposerView';
import { SettingsView } from './components/SettingsView';
import { LoginView } from './components/LoginView';

const MainLayout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
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
            <span aria-hidden="true">·</span>
            <button 
              onClick={onLogout}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              Sign Out
            </button>
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
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);

  // Check if session exists on load
  useEffect(() => {
    const savedSession = localStorage.getItem('stemsters_current_session');
    if (savedSession) {
      try {
        setCurrentUser(JSON.parse(savedSession));
      } catch (e) {
        localStorage.removeItem('stemsters_current_session');
      }
    }
  }, []);

  const handleLoginSuccess = (user: { email: string; name: string }) => {
    setCurrentUser(user);
    localStorage.setItem('stemsters_current_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('stemsters_current_session');
  };

  // Show Login screen if not authenticated
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <OutreachProvider>
      <MainLayout onLogout={handleLogout} />
    </OutreachProvider>
  );
}
