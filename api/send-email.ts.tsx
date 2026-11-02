import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

interface SendEmailBody {
  toEmail: string;
  subject: string;
  body: string;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  // Set CORS headers so your frontend can talk to this API route smoothly
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { toEmail, subject, body }: SendEmailBody = req.body || {};

  if (!toEmail || !subject || !body) {
    return res.status(400).json({ error: 'Recipient email, subject, and body are required.' });
  }

  try {
    const data = await resend.emails.send({
      from: 'Outreach Hub <onboarding@resend.dev>',
      to: [toEmail],
      subject: subject,
      text: body,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to deliver email through provider.' });
  }
}
