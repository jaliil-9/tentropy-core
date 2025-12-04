'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
        return { error: 'Please fill in all fields' };
    }

    try {
        await resend.emails.send({
            from: 'TENTROPY Contact <onboarding@resend.dev>',
            to: 'jalilbouziane09@gmail.com',
            subject: `New Contact Form Submission from ${name}`,
            replyTo: email,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });

        return { success: true };
    } catch (error) {
        console.error('Resend error:', error);
        return { error: 'Failed to send message. Please try again.' };
    }
}
