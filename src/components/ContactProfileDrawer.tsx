import React from 'react';
import { Contact } from '../types';
import {
  X,
  Mail,
  Edit2,
  Building,
  Globe,
  Calendar,
  Tag,
  FileText,
  Clock,
} from 'lucide-react';

interface ContactProfileDrawerProps {
  contact: Contact | null;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onCompose: (contact: Contact) => void;
}

export const ContactProfileDrawer: React.FC<ContactProfileDrawerProps> = ({
  contact,
  onClose,
  onEdit,
  onCompose,
}) => {
  if (!contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div>
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {contact.firstName} {contact.lastName}
                </h2>
                {contact.isSample && (
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                    Demo
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                {contact.role || 'No title'}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{contact.organization}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Details */}
          <div className="p-6 space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto text-xs">
            {/* Status & Key Dates */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 text-[11px] block">Current Status</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 inline-block">
                  {contact.status}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Next Follow-up</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 inline-block">
                  {contact.nextFollowUp || 'None scheduled'}
                </span>
              </div>
            </div>

            {/* Contact Metadata */}
            <div className="space-y-2">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-400">
                Contact Information
              </h3>
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${contact.email}`} className="text-indigo-600 hover:underline">
                    {contact.email}
                  </a>
                </div>
                {contact.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                    <a
                      href={contact.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-600 hover:text-slate-900 truncate"
                    >
                      {contact.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Last Contacted: {contact.lastContacted || 'Never'}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {contact.tags && contact.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {contact.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[11px] bg-slate-100 text-slate-700 rounded-md border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Research Notes Dossier */}
            <div className="space-y-2">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Research Dossier & Notes
              </h3>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                {contact.researchNotes || 'No research notes recorded for this contact yet.'}
              </div>
            </div>

            {/* Saved Email Draft Preview */}
            {contact.draftSubject && (
              <div className="space-y-2">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Current Saved Draft
                </h3>
                <div className="p-3.5 bg-purple-50/50 border border-purple-200 rounded-xl text-slate-800 space-y-1.5">
                  <div className="font-semibold text-purple-900">Subject: {contact.draftSubject}</div>
                  <div className="text-slate-600 line-clamp-3 text-[11px] leading-relaxed">
                    {contact.draftBody}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Quick Action Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
          <button
            onClick={() => onCompose(contact)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Compose Email</span>
          </button>
          <button
            onClick={() => onEdit(contact)}
            className="inline-flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
};