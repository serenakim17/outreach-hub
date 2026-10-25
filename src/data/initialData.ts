import { Contact, AppSettings, ActivityRecord } from '../types';

export const INITIAL_SETTINGS: AppSettings = {
  organizationName: 'STEM Outreach Student Alliance',
  volunteerName: 'Alex Rivera',
  volunteerRole: 'VP of Outreach & Partnerships',
  defaultFollowUpDays: 3,
  emailSignature: `Best regards,\nAlex Rivera\nVP of Outreach & Partnerships | STEM Outreach Student Alliance\nUniversity Chapter #142 · outreach@stemalliance-student.org`,
};

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'sample-contact-1',
    firstName: 'Eleanor',
    lastName: 'Vance',
    email: 'dr.e.vance.fictional@pcu-demo.edu',
    organization: 'Pacific Coast University',
    role: 'Associate Professor of Computer Science & Ethics in AI Lab',
    website: 'https://cs.pcu-demo.edu/faculty/evance',
    researchNotes:
      'Keynote candidate for the 2026 Fall Student Tech Symposium. Published "Inclusive AI Pedagogy" (March 2026). Previously faculty advisor for ACM-W. Passionate about undergraduate research access for underrepresented students. Receptive to structured invites with clear time commitments (45 min talk + 15 min Q&A). Prefers Monday/Thursday morning sessions.',
    tags: ['Keynote Candidate', 'Faculty Advisor', 'AI & Ethics', 'Higher Ed'],
    status: 'Follow-up Due',
    lastContacted: '2026-10-20',
    nextFollowUp: '2026-10-23',
    isSample: true,
    draftSubject: 'Checking in regarding Fall Tech Symposium Keynote invitation (PCU Student Chapter)',
    draftBody: `Dear Dr. Vance,

I hope your week is off to a wonderful start.

I am following up on our previous note regarding the Pacific Coast University Student Tech Symposium scheduled for November 14, 2026. Our student organizing committee was inspired by your recent paper on "Inclusive AI Pedagogy" and would be honored to host you for a 45-minute keynote address on ethical systems design.

We understand your schedule is exceptionally demanding. If an in-person keynote does not fit your calendar, we would also be delighted to host you for a hybrid fireside chat or panel discussion at your convenience.

Could we schedule a quick 10-minute briefing next week to share more details?`,
    draftUpdatedAt: '2026-10-20T14:32:00Z',
  },
  {
    id: 'sample-contact-2',
    firstName: 'Marcus',
    lastName: 'Chen',
    email: 'marcus.chen.demo@apexrobotics-fake.org',
    organization: 'Apex Robotics & Automation Labs',
    role: 'Senior Engineering Director & University Relations Lead',
    website: 'https://apexrobotics-fake.org/community-initiatives',
    researchNotes:
      'Apex provides annual $5,000 micro-grants for collegiate autonomous robotics teams. Marcus gave an inspiring talk at MakerExpo on first-generation STEM pathways. Stated interest in sponsoring local student hackathons and offering lab tours for collegiate robotics clubs. Looking for student organizations that actively run high school mentor pipelines.',
    tags: ['Industry Sponsor', 'Robotics', 'Hardware Grant', 'Mentor Network'],
    status: 'Draft Ready',
    lastContacted: null,
    nextFollowUp: null,
    isSample: true,
    draftSubject: 'Partnership Inquiry: Student Robotics Mentorship & Hackathon Sponsorship',
    draftBody: `Hi Marcus,

My name is Alex Rivera with the STEM Outreach Student Alliance. I enjoyed your keynote at MakerExpo highlighting the importance of early hands-on prototyping for aspiring engineers.

Our organization currently runs bi-weekly robotics build workshops reaching over 180 local high schoolers, staffed entirely by passionate undergraduate mentors. We are preparing for our Spring Autonomous Build Day and would love to explore a partnership with Apex Robotics.

We would be thrilled to feature Apex as our Title Workshop Sponsor and invite engineers from your team to serve as guest project judges.

Would you be open to a brief call this Thursday or Friday to discuss how we might collaborate?`,
    draftUpdatedAt: '2026-10-22T19:15:00Z',
  },
  {
    id: 'sample-contact-3',
    firstName: 'Sophia',
    lastName: 'Rodriguez',
    email: 's.rodriguez.sample@metroscience-demo.org',
    organization: 'Metro Science Discovery Center',
    role: 'Director of Youth Programs & Community Outreach',
    website: 'https://metroscience-demo.org/stem-explorers',
    researchNotes:
      'Runs the regional "K-12 Weekend Science Explorers" fair (over 1,200 youth and families). Needs 15-20 energetic student volunteers for interactive physics and coding demonstration booths. Replied on Tuesday expressing enthusiasm and requested our roster availability for November 21st.',
    tags: ['Community Partner', 'K-12 Outreach', 'Volunteer Venue', 'Weekend Fair'],
    status: 'Replied',
    lastContacted: '2026-10-18',
    nextFollowUp: null,
    isSample: true,
    draftSubject: 'Re: Student volunteer roster for K-12 Weekend Science Explorers',
    draftBody: `Hi Sophia,

Thank you so much for the enthusiastic response! Our student members are excited to staff the interactive physics and hands-on coding booths on November 21st.

We are currently compiling our confirmed volunteer shift roster and will send over the final headcount by Friday.`,
    draftUpdatedAt: '2026-10-21T11:00:00Z',
  },
];

export const INITIAL_ACTIVITIES: ActivityRecord[] = [
  {
    id: 'act-1',
    timestamp: '2026-10-23T16:45:00Z',
    contactId: 'sample-contact-1',
    contactName: 'Dr. Eleanor Vance',
    action: 'Follow-up Due',
    details: 'Scheduled 3-day follow-up reminder reached due date.',
    type: 'followup',
  },
  {
    id: 'act-2',
    timestamp: '2026-10-22T19:15:00Z',
    contactId: 'sample-contact-2',
    contactName: 'Marcus Chen',
    action: 'Draft Saved Locally',
    details: 'Drafted tailored outreach proposal highlighting student robotics workshops.',
    type: 'draft',
  },
  {
    id: 'act-3',
    timestamp: '2026-10-21T11:00:00Z',
    contactId: 'sample-contact-3',
    contactName: 'Sophia Rodriguez',
    action: 'Reply Logged',
    details: 'Partner confirmed interest in student demo booths for regional science fair.',
    type: 'status',
  },
  {
    id: 'act-4',
    timestamp: '2026-10-20T14:30:00Z',
    contactId: 'sample-contact-1',
    contactName: 'Dr. Eleanor Vance',
    action: 'Initial Outreach Recorded',
    details: 'Initial invitation for Fall Symposium keynote logged (waiting for response).',
    type: 'status',
  },
];
