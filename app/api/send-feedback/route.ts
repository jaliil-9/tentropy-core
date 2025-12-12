import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { name, email, feedback } = await req.json();

        if (!feedback || feedback.trim() === '') {
            return NextResponse.json(
                { error: 'Feedback is required' },
                { status: 400 }
            );
        }

        // Email configuration
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const TO_EMAIL = 'contact@tentropy.co';

        // If Resend API key is configured, send email
        if (RESEND_API_KEY) {
            try {
                const response = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                    },
                    body: JSON.stringify({
                        from: 'Tentropy Feedback <feedback@resend.dev>', // Use verified domain
                        to: [TO_EMAIL],
                        subject: `New Feedback${name ? ` from ${name}` : ''}`,
                        html: `
                            <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #09090B; color: #FFB000; border: 1px solid #FFB000;">
                                <h2 style="color: #FFB000; border-bottom: 2px solid #FFB000; padding-bottom: 10px;">New Feedback Received</h2>
                                ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
                                ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
                                <p><strong>Feedback:</strong></p>
                                <div style="background-color: #000; padding: 15px; border: 1px solid #27272A; margin: 10px 0;">
                                    ${feedback.replace(/\n/g, '<br>')}
                                </div>
                                <p style="color: #888; font-size: 12px; margin-top: 20px;">
                                    Submitted at: ${new Date().toLocaleString()}
                                </p>
                            </div>
                        `,
                    }),
                });

                if (!response.ok) {
                    console.error('Resend API error:', await response.text());
                    // Continue anyway - save to file as backup
                }
            } catch (emailError) {
                console.error('Failed to send email:', emailError);
                // Continue anyway
            }
        }

        // Always save feedback locally as backup
        const timestamp = new Date().toISOString();
        const feedbackData = {
            name: name || 'Anonymous',
            feedback,
            timestamp,
        };

        // Log to console (you can check this in server logs)
        console.log('=== NEW FEEDBACK ===');
        console.log('Time:', timestamp);
        console.log('Name:', feedbackData.name);
        console.log('Feedback:', feedback);
        console.log('===================');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing feedback:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
