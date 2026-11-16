import { GoogleGenAI } from '@google/genai';

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

    const systemInstruction = `You are writing a concise, warm, personalized student outreach email on behalf of STEMsters.

FACTUAL GUARDRAIL (Never invent or contradict these STEMsters facts):
- STEMsters is a student-led organization providing hands-on STEM workshops and kits ($50 per kit/workshop).
- Never make up unverified statistics, grants, or programs.

WRITING INSTRUCTIONS:
- Focus 90% of the email on the recipient (${contactName}), their role (${role}), their organization (${organization}), and these specific Research Notes: "${researchNotes || 'Their leadership in STEM education'}".
- Keep it brief (3 short paragraphs max). Do not dump STEMsters pricing or policy details unless directly relevant to the research notes.
- Sign off naturally from ${volunteerName || 'the STEMsters team'} (do not add a full signature block, as the app appends it automatically).
- Return ONLY valid JSON with keys "subject" and "body".`;

    const ai = new GoogleGenAI({ apiKey });

    let rawText = '';
    
    // Try primary model, fallback to 2.5-flash if 503 unavailable
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Write a short outreach email to ${contactName || 'the recipient'} at ${organization || 'their organization'} using these notes: "${researchNotes || 'STEM outreach collaboration'}".`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingBudget: 0 },
        },
      });
      rawText = response.text || '';
    } catch (primaryError) {
      console.warn('Primary model busy, falling back to gemini-2.5-flash...', primaryError);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a short outreach email to ${contactName || 'the recipient'} at ${organization || 'their organization'} using these notes: "${researchNotes || 'STEM outreach collaboration'}".`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });
      rawText = fallbackResponse.text || '';
    }

    const cleanedJson = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);

    return res.status(200).json({
      subject: parsed.subject,
      body: parsed.body,
    });
  } catch (error: any) {
    console.warn('Gemini API busy or timed out. Using instant grounded fallback draft...', error);
    
    // Instant fallback grounded in STEMsters knowledge base
    const { contactName, organization, researchNotes } = req.body || {};
    const fallbackSubject = `STEMsters Hands-On Workshop Collaboration — ${organization || 'Partnership'}`;
    const fallbackBody = `Dear ${contactName || 'Colleague'},\n\nI hope this message finds you well. I have been following ${organization || 'your institution'}'s remarkable work and wanted to reach out regarding potential student outreach opportunities.\n\n${researchNotes ? `I was particularly inspired by your work on ${researchNotes}. ` : ''}Our student alliance at STEMsters coordinates hands-on engineering workshops and kits ($50 per kit/workshop) designed to empower aspiring collegiate and local high school engineers.\n\nWould you be open to a brief 10-minute introductory conversation next term to explore a potential collaboration?\n\nThank you for your time and leadership in STEM.`;

    return res.status(200).json({
      subject: fallbackSubject,
      body: fallbackBody,
    });
  }
}
