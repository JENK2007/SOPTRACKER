import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3006;

app.use(cors());
app.use(express.json());

// Endpoint: Send Email Notification
// Credentials come exclusively from the request body (entered by user in the UI)
// No passwords or emails are read from .env or server files
app.post('/api/notify/email', async (req, res) => {
  const { to, subject, message, credentials, provider } = req.body;
  const emailUser = credentials?.emailUser;
  const emailPass = credentials?.emailPass;
  const selectedProvider = provider || credentials?.emailProvider || 'gmail';

  if (!emailUser || !emailPass) {
    console.warn('Email credentials not provided in request. Simulating email send.');
    return res.status(200).json({ 
      success: true, 
      simulated: true, 
      message: 'Email simulated (No credentials entered by user in the UI yet).' 
    });
  }

  try {
    const isOutlook = 
      selectedProvider === 'outlook' || 
      emailUser.toLowerCase().includes('outlook') || 
      emailUser.toLowerCase().includes('hotmail') || 
      emailUser.toLowerCase().includes('office365') ||
      emailUser.toLowerCase().includes('live.com');

    // Create transport dynamically using credentials supplied by user
    const transporter = nodemailer.createTransport(
      isOutlook
        ? {
            service: 'hotmail',
            auth: {
              user: emailUser,
              pass: emailPass,
            },
          }
        : {
            service: 'gmail',
            auth: {
              user: emailUser,
              pass: emailPass,
            },
          }
    );

    const info = await transporter.sendMail({
      from: `"Global Work Command" <${emailUser}>`,
      to: to || emailUser,
      subject,
      text: message,
      html: `<div style="font-family: sans-serif; padding: 20px; background: #1c1917; color: #e7e5e4; border-radius: 12px;">
              <div style="border-bottom: 1px solid #44403c; padding-bottom: 16px; margin-bottom: 16px;">
                <h2 style="color: #10b981; margin: 0;">${subject}</h2>
                <p style="color: #a8a29e; font-size: 12px; margin-top: 4px;">Global Work Command Center</p>
              </div>
              <p style="font-size: 14px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
              <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #44403c;">
                <p style="color: #78716c; font-size: 11px;">This is an automated notification from your task management system.</p>
              </div>
             </div>`,
    });

    console.log('Email sent successfully: %s', info.messageId);
    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Error sending email:', error.message || error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to authenticate or send email. Please check your user email & password/app password.' 
    });
  }
});

// Endpoint: Send Teams Notification
// Webhook URL comes exclusively from the request body (entered by user in the UI)
// No webhooks are read from .env or server files
app.post('/api/notify/teams', async (req, res) => {
  const { title, text, webhookUrl } = req.body;

  if (!webhookUrl || typeof webhookUrl !== 'string' || webhookUrl.trim() === '') {
    console.warn('Teams Webhook URL not provided in request. Simulating Teams message.');
    return res.status(200).json({ 
      success: true, 
      simulated: true, 
      message: 'Teams message simulated (No Teams Webhook entered in the UI yet).' 
    });
  }

  try {
    const response = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "10b981",
        "summary": title,
        "sections": [{
          "activityTitle": title,
          "activitySubtitle": "Global Work Command Center",
          "text": text
        }]
      })
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Teams Webhook responded with status ${response.status}: ${errText}`);
    }

    console.log('Teams notification delivered successfully.');
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error sending to Teams:', error.message || error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send message to Microsoft Teams webhook.' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend notification server running on port ${PORT}`);
});
