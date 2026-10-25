import React, { useState } from 'react';
import { useOutreach } from '../context/OutreachContext';
import {
  FileSpreadsheet,
  Sparkles,
  Mail,
  ShieldAlert,
  Clock,
  Building,
  User,
  Signature,
  Save,
  Download,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Info,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, contacts, resetToSampleData, addToast } = useOutreach();

  const [orgName, setOrgName] = useState(settings.organizationName);
  const [volunteerName, setVolunteerName] = useState(settings.volunteerName);
  const [volunteerRole, setVolunteerRole] = useState(settings.volunteerRole);
  const [followUpDays, setFollowUpDays] = useState(settings.defaultFollowUpDays);
  const [emailSignature, setEmailSignature] = useState(settings.emailSignature);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      organizationName: orgName.trim() || 'Student Outreach Alliance',
      volunteerName: volunteerName.trim() || 'Student Volunteer',
      volunteerRole: volunteerRole.trim() || 'Outreach Member',
      defaultFollowUpDays: Number(followUpDays) || 3,
      emailSignature: emailSignature,
    });
  };

  const handleExportData = () => {
    const exportObject = {
      exportedAt: new Date().toISOString(),
      organization: orgName,
      settings: {
        organizationName: orgName,
        volunteerName,
        volunteerRole,
        defaultFollowUpDays: followUpDays,
      },
      contactsCount: contacts.length,
      contacts,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `outreach_hub_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Contacts and outreach settings exported as JSON.', 'success');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to restore the default sample contacts and preferences? Your custom changes in local storage will be replaced.')) {
      resetToSampleData();
      setOrgName('STEM Outreach Student Alliance');
      setVolunteerName('Alex Rivera');
      setVolunteerRole('VP of Outreach & Partnerships');
      setFollowUpDays(3);
      setEmailSignature(`Best regards,\nAlex Rivera\nVP of Outreach & Partnerships | STEM Outreach Student Alliance\nUniversity Chapter #142 · outreach@stemalliance-student.org`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Informational Header */}
      <div className="p-4 bg-slate-900 text-slate-200 rounded-xl border border-slate-800">
        <h2 className="text-base font-bold text-white">System Settings & Integrations</h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Configure local outreach preferences, volunteer profile signatures, and review external service integration blueprints.
        </p>
      </div>

      {/* External Service Connections (Integration Placeholders) */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">External Cloud Integrations</h3>
          <p className="text-xs text-slate-500">
            These services will be connected by backend developers. Status is currently <span className="font-semibold text-slate-700">Not Connected</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Google Sheets */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                  Not Connected
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">Google Sheets Sync</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Two-way synchronization for contact rosters, lead scoring, and collaborative student club spreadsheets.
                </p>
              </div>

              <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono space-y-1">
                <div className="text-slate-400 font-sans">Scope Requirement:</div>
                <div className="truncate">spreadsheets.readonly / .readwrite</div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                disabled
                title="Backend developers will connect Google Sheets integration."
                className="w-full py-2 px-3 text-xs font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed text-center"
              >
                Connect Sheets (Pending)
              </button>
            </div>
          </div>

          {/* Card 2: Gemini API */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                  Not Connected
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">Gemini 2.5 Flash AI</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Generates tailored introductory messages and personalized outreach drafts from contact research dossiers.
                </p>
              </div>

              <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono space-y-1">
                <div className="text-slate-400 font-sans">Server Route:</div>
                <div className="truncate">/api/gemini/generate-outreach</div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                disabled
                title="Backend developers will inject GEMINI_API_KEY server-side."
                className="w-full py-2 px-3 text-xs font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed text-center"
              >
                Configure Gemini (Pending)
              </button>
            </div>
          </div>

          {/* Card 3: Gmail API */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                  Not Connected
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">Gmail Send & Reply Tracker</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  OAuth integration for one-click approval email sends directly from student club Google Workspace inboxes.
                </p>
              </div>

              <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono space-y-1">
                <div className="text-slate-400 font-sans">OAuth Scopes:</div>
                <div className="truncate">gmail.send, gmail.readonly</div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                disabled
                title="Backend developers will configure OAuth client credentials."
                className="w-full py-2 px-3 text-xs font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed text-center"
              >
                Connect Gmail (Pending)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Organization & Volunteer Profile Form */}
      <form onSubmit={handleSavePreferences} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-semibold text-slate-900">Organization & Volunteer Defaults</h3>
          <p className="text-xs text-slate-500">
            These values customize your email composer, signatures, and default follow-up cadence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Organization Name
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. STEM Outreach Student Alliance"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Follow-up Delay (Days)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="1"
                max="30"
                value={followUpDays}
                onChange={(e) => setFollowUpDays(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 font-mono tabular-nums focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Recommended for collegiate outreach: 3 to 5 business days.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Name (Volunteer)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={volunteerName}
                onChange={(e) => setVolunteerName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Role / Position
            </label>
            <input
              type="text"
              value={volunteerRole}
              onChange={(e) => setVolunteerRole(e.target.value)}
              placeholder="e.g. VP of Outreach & Partnerships"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Email Signature Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Email Signature
            </label>
            <span className="text-[11px] text-slate-400">Appended to generated and manual drafts</span>
          </div>
          <textarea
            rows={4}
            value={emailSignature}
            onChange={(e) => setEmailSignature(e.target.value)}
            placeholder="Best regards,&#10;Your Name&#10;Role | Organization Name&#10;Email: outreach@example.org"
            className="w-full px-3.5 py-2.5 text-xs font-mono rounded-lg border border-slate-300 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Local Storage & Data Management */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-semibold text-slate-900">Local Data Management</h3>
          <p className="text-xs text-slate-500">
            Contacts and email drafts are persisted securely in your browser's <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">localStorage</code>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-800">Export All Data (JSON)</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Download your full database of {contacts.length} contacts and outreach drafts.
            </p>
          </div>
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Contacts JSON</span>
          </button>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-semibold text-rose-800">Restore Sample Contacts</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Clear custom entries and restore the 3 fictional sample profiles for testing.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Demo Samples</span>
          </button>
        </div>
      </div>
    </div>
  );
};
