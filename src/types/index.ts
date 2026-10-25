export type ContactStatus =
  | 'Not Contacted'
  | 'Draft Ready'
  | 'Sent'
  | 'Follow-up Due'
  | 'Replied'
  | 'Paused'
  | 'Opted Out';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  role: string;
  website: string;
  researchNotes: string;
  tags: string[];
  status: ContactStatus;
  lastContacted: string | null; // e.g. "2026-10-20"
  nextFollowUp: string | null;  // e.g. "2026-10-24"
  isSample: boolean;
  draftSubject: string;
  draftBody: string;
  draftUpdatedAt?: string;
  history?: ActivityRecord[];
}

export interface ActivityRecord {
  id: string;
  timestamp: string;
  contactId: string;
  contactName: string;
  action: string;
  details: string;
  type: 'status' | 'draft' | 'contact' | 'followup';
}

export interface AppSettings {
  organizationName: string;
  volunteerName: string;
  volunteerRole: string;
  defaultFollowUpDays: number;
  emailSignature: string;
}

export type PageId = 'dashboard' | 'contacts' | 'composer' | 'followups' | 'settings';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
