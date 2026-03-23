```
 ███████╗██╗  ██╗██╗   ██╗██╗     ██╗███╗   ██╗███████╗
 ██╔════╝██║ ██╔╝╚██╗ ██╔╝██║     ██║████╗  ██║██╔════╝
 ███████╗█████╔╝  ╚████╔╝ ██║     ██║██╔██╗ ██║█████╗
 ╚════██║██╔═██╗   ╚██╔╝  ██║     ██║██║╚██╗██║██╔══╝
 ███████║██║  ██╗   ██║   ███████╗██║██║ ╚████║███████╗
 ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝
        Airline Fleet Operations Intelligence Platform
```

> AI-powered fleet management dashboard for airline maintenance executives. Track aircraft health, predict failures, optimize procurement, and reduce AOG costs — with an AI copilot that speaks aviation.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Claude API](https://img.shields.io/badge/Claude_API-Sonnet_4-orange)](https://docs.anthropic.com/)

---

## Why It Exists

Airlines lose millions annually because their maintenance systems (MRO software), parts inventory, procurement, and financial reporting live in disconnected silos. Deferred maintenance cascades into emergency repairs, AOG (Aircraft on Ground) events, and emergency parts procurement at 50-300% markups.

**Skyline** unifies these data streams into a single cockpit-style dashboard and uses AI to surface the connections executives can't see in spreadsheets.

---

## What It Does

### 9 Dashboard Panels

| Panel | What It Shows |
|-------|--------------|
| **Fleet Overview** | Real-time aircraft positions on world map, fleet status, cost metrics, aircraft registry |
| **Maintenance Intelligence** | Overdue alerts, 90-day timeline, category breakdown, fleet-wide failure pattern detection |
| **Procurement & Inventory** | Two-track order pipeline (planned + AOG bypass), emergency orders, low stock alerts |
| **Cost Analysis** | YTD gauges, monthly trends, cost breakdown by category, AOG burn tracker |
| **MEL Tracker** | Minimum Equipment List deferrals with category-based countdown timers |
| **AD/SB Compliance** | Airworthiness Directive and Service Bulletin compliance status across the fleet |
| **Dispatch Reliability** | Real-time dispatch reliability %, trend charts, cause breakdown |
| **AOG Timeline** | Current AOG events with revenue impact calculator, event history |
| **Multi-Station Inventory** | Parts stock across 5 airport hubs, cross-station transfer recommendations |

### Tower AI Copilot

An AI executive assistant that lives in a sidebar. Powered by Claude with 9 specialized tools:

- **Natural language queries** — "Which aircraft should I be worried about?"
- **Data-backed answers** — Tower queries fleet data, maintenance records, inventory, MEL status before responding
- **Proactive intelligence** — Surfaces patterns and risks before you ask
- **Report generation** — Fleet status, cost analysis, AOG impact, MEL summaries
- **Dashboard control** — Tower can filter and navigate the dashboard for you

### HUD Design System

Cockpit-inspired dark theme with aviation blue/amber palette. Monospace typography (Share Tech Mono), animated gauges, scan lines, radar display, cinematic boot sequence.

---

## How To Use It

### Prerequisites

- Node.js 18+
- Anthropic API key (for Tower AI)

### Setup

```bash
git clone https://github.com/saasysoft/skyline.git
cd skyline
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). PIN is `8888`.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key for Tower AI copilot |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS + custom HUD design tokens |
| Charts | Recharts |
| Maps | MapLibre GL (react-map-gl) |
| Animations | Framer Motion + GSAP |
| AI | Claude API (Anthropic SDK) with tool calling |
| Fonts | Share Tech Mono + Inter |

---

## Project Structure

```
src/
  app/              # Next.js pages + API routes
    api/tower/      # Tower AI endpoint (Claude tool-calling loop)
  components/
    auth/           # PIN Gate, Boot Sequence, Guided Tour
    hud/            # Design system (Panel, Gauge, Indicator, Knob, etc.)
    layout/         # App shell, 9-tab navigation, status bar
    panels/         # 4 core panels + fleet map
      aviation/     # 5 aviation-specific panels
    tower/          # AI sidebar (chat UI, actions, thinking states)
  lib/
    data/           # Data access layer + dashboard filter context
    mock-data/      # 8 data domains (aircraft, maintenance, MEL, etc.)
    tower/          # System prompt, 9 tool definitions, tool handlers
    i18n/           # Translation infrastructure
```

---

## Mock Data

Skyline ships with realistic demo data:

- **30 aircraft** across 8 types (B737-800, A320neo, B787-9, B777-300ER, etc.)
- **70 maintenance records** with a fleet-wide CFM LEAP-1A pattern
- **25 MEL items** across Categories A-D with expiry countdowns
- **50 procurement orders** (35 planned + 15 AOG emergency at 50-300% premium)
- **100 inventory items** across 5 airport hub locations
- **12 months of cost data** showing escalating unscheduled maintenance trends
- **164 scheduled flights** with revenue estimates for AOG impact calculation
- **15 alerts** across 4 severity levels

---

## License

[MIT](LICENSE) - SaaSy Labs 2026
