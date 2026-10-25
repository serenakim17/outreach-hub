import React, { useState, useEffect } from 'react';
import { Contact, ContactStatus } from '../types';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Contact, 'id' | 'isSample'>) => void;
  contactToEdit?: Contact | null;
}

const ALL_STATUSES: ContactStatus[] = [
  'Not Contacted',
  'Draft Ready',
  'Sent',
  'Follow-up Due',
  'Replied',
  'Paused',
  'Opted Out',
];

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  contactToEdit,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [website, setWebsite] = useState('');
  const [researchNotes, setResearchNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<ContactStatus>('Not Contacted');
  const [lastContacted, setLastContacted] = useState<string>('');
  const [nextFollowUp, setNextFollowUp] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (contactToEdit) {
      setFirstName(contactToEdit.firstName || '');
      setLastName(contactToEdit.lastName || '');
      setEmail(contactToEdit.email || '');
      setOrganization(contactToEdit.organization || '');
      setRole(contactToEdit.role || '');
      setWebsite(contactToEdit.website || '');
      setResearchNotes(contactToEdit.researchNotes || '');
      setTagsInput(contactToEdit.tags?.join(', ') || '');
      setStatus(contactToEdit.status || 'Not Contacted');
      setLastContacted(contactToEdit.lastContacted || '');
      setNextFollowUp(contactToEdit.nextFollowUp || '');
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setOrganization('');
      setRole('');
      setWebsite('');
      setResearchNotes('');
      setTagsInput('');
      setStatus('Not Contacted');
      setLastContacted('');
      setNextFollowUp('');
    }
    setErrors({});
  }, [contactToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!organization.trim()) errs.organization = 'Organization is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      organization: organization.trim(),
      role: role.trim(),
      website: website.trim(),
      researchNotes: researchNotes.trim(),
      tags: parsedTags,
      status,
      lastContacted: lastContacted.trim() || null,
      nextFollowUp: nextFollowUp.trim() || null,
      draftSubject: contactToEdit?.draftSubject || '',
      draftBody: contactToEdit?.draftBody || '',
      draftUpdatedAt: contactToEdit?.draftUpdatedAt,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              {contactToEdit ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {contactToEdit ? 'Edit Contact Profile' : 'Add New Outreach Contact'}
              </h2>
              <p className="text-xs text-slate-500">
                {contactToEdit
                  ? 'Update contact info, outreach stage, or background notes'
                  : 'Add a prospective mentor, keynote speaker, or sponsor'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Eleanor"
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  errors.firstName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600`}
              />
              {errors.firstName && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Vance"
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  errors.lastName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600`}
              />
              {errors.lastName && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Email & Organization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. e.vance@university.edu"
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600`}
              />
              {errors.email && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organization / Institution <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Pacific Coast University"
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  errors.organization ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600`}
              />
              {errors.organization && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.organization}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Role & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Associate Professor of Robotics"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Website / Profile URL
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.edu/lab"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Row 4: Status & Follow-up Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Outreach Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContactStatus)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Last Contacted Date
              </label>
              <input
                type="date"
                value={lastContacted}
                onChange={(e) => setLastContacted(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Next Follow-up Due
              </label>
              <input
                type="date"
                value={nextFollowUp}
                onChange={(e) => setNextFollowUp(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tags <span className="font-normal text-slate-400">(separate with commas)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Keynote Speaker, Industry Sponsor, Robotics, Alumni"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Research Notes */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Research Notes & Personalization Context
              </label>
              <span className="text-[11px] text-slate-400">
                Used by volunteers & future Gemini generator
              </span>
            </div>
            <textarea
              rows={4}
              value={researchNotes}
              onChange={(e) => setResearchNotes(e.target.value)}
              placeholder="Summarize recent publications, news articles, mutual connections, mentorship interests, or specific symposium talk ideas..."
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              {contactToEdit ? 'Save Changes' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
