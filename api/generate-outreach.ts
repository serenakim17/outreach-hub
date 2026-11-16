import { GoogleGenAI } from '@google/genai';
import { buildEmailSystemPrompt } from './knowledgeBase.js';

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

    const baseKnowledge = buildEmailSystemPrompt({
      centerName: organization || 'Partner Organization',
      contactName: contactName || 'Partner',
      contactRole: role || 'Community Leader',
      notes: researchNotes || '',
    });

    const systemInstruction = `${baseKnowledge}

IMPORTANT STYLE & FOCUS OVERRIDE:
- Center the email primarily around the recipient (${contactName}), their role (${role}), their organization (${organization}), and the specific Research Notes provided: "${researchNotes || 'General STEM community leadership'}".
- Keep the tone warm, concise, and tailored to the recipient's work, similar to a personalized student outreach note.
- Do NOT dump a list of STEMsters facts, prices, or policies into the initial email unless directly relevant.
- Use the STEMsters Knowledge Base strictly as a factual guardrail so that any mention of STEMsters is 100% accurate and never hallucinated.
- Sign off naturally from ${volunteerName || 'the STEMsters team'} (do not add an extra email signature block, as the app appends it automatically).`;

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Write a personalized outreach email to ${contactName || 'the recipient'} (${role || 'Leader'}) at ${organization || 'their organization'} based primarily on these research notes: "${researchNotes || 'Their work in STEM and education'}".`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingBudget: 0 },
        maxOutputTokens: 500,
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
    console.error('Error generating email:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate email with Gemini',
    });
  }
}
