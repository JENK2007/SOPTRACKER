# Global Work Command Center (Task & SOP Tracker)

A modern web application designed to help teams track operational tasks, manage handoffs, and send automatic role-based notifications to Outlook/Gmail and Microsoft Teams.

## 🚀 Run Locally

**Prerequisites:** Node.js (v18+)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start both the web app and the notification server:
   ```bash
   npm run dev
   ```

3. Open your browser:
   - Frontend UI: `http://localhost:3000`
   - Backend API: `http://localhost:3005`

---

## 🔔 Email & Microsoft Teams Notifications

> **Security Note:** You **do not** need to edit or put any passwords or emails inside `.env` or code files!

All credentials are entered by users directly inside the web application:

1. Click **"Email & Teams"** in the top navigation bar (or **"Email & Teams Setup"** on the Dashboard).
2. **Choose your email provider:**
   - **Google / Gmail**: Enter your Gmail address and 16-character Google App Password.
   - **Microsoft Outlook / Office 365**: Enter your Outlook/Office 365 email and password or app password.
3. **Microsoft Teams**:
   - In Microsoft Teams, go to your channel &rarr; **⋯** &rarr; **Connectors / Workflows** &rarr; add **Incoming Webhook** &rarr; copy the URL.
   - Paste the Webhook URL into the Teams field in the web page.
4. Click **"Send Test Email"** or **"Send Test Teams Message"** to verify immediately.
5. Click **"Save Integration Settings"**.

Now, whenever a Senior Leader/Manager creates or assigns a task, or when an Execution Owner completes a task, alerts are automatically sent!
