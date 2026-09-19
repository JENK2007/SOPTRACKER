import { Task } from '../types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'sop-task-1',
    title: 'Client Onboarding & Workspace Provisioning',
    frequency: 'Weekly',
    owner: 'Sarah Chen',
    ownerRole: 'Client Success Lead',
    category: 'Client Success',
    estDurationMinutes: 45,
    steps: [
      'Verify signed master service agreement and initial retainer payment in billing ledger.',
      'Create client shared Slack Connect channel (#client-external-sync) and invite primary client stakeholders.',
      'Duplicate the Master Client Onboarding Notion Workspace template and customize brand assets and project goals.',
      'Provision read-only dashboard access in the production portal and send welcome credential email.',
      'Schedule the 30-minute operational kickoff call via Google Calendar with the agenda link.'
    ],
    links: [
      {
        id: 'link-1-1',
        title: 'Notion Client Hub Template',
        url: 'https://notion.so/workspace/client-onboarding-template',
        type: 'notion'
      },
      {
        id: 'link-1-2',
        title: 'Client Kickoff Slide Deck',
        url: 'https://docs.google.com/presentation/d/client-kickoff-deck',
        type: 'doc'
      }
    ],
    lastCompletedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    history: [
      {
        id: 'hist-1-1',
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completedBy: 'Sarah Chen',
        notes: 'Completed onboarding for Acme Corp tier-1 kickoff. Notion workspace transferred.'
      },
      {
        id: 'hist-1-2',
        completedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        completedBy: 'Sarah Chen',
        notes: 'Onboarded Delta Labs team with customized enterprise integration guide.'
      }
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sop-task-2',
    title: 'Weekly Executive Financial & Metrics Pulse',
    frequency: 'Weekly',
    owner: 'Marcus Vance',
    ownerRole: 'VP of Operations',
    category: 'Operations',
    estDurationMinutes: 60,
    steps: [
      'Pull gross revenue, MRR churn rate, and active subscriber metrics from Stripe billing portal.',
      'Cross-reference burn rate and pending wire transfers with corporate bank accounts.',
      'Populate the Weekly Exec Ops Summary Google Sheet with actuals vs planned quarterly budget.',
      'Draft the bulleted highlight memo in the leadership Slack channel by Friday 2:00 PM EST.',
      'Archive the weekly CSV exports in Google Drive under /Finance/2026/Q3.'
    ],
    links: [
      {
        id: 'link-2-1',
        title: 'Executive Metrics Master Sheet',
        url: 'https://docs.google.com/spreadsheets/d/weekly-exec-metrics',
        type: 'sheet'
      },
      {
        id: 'link-2-2',
        title: 'Stripe Financial Reports',
        url: 'https://dashboard.stripe.com/reports',
        type: 'tool'
      }
    ],
    lastCompletedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago -> pending for this week
    history: [
      {
        id: 'hist-2-1',
        completedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        completedBy: 'Marcus Vance',
        notes: 'Sent Week 37 summary. Net retention rate remained steady at 112%.'
      }
    ],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sop-task-3',
    title: 'Daily Production Health Check & Bug Triage',
    frequency: 'Daily',
    owner: 'Alex Rivera',
    ownerRole: 'DevOps / Tech Lead',
    category: 'Engineering',
    estDurationMinutes: 20,
    steps: [
      'Review Datadog APM dashboard for 5xx error spikes and latency degradation (>250ms p99 threshold).',
      'Inspect Sentry uncaught exception queue; triage new regressions into Linear engineering tickets.',
      'Verify overnight automated database backups and WAL replication status in Cloud Console.',
      'Post Green / Amber / Red status confirmation in #ops-standup Slack channel by 9:30 AM.'
    ],
    links: [
      {
        id: 'link-3-1',
        title: 'Datadog APM Production Overview',
        url: 'https://app.datadoghq.com/apm/services',
        type: 'tool'
      },
      {
        id: 'link-3-2',
        title: 'Sentry Production Issue Stream',
        url: 'https://sentry.io/organizations/team/issues',
        type: 'tool'
      }
    ],
    lastCompletedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago -> done today
    history: [
      {
        id: 'hist-3-1',
        completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        completedBy: 'Alex Rivera',
        notes: 'All systems green. Redis cache hit ratio 99.4%, zero critical errors in Sentry.'
      },
      {
        id: 'hist-3-2',
        completedAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
        completedBy: 'Alex Rivera',
        notes: 'Triaged minor auth token timeout edge case to sprint backlog.'
      }
    ],
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sop-task-4',
    title: 'Monthly Payroll & Contractor Invoice Reconciliation',
    frequency: 'Monthly',
    owner: 'Elena Rostova',
    ownerRole: 'People & Finance Specialist',
    category: 'Finance',
    estDurationMinutes: 90,
    steps: [
      'Collect approved contractor timesheets from Deel and verify signed milestone deliverables.',
      'Calculate overtime, commission bonuses, and 401(k) matching contributions in Gusto.',
      'Perform dual-authorization check with Chief Executive Officer for bank payroll batch release.',
      'Distribute payslips via email and verify direct deposit processing dates.',
      'File monthly payroll tax withholdings documentation with state authorities.'
    ],
    links: [
      {
        id: 'link-4-1',
        title: 'Gusto Payroll Portal',
        url: 'https://app.gusto.com/payroll',
        type: 'tool'
      },
      {
        id: 'link-4-2',
        title: 'Deel Contractor Hub',
        url: 'https://app.deel.com/contracts',
        type: 'tool'
      }
    ],
    lastCompletedAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000).toISOString(), // 34 days ago -> pending for this month
    history: [
      {
        id: 'hist-4-1',
        completedAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000).toISOString(),
        completedBy: 'Elena Rostova',
        notes: 'Processed end of month payroll across 14 contractors and 22 full-time staff.'
      }
    ],
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sop-task-5',
    title: 'Social Media & Product Release Publishing Schedule',
    frequency: 'Weekly',
    owner: 'Jordan Diaz',
    ownerRole: 'Marketing Manager',
    category: 'Marketing',
    estDurationMinutes: 40,
    steps: [
      'Review the week’s release changelog from Product GitHub releases and release notes draft.',
      'Draft 3 LinkedIn product spotlight posts and 4 X/Twitter feature threads in Buffer.',
      'Review and attach approved design assets from Figma Marketing Kit (1200x675 export).',
      'Run copy through readability guidelines and check brand terminology compliance.',
      'Schedule posts for Tuesday/Thursday 9:00 AM EST publishing windows.'
    ],
    links: [
      {
        id: 'link-5-1',
        title: 'Figma Marketing Asset Kit',
        url: 'https://figma.com/file/marketing-kit',
        type: 'link'
      },
      {
        id: 'link-5-2',
        title: 'Buffer Publishing Queue',
        url: 'https://publish.buffer.com',
        type: 'tool'
      }
    ],
    lastCompletedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago -> done this week
    history: [
      {
        id: 'hist-5-1',
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        completedBy: 'Jordan Diaz',
        notes: 'Queued feature release highlights for the new export features. Engagement tracking scheduled.'
      }
    ],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sop-task-6',
    title: 'Monthly Infrastructure Security & Access Permission Audit',
    frequency: 'Monthly',
    owner: 'Alex Rivera',
    ownerRole: 'Security & Compliance',
    category: 'IT & Security',
    estDurationMinutes: 75,
    steps: [
      'Export current IAM active role members from Google Cloud and AWS root organizations.',
      'Audit GitHub organization members, revoke departed employee access, and enforce 2FA compliance.',
      'Review 1Password Enterprise team vault permissions and remove stale guest invites.',
      'Confirm SSL/TLS certificate expiration dates across all public domain endpoints.',
      'Sign off on SOC2 access review log sheet and store snapshot in compliance drive.'
    ],
    links: [
      {
        id: 'link-6-1',
        title: 'SOC2 Access Audit Log',
        url: 'https://docs.google.com/spreadsheets/d/soc2-audit-log',
        type: 'sheet'
      },
      {
        id: 'link-6-2',
        title: 'Google Cloud IAM Console',
        url: 'https://console.cloud.google.com/iam-admin',
        type: 'tool'
      }
    ],
    lastCompletedAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(), // 38 days ago -> pending
    history: [
      {
        id: 'hist-6-1',
        completedAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
        completedBy: 'Alex Rivera',
        notes: 'Completed August SOC2 audit. Revoked 3 inactive contractor accounts in GitHub.'
      }
    ],
    createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sop-task-7',
    title: 'Bi-Weekly Sprint Retrospective & Backlog Grooming',
    frequency: 'Weekly',
    owner: 'Priya Patel',
    ownerRole: 'Product Delivery Lead',
    category: 'Product',
    estDurationMinutes: 50,
    steps: [
      'Close current sprint iteration in Linear and calculate story point velocity completion.',
      'Create retro Miro board with What went well, What to improve, and Action items columns.',
      'Facilitate the 45-minute team retro meeting and assign direct ownership to all action items.',
      'Review the top 10 ranked tickets for the upcoming sprint; ensure acceptance criteria are complete.',
      'Lock sprint scope and announce sprint kick-off in #product-engineering.'
    ],
    links: [
      {
        id: 'link-7-1',
        title: 'Linear Sprint Backlog',
        url: 'https://linear.app/team/backlog',
        type: 'tool'
      },
      {
        id: 'link-7-2',
        title: 'Miro Retro Collaborative Board',
        url: 'https://miro.com/app/board/retro-biweekly',
        type: 'link'
      }
    ],
    lastCompletedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago -> done this week
    history: [
      {
        id: 'hist-7-1',
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        completedBy: 'Priya Patel',
        notes: 'Sprint 34 closed with 42/45 points completed. 3 action items assigned for CI test flakiness.'
      }
    ],
    createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sop-task-8',
    title: 'New Employee Workstation & SaaS Provisioning',
    frequency: 'One-off',
    owner: 'Elena Rostova',
    ownerRole: 'People Operations',
    category: 'People Ops',
    estDurationMinutes: 60,
    steps: [
      'Confirm hardware shipment tracking with Apple Business Manager and FedEx.',
      'Provision Google Workspace email, Google Drive shared folders, and department calendar groups.',
      'Send 1Password invite and trigger Okta SSO account setup.',
      'Assign buddy mentor and schedule welcome coffee 1-on-1 on Day 1 calendar.',
      'Send welcome care package and company swag kit to employee residential address.'
    ],
    links: [
      {
        id: 'link-8-1',
        title: 'Employee Onboarding Checklist (Notion)',
        url: 'https://notion.so/people-ops/new-hire-guide',
        type: 'notion'
      },
      {
        id: 'link-8-2',
        title: 'Google Workspace Admin Directory',
        url: 'https://admin.google.com/ac/users',
        type: 'tool'
      }
    ],
    lastCompletedAt: null, // Pending one-off task
    history: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];
