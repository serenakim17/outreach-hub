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
    } = req.body || {};

    const systemInstruction = buildEmailSystemPrompt({
      centerName: organization || 'Partner Organization',
      contactName: contactName || 'Partner',
      contactRole: role || 'Community Leader',
      notes: researchNotes || '',
    });

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Write a personalized STEMsters outreach email to ${contactName || 'the recipient'} at ${organization || 'their organization'}.`,
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
    console.error('Error generating email:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate email with Gemini',
    });
  }
}
