import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: 'Recipient email, subject, and body are required.' },
        { status: 400 }
      );
    }

    const data = await resend.emails.send({
      from: 'Outreach Hub <onboarding@resend.dev>', // Default testing sender provided by Resend
      to: [to],
      subject: subject,
      text: body,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to deliver email through provider.' },
      { status: 500 }
    );
  }
}
