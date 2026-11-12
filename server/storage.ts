import fs from 'fs';
import path from 'path';
import {
  BusinessProfile,
  CampaignReport,
  ChannelIntegration,
  ContentItem,
  ExecutionLog,
  GrowthPlaybook,
  MarketIntelligenceItem,
  MarketingCampaign,
  StrategyBrief,
  CeoTask,
  AutonomousSchedule,
} from '../src/types/marketing.js';

interface DatabaseSchema {
  profiles: BusinessProfile[];
  campaigns: MarketingCampaign[];
  contentItems: ContentItem[];
  strategies: StrategyBrief[];
  intelligence: MarketIntelligenceItem[];
  growthPlaybooks: GrowthPlaybook[];
  reports: CampaignReport[];
  ceoTasks: CeoTask[];
  integrations: ChannelIntegration[];
  schedules: AutonomousSchedule[];
  logs: ExecutionLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'storage.json');

const INITIAL_PROFILES: BusinessProfile[] = [
  {
    id: 'prof-cloudscale-01',
    name: 'CloudScale Flow',
    website: 'https://cloudscale-flow.io',
    industry: 'Developer Tools & B2B SaaS',
    productsAndServices:
      'Autonomous cloud workflow orchestrator, serverless microservice pipeline automation, observability analytics.',
    targetMarkets: ['North America', 'Western Europe', 'ANZ'],
    targetAudience:
      'VP of Engineering, Lead DevOps Architects, Platform Engineers at Series A-C SaaS startups ($1M-$30M ARR).',
    brandPositioning:
      'The zero-to-prod infrastructure orchestrator that turns days of CI/CD plumbing into 3-minute declarative workflows.',
    brandVoice: 'Authoritative, technical yet punchy, developer-empathetic, hype-free, evidence-driven.',
    toneKeywords: ['Engineering-grade', 'Pragmatic', 'Decisive', 'Transparent', 'Modern'],
    preferredLanguages: ['en', 'es', 'de'],
    socialAccounts: {
      linkedin: { handle: 'company/cloudscale-flow', connected: false, followers: 8400 },
      twitter: { handle: '@cloudscaleflow', connected: false, followers: 14200 },
      youtube: { handle: '@CloudScaleEngineering', connected: false, followers: 3100 },
      instagram: { handle: '@cloudscale.dev', connected: false, followers: 2200 },
      tiktok: { handle: '@cloudscale_tech', connected: false, followers: 980 },
    },
    marketingObjectives: [
      'Scale monthly inbound self-serve trials from 350 to 1,000',
      'Establish technical thought leadership on distributed tracing and serverless cost optimization',
      'Generate 150 enterprise demo bookings per quarter',
    ],
    competitors: ['Temporal.io', 'Datadog Workflows', 'Argo Workflows', 'Inngest'],
    brandGuidelines:
      'Strictly avoid marketing buzzwords like "game-changing" or "synergy". Emphasize concrete CLI examples, YAML benchmarks, latency numbers, and SOC2 compliance.',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prof-omnipulse-02',
    name: 'OmniPulse CRM',
    website: 'https://omnipulse.ai',
    industry: 'Revenue Operations & AI Sales',
    productsAndServices: 'Autonomous pipeline acceleration, multi-touch account engagement, AI deal velocity scoring.',
    targetMarkets: ['Global (US, UK, LatAm, Europe)'],
    targetAudience: 'Chief Revenue Officers, VPs of Sales, RevOps Directors at mid-market B2B tech companies.',
    brandPositioning: 'The AI sales director that uncovers stalled pipeline opportunities before quarter-end.',
    brandVoice: 'Executive, results-oriented, forward-thinking, consultative, metric-obsessed.',
    toneKeywords: ['High-velocity', 'Strategic', 'Insightful', 'Confident', 'Polished'],
    preferredLanguages: ['en', 'pt', 'es', 'fr'],
    socialAccounts: {
      linkedin: { handle: 'company/omnipulse-crm', connected: false, followers: 16500 },
      twitter: { handle: '@omnipulse_ai', connected: false, followers: 8900 },
      youtube: { handle: '@OmniPulseSalesTech', connected: false, followers: 1800 },
      instagram: { handle: '@omnipulse.hq', connected: false, followers: 4100 },
    },
    marketingObjectives: [
      'Generate $2.4M in pipeline attribution from organic social and webinar distribution',
      'Increase LinkedIn executive reach among Fortune 1000 RevOps leaders',
      'Launch RevOps Playbook 2026 lead magnet campaign',
    ],
    competitors: ['Gong.io', 'Clari', 'People.ai', 'HubSpot Enterprise'],
    brandGuidelines:
      'Highlight revenue math, win-rate multipliers, and rep quota attainment. Use clean dark aesthetic with emerald ROI indicators.',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'camp-q1-serverless-roi',
    businessProfileId: 'prof-cloudscale-01',
    name: 'Serverless Cloud Bill Slash — Q1 Acquisition Flight',
    objective: 'customer_acquisition',
    targetAudience: 'Platform Engineers & DevOps Team Leads feeling painful AWS Lambda / Fargate bill spikes',
    customerPersona: {
      name: 'DevOps Architect Dave',
      role: 'Head of Infrastructure',
      painPoints: [
        'Cloud bills increasing 40% quarter-over-quarter with zero visibility into zombie containers',
        'Complex microservices stalling during deployments requiring manual rollback scripts',
        'Too many disconnected monitoring tabs that cause alert fatigue',
      ],
      buyingMotivations: [
        'Automated cost-slashing algorithms that justify tool ROI to the CFO',
        'Infrastructure-as-code declarative manifests that integrate into GitHub Actions',
      ],
      preferredChannels: ['twitter', 'linkedin', 'youtube'],
    },
    coreMessage:
      'Stop paying for idle cloud compute. Automate your container lifecycle in 3 lines of declarative YAML.',
    positioning: 'The high-velocity serverless orchestrator with guaranteed 35% compute bill reduction.',
    durationWeeks: 4,
    startDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 21 * 86400000).toISOString(),
    budgetRecommendations: {
      totalBudgetUsd: 12000,
      paidAdsUsd: 7000,
      contentProductionUsd: 3500,
      influencerUsd: 1500,
      recommendedDailyUsd: 400,
    },
    expectedKPIs: {
      targetImpressions: 450000,
      targetClicks: 14200,
      targetLeads: 1250,
      targetConversions: 240,
      estimatedCAC: 50,
    },
    conversionStrategy:
      'Top-of-funnel technical benchmark carousel -> interactive cloud cost calculator lead magnet -> instant sandbox sign-up with pre-loaded demo cluster.',
    expectedOutcomes: [
      '240 new self-serve free trial teams onboarded',
      'Over 1,200 downloads of the Cloud Cost Optimization Playbook',
      'Growth of 3,000+ developer followers across LinkedIn and X',
    ],
    assumptions: [
      'CAC benchmarks remain below $65 across developer channels',
      'Interactive cost calculator maintains a >18% conversion rate from landing page visits',
    ],
    status: 'active',
    channels: ['linkedin', 'twitter', 'youtube', 'instagram'],
    contentItemIds: ['content-01', 'content-02', 'content-03', 'content-04'],
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'camp-omnipulse-pipeline-mastery',
    businessProfileId: 'prof-omnipulse-02',
    name: 'State of B2B Pipeline 2026 — Executive Lead Gen',
    objective: 'lead_generation',
    targetAudience: 'CROs, VPs of Sales and Revenue Operations leaders',
    customerPersona: {
      name: 'RevOps Director Rachel',
      role: 'VP of Revenue Operations',
      painPoints: [
        'Deals slip past close dates with no early warning indicators',
        'Sales reps spend 60% of their week on manual CRM hygiene instead of selling',
      ],
      buyingMotivations: ['Accurate AI forecast models and automated meeting intelligence'],
      preferredChannels: ['linkedin', 'youtube', 'facebook'],
    },
    coreMessage:
      'Turn dead CRM records into qualified pipeline with autonomous relationship intelligence.',
    positioning: 'The enterprise deal acceleration copilot that uncovers hidden churn and upside.',
    durationWeeks: 6,
    startDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 40 * 86400000).toISOString(),
    budgetRecommendations: {
      totalBudgetUsd: 25000,
      paidAdsUsd: 16000,
      contentProductionUsd: 6000,
      influencerUsd: 3000,
      recommendedDailyUsd: 600,
    },
    expectedKPIs: {
      targetImpressions: 800000,
      targetClicks: 22000,
      targetLeads: 2400,
      targetConversions: 180,
      estimatedCAC: 138,
    },
    conversionStrategy:
      'Gated benchmark report with interactive executive dashboard -> VIP webinar with high-profile CRO panel -> personalized pipeline health assessment audit.',
    expectedOutcomes: [
      '180 sales demo requests with companies over 250 employees',
      '$1.8M in qualified sales pipeline created within 60 days',
    ],
    assumptions: [
      'LinkedIn InMail and sponsored content response rates remain stable above 1.2%',
    ],
    status: 'active',
    channels: ['linkedin', 'youtube', 'twitter'],
    contentItemIds: ['content-05', 'content-06'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_CONTENT_ITEMS: ContentItem[] = [
  {
    id: 'content-01',
    campaignId: 'camp-q1-serverless-roi',
    businessProfileId: 'prof-cloudscale-01',
    platform: 'linkedin',
    title: 'The Silent 40% Cloud Waste Architecture Breakdown',
    content: `Most engineering teams don't have a microservices architecture. They have a distributed spending machine.

Last month, we audited 45 mid-stage Kubernetes clusters running on AWS. The findings were staggering:
• 41% of compute hours were billed to idle sandbox pods
• Zombie message queues running retry loops consumed $3,200/mo per cluster
• Zero automated ephemeral teardowns on staging environments

Here is the exact 3-step automation we deployed to cut AWS compute costs by 36% in under 72 hours:

1. Ephemeral Cluster Lifecycle: PR-based preview environments destroy themselves 45 minutes after last git commit.
2. Smart Spot-Instance Drainage: Shift state-agnostic worker queues to 80% discounted spot pools with automated pre-emption failover.
3. Declarative Resource Caps: Hard limits embedded directly into the developer workflow.

Engineers shouldn't spend their Fridays debugging billing spikes. Let your orchestrator handle the plumbing.

What is the biggest hidden cost driver in your stack right now?`,
    hook: 'Most engineering teams do not have a microservices architecture. They have a distributed spending machine.',
    hashtags: ['#DevOps', '#CloudComputing', '#Kubernetes', '#SaaSInfrastructure', '#FinOps'],
    callToAction: 'Read the full benchmark report & download the free YAML deployment recipe in the comments below.',
    contentType: 'carousel',
    carouselSlides: [
      'Slide 1: Why 41% of your Kubernetes bill is completely wasted (and how to fix it)',
      'Slide 2: Audit of 45 Series A-C SaaS clusters — the breakdown',
      'Slide 3: Tactic 1 — Ephemeral preview environments with auto-teardown',
      'Slide 4: Tactic 2 — Smart spot instances with zero-downtime drain',
      'Slide 5: Tactic 3 — Declarative YAML budget enforcement',
      'Slide 6: Grab the open-source manifest template at cloudscale-flow.io/finops',
    ],
    scheduledFor: new Date(Date.now() + 86400000).toISOString(),
    status: 'approved',
    language: 'en',
    metrics: {
      estimatedReach: 24000,
    },
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'content-02',
    campaignId: 'camp-q1-serverless-roi',
    businessProfileId: 'prof-cloudscale-01',
    platform: 'twitter',
    title: 'The 3-Line YAML Fix for $10k/mo Cloud Bills [Thread]',
    content: `We inspected 45 production AWS bills last month.

Over 40% of spend was wasted on idle sandbox pods and zombie workers.

Here's the exact 3-line declarative automation that cuts cloud waste by 35% without breaking production 👇🧵 (1/6)

(2/6) Problem: Developers spin up test clusters for PR review and forget to delete them over the weekend. That's 64 hours of pure AWS profit at your expense.

(3/6) The Fix: Instead of hoping engineers remember to run clean-up scripts, enforce an autonomous TTL tag in your workflow orchestrator.

(4/6) When CloudScale Flow detects 0 network ingress for 45 minutes, it gracefully captures container snapshot state and parks compute at $0.00/hr.

(5/6) When a new commit hits the PR branch, it boots back up in under 4 seconds. Zero cold start penalty for developers.

(6/6) Try the interactive cloud waste calculator to see your team's projected savings in 30 seconds: cloudscale-flow.io/calculator`,
    hook: 'We inspected 45 production AWS bills last month. Over 40% was completely wasted.',
    hashtags: ['#DevOps', '#AWS', '#FinOps', '#BuildInPublic'],
    callToAction: 'Check the calculator link in thread or retweet to save an engineer their weekend.',
    contentType: 'thread',
    scheduledFor: new Date(Date.now() + 2 * 86400000).toISOString(),
    status: 'scheduled',
    language: 'en',
    metrics: {
      estimatedReach: 45000,
    },
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'content-03',
    campaignId: 'camp-q1-serverless-roi',
    businessProfileId: 'prof-cloudscale-01',
    platform: 'youtube',
    title: 'How We Scaled Serverless Workflows to 10M Events/sec (Technical Deep Dive)',
    content: `In this deep dive, CloudScale Flow Principal Architect walks through the event-driven architecture that powers our distributed task graph.

We cover:
00:00 - The bottleneck with traditional message queues
04:12 - Vector clock state management vs Redis lock contention
11:30 - Zero-cost ephemeral sandboxes with microVMs
18:45 - Live stress test: 100k requests burst in 10 seconds
26:10 - Architecture diagram & code walkthrough

Full manifest repository is linked in the video description.`,
    hook: 'Traditional message queues collapse when burst traffic hits 50k RPS. Here is how we fixed it.',
    hashtags: ['#SystemDesign', '#CloudEngineering', '#SoftwareArchitecture', '#BackendEngineering'],
    callToAction: 'Subscribe to CloudScale Engineering and clone the GitHub demo repo in the description.',
    contentType: 'video_script',
    videoScript: {
      hook: 'Most engineering teams think scaling microservices requires adding more cluster nodes. Watch what happens when we handle 10M events with zero extra compute.',
      body: 'Demonstrate terminal benchmark side by side: traditional queue crashing vs autonomous orchestrator smoothly routing backpressure.',
      cta: 'Check the link in the pinned comment to deploy this template to your own AWS account today.',
      visualDirection: 'Clean split-screen with dark code editor on the left and live Grafana dashboard metrics on the right.',
      estimatedSeconds: 380,
    },
    scheduledFor: new Date(Date.now() + 5 * 86400000).toISOString(),
    status: 'pending_approval',
    approvalNotes: 'Pending VP of Engineering final review of the architecture diagram slide.',
    language: 'en',
    metrics: {
      estimatedReach: 15000,
    },
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'content-04',
    campaignId: 'camp-q1-serverless-roi',
    businessProfileId: 'prof-cloudscale-01',
    platform: 'tiktok',
    title: 'POV: Your AWS bill arrives on Monday morning',
    content: `POV: You left your testing GPU cluster running over the weekend... 💀
Sound up for the panic when the $8,400 bill notification drops.
Don't be that engineer. Set up automated cluster auto-kill in 60 seconds with CloudScale.`,
    hook: 'POV: You left a GPU test instance running all weekend...',
    hashtags: ['#TechHumor', '#SoftwareEngineer', '#ProgrammerLife', '#DevOpsFail', '#CodingMemes'],
    callToAction: 'Link in bio to save your team from the Monday morning finance meeting.',
    contentType: 'video_script',
    videoScript: {
      hook: 'Look at this notification: AWS CloudWatch Alert: $8,492 estimated monthly spend.',
      body: 'Quick cut from developer looking at monitor in horror to opening terminal and typing single command: cloudscale autokill --ttl 1h.',
      cta: 'Don\'t wait for finance to email your CEO. Set up auto-kill for free at the link in bio.',
      visualDirection: 'Fast-paced phone camera style with humor audio track, text overlay and neon code snippet highlights.',
      estimatedSeconds: 28,
    },
    scheduledFor: new Date(Date.now() + 3 * 86400000).toISOString(),
    status: 'draft',
    language: 'en',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'content-05',
    campaignId: 'camp-omnipulse-pipeline-mastery',
    businessProfileId: 'prof-omnipulse-02',
    platform: 'linkedin',
    title: 'Why 72% of Sales Pipeline is Phantom Revenue',
    content: `We analyzed 12,000 mid-market B2B deals that were marked "Commit" or "Best Case" in Q4.

72% of those stalled deals showed 3 unmistakable warning signals 30 days before slippage:

1. No executive sponsor attendance in the second demo
2. Deal champion stopped replying within 4 hours (average latency climbed to 3.8 days)
3. Legal review was initiated without security procurement clearance

Revenue teams don't lose deals at the finish line. They lose them 4 weeks earlier because no one flagged momentum decay.

OmniPulse automatically monitors relationship telemetry across email, Slack, calendar and contract views to alert your reps before deals slip.

Stop forecasting with gut feel. What is your team's #1 leading indicator of deal health?`,
    hook: '72% of stalled enterprise deals exhibit the exact same 3 warning signals 30 days before slippage.',
    hashtags: ['#RevOps', '#SalesLeadership', '#CRO', '#B2BSales', '#PipelineVelocity'],
    callToAction: 'Download the 2026 Deal Velocity Diagnostic Checklist linked in the first comment.',
    contentType: 'post',
    scheduledFor: new Date(Date.now() + 4 * 86400000).toISOString(),
    status: 'approved',
    language: 'en',
    metrics: {
      estimatedReach: 32000,
    },
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'content-06',
    campaignId: 'camp-omnipulse-pipeline-mastery',
    businessProfileId: 'prof-omnipulse-02',
    platform: 'instagram',
    title: 'The Modern RevOps Tech Stack vs 2020 Legacy Stack',
    content: `Swipe to see the evolution of enterprise revenue operations 📊
From messy disconnected spreadsheets and manual CRM logging to unified autonomous sales intelligence.
Which tool in your stack is slowing your team down the most?`,
    hook: 'Is your revenue tech stack built for 2026 or 2020?',
    hashtags: ['#SalesOperations', '#RevOpsLife', '#B2BTech', '#SalesEnablement', '#SaaSGrowth'],
    callToAction: 'Save this post for your next revenue tools audit meeting.',
    contentType: 'carousel',
    carouselSlides: [
      'Slide 1: The 2020 vs 2026 RevOps Architecture',
      'Slide 2: Legacy: Reps spend 5.2 hrs/wk manually updating CRM notes',
      'Slide 3: Modern: Autonomous call intelligence auto-syncs action items & MEDDPICC fields',
      'Slide 4: Legacy: Quarterly forecast surprises during executive board meetings',
      'Slide 5: Modern: Real-time velocity scoring with algorithmic risk detection',
      'Slide 6: Audit your revenue tech stack at omnipulse.ai/stack-audit',
    ],
    scheduledFor: new Date(Date.now() + 6 * 86400000).toISOString(),
    status: 'pending_approval',
    language: 'en',
    metrics: {
      estimatedReach: 12000,
    },
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_INTELLIGENCE: MarketIntelligenceItem[] = [
  {
    id: 'intel-01',
    type: 'trend',
    title: 'Developer Backlash Against Opaque Cloud Compute Surcharges',
    description:
      'Trending discussions on Hacker News and Reddit (r/devops) show rising frustration with hyperscaler egress fees and unpredictable microservice bills.',
    impactScore: 'high',
    isHypothesis: false,
    sourceOrRationale: 'Verified by 4 consecutive front-page HN discussions in past 30 days analyzing AWS Lambda cost inflation.',
    recommendedAction:
      'Launch targeted technical teardowns of egress fee architectures and release an open-source cost auditor CLI to capture developer mindshare.',
    relevantChannels: ['twitter', 'linkedin', 'youtube'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'intel-02',
    type: 'competitor',
    title: 'Temporal.io Pivoting Messaging Toward High-Volume Financial Enterprise',
    description:
      'Leading competitor is de-emphasizing developer self-serve onboarding in favor of multi-year Fortune 500 enterprise contracts.',
    impactScore: 'high',
    isHypothesis: false,
    sourceOrRationale: 'Verified through analysis of their recent pricing page overhaul and Q4 press releases.',
    recommendedAction:
      'Capture orphaned mid-market and series A-C startups with a friction-free 5-minute sandbox and transparent tiered pricing.',
    relevantChannels: ['linkedin', 'twitter'],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'intel-03',
    type: 'keyword',
    title: 'Search Volume Surge for "AI Agent Orchestration Latency"',
    description:
      'Global search queries for multi-agent coordination frameworks and execution latency benchmarking grew 280% in the last 6 months.',
    impactScore: 'medium',
    isHypothesis: true,
    sourceOrRationale: 'AI Hypothesis based on developer migration toward autonomous agent architectures and framework benchmarks.',
    recommendedAction:
      'Publish high-intent technical documentation comparing orchestration latency across worker thread runtimes.',
    relevantChannels: ['linkedin', 'youtube'],
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'intel-04',
    type: 'seasonal',
    title: 'End of Q1 Cloud Budget Reconciliation Window',
    description:
      'Finance and engineering leadership conduct quarterly budget reviews in late March/early April, making this the prime window for FinOps tooling adoption.',
    impactScore: 'high',
    isHypothesis: false,
    sourceOrRationale: 'Historical procurement cycle data across B2B SaaS buyer cohorts.',
    recommendedAction:
      'Run a time-sensitive "Q1 Cloud Audit Challenge" offering free benchmark reports for teams spending >$10k/mo on AWS/GCP.',
    relevantChannels: ['linkedin', 'twitter', 'facebook'],
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

const INITIAL_GROWTH_PLAYBOOKS: GrowthPlaybook[] = [
  {
    id: 'playbook-01',
    category: 'organic_loop',
    title: 'The Open-Source CLI Trojan Horse Loop',
    description:
      'Release a high-utility, zero-friction terminal tool that solves an acute standalone pain (e.g. AWS cost scanner) and natively invites team members to the CloudScale dashboard.',
    implementationSteps: [
      'Package a standalone Go/Rust binary: brew install cloudscale-audit',
      'Scan user cluster locally without requiring cloud account credentials or invasive write access',
      'Generate a pristine local Markdown report with top 5 compute leaks',
      'Display a one-click flag: --export-web to generate a shareable interactive visual dashboard link for colleagues',
    ],
    expectedImpact: 'Generates 450+ viral developer stars and ~18% conversion to self-serve platform accounts',
    difficulty: 'medium',
    estimatedTimeline: '2 weeks development + 1 week distribution blitz',
    targetMetrics: ['CLI Installations', 'Shared Web Report URLs', 'Sign-up Conversions'],
  },
  {
    id: 'playbook-02',
    category: 'lead_magnet',
    title: 'Interactive Cloud Cost & Workflow ROI Simulator',
    description:
      'An un-gated, ultra-fast slider tool where engineering managers plug in their current cluster size and get instant projected dollar savings and latency curves.',
    implementationSteps: [
      'Build client-side calculator with real industry benchmark math',
      'Allow immediate visual feedback without asking for email upfront',
      'Gate the optional custom PDF export and Terraform auto-fix script with email capture',
      'Trigger an automated 3-part technical email nurture sequence with real YAML code recipes',
    ],
    expectedImpact: '25-30% email conversion on high-intent inbound traffic',
    difficulty: 'low',
    estimatedTimeline: '4 days',
    targetMetrics: ['Simulator Sessions', 'PDF Downloads', 'Demo Requests'],
  },
  {
    id: 'playbook-03',
    category: 'product_hunt_launch',
    title: 'The 30-Day Product Hunt & Hacker News Double-Strike',
    description:
      'A synchronized product release orchestrated across Product Hunt, Hacker News "Show HN", technical Reddit communities, and X (Twitter) influencer seeding.',
    implementationSteps: [
      'Curate a 400-person VIP developer waitlist with early sandbox badges',
      'Draft an authentic, no-BS Show HN narrative focusing on architectural challenges solved',
      'Prepare 7 platform-specific asset packages: 60s teaser video, GIF demos, and interactive sandbox playground',
      'Coordinate launch day live-streaming Q&A with the engineering founding team',
    ],
    expectedImpact: '10,000+ targeted developer visits, Top 3 Product of the Day, 600+ new active workspaces',
    difficulty: 'high',
    estimatedTimeline: '4 weeks preparation',
    targetMetrics: ['Launch Day Ingress', 'Product Hunt Upvotes', 'Trial Activations'],
  },
  {
    id: 'playbook-04',
    category: 'paid_ads',
    title: 'High-Intent Developer Pain Retargeting Matrix',
    description:
      'Precision retargeting on LinkedIn and X targeting visitors who viewed documentation or pricing pages but did not initiate a workspace setup.',
    implementationSteps: [
      'Exclude existing logged-in users via cookie suppression',
      'Serve short, technical video demos showing exact CLI deploy command (zero talking heads)',
      'Use LinkedIn Conversation Ads offering an invite to private engineering Slack community',
      'Cap frequency to 3 impressions per week to prevent developer ad fatigue',
    ],
    expectedImpact: 'Reduces blended customer acquisition cost by 38% compared to broad cold display ads',
    difficulty: 'medium',
    estimatedTimeline: '1 week',
    targetMetrics: ['CPA ($)', 'Pricing Page Re-visits', 'Trial Activation Rate'],
  },
];

const INITIAL_INTEGRATIONS: ChannelIntegration[] = [
  {
    platform: 'linkedin',
    name: 'LinkedIn Company Pages & Personal Profiles',
    connected: false,
    authMethod: 'OAuth 2.0',
    permissions: ['w_member_social', 'w_organization_social', 'r_organization_social'],
    requiresConfig: true,
    credentialsSet: false,
    configFields: [
      { key: 'clientId', label: 'LinkedIn Client ID', type: 'text', required: true, description: 'From LinkedIn Developer Portal' },
      { key: 'clientSecret', label: 'LinkedIn Client Secret', type: 'password', required: true, description: 'Application secret key' },
      { key: 'organizationId', label: 'Organization URN / ID', type: 'text', required: true, description: 'Numeric ID of your LinkedIn Company Page' },
    ],
  },
  {
    platform: 'twitter',
    name: 'X (Twitter) Developer API v2',
    connected: false,
    authMethod: 'API Key',
    permissions: ['tweet.read', 'tweet.write', 'users.read'],
    requiresConfig: true,
    credentialsSet: false,
    configFields: [
      { key: 'apiKey', label: 'API Key (Consumer Key)', type: 'text', required: true, description: 'From X Developer Dashboard' },
      { key: 'apiSecret', label: 'API Key Secret', type: 'password', required: true, description: 'Consumer Secret' },
      { key: 'accessToken', label: 'Access Token', type: 'text', required: true, description: 'Read & Write user access token' },
      { key: 'accessSecret', label: 'Access Token Secret', type: 'password', required: true, description: 'User token secret' },
    ],
  },
  {
    platform: 'instagram',
    name: 'Instagram Graph API via Meta Business Suite',
    connected: false,
    authMethod: 'OAuth 2.0',
    permissions: ['instagram_basic', 'instagram_content_publish', 'pages_read_engagement'],
    requiresConfig: true,
    credentialsSet: false,
    configFields: [
      { key: 'instagramBusinessAccountId', label: 'Instagram Business Account ID', type: 'text', required: true, description: 'Linked to Facebook Page' },
      { key: 'pageAccessToken', label: 'Long-Lived Page Access Token', type: 'password', required: true, description: 'From Meta Developer App' },
    ],
  },
  {
    platform: 'tiktok',
    name: 'TikTok Content Posting API',
    connected: false,
    authMethod: 'OAuth 2.0',
    permissions: ['video.upload', 'video.publish', 'user.info.basic'],
    requiresConfig: true,
    credentialsSet: false,
    configFields: [
      { key: 'clientKey', label: 'Client Key', type: 'text', required: true, description: 'From TikTok for Developers' },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true, description: 'TikTok App Secret' },
    ],
  },
  {
    platform: 'youtube',
    name: 'YouTube Data API v3',
    connected: false,
    authMethod: 'OAuth 2.0',
    permissions: ['https://www.googleapis.com/auth/youtube.upload'],
    requiresConfig: true,
    credentialsSet: false,
    configFields: [
      { key: 'clientId', label: 'Google Cloud OAuth Client ID', type: 'text', required: true, description: 'GCP Credentials console' },
      { key: 'clientSecret', label: 'Google Cloud Client Secret', type: 'password', required: true, description: 'GCP OAuth Secret' },
      { key: 'channelId', label: 'YouTube Channel ID', type: 'text', required: true, description: 'Format: UC...' },
    ],
  },
  {
    platform: 'facebook',
    name: 'Facebook Pages API',
    connected: false,
    authMethod: 'OAuth 2.0',
    permissions: ['pages_manage_posts', 'pages_read_engagement'],
    requiresConfig: true,
    credentialsSet: false,
    configFields: [
      { key: 'pageId', label: 'Facebook Page ID', type: 'text', required: true, description: 'Numeric ID of the Page' },
      { key: 'pageToken', label: 'Page Access Token', type: 'password', required: true, description: 'Never-expiring page access token' },
    ],
  },
  {
    platform: 'pinterest',
    name: 'Pinterest API v5',
    connected: false,
    authMethod: 'OAuth 2.0',
    permissions: ['boards:read', 'pins:read', 'pins:write'],
    requiresConfig: true,
    credentialsSet: false,
    configFields: [
      { key: 'appId', label: 'Pinterest App ID', type: 'text', required: true, description: 'From Pinterest Developer Portal' },
      { key: 'appSecret', label: 'App Secret', type: 'password', required: true, description: 'Pinterest App Secret' },
      { key: 'boardId', label: 'Default Board ID', type: 'text', required: true, description: 'Target board for campaigns' },
    ],
  },
];

const INITIAL_SCHEDULES: AutonomousSchedule[] = [
  {
    id: 'sched-daily-queue',
    name: 'Daily Social Content Pipeline Refresh',
    enabled: true,
    frequency: 'daily',
    action: 'generate_weekly_batch',
    lastRun: new Date(Date.now() - 14 * 3600000).toISOString(),
    nextRun: new Date(Date.now() + 10 * 3600000).toISOString(),
    autoApproveSafeDrafts: false, // Human approval always enforced by default
  },
  {
    id: 'sched-market-intel',
    name: 'Market Intelligence & Competitor Shift Radar',
    enabled: true,
    frequency: 'twice_weekly',
    action: 'refresh_market_intelligence',
    lastRun: new Date(Date.now() - 2 * 86400000).toISOString(),
    nextRun: new Date(Date.now() + 1 * 86400000).toISOString(),
    autoApproveSafeDrafts: false,
  },
  {
    id: 'sched-perf-eval',
    name: 'Weekly Campaign Optimization & Rebalancing Engine',
    enabled: true,
    frequency: 'weekly',
    action: 'analyze_performance',
    lastRun: new Date(Date.now() - 6 * 86400000).toISOString(),
    nextRun: new Date(Date.now() + 1 * 86400000).toISOString(),
    autoApproveSafeDrafts: false,
  },
];

const INITIAL_REPORTS: CampaignReport[] = [
  {
    id: 'rep-q1-benchmark',
    campaignId: 'camp-q1-serverless-roi',
    title: 'Mid-Flight Campaign Intelligence Report — Q1 Serverless Acquisition',
    period: 'Past 14 Days',
    generatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    executiveSummary:
      'The Serverless Cloud Bill campaign is demonstrating strong top-of-funnel resonance on LinkedIn and X. Developer engagement on technical YAML threads is outperforming standard product screenshots by 2.8x. Clicks to the interactive calculator have exceeded the target run-rate by 14%.',
    performanceSummary: {
      totalImpressions: 184500,
      totalEngagements: 9820,
      averageEngagementRate: 5.32,
      totalClicks: 6240,
      totalConversions: 104,
      conversionRate: 1.66,
      isEstimate: false, // Clearly indicates real logged data vs forecast
    },
    channelBreakdown: [
      {
        channel: 'linkedin',
        postsCount: 4,
        reach: 92000,
        engagements: 5400,
        efficiencyRating: 'High',
      },
      {
        channel: 'twitter',
        postsCount: 6,
        reach: 71000,
        engagements: 3820,
        efficiencyRating: 'High',
      },
      {
        channel: 'youtube',
        postsCount: 1,
        reach: 14500,
        engagements: 420,
        efficiencyRating: 'Moderate',
      },
      {
        channel: 'tiktok',
        postsCount: 2,
        reach: 7000,
        engagements: 180,
        efficiencyRating: 'Underperforming',
      },
    ],
    keyWins: [
      'Technical architecture teardowns on LinkedIn achieved a record 6.8% comment rate among senior engineers',
      'The "3-line YAML" thread drove 1,420 direct visits to the cloud calculator with 18% email opt-in',
      'Organic retweets from prominent open-source maintainers drove $0 CAC inbound accounts',
    ],
    underperformingAreas: [
      'TikTok short-form video reached younger dev students but had near-zero B2B enterprise conversion (<0.1%)',
      'Publishing to social channels currently requires manual copy-paste due to unconfigured OAuth credentials',
    ],
    recommendations: [
      'Reallocate 70% of creative production time to technical carousels and code-first threads',
      'Pause TikTok creative production and test dedicated YouTube Shorts technical tutorials instead',
      'Launch an automated retargeting sequence to calculator leads offering a 1-on-1 architecture review',
    ],
    proposedExperiments: [
      'A/B Test: "Cut AWS Costs" vs "Stop Kubernetes Alert Fatigue" headline hook in LinkedIn sponsored posts',
      'Deploy interactive CLI open-source lead magnet to Hacker News Show HN',
    ],
  },
];

const INITIAL_LOGS: ExecutionLog[] = [
  {
    id: 'log-01',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    level: 'info',
    module: 'Autonomous Scheduler',
    message: 'Triggered scheduled daily queue health check. 3 posts queued for this week.',
    details: { activeCampaignsCount: 2, queuedPosts: 3 },
  },
  {
    id: 'log-02',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    level: 'warn',
    module: 'Publishing Adapter',
    message: 'Post #content-01 approved for publishing, but LinkedIn OAuth integration is not connected.',
    details: { platform: 'linkedin', status: 'awaiting_credentials' },
  },
  {
    id: 'log-03',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    level: 'info',
    module: 'CEO Orchestrator Contract',
    message: 'System ready to receive delegated tasks via POST /api/marketing/generate or /api/ceo/tasks.',
    details: { contractVersion: '2026-v1', endpointsActive: 12 },
  },
];

class StorageService {
  private data: DatabaseSchema;
  private isSaving = false;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('[StorageService] Error loading storage.json, falling back to initial data:', err);
    }

    const initial: DatabaseSchema = {
      profiles: INITIAL_PROFILES,
      campaigns: INITIAL_CAMPAIGNS,
      contentItems: INITIAL_CONTENT_ITEMS,
      strategies: [],
      intelligence: INITIAL_INTELLIGENCE,
      growthPlaybooks: INITIAL_GROWTH_PLAYBOOKS,
      reports: INITIAL_REPORTS,
      ceoTasks: [],
      integrations: INITIAL_INTEGRATIONS,
      schedules: INITIAL_SCHEDULES,
      logs: INITIAL_LOGS,
    };

    this.persist(initial);
    return initial;
  }

  private persist(dataToSave: DatabaseSchema) {
    if (this.isSaving) return;
    this.isSaving = true;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[StorageService] Failed to persist data:', err);
    } finally {
      this.isSaving = false;
    }
  }

  private save() {
    this.persist(this.data);
  }

  // --- Profiles ---
  getProfiles(): BusinessProfile[] {
    return this.data.profiles;
  }

  getProfileById(id: string): BusinessProfile | undefined {
    return this.data.profiles.find((p) => p.id === id);
  }

  saveProfile(profile: BusinessProfile): BusinessProfile {
    const idx = this.data.profiles.findIndex((p) => p.id === profile.id);
    if (idx >= 0) {
      this.data.profiles[idx] = { ...profile, updatedAt: new Date().toISOString() };
    } else {
      this.data.profiles.push(profile);
    }
    this.save();
    return profile;
  }

  deleteProfile(id: string): boolean {
    const initialLen = this.data.profiles.length;
    this.data.profiles = this.data.profiles.filter((p) => p.id !== id);
    if (this.data.profiles.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Campaigns ---
  getCampaigns(profileId?: string): MarketingCampaign[] {
    if (profileId) {
      return this.data.campaigns.filter((c) => c.businessProfileId === profileId);
    }
    return this.data.campaigns;
  }

  getCampaignById(id: string): MarketingCampaign | undefined {
    return this.data.campaigns.find((c) => c.id === id);
  }

  saveCampaign(campaign: MarketingCampaign): MarketingCampaign {
    const idx = this.data.campaigns.findIndex((c) => c.id === campaign.id);
    if (idx >= 0) {
      this.data.campaigns[idx] = { ...campaign, updatedAt: new Date().toISOString() };
    } else {
      this.data.campaigns.unshift(campaign);
    }
    this.save();
    return campaign;
  }

  deleteCampaign(id: string): boolean {
    const initialLen = this.data.campaigns.length;
    this.data.campaigns = this.data.campaigns.filter((c) => c.id !== id);
    if (this.data.campaigns.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Content Items ---
  getContentItems(filters?: { campaignId?: string; businessProfileId?: string; status?: string }): ContentItem[] {
    let items = this.data.contentItems;
    if (filters?.campaignId) {
      items = items.filter((i) => i.campaignId === filters.campaignId);
    }
    if (filters?.businessProfileId) {
      items = items.filter((i) => i.businessProfileId === filters.businessProfileId);
    }
    if (filters?.status) {
      items = items.filter((i) => i.status === filters.status);
    }
    return items;
  }

  getContentItemById(id: string): ContentItem | undefined {
    return this.data.contentItems.find((i) => i.id === id);
  }

  saveContentItem(item: ContentItem): ContentItem {
    const idx = this.data.contentItems.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      this.data.contentItems[idx] = { ...item, updatedAt: new Date().toISOString() };
    } else {
      this.data.contentItems.unshift(item);
    }
    this.save();
    return item;
  }

  updateContentStatus(
    id: string,
    status: ContentItem['status'],
    notes?: { approvalNotes?: string; rejectionReason?: string; scheduledFor?: string }
  ): ContentItem | undefined {
    const item = this.getContentItemById(id);
    if (!item) return undefined;
    item.status = status;
    if (notes?.approvalNotes !== undefined) item.approvalNotes = notes.approvalNotes;
    if (notes?.rejectionReason !== undefined) item.rejectionReason = notes.rejectionReason;
    if (notes?.scheduledFor !== undefined) item.scheduledFor = notes.scheduledFor;
    item.updatedAt = new Date().toISOString();
    this.save();
    return item;
  }

  deleteContentItem(id: string): boolean {
    const initialLen = this.data.contentItems.length;
    this.data.contentItems = this.data.contentItems.filter((i) => i.id !== id);
    if (this.data.contentItems.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Strategies ---
  getStrategies(profileId?: string): StrategyBrief[] {
    if (profileId) {
      return this.data.strategies.filter((s) => s.businessProfileId === profileId);
    }
    return this.data.strategies;
  }

  saveStrategy(strategy: StrategyBrief): StrategyBrief {
    this.data.strategies.unshift(strategy);
    this.save();
    return strategy;
  }

  // --- Market Intelligence ---
  getIntelligence(): MarketIntelligenceItem[] {
    return this.data.intelligence;
  }

  addIntelligenceItem(item: MarketIntelligenceItem): MarketIntelligenceItem {
    this.data.intelligence.unshift(item);
    this.save();
    return item;
  }

  // --- Growth Playbooks ---
  getGrowthPlaybooks(): GrowthPlaybook[] {
    return this.data.growthPlaybooks;
  }

  // --- Reports ---
  getReports(): CampaignReport[] {
    return this.data.reports;
  }

  saveReport(report: CampaignReport): CampaignReport {
    this.data.reports.unshift(report);
    this.save();
    return report;
  }

  // --- CEO Tasks ---
  getCeoTasks(): CeoTask[] {
    return this.data.ceoTasks;
  }

  getCeoTaskById(id: string): CeoTask | undefined {
    return this.data.ceoTasks.find((t) => t.taskId === id);
  }

  saveCeoTask(task: CeoTask): CeoTask {
    const idx = this.data.ceoTasks.findIndex((t) => t.taskId === task.taskId);
    if (idx >= 0) {
      this.data.ceoTasks[idx] = task;
    } else {
      this.data.ceoTasks.unshift(task);
    }
    this.save();
    return task;
  }

  // --- Integrations ---
  getIntegrations(): ChannelIntegration[] {
    return this.data.integrations;
  }

  updateIntegration(platform: string, updates: Partial<ChannelIntegration>): ChannelIntegration | undefined {
    const item = this.data.integrations.find((i) => i.platform === platform);
    if (!item) return undefined;
    Object.assign(item, updates);
    this.save();
    return item;
  }

  // --- Schedules ---
  getSchedules(): AutonomousSchedule[] {
    return this.data.schedules;
  }

  updateSchedule(id: string, updates: Partial<AutonomousSchedule>): AutonomousSchedule | undefined {
    const sched = this.data.schedules.find((s) => s.id === id);
    if (!sched) return undefined;
    Object.assign(sched, updates);
    this.save();
    return sched;
  }

  // --- Logs ---
  getLogs(limit = 100): ExecutionLog[] {
    return this.data.logs.slice(0, limit);
  }

  addLog(level: ExecutionLog['level'], module: string, message: string, details?: Record<string, any>): ExecutionLog {
    const entry: ExecutionLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      details,
    };
    this.data.logs.unshift(entry);
    if (this.data.logs.length > 500) {
      this.data.logs = this.data.logs.slice(0, 500);
    }
    this.save();
    return entry;
  }
}

export const storage = new StorageService();
