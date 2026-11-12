# SaaS Growth Marketing & Distribution Agent
### Autonomous AI Marketing Director — Specialist Agent in the Autonomous Business CEO Ecosystem

An enterprise-grade, autonomous AI Marketing Director application built to plan, create, organize, optimize, and distribute multi-channel marketing campaigns.

Operating under the supervision of the **Autonomous Business CEO Orchestrator**, this specialist agent takes high-level business directives (e.g. "Accelerate Q2 self-serve ARR", "Launch developer CLI tool") and autonomously transforms them into full go-to-market strategies, platform-native content calendars, and conversion distribution flights across 7 digital channels.

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│          Autonomous Business CEO Orchestrator               │
│  (Central Delegation Engine: Directives, Priorities, Goals)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ POST /api/ceo/tasks
                               ▼
┌─────────────────────────────────────────────────────────────┐
│      SaaS Growth Marketing & Distribution Agent             │
│                                                             │
│  ┌───────────────────────┐       ┌────────────────────────┐ │
│  │   AI Marketing Engine │       │  Autonomous Scheduler  │ │
│  │   • Marketing Strategist      │  • 24/7 Queue Refresh  │ │
│  │   • Social Copywriter │       │  • Market Radar Daemons│ │
│  │   • Campaign Planner  │       │  • Weekly Rebalancer   │ │
│  │   • Growth Hacker     │       └────────────────────────┘ │
│  │   • Marketing Analyst │                                  │
│  │   • Brand Voice Guard │       ┌────────────────────────┐ │
│  └───────────────────────┘       │   Persistent Storage   │ │
│                                  │   (Local JSON / SQL)   │ │
│  ┌────────────────────────┐      └────────────────────────┘ │
│  │  Human Approval Gate   │                                 │
│  │  (Approve/Reject/Edit) │      ┌────────────────────────┐ │
│  └───────────┬────────────┘      │ Independent Adapters   │ │
│              │                   │ • LinkedIn • Twitter/X │ │
│              ▼                   │ • YouTube  • Instagram │ │
│    [ Export Kit / Direct ] ─────▶│ • TikTok   • Facebook  │ │
│                                  │ • Pinterest            │ │
│                                  └────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Plus Jakarta Sans & JetBrains Mono typography.
- **Backend**: Node.js + Express 4.x running in full-stack architecture with Vite dev middleware (`tsx server.ts`).
- **AI Engine**: Google Gemini API (`@google/genai`) configured server-side with `gemini-3.8-flash` and 7 domain reasoning modes.
- **Data Persistence**: File-backed JSON store in `data/storage.json` with atomic writes, seed data, and clean upgrade path to PostgreSQL / Cloud SQL / Firestore.
- **Publishing Adapters**: Strict independent adapters with credential validation; never simulates publication without authorization.

---

## 2. Supported Social Media Channels & Formats

| Channel | Platform Formats | Hook / Tone Optimization | Character Limit |
| :--- | :--- | :--- | :--- |
| **LinkedIn** | Thought Leadership Posts, Document Carousels, Long-form Articles | Technical credibility, clean line-breaks, contrarian insights, whitespace | 3,000 |
| **X (Twitter)** | Numbered Threads, Single Insight Tweets, Polls | Punchy contrarian hooks, YAML/code blocks, fast value delivery | 280 (or 25k Premium) |
| **YouTube** | Deep-Dive Video Scripts, Shorts Concepts, Community Posts | 3-second retention hooks, split-screen visual direction, timecoded blueprints | 5,000 |
| **Instagram** | 6-Slide Educational Carousels, Reels Concepts, Story Teasers | High-contrast visual slides, aesthetic typography, problem-to-solution flow | 2,200 |
| **TikTok** | Short-form Skits, POV Engineering Humor, Code Walkthroughs | Rapid phone camera staging, audio track cues, fast caption overlays | 2,200 |
| **Facebook** | Group Updates, Page Announcements, Case Study Links | Relatable storytelling, community discussion prompts, link previews | 63,206 |
| **Pinterest** | Infographic Pins, Architecture Flowcharts, Cheat Sheets | Vertical 2:3 infographic outlines, high-intent problem headlines | 500 |

---

## 3. The 7 Specialized AI Reasoning Modes

1. **Marketing Strategist**: Formulates GTM positioning, competitive moats, TAM/SAM/SOM breakdowns, SWOT evaluations, and budget allocation models.
2. **Social Media Copywriter**: Generates platform-native copy, provocative hooks, carousels, and hashtag strategies with zero generic AI platitudes.
3. **Campaign Planner**: Coordinates end-to-end multi-channel flights, TOF/MOF/BOF funnel sequencing, and milestone forecasts.
4. **Audience Researcher**: Identifies unspoken ICP anxieties, buying triggers, objections, and Jobs-to-be-Done (JTBD).
5. **Growth Hacker**: Designs viral organic acquisition loops, un-gated calculator lead magnets, and Product Hunt / Hacker News launch blitzes.
6. **Marketing Analyst**: Dissects conversion cohorts, evaluates channel efficiency ratings, and formulates data-driven A/B experiments.
7. **Brand Voice Specialist**: Enforces strict brand guardrails, lexical rules, and culturally native localization across 6+ languages (English, Portuguese, Spanish, French, German, Italian).

---

## 4. CEO Orchestrator Integration API Contract

This agent implements a standardized contract for delegation from external central orchestrators:

### Endpoints
- `GET /api/health` — Agent status, uptime, version, and Gemini readiness.
- `GET /api/ceo/contract` — Machine-readable contract specification.
- `POST /api/ceo/tasks` — Accepts delegated tasks from the CEO Orchestrator.
- `GET /api/ceo/tasks` — Lists historical CEO tasks and execution traces.
- `POST /api/marketing/generate` — Universal task delegator conforming to CEO contract.

### Delegated Task Payload (CEO → Specialist)
```json
{
  "taskId": "ceo-task-q2-001",
  "sourceAgent": "AUTONOMOUS_BUSINESS_CEO_ORCHESTRATOR",
  "taskType": "GENERATE_CAMPAIGN",
  "businessProfileId": "prof-cloudscale-01",
  "objective": "Scale Q2 self-serve ARR through developer advocacy",
  "priority": "high",
  "input": {
    "campaignName": "Serverless Compute Cost Slash Blitz",
    "durationWeeks": 4,
    "channels": ["linkedin", "twitter", "youtube"],
    "instructions": "Focus on declarative YAML automation and ephemeral cluster destruction."
  }
}
```

### Specialist Response Contract (Specialist → CEO)
```json
{
  "agentName": "SaaS Growth Marketing & Distribution Specialist Agent",
  "taskId": "ceo-task-q2-001",
  "status": "SUCCESS",
  "summary": "Successfully formulated multi-channel campaign spanning LinkedIn, X, and YouTube with 3 ready-to-review content assets.",
  "recommendations": [
    "Review and approve content pieces in the Approval Queue before flight launch.",
    "Ensure channel API credentials or export workflows are verified.",
    "Initiate technical retargeting pixel setup prior to flight launch."
  ],
  "generatedAssets": {
    "campaignId": "camp-1794420503200",
    "contentItemsCount": 3,
    "contentItemIds": ["content-1", "content-2", "content-3"]
  },
  "relevantMetrics": {
    "targetImpressions": 350000,
    "targetLeads": 950,
    "targetConversions": 160,
    "recommendedTotalBudgetUsd": 12000
  },
  "requiredApprovals": [
    {
      "type": "HUMAN_CONTENT_VERIFICATION",
      "description": "Human review required for 3 generated social posts before external publication.",
      "severity": "medium",
      "requiresHumanConfirmation": true
    }
  ],
  "nextActions": [
    "Approve draft items via POST /api/marketing/approve",
    "Query scheduled calendar via GET /api/marketing/calendar"
  ],
  "errors": []
}
```

---

## 5. Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck & runtime status |
| `POST` | `/api/marketing/generate` | Universal task generation (CEO format) |
| `POST` | `/api/marketing/strategy` | Generate GTM marketing strategy & SWOT |
| `GET` | `/api/marketing/campaigns` | List campaigns (optional `?profileId=`) |
| `POST` | `/api/marketing/campaigns` | Create multi-channel campaign flight |
| `GET` | `/api/marketing/campaigns/:id` | Fetch campaign and its assets |
| `POST` | `/api/marketing/content/generate`| Generate single platform-optimized post |
| `GET` | `/api/marketing/calendar` | Query calendar posts by channel & status |
| `POST` | `/api/marketing/calendar` | Save or update calendar entry |
| `POST` | `/api/marketing/approve` | Approve, reject with note, or schedule |
| `POST` | `/api/marketing/publish` | Attempt live dispatch (or export kit if not connected) |
| `GET` | `/api/marketing/report` | Fetch latest executive performance reports |
| `POST` | `/api/marketing/analyze` | Run AI diagnostic on campaign metrics |
| `GET` | `/api/marketing/profiles` | List business profiles |
| `POST` | `/api/marketing/profiles` | Create or update brand profile |
| `GET` | `/api/marketing/intelligence` | Query trends and competitor moves |
| `GET` | `/api/marketing/integrations` | Fetch adapter connection statuses |
| `GET` | `/api/marketing/export/:id` | Generate instant platform export kit |

---

## 6. Human Approval & Autonomous Safety Policy

In compliance with enterprise safety standards:
1. **Content Generation** may occur automatically via 24/7 autonomous background daemons.
2. **External Actions** (publishing to social channels, paid ad budget shifts, account mutations) **strictly require**:
   - Human operator approval in the **Approval Queue** (`POST /api/marketing/approve`).
   - Valid channel credentials configured in **Integrations**.
3. **Zero False Publishing**: When credentials or OAuth tokens are absent, the application refuses to claim success. It provides an immediate structured error with clear instructions and an **Export Kit** containing formatted text, hashtags, character counts, and suggested posting times.

---

## 7. Integrations Requiring External Credentials

All 7 channel adapters run in **Export / Preview Mode** out of the box. To enable direct 1-click publishing, the following developer credentials can be configured in `Settings > Integrations`:

- **LinkedIn**: `Client ID`, `Client Secret`, `Organization URN` (`w_organization_social` scope).
- **X (Twitter)**: `API Key`, `API Secret`, `Access Token`, `Access Secret` (OAuth 1.0a / OAuth 2.0 User Context).
- **Instagram**: `Instagram Business Account ID`, `Long-Lived Page Access Token` (Meta Graph API).
- **TikTok**: `Client Key`, `Client Secret` (TikTok Content Posting API).
- **YouTube**: `Google Cloud OAuth Client ID`, `Client Secret`, `Channel ID` (`youtube.upload` scope).
- **Facebook**: `Facebook Page ID`, `Page Access Token` (`pages_manage_posts` scope).
- **Pinterest**: `App ID`, `App Secret`, `Board ID` (Pinterest API v5).

*(Sandbox Test Mode is also provided in the UI for verifying workflow validation without live keys).*

---

## 8. Known Limitations & Production Database Upgrade

- **Current Persistence**: The application uses a robust, file-backed local JSON store in `data/storage.json` with synchronous atomic writes. This satisfies the requirement to avoid relying solely on browser `localStorage`.
- **Production Scale Upgrade**:
  - To upgrade to PostgreSQL / Cloud SQL: replace `server/storage.ts` with Drizzle ORM or Prisma connecting via `DATABASE_URL`.
  - To upgrade to Firestore: initialize `@google-cloud/firestore` in `server/storage.ts` using the same typed interface methods (`getCampaigns`, `saveContentItem`, etc.).

---

## 9. Local Development & Verification

```bash
# 1. Install dependencies
npm install

# 2. Run TypeScript checks
npm run lint

# 3. Build production bundle
npm run build

# 4. Start full-stack dev server
npm run dev
# The server boots on http://0.0.0.0:3000
```
