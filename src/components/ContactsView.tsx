import React, { useState, useMemo } from 'react';
import { useOutreach } from '../context/OutreachContext';
import { Contact, ContactStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { ContactModal } from './ContactModal';
import { ContactProfileDrawer } from './ContactProfileDrawer';
import {
  Search,
  Filter,
  Plus,
  PenSquare,
  Edit2,
  Trash2,
  Eye,
  Building2,
  Calendar,
  Globe,
  Tag,
  X,
  FileSpreadsheet,
} from 'lucide-react';

const STATUS_FILTERS: (ContactStatus | 'All')[] = [
  'All',
  'Not Contacted',
  'Draft Ready',
  'Sent',
  'Follow-up Due',
  'Replied',
  'Paused',
  'Opted Out',
];

export const ContactsView: React.FC = () => {
  const {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    openComposerForContact,
  } = useOutreach();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ContactStatus | 'All'>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Modals & Drawer state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const [selectedProfileContact, setSelectedProfileContact] = useState<Contact | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    contacts.forEach((c) => {
      c.tags?.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet);
  }, [contacts]);

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      // Status filter
      if (selectedStatus !== 'All' && c.status !== selectedStatus) {
        return false;
      }

      // Tag filter
      if (selectedTag !== 'All' && !c.tags?.includes(selectedTag)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
        const org = (c.organization || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        const role = (c.role || '').toLowerCase();
        const notes = (c.researchNotes || '').toLowerCase();
        const tags = (c.tags || []).join(' ').toLowerCase();

        return (
          fullName.includes(query) ||
          org.includes(query) ||
          email.includes(query) ||
          role.includes(query) ||
          notes.includes(query) ||
          tags.includes(query)
        );
      }

      return true;
    });
  }, [contacts, selectedStatus, selectedTag, searchQuery]);

  const handleDelete = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      deleteContact(contact.id);
      if (selectedProfileContact?.id === contact.id) {
        setSelectedProfileContact(null);
      }
    }
  };

  const handleEdit = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation();
    setContactToEdit(contact);
    setIsAddModalOpen(true);
  };

  const handleCompose = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation();
    openComposerForContact(contact.id);
  };

  const handleSaveContact = (data: Omit<Contact, 'id' | 'isSample'>) => {
    if (contactToEdit) {
      updateContact(contactToEdit.id, data);
      if (selectedProfileContact?.id === contactToEdit.id) {
        setSelectedProfileContact({ ...selectedProfileContact, ...data });
      }
    } else {
      addContact(data);
    }
    setContactToEdit(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Controls Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, organization, tags, research notes..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ContactStatus | 'All')}
              aria-label="Filter contacts by status"
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-hidden focus:border-indigo-600"
            >
              {STATUS_FILTERS.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              aria-label="Filter contacts by tag"
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-hidden focus:border-indigo-600"
            >
              <option value="All">All Tags ({allTags.length})</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  Tag: {tag}
                </option>
              ))}
            </select>
          )}

          {/* Add Contact Button */}
          <button
            onClick={() => {
              setContactToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Contacts Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Header Bar */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Outreach Contacts</span>
            <span>·</span>
            <span className="font-mono tabular-nums">{filteredContacts.length} shown</span>
            {filteredContacts.length !== contacts.length && (
              <span className="text-slate-400 font-mono tabular-nums">({contacts.length} total)</span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Click any row to open full research dossier
          </span>
        </div>

        {/* Table Content */}
        {filteredContacts.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">No matching contacts found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedStatus !== 'All' || selectedTag !== 'All'
                ? 'Try clearing active filters or refining your search term.'
                : 'Get started by adding your first keynote candidate, mentor, or sponsor.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              {(searchQuery || selectedStatus !== 'All' || selectedTag !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('All');
                    setSelectedTag('All');
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => {
                  setContactToEdit(null);
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Add Contact
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50/70 font-semibold">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Organization & Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Contacted</th>
                  <th className="py-3 px-4">Next Follow-up</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => setSelectedProfileContact(contact)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {contact.firstName} {contact.lastName}
                        </span>
                        {contact.isSample && (
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                            Sample
                          </span>
                        )}
                      </div>
                      {contact.tags && contact.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                          <span className="truncate max-w-[200px]">{contact.tags.join(' · ')}</span>
                        </div>
                      )}
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4">
                      <span className="text-slate-600 font-mono text-[11px] select-all">
                        {contact.email}
                      </span>
                    </td>

                    {/* Organization & Role */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{contact.organization}</div>
                      <div className="text-slate-500 text-[11px] truncate max-w-[220px]">
                        {contact.role || '—'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={contact.status} size="sm" />
                    </td>

                    {/* Last Contacted */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono tabular-nums text-slate-600 text-[11px]">
                      {contact.lastContacted || '—'}
                    </td>

                    {/* Next Follow-up */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono tabular-nums text-slate-600 text-[11px]">
                      {contact.nextFollowUp ? (
                        <span className="text-amber-700 font-medium">{contact.nextFollowUp}</span>
                      ) : (
                        '—'
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleCompose(contact, e)}
                          title="Draft or Edit Email"
                          className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          <PenSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProfileContact(contact);
                          }}
                          title="View Profile Dossier"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleEdit(contact, e)}
                          title="Edit Contact"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(contact, e)}
                          title="Delete Contact"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <ContactModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setContactToEdit(null);
        }}
        onSubmit={handleSaveContact}
        contactToEdit={contactToEdit}
      />

      {/* Profile Dossier Drawer */}
      <ContactProfileDrawer
        contact={selectedProfileContact}
        onClose={() => setSelectedProfileContact(null)}
        onEdit={(c) => {
          setSelectedProfileContact(null);
          setContactToEdit(c);
          setIsAddModalOpen(true);
        }}
      />
    </div>
  );
};
