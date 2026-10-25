import React, { useState, useEffect, useRef } from 'react';
import { useOutreach } from '../context/OutreachContext';
import { StatusBadge } from './StatusBadge';
import {
  Sparkles,
  Save,
  Send,
  Copy,
  Check,
  Building2,
  Mail,
  BookOpen,
  Info,
  Clock,
  AlertTriangle,
  RotateCcw,
  Tag,
  ExternalLink,
} from 'lucide-react';

export const ComposerView: React.FC = () => {
  const {
    contacts,
    selectedContactIdForComposer,
    saveDraft,
    settings,
    addToast,
  } = useOutreach();

  // Active selected contact
  const [selectedId, setSelectedId] = useState<string>(
    selectedContactIdForComposer || contacts[0]?.id || ''
  );

  const activeContact = contacts.find((c) => c.id === selectedId) || contacts[0];

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showGeminiModal, setShowGeminiModal] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync draft from active contact
  useEffect(() => {
    if (activeContact) {
      setSelectedId(activeContact.id);
      setSubject(activeContact.draftSubject || '');
      setBody(activeContact.draftBody || '');
    }
  }, [activeContact?.id]);

  // Insert variable into body at cursor
  const insertVariable = (variableKey: string) => {
    let valueToInsert = variableKey;
    if (activeContact) {
      if (variableKey === '{{First Name}}') valueToInsert = activeContact.firstName;
      if (variableKey === '{{Last Name}}') valueToInsert = activeContact.lastName;
      if (variableKey === '{{Organization}}') valueToInsert = activeContact.organization;
      if (variableKey === '{{Role}}') valueToInsert = activeContact.role || 'Partner';
      if (variableKey === '{{My Organization}}') valueToInsert = settings.organizationName;
    }

    if (!textareaRef.current) {
      setBody((prev) => prev + valueToInsert);
      return;
    }

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const currentText = body;
    const newText = currentText.substring(0, start) + valueToInsert + currentText.substring(end);
    setBody(newText);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + valueToInsert.length, start + valueToInsert.length);
      }
    }, 0);
  };

  const handleSaveDraft = () => {
    if (!activeContact) return;
    saveDraft(activeContact.id, subject, body);
  };

  const handleCopy = () => {
    if (!activeContact) return;
    const fullText = `Subject: ${subject}\n\n${body}\n\n${settings.emailSignature}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    addToast('Subject and email body copied to clipboard!', 'info');
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Sample AI generation simulation for preview demonstration
  const handleLoadSampleAiDraft = () => {
    if (!activeContact) return;
    const generatedSubject = `Exploring STEM Collaboration with ${activeContact.organization} · ${settings.organizationName}`;
    const generatedBody = `Dear ${activeContact.firstName ? activeContact.firstName : 'Partner'},

I hope this message finds you well.

My name is ${settings.volunteerName || 'Alex Rivera'}, representing ${settings.organizationName}. I have been following ${activeContact.organization}'s remarkable work${
      activeContact.researchNotes ? `—specifically: "${activeContact.researchNotes.slice(0, 110)}..."` : ''
    } and was inspired to reach out directly.

Our student alliance coordinates hands-on outreach, career panels, and technical symposiums for over 200 aspiring collegiate engineers and local high schoolers. Given your background in ${activeContact.role || 'your field'}, we would be deeply honored to collaborate with you this academic term.

Could we schedule a brief 10-minute introductory conversation next week to explore potential partnership opportunities?

Thank you for your time and leadership in STEM.`;

    setSubject(generatedSubject);
    setBody(generatedBody);
    setShowGeminiModal(false);
    addToast('Loaded personalized demonstrative draft for review.', 'info');
  };

  if (!activeContact) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <Mail className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-800">No Contacts in Database</h3>
        <p className="text-xs text-slate-500 mt-1">Please add a contact first before composing an outreach email.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Banner Notice */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Local Composer Mode:</strong> Save Draft stores your writing in browser localStorage.
            Direct automated sending requires Gmail OAuth credentials to be configured by the backend team.
          </span>
        </div>
        <span className="font-mono text-[11px] text-amber-700 font-medium shrink-0 hidden sm:inline">
          No external API keys required
        </span>
      </div>

      {/* Main Split Layout: Context Dossier (Left) + Composer Editor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Dossier Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Recipient Contact
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} — {c.organization}
                </option>
              ))}
            </select>
          </div>

          {/* Contact Details Card */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {activeContact.firstName} {activeContact.lastName}
                </h4>
                <p className="text-slate-600 text-xs font-medium">{activeContact.role || 'Member'}</p>
              </div>
              <StatusBadge status={activeContact.status} size="sm" />
            </div>

            <div className="pt-2 border-t border-slate-200/80 space-y-1.5 text-slate-600">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium truncate">{activeContact.organization}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono text-[11px] truncate">{activeContact.email}</span>
              </div>
            </div>
          </div>

          {/* Research Notes Callout */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Research Notes for Personalization</span>
            </div>
            <div className="p-3 bg-indigo-50/40 rounded-lg border border-indigo-100 text-xs text-slate-700 leading-relaxed font-sans max-h-48 overflow-y-auto whitespace-pre-wrap">
              {activeContact.researchNotes ? (
                activeContact.researchNotes
              ) : (
                <span className="text-slate-400 italic">
                  No research notes recorded. Go to Contacts &gt; Edit to add personalized details.
                </span>
              )}
            </div>
          </div>

          {/* Quick Variable Chips */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Insert Variable into Body
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                '{{First Name}}',
                '{{Organization}}',
                '{{Role}}',
                '{{My Organization}}',
              ].map((token) => (
                <button
                  key={token}
                  type="button"
                  onClick={() => insertVariable(token)}
                  className="px-2 py-1 text-[11px] font-mono bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 rounded-md transition-colors"
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

          {/* Draft Metadata */}
          {activeContact.draftUpdatedAt && (
            <div className="text-[11px] text-slate-400 font-mono tabular-nums flex items-center gap-1.5 pt-2">
              <Clock className="w-3 h-3" />
              <span>Last saved: {new Date(activeContact.draftUpdatedAt).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Right Editor Panel (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-3 flex-wrap">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Email Draft Workspace</h3>
              <p className="text-xs text-slate-500">
                To: <span className="font-mono text-slate-700">{activeContact.email}</span>
              </p>
            </div>

            {/* AI Generator Button - Marked as Integration Pending */}
            <button
              onClick={() => setShowGeminiModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Generate with Gemini</span>
              <span className="text-[10px] bg-indigo-200/80 text-indigo-800 px-1.5 py-0.2 rounded-sm font-medium">
                Integration Pending
              </span>
            </button>
          </div>

          {/* Subject Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Invitation: Keynote Speaker for Fall Student Tech Symposium"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>

          {/* Body Field */}
          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Body
            </label>
            <textarea
              ref={textareaRef}
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your personalized outreach email here. Incorporate the research notes on the left for genuine connection..."
              className="w-full flex-1 px-3.5 py-3 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 leading-relaxed font-sans"
            />
          </div>

          {/* Signature Preview */}
          <div className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg text-xs text-slate-600">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
              Automatic Organization Signature
            </span>
            <div className="font-mono text-[11px] whitespace-pre-wrap text-slate-700">
              {settings.emailSignature}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied to Clipboard' : 'Copy Subject & Body'}</span>
            </button>

            <div className="flex items-center gap-2 justify-end">
              {/* Save Draft Button - Works Locally */}
              <button
                onClick={handleSaveDraft}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-indigo-600" />
                <span>Save Draft (Local)</span>
              </button>

              {/* Approve & Send Button - Clearly labeled 'Connect Gmail to enable' */}
              <button
                disabled
                title="Direct sending requires Google Workspace OAuth connection to be completed by the backend team."
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed opacity-80"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Connect Gmail to enable</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gemini AI Integration Pending Modal */}
      {showGeminiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Gemini AI Outreach Assistant
                  </h3>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">
                    Backend Integration Pending
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <p>
                <strong>Architecture Notice:</strong> The server-side Gemini integration route (<code className="bg-slate-200 px-1 py-0.5 rounded font-mono">/api/gemini/generate-outreach</code>) will use the modern Google Gen AI SDK (<code className="bg-slate-200 px-1 py-0.5 rounded font-mono">@google/genai</code>) to synthesize outreach text using:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                <li>Recipient background: <em>{activeContact.firstName} {activeContact.lastName} ({activeContact.role} at {activeContact.organization})</em></li>
                <li>Research Dossier notes: <em>{activeContact.researchNotes ? activeContact.researchNotes.slice(0, 90) + '...' : 'No notes'}</em></li>
                <li>Student organization context: <em>{settings.organizationName}</em></li>
              </ul>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-900">
              <p className="font-semibold mb-1">Preview Demonstrative Draft:</p>
              <p className="text-[11px] text-indigo-800">
                You can insert a sample synthesized draft into the editor right now to experience how the finished workflow will function once API keys are connected.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowGeminiModal(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={handleLoadSampleAiDraft}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Load Demonstrative Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
