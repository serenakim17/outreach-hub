import { GoogleGenAI } from '@google/genai';

// Tells Vercel to allow up to 30 seconds (requires Pro plan; defaults to 10s on Hobby)
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
    } = req.body || {};

    const systemInstruction = `You are writing a concise, warm, personalized student outreach email on behalf of STEMsters.

FACTUAL GUARDRAIL:
- STEMsters provides hands-on STEM workshops and kits ($50 per kit/workshop).

WRITING INSTRUCTIONS:
- Focus on the recipient (${contactName}), role (${role}), organization (${organization}), and Research Notes: "${researchNotes || 'STEM leadership'}".
- Keep it brief (3 short paragraphs max).
- Return ONLY valid JSON with keys "subject" and "body".`;

    const ai = new GoogleGenAI({ apiKey });

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
    console.error('Email generation failed:', error);
    
    // Fallback response with cleaned notes to prevent double periods and spacing artifacts
    const { contactName, organization, researchNotes } = req.body || {};
    const cleanedNotes = researchNotes ? researchNotes.trim().replace(/\.$/, '') : '';

    return res.status(200).json({
      subject: `STEMsters Hands-On Workshop Collaboration — ${organization || 'Partnership'}`,
      body: `Dear ${contactName || 'Colleague'},\n\nI hope this message finds you well. I wanted to reach out regarding potential student outreach opportunities with ${organization || 'your institution'}.\n\n${cleanedNotes ? `I was particularly inspired by your work on ${cleanedNotes}. ` : ''}Our student alliance at STEMsters coordinates hands-on engineering workshops and kits ($50 per kit/workshop).\n\nWould you be open to a brief 10-minute introductory conversation next term?\n\nBest regards,\nThe STEMsters Team`,
    });
  }
}
