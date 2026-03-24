import type {
  NavSection,
  PainPointCard,
  PlatformFeature,
  PricingTier,
} from '@/lib/types/landing';

// ── Navigation ──────────────────────────────────────────────────────

export const NAV_SECTIONS: NavSection[] = [
  { id: 'hero', label: 'Home' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'platform', label: 'Platform' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'demo', label: 'Get Demo' },
];

// ── Pain Points ─────────────────────────────────────────────────────

export const PAIN_POINTS: PainPointCard[] = [
  {
    id: 'visibility',
    icon: 'radar',
    headline: 'Fleet Visibility Gaps',
    description:
      'Scattered data across OEM portals, MRO systems, and spreadsheets means no one has a single view of the fleet. Critical status changes go unnoticed until they become emergencies.',
    stat: '37%',
    statContext: 'of AOG events traced to delayed visibility into aircraft status',
  },
  {
    id: 'aog-response',
    icon: 'alert-triangle',
    headline: 'AOG Response Bottlenecks',
    description:
      'When an aircraft goes down, the clock starts. Manual coordination between maintenance, logistics, and ops burns hours that cost tens of thousands per incident.',
    stat: '$150K+',
    statContext: 'average cost per AOG day for narrowbody operators',
  },
  {
    id: 'maintenance-silos',
    icon: 'database',
    headline: 'Maintenance Intel Silos',
    description:
      'AD compliance, MEL tracking, and reliability data live in disconnected systems. Engineering teams spend more time hunting information than analyzing it.',
    stat: '12hrs/wk',
    statContext: 'spent by engineering leads reconciling maintenance data manually',
  },
  {
    id: 'procurement',
    icon: 'shopping-cart',
    headline: 'Procurement Blind Spots',
    description:
      'Parts inventory spread across stations with no real-time view. Duplicate orders, stockouts, and missed repair-vs-replace decisions erode margins.',
    stat: '22%',
    statContext: 'of parts spend attributed to emergency procurement premiums',
  },
];

// ── Platform Features ───────────────────────────────────────────────

export const PLATFORM_FEATURES: PlatformFeature[] = [
  {
    id: 'fleet-radar',
    title: 'Fleet Map & Radar',
    description:
      'Real-time fleet position tracking with HUD-style radar overlay. See every aircraft, its status, route, and maintenance window at a glance.',
    hudComponent: 'radar',
    demoProps: {
      blips: 12,
      sweepSpeed: 2,
      range: 'global',
    },
  },
  {
    id: 'maintenance-intel',
    title: 'Maintenance Intelligence',
    description:
      'Unified AD compliance board, MEL tracker, and reliability trends. AI-powered alerts surface issues before they ground aircraft.',
    hudComponent: 'indicator',
    demoProps: {
      status: 'nominal',
      alerts: 3,
      compliance: 97.2,
    },
  },
  {
    id: 'cost-analytics',
    title: 'Cost & Operations Analytics',
    description:
      'Drill into cost-per-flight-hour, MRO spend, and dispatch reliability. Interactive gauges and trend lines built for the flight deck, not the back office.',
    hudComponent: 'gauge',
    demoProps: {
      value: 94.7,
      max: 100,
      label: 'Dispatch Reliability',
      unit: '%',
    },
  },
  {
    id: 'tower-copilot',
    title: 'Tower AI Co-Pilot',
    description:
      'Ask questions in plain language. Tower queries fleet data, surfaces anomalies, and recommends actions — like having an ops analyst that never sleeps.',
    hudComponent: 'panel',
    demoProps: {
      prompt: 'Show me aircraft approaching AD deadlines this month',
      responseLines: 4,
    },
  },
];

// ── Pricing Tiers ───────────────────────────────────────────────────

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'ops',
    name: 'OPS',
    tagline: 'Fleet visibility essentials',
    price: { amount: null, currency: 'USD', interval: 'month', perUnit: 'aircraft' },
    features: [
      { text: 'Real-time fleet map & radar', included: true },
      { text: 'Aircraft status dashboard', included: true },
      { text: 'Basic alerting (AOG, status changes)', included: true },
      { text: 'Dispatch reliability metrics', included: true },
      { text: 'Up to 25 aircraft', included: true },
      { text: 'Email support', included: true },
      { text: 'Maintenance intelligence', included: false },
      { text: 'Cost analytics', included: false },
      { text: 'Tower AI Co-Pilot', included: false },
    ],
    highlighted: false,
    ctaLabel: 'Contact Sales',
  },
  {
    id: 'intel',
    name: 'INTEL',
    tagline: 'AI-powered maintenance & cost intelligence',
    price: { amount: null, currency: 'USD', interval: 'month', perUnit: 'aircraft' },
    features: [
      { text: 'Everything in OPS', included: true },
      { text: 'Maintenance intelligence suite', included: true, tooltip: 'AD compliance, MEL tracking, reliability trends' },
      { text: 'Cost & operations analytics', included: true },
      { text: 'Tower AI Co-Pilot', included: true, tooltip: 'Natural language fleet queries and anomaly detection' },
      { text: 'Multi-station inventory view', included: true },
      { text: 'Advanced alerting & escalation', included: true },
      { text: 'Up to 100 aircraft', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom integrations & API', included: false },
    ],
    highlighted: true,
    ctaLabel: 'Contact Sales',
  },
  {
    id: 'command',
    name: 'COMMAND',
    tagline: 'Full platform with custom integrations',
    price: { amount: null, currency: 'USD', interval: 'month', perUnit: 'aircraft' },
    features: [
      { text: 'Everything in INTEL', included: true },
      { text: 'Custom integrations & API access', included: true, tooltip: 'Connect to your MRO, ERP, and OEM systems' },
      { text: 'Unlimited aircraft', included: true },
      { text: 'Custom dashboards & reports', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'SSO & advanced security', included: true },
      { text: 'On-premise deployment option', included: true },
      { text: 'SLA-backed uptime guarantee', included: true },
      { text: '24/7 phone & chat support', included: true },
    ],
    highlighted: false,
    ctaLabel: 'Contact Sales',
  },
];
