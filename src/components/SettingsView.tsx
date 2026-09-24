import React, { useState, useEffect } from 'react';
import { ViewRoute, NotificationSettings } from '../types';
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Shield,
  Settings as SettingsIcon,
  Send,
  Loader2,
  ExternalLink,
  HelpCircle,
  Check,
} from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsViewProps {
  onRouteChange: (route: ViewRoute) => void;
  settings: NotificationSettings;
  onSaveSettings: (settings: NotificationSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onRouteChange,
  settings,
  onSaveSettings,
}) => {
  const [emailProvider, setEmailProvider] = useState<'gmail' | 'outlook'>(
    settings.emailProvider || 'gmail'
  );
  const [emailUser, setEmailUser] = useState(settings.emailUser || '');
  const [emailPass, setEmailPass] = useState(settings.emailPass || '');
  const [teamsWebhookUrl, setTeamsWebhookUrl] = useState(settings.teamsWebhookUrl || '');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testingTeams, setTestingTeams] = useState(false);
  const [testResult, setTestResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setEmailProvider(settings.emailProvider || 'gmail');
    setEmailUser(settings.emailUser || '');
    setEmailPass(settings.emailPass || '');
    setTeamsWebhookUrl(settings.teamsWebhookUrl || '');
  }, [settings]);

  const handleSave = () => {
    onSaveSettings({
      emailProvider,
      emailUser: emailUser.trim(),
      emailPass: emailPass.trim(),
      teamsWebhookUrl: teamsWebhookUrl.trim(),
    });
    setSaved(true);
    setTestResult({
      type: 'success',
      message: 'Settings saved! Notifications will now use these credentials for task alerts.',
    });
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestEmail = async () => {
    if (!emailUser.trim() || !emailPass.trim()) {
      setTestResult({ 
        type: 'error', 
        message: `Please enter your ${emailProvider === 'gmail' ? 'Gmail' : 'Outlook'} address and password first.` 
      });
      return;
    }
    setTestingEmail(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/notify/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailUser.trim(),
          provider: emailProvider,
          subject: 'Test Notification from Global Work Command Center',
          message: `Hello! This is a test email sent from Global Work Command Center via ${
            emailProvider === 'gmail' ? 'Gmail' : 'Outlook'
          }.\n\nIf you are reading this, your email notifications are fully working!`,
          credentials: { 
            emailUser: emailUser.trim(), 
            emailPass: emailPass.trim(),
            emailProvider 
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({ 
          type: 'success', 
          message: data.simulated 
            ? 'Email simulated successfully (check console).' 
            : `Success! Test email sent to ${emailUser.trim()}. Please check your inbox!` 
        });
      } else {
        setTestResult({ 
          type: 'error', 
          message: data.error || 'Failed to send test email. Please check your credentials.' 
        });
      }
    } catch (err: any) {
      setTestResult({ 
        type: 'error', 
        message: 'Could not connect to the backend server. Please verify the server is running on port 3005.' 
      });
    }
    setTestingEmail(false);
  };

  const handleTestTeams = async () => {
    if (!teamsWebhookUrl.trim()) {
      setTestResult({ type: 'error', message: 'Please enter your Microsoft Teams Webhook URL first.' });
      return;
    }
    setTestingTeams(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/notify/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '🔔 Test Notification: Global Work Command Center',
          text: 'This is a test notification from Global Work Command Center. If you see this in your Teams channel, your Microsoft Teams integration is fully connected and ready!',
          webhookUrl: teamsWebhookUrl.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({ 
          type: 'success', 
          message: data.simulated 
            ? 'Teams message simulated successfully.' 
            : 'Success! Test notification was posted to your Microsoft Teams channel!' 
        });
      } else {
        setTestResult({ 
          type: 'error', 
          message: data.error || 'Failed to send Microsoft Teams message. Please check the Webhook URL.' 
        });
      }
    } catch (err: any) {
      setTestResult({ 
        type: 'error', 
        message: 'Could not connect to the backend server. Please verify the server is running on port 3005.' 
      });
    }
    setTestingTeams(false);
  };

  const emailConfigured = emailUser.trim().length > 0 && emailPass.trim().length > 0;
  const teamsConfigured = teamsWebhookUrl.trim().length > 0;

  return (
    <div id="settings-page-container" className="max-w-3xl mx-auto space-y-6 pb-16">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-stone-400 border-b border-stone-800 pb-4">
        <button
          onClick={() => onRouteChange({ name: 'dashboard' })}
          className="hover:text-stone-100 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
        <span>/</span>
        <span className="text-stone-300 font-medium">Notification Settings</span>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-8 shadow-xs space-y-7">
        
        {/* Header */}
        <div className="border-b border-stone-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <SettingsIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-stone-100 tracking-tight">
                Connect Email &amp; Microsoft Teams
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
                Set up your Outlook/Gmail and Teams to receive instant alerts when tasks are created or completed.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Privacy Notice */}
        <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
          <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-300">
              Zero Credentials in Code or .env Files
            </p>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Your email ID, password, and Teams webhook are entered directly by you here in this browser page. They are stored in your browser's private local storage and are <strong>never</strong> hardcoded into the project code, Git repository, or <code>.env</code> files.
            </p>
          </div>
        </div>

        {/* Section 1: Email Configuration (Gmail or Outlook) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-stone-100 uppercase tracking-wider">
                1. Email Integration (Gmail / Outlook)
              </h2>
            </div>
            {emailConfigured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Check className="w-3 h-3" /> Configured ({emailProvider === 'gmail' ? 'Gmail' : 'Outlook'})
              </span>
            )}
          </div>

          <div className="bg-stone-800/40 border border-stone-700/60 rounded-xl p-4 sm:p-5 space-y-4">
            
            {/* Email Provider Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-2">
                Choose Email Provider
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEmailProvider('gmail')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    emailProvider === 'gmail'
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 ring-1 ring-rose-500/30'
                      : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  <span>Google / Gmail</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEmailProvider('outlook')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    emailProvider === 'outlook'
                      ? 'bg-blue-500/15 border-blue-500/40 text-blue-300 ring-1 ring-blue-500/30'
                      : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>Microsoft Outlook / Office 365</span>
                </button>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                {emailProvider === 'gmail' ? 'Gmail Address' : 'Outlook / Microsoft Email Address'}
              </label>
              <input
                id="settings-email-user"
                type="email"
                placeholder={emailProvider === 'gmail' ? 'your-name@gmail.com' : 'your-name@outlook.com or company@domain.com'}
                value={emailUser}
                onChange={(e) => setEmailUser(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 min-h-[42px]"
              />
            </div>

            {/* Email Password / App Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                {emailProvider === 'gmail' ? 'Gmail App Password (16 characters)' : 'Outlook Password or App Password'}
              </label>
              <div className="relative">
                <input
                  id="settings-email-pass"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={emailProvider === 'gmail' ? 'xxxx xxxx xxxx xxxx' : 'Your Outlook account or App password'}
                  value={emailPass}
                  onChange={(e) => setEmailPass(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 pr-10 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 min-h-[42px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Instructions Guide */}
              <div className="mt-2 text-[11px] text-stone-400 bg-stone-900/60 rounded-lg p-2.5 border border-stone-800 flex items-start gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                {emailProvider === 'gmail' ? (
                  <span>
                    For Gmail with 2-Step Verification, generate a 16-character App Password at{' '}
                    <a
                      href="https://myaccount.google.com/apppasswords"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 underline font-medium inline-flex items-center gap-0.5"
                    >
                      Google App Passwords <ExternalLink className="w-2.5 h-2.5" />
                    </a>.
                  </span>
                ) : (
                  <span>
                    For Outlook/Hotmail/Office 365, use your account password or an App Password from{' '}
                    <a
                      href="https://account.live.com/proofs/AppPassword"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline font-medium inline-flex items-center gap-0.5"
                    >
                      Microsoft Security <ExternalLink className="w-2.5 h-2.5" />
                    </a>.
                  </span>
                )}
              </div>
            </div>

            {/* Test Email Button */}
            <div className="pt-1">
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleTestEmail}
                disabled={testingEmail || !emailConfigured}
                className="px-4 py-2.5 text-xs font-semibold bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-h-[38px]"
              >
                {testingEmail ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{testingEmail ? 'Sending Test Email...' : 'Send Test Email'}</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Section 2: Microsoft Teams Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-stone-100 uppercase tracking-wider">
                2. Microsoft Teams Integration
              </h2>
            </div>
            {teamsConfigured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Check className="w-3 h-3" /> Configured
              </span>
            )}
          </div>

          <div className="bg-stone-800/40 border border-stone-700/60 rounded-xl p-4 sm:p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1.5">
                Teams Incoming Webhook URL
              </label>
              <input
                id="settings-teams-webhook"
                type="url"
                placeholder="https://outlook.office.com/webhook/... or https://yourcompany.webhook.office.com/..."
                value={teamsWebhookUrl}
                onChange={(e) => setTeamsWebhookUrl(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 min-h-[42px]"
              />
              
              <div className="mt-2 text-[11px] text-stone-400 bg-stone-900/60 rounded-lg p-2.5 border border-stone-800 flex items-start gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>
                  <strong>How to get this:</strong> Open Microsoft Teams &rarr; Go to your Channel &rarr; Click <strong>⋯</strong> &rarr; <strong>Connectors / Workflows</strong> &rarr; Add <strong>Incoming Webhook</strong> &rarr; Copy the generated URL and paste it here.
                </span>
              </div>
            </div>

            {/* Test Teams Button */}
            <div className="pt-1">
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleTestTeams}
                disabled={testingTeams || !teamsConfigured}
                className="px-4 py-2.5 text-xs font-semibold bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-h-[38px]"
              >
                {testingTeams ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                )}
                <span>{testingTeams ? 'Posting to Teams...' : 'Send Test Teams Message'}</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Live Test / Feedback Banner */}
        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 rounded-xl p-4 border ${
              testResult.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-rose-500/10 border-rose-500/30'
            }`}
          >
            {testResult.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <p className={`text-xs font-medium ${testResult.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>
              {testResult.message}
            </p>
          </motion.div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-stone-800 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => onRouteChange({ name: 'dashboard' })}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer min-h-[42px] flex items-center justify-center"
          >
            Back to Dashboard
          </button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-950/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
          >
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Saved Successfully!' : 'Save Integration Settings'}</span>
          </motion.button>
        </div>

      </div>
    </div>
  );
};
