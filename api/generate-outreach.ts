import { GoogleGenAI } from '@google/genai';

export const maxDuration = 30;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY in Vercel environment variables.' });
    }

    const {
      contactName,
      organization,
      role,
      researchNotes,
      volunteerName,
    } = req.body || {};

    const systemInstruction = `You are writing a concise, warm, personalized student outreach email on behalf of STEMsters${volunteerName ? ` (sent by ${volunteerName})` : ''}.

FACTUAL GUARDRAILS (ONLY USE THESE FACTS ABOUT STEMSTERS):
- Identity & Reach: STEMsters is a 501(c)(3) student-led non-profit founded in 2023 by high schoolers (currently led by President Sydney Chau and VP Max Sun). We have reached over 8,520 K-5 students across 20 states, with 165+ chapters across the U.S. and internationally, and 84 partners worldwide (including LAUSD, SFUSD, NYC Schools, Chicago Public Schools, YMCA, Boys & Girls Clubs, and local libraries).
- Mission: Organized entirely by high school students to bring hands-on STEM education to elementary students (K-5) and lift underrepresented populations toward greater economic mobility.
- Program Structure: Workshops generally last 1 hour—starting with a 15-minute presentation introducing core vocabulary and concepts with worksheets, followed by a 45-minute interactive group project where students build, test, and troubleshoot designs.
- Curriculum: Covers physics, robotics & engineering, chemistry, biology & life science, environmental science, and coding & computer science, emphasizing teamwork and problem-solving.
- Press Recognition: Featured in outlets such as Pasadena Star News, Hey SoCal, Richmond Times Dispatch, Cross Timbers Gazette, and Oak Cliff Advocate.
- IMPORTANT: Do NOT mention "$50 per kit/workshop" or any pricing unless explicitly asked.

WRITING INSTRUCTIONS:
- Tailor the pitch to the recipient (${contactName || 'the recipient'}), their role (${role || 'Educator/Leader'}), their organization (${organization || 'their organization'}), and Research Notes: "${researchNotes || 'STEM leadership'}".
- Select only the 1-2 most relevant STEMsters facts (e.g., matching their region/school type or highlighting the 1-hour hands-on workshop format) so the email feels tailored rather than copy-pasted.
- Keep it brief (3 short paragraphs max) with a clear, low-friction call to action (e.g., a brief 10-minute chat).
- Return ONLY valid JSON with keys "subject" and "body".`;

    const ai = new GoogleGenAI({ apiKey });

    // Uses gemini-2.5-flash to match dashboard configuration and prevent Vercel timeouts
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write an outreach email to ${contactName || 'the recipient'} at ${organization || 'their organization'}.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '';
    const cleanedJson = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);

    return res.status(200).json({
      subject: parsed.subject,
      body: parsed.body,
    });
  } catch (error: any) {
    console.warn('Using instant fallback draft due to API delay or error:', error);
    
    const { contactName, organization, researchNotes, volunteerName } = req.body || {};
    return res.status(200).json({
      subject: `Bringing Hands-On K–5 STEM Workshops to ${organization || 'Your Students'} — STEMsters`,
      body: `Dear ${contactName || 'Colleague'},\n\nI hope this message finds you well. ${researchNotes ? `I was particularly inspired by your work around ${researchNotes}, and wanted` : 'I wanted'} to reach out regarding bringing peer-led STEM programming to ${organization || 'your institution'}.\n\nSTEMsters is a 501(c)(3) high school student-led non-profit that has reached over 8,520 K–5 students across 165+ chapters nationwide. Our 1-hour workshops combine a 15-minute interactive vocabulary and concept lesson with a 45-minute hands-on group engineering or science project.\n\nWould you be open to a brief 10-minute introductory call next week to explore a potential partnership?\n\nBest regards,\n${volunteerName ? `${volunteerName}\n` : ''}The STEMsters Outreach Team`,
    });
  }
}
