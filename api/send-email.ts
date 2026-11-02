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
  htmlBody?: string; // Optional: for rich formatting
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

  const { toEmail, subject, body, htmlBody }: SendEmailBody = req.body || {};

  if (!toEmail || !subject || !body) {
    return res.status(400).json({ error: 'Recipient email, subject, and body are required.' });
  }

  try {
    const data = await resend.emails.send({
      from: 'Outreach Hub <onboarding@resend.dev>',
      to: [toEmail],
      subject: subject,
      text: body,
      // Automatically convert line breaks to HTML if htmlBody isn't explicitly provided
      html: htmlBody || body.replace(/\n/g, '<br>'),
    });

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to deliver email through provider.' });
  }
}
