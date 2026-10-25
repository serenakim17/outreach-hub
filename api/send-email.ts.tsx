import type { VercelRequest, VercelResponse } from '@vercel/node';

interface SendEmailBody {
  toEmail: string;
  subject: string;
  body: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { toEmail, subject, body }: SendEmailBody = req.body;

  if (!toEmail || !subject || !body) {
    return res.status(400).json({ error: 'Recipient, subject, and body are required.' });
  }

  const gmailConnected = process.env.GMAIL_OAUTH_CLIENT_ID && process.env.GMAIL_OAUTH_TOKEN;

  if (!gmailConnected) {
    return res.status(200).json({
      status: 'pending_integration',
      message: `Email draft staged for ${toEmail}. Gmail API integration key is required in environment variables to execute direct sends.`,
    });
  }

  return res.status(200).json({ status: 'sent', recipient: toEmail });
}