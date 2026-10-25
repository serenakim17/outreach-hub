import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Contact,
  ContactStatus,
  AppSettings,
  ActivityRecord,
  PageId,
  ToastMessage,
} from '../types';
import {
  INITIAL_CONTACTS,
  INITIAL_SETTINGS,
  INITIAL_ACTIVITIES,
} from '../data/initialData';

interface OutreachContextType {
  // Navigation
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  selectedContactIdForComposer: string | null;
  openComposerForContact: (contactId: string) => void;

  // Data
  contacts: Contact[];
  settings: AppSettings;
  activities: ActivityRecord[];

  // Actions
  addContact: (contactData: Omit<Contact, 'id' | 'isSample'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  saveDraft: (id: string, subject: string, body: string) => void;
  updateContactStatus: (id: string, newStatus: ContactStatus) => void;
  pauseFollowUp: (id: string) => void;
  markAsReplied: (id: string) => void;
  postponeFollowUp: (id: string, days?: number) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetToSampleData: () => void;

  // Notifications
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEYS = {
  CONTACTS: 'outreach_hub_contacts_v1',
  SETTINGS: 'outreach_hub_settings_v1',
  ACTIVITIES: 'outreach_hub_activities_v1',
};

const OutreachContext = createContext<OutreachContextType | undefined>(undefined);

export const OutreachProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [selectedContactIdForComposer, setSelectedContactIdForComposer] = useState<string | null>(null);

  // Load contacts
  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored contacts', e);
    }
    return INITIAL_CONTACTS;
  });

  // Load settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored settings', e);
    }
    return INITIAL_SETTINGS;
  });

  // Load activities
  const [activities, setActivities] = useState<ActivityRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored activities', e);
    }
    return INITIAL_ACTIVITIES;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist contacts
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    } catch (e) {
      console.error('Failed to save contacts to localStorage', e);
    }
  }, [contacts]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  // Persist activities
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error('Failed to save activities to localStorage', e);
    }
  }, [activities]);

  const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logActivity = (contactId: string, contactName: string, action: string, details: string, type: ActivityRecord['type']) => {
    const newActivity: ActivityRecord = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      contactId,
      contactName,
      action,
      details,
      type,
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 49)]);
  };

  const openComposerForContact = (contactId: string) => {
    setSelectedContactIdForComposer(contactId);
    setActivePage('composer');
  };

  const addContact = (contactData: Omit<Contact, 'id' | 'isSample'>) => {
    const newId = `contact-${Date.now()}`;
    const newContact: Contact = {
      ...contactData,
      id: newId,
      isSample: false,
    };

    setContacts((prev) => [newContact, ...prev]);
    logActivity(
      newId,
      `${newContact.firstName} ${newContact.lastName}`,
      'Contact Created',
      `Added ${newContact.role || 'Member'} at ${newContact.organization}`,
      'contact'
    );
    addToast(`Added contact ${newContact.firstName} ${newContact.lastName} to database.`, 'success');
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          logActivity(
            c.id,
            `${updated.firstName} ${updated.lastName}`,
            'Contact Updated',
            'Updated contact profile information.',
            'contact'
          );
          return updated;
        }
        return c;
      })
    );
    addToast('Contact details updated successfully.', 'success');
  };

  const deleteContact = (id: string) => {
    const target = contacts.find((c) => c.id === id);
    if (!target) return;

    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (selectedContactIdForComposer === id) {
      setSelectedContactIdForComposer(null);
    }
    logActivity(
      id,
      `${target.firstName} ${target.lastName}`,
      'Contact Removed',
      `Deleted contact record for ${target.organization}.`,
      'contact'
    );
    addToast(`Deleted contact ${target.firstName} ${target.lastName}.`, 'info');
  };

  const saveDraft = (id: string, subject: string, body: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus: ContactStatus = c.status === 'Not Contacted' ? 'Draft Ready' : c.status;
          return {
            ...c,
            draftSubject: subject,
            draftBody: body,
            draftUpdatedAt: new Date().toISOString(),
            status: newStatus,
          };
        }
        return c;
      })
    );

    const target = contacts.find((c) => c.id === id);
    const name = target ? `${target.firstName} ${target.lastName}` : 'Contact';
    logActivity(
      id,
      name,
      'Draft Saved Locally',
      `Saved draft with subject: "${subject.substring(0, 45)}${subject.length > 45 ? '...' : ''}"`,
      'draft'
    );
    addToast(`Draft saved in browser localStorage for ${name}.`, 'success');
  };

  const updateContactStatus = (id: string, newStatus: ContactStatus) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
    const target = contacts.find((c) => c.id === id);
    if (target) {
      logActivity(
        id,
        `${target.firstName} ${target.lastName}`,
        `Status Changed to ${newStatus}`,
        `Updated status from ${target.status} to ${newStatus}.`,
        'status'
      );
      addToast(`Status updated to "${newStatus}" for ${target.firstName} ${target.lastName}.`, 'info');
    }
  };

  const pauseFollowUp = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: 'Paused',
          };
        }
        return c;
      })
    );
    const target = contacts.find((c) => c.id === id);
    if (target) {
      logActivity(
        id,
        `${target.firstName} ${target.lastName}`,
        'Follow-ups Paused',
        'Marked contact as Paused; reminders suspended.',
        'followup'
      );
      addToast(`Follow-ups paused for ${target.firstName} ${target.lastName}.`, 'info');
    }
  };

  const markAsReplied = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: 'Replied',
            nextFollowUp: null,
          };
        }
        return c;
      })
    );
    const target = contacts.find((c) => c.id === id);
    if (target) {
      logActivity(
        id,
        `${target.firstName} ${target.lastName}`,
        'Marked as Replied',
        'Contact confirmed reply; follow-up cycle resolved.',
        'status'
      );
      addToast(`Marked ${target.firstName} ${target.lastName} as Replied.`, 'success');
    }
  };

  const postponeFollowUp = (id: string, days = settings.defaultFollowUpDays || 3) => {
    const today = new Date();
    today.setDate(today.getDate() + days);
    const newDateStr = today.toISOString().split('T')[0];

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: 'Follow-up Due',
            nextFollowUp: newDateStr,
          };
        }
        return c;
      })
    );
    const target = contacts.find((c) => c.id === id);
    if (target) {
      logActivity(
        id,
        `${target.firstName} ${target.lastName}`,
        'Follow-up Rescheduled',
        `Rescheduled next follow-up to ${newDateStr} (+${days} days).`,
        'followup'
      );
      addToast(`Follow-up rescheduled to ${newDateStr} for ${target.firstName} ${target.lastName}.`, 'info');
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Preferences and signature updated.', 'success');
  };

  const resetToSampleData = () => {
    setContacts(INITIAL_CONTACTS);
    setSettings(INITIAL_SETTINGS);
    setActivities(INITIAL_ACTIVITIES);
    setSelectedContactIdForComposer(null);
    localStorage.removeItem(STORAGE_KEYS.CONTACTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    addToast('Restored default fictional sample contacts and preferences.', 'info');
  };

  return (
    <OutreachContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedContactIdForComposer,
        openComposerForContact,
        contacts,
        settings,
        activities,
        addContact,
        updateContact,
        deleteContact,
        saveDraft,
        updateContactStatus,
        pauseFollowUp,
        markAsReplied,
        postponeFollowUp,
        updateSettings,
        resetToSampleData,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </OutreachContext.Provider>
  );
};

export const useOutreach = () => {
  const context = useContext(OutreachContext);
  if (!context) {
    throw new Error('useOutreach must be used within an OutreachProvider');
  }
  return context;
};
