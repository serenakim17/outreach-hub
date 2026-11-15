import { buildEmailSystemPrompt } from './knowledgeBase';

export interface ApiRequest {
  method?: string;
  body: any;
}

export interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (data: any) => any;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}

interface GenerateRequestBody {
  contactName: string;
  organization: string;
  role: string;
  researchNotes: string;
  volunteerName: string;
  volunteerRole: string;
  organizationName: string;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    contactName,
    organization,
    role,
    researchNotes,
    volunteerName,
    volunteerRole,
    organizationName,
  }: GenerateRequestBody = req.body;

  if (!contactName || !organization) {
    return res.status(400).json({ error: 'Missing required contact fields.' });
  }

  // 1. BUILD THE GROUNDED SYSTEM PROMPT FROM YOUR KNOWLEDGE BASE
  const systemInstructionText = buildEmailSystemPrompt({
    centerName: organization,
    contactName: contactName,
    contactRole: role,
    notes: researchNotes,
  });

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      status: 'placeholder',
      subject: `Collaboration Opportunity with ${organizationName}`,
      body: `Dear ${contactName},\n\nI hope this email finds you well. I am reaching out on behalf of ${organizationName} regarding your work as ${role} at ${organization}.\n\n[Personalized detail based on: "${researchNotes || 'your recent contributions'}"]\n\nWe would love to connect for a short 15-minute call to explore potential collaboration.\n\nBest regards,\n${volunteerName}\n${volunteerRole} | ${organizationName}`,
    });
  }

  try {
    // 2. KEEP YOUR USER PROMPT CLEAN & FOCUSED ON TASK
    const userPrompt = `Write a professional, warm outreach email inviting ${contactName} (${role} at ${organization}) to host a STEMsters workshop. Sign off as ${volunteerName}, ${volunteerRole}. Return output strictly as JSON with keys "subject" and "body".`;

    const endpointUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' +
      encodeURIComponent(apiKey as string);

    // 3. PASS THE SYSTEM INSTRUCTION TO GEMINI
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstructionText }]
        },
        contents: [{ parts: [{ text: userPrompt }] }],
      }),
    });

    const data = await response.json();
    return res.status(200).json({ status: 'success', data });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate outreach text.' });
  }
}
