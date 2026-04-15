import type { Locale } from './context';
import type { PainPointCard, PlatformFeature, PricingTier, NavSection } from '@/lib/types/landing';

// ── Simple strings ──────────────────────────────────────────────────────

const strings = {
  en: {
    hero: {
      headline: "Your Fleet\u2019s Hidden Costs \u2014 Made Visible",
      subhead: "AI-powered fleet intelligence for airline maintenance executives who need answers, not dashboards",
      cta: "Schedule Meeting",
      demo: "Demo",
      demoAria: "Try the SkyStratos demo",
      scrollHint: "Scroll to explore",
    },
    painPoints: {
      headline: "Every grounded aircraft costs",
      costRange: "$10K-150K",
      perHour: "per hour",
    },
    platform: {
      headline: "One Command Center for Your Entire Fleet",
      subhead: "Four integrated modules. One screen. Zero guesswork.",
      livePreview: "Live Fleet Map Preview",
    },
    tower: {
      label: "Tower AI Co-Pilot",
      headline: "Ask Your Fleet Anything",
      description: "Tower AI understands your fleet data \u2014 maintenance schedules, parts inventory, cost trends, compliance status. Ask in plain English, get actionable intelligence.",
      cta: "See Tower in Action",
      bullets: [
        "9 specialized tools for fleet intelligence",
        "Natural language \u2014 no dashboards to learn",
        "Powered by Claude AI",
      ],
      userMsg1: "Which aircraft should I worry about this month?",
      userMsg2: "Show me the parts availability for N321SK",
      response: "3 aircraft flagged for attention this month:",
      colTail: "Tail #",
      colIssue: "Issue",
      colRisk: "Risk",
    },
    pricing: {
      headline: "Built for Your Fleet, Priced for Your Scale",
      subhead: "Every deployment is custom-tailored to your airline\u2019s systems, workflows, and fleet size.",
      contactSales: "Schedule Meeting",
      customPricing: "Custom pricing per aircraft",
      recommended: "Recommended",
    },
    schedule: {
      headline: "Schedule a Meeting",
      subhead: "Book 30 minutes with our team to see SkyStratos in action and discuss your fleet operations.",
      loading: "Loading calendar...",
      fallback: "Open in Cal.com",
    },
    footer: {
      product: "PRODUCT",
      company: "COMPANY",
      legal: "LEGAL",
      fleetIntelligence: "Fleet Intelligence",
      maintenanceAI: "Maintenance AI",
      costAnalytics: "Cost Analytics",
      towerCoPilot: "Tower AI Co-Pilot",
      about: "About",
      pricing: "Pricing",
      contact: "Contact",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      cta: "Ready to see what\u2019s grounding your fleet?",
      ctaLink: "Schedule Meeting",
      tagline: "Fleet Intelligence Platform",
    },
    nav: {
      demo: "Demo",
      scheduleMeeting: "SCHEDULE MEETING",
    },
  },
  'zh-TW': {
    hero: {
      headline: "\u6a5f\u968a\u96b1\u85cf\u6210\u672c \u2014 \u4e00\u76ee\u4e86\u7136",
      subhead: "\u70ba\u822a\u7a7a\u7dad\u4fee\u4e3b\u7ba1\u6253\u9020\u7684 AI \u6a5f\u968a\u60c5\u5831\u5e73\u53f0\uff0c\u63d0\u4f9b\u7b54\u6848\u800c\u975e\u5100\u8868\u677f",
      cta: "\u9810\u7d04\u6703\u8b70",
      demo: "\u9ad4\u9a57\u5c55\u793a",
      demoAria: "\u8a66\u7528 SkyStratos \u5c55\u793a",
      scrollHint: "\u5411\u4e0b\u6372\u52d5\u63a2\u7d22",
    },
    painPoints: {
      headline: "\u6bcf\u67b6\u505c\u98db\u822a\u7a7a\u5668\u6bcf\u5c0f\u6642\u640d\u5931",
      costRange: "1\u842c\u81f315\u842c\u7f8e\u5143",
      perHour: "",
    },
    platform: {
      headline: "\u4e00\u500b\u6307\u63ee\u4e2d\u5fc3\u638c\u63a7\u6574\u500b\u6a5f\u968a",
      subhead: "\u56db\u500b\u6574\u5408\u6a21\u7d44\u3002\u4e00\u500b\u756b\u9762\u3002\u96f6\u731c\u6e2c\u3002",
      livePreview: "\u5373\u6642\u6a5f\u968a\u5730\u5716\u9810\u89bd",
    },
    tower: {
      label: "Tower AI \u526f\u99d5",
      headline: "\u5411\u6a5f\u968a\u63d0\u554f\u4efb\u4f55\u554f\u984c",
      description: "Tower AI \u638c\u63e1\u60a8\u7684\u6a5f\u968a\u8cc7\u6599 \u2014 \u7dad\u4fee\u6392\u7a0b\u3001\u96f6\u4ef6\u5eab\u5b58\u3001\u6210\u672c\u8da8\u52e2\u3001\u5408\u898f\u72c0\u614b\u3002\u4ee5\u81ea\u7136\u8a9e\u8a00\u63d0\u554f\uff0c\u7372\u5f97\u53ef\u57f7\u884c\u7684\u60c5\u5831\u3002",
      cta: "\u89c0\u770b Tower \u5be6\u969b\u904b\u4f5c",
      bullets: [
        "9 \u500b\u5c08\u696d\u6a5f\u968a\u60c5\u5831\u5de5\u5177",
        "\u81ea\u7136\u8a9e\u8a00 \u2014 \u7121\u9700\u5b78\u7fd2\u5100\u8868\u677f",
        "\u7531 Claude AI \u9a45\u52d5",
      ],
      userMsg1: "\u9019\u500b\u6708\u6211\u61c9\u8a72\u95dc\u6ce8\u54ea\u4e9b\u822a\u7a7a\u5668\uff1f",
      userMsg2: "\u986f\u793a N321SK \u7684\u96f6\u4ef6\u53ef\u7528\u6027",
      response: "\u672c\u6708\u67093\u67b6\u822a\u7a7a\u5668\u9700\u8981\u95dc\u6ce8\uff1a",
      colTail: "\u6a5f\u5c3e\u865f",
      colIssue: "\u554f\u984c",
      colRisk: "\u98a8\u96aa",
    },
    pricing: {
      headline: "\u70ba\u60a8\u7684\u6a5f\u968a\u6253\u9020\uff0c\u4f9d\u898f\u6a21\u5b9a\u50f9",
      subhead: "\u6bcf\u6b21\u90e8\u7f72\u90fd\u91dd\u5c0d\u60a8\u822a\u7a7a\u516c\u53f8\u7684\u7cfb\u7d71\u3001\u6d41\u7a0b\u548c\u6a5f\u968a\u898f\u6a21\u91cf\u8eab\u8a02\u88fd\u3002",
      contactSales: "\u9810\u7d04\u6703\u8b70",
      customPricing: "\u4f9d\u822a\u7a7a\u5668\u6578\u91cf\u5b9a\u50f9",
      recommended: "\u63a8\u85a6",
    },
    schedule: {
      headline: "\u9810\u7d04\u6703\u8b70",
      subhead: "\u9810\u7d0430\u5206\u9418\u8207\u6211\u5011\u7684\u5718\u968a\u6703\u9762\uff0c\u89c0\u770b SkyStratos \u5be6\u969b\u904b\u4f5c\u4e26\u8a0e\u8ad6\u60a8\u7684\u6a5f\u968a\u71df\u904b\u3002",
      loading: "\u8f09\u5165\u884c\u4e8b\u66c6\u4e2d\u2026",
      fallback: "\u5728 Cal.com \u958b\u555f",
    },
    footer: {
      product: "\u7522\u54c1",
      company: "\u516c\u53f8",
      legal: "\u6cd5\u5f8b",
      fleetIntelligence: "\u6a5f\u968a\u60c5\u5831",
      maintenanceAI: "\u7dad\u4fee AI",
      costAnalytics: "\u6210\u672c\u5206\u6790",
      towerCoPilot: "Tower AI \u526f\u99d5",
      about: "\u95dc\u65bc\u6211\u5011",
      pricing: "\u50f9\u683c",
      contact: "\u806f\u7d61\u6211\u5011",
      terms: "\u670d\u52d9\u689d\u6b3e",
      privacy: "\u96b1\u79c1\u653f\u7b56",
      cta: "\u60f3\u77e5\u9053\u662f\u4ec0\u9ebc\u8b93\u60a8\u7684\u6a5f\u968a\u505c\u98db\u55ce\uff1f",
      ctaLink: "\u9810\u7d04\u6703\u8b70",
      tagline: "\u6a5f\u968a\u60c5\u5831\u5e73\u53f0",
    },
    nav: {
      demo: "\u9ad4\u9a57\u5c55\u793a",
      scheduleMeeting: "\u9810\u7d04\u6703\u8b70",
    },
  },
} as const;

// ── Data arrays ─────────────────────────────────────────────────────────

const navSections: Record<Locale, NavSection[]> = {
  en: [
    { id: 'hero', label: 'Home' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'platform', label: 'Platform' },
    { id: 'tower', label: 'Tower AI' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'demo', label: 'Schedule' },
  ],
  'zh-TW': [
    { id: 'hero', label: '\u9996\u9801' },
    { id: 'challenges', label: '\u6311\u6230' },
    { id: 'platform', label: '\u5e73\u53f0' },
    { id: 'tower', label: 'Tower AI' },
    { id: 'pricing', label: '\u50f9\u683c' },
    { id: 'demo', label: '\u9810\u7d04' },
  ],
};

const painPoints: Record<Locale, PainPointCard[]> = {
  en: [
    {
      id: 'fragmented-systems',
      icon: 'database',
      headline: 'Fragmented Systems',
      description: 'Maintenance records in one system. Parts inventory in another. Cost data in a spreadsheet. Your team spends more time hunting for data than acting on it.',
      stat: '4.2 hrs',
      statContext: 'Average daily time lost to manual data reconciliation per station',
    },
    {
      id: 'reactive-maintenance',
      icon: 'alert-triangle',
      headline: 'Reactive Maintenance',
      description: 'By the time you spot a trend, three aircraft are already grounded. Traditional dashboards show what happened — not what\'s about to happen.',
      stat: '23%',
      statContext: 'Of unscheduled maintenance events are predictable with AI',
    },
    {
      id: 'procurement-chaos',
      icon: 'shopping-cart',
      headline: 'Procurement Chaos',
      description: 'Emergency AOG orders at 3x cost premiums. Parts sitting unused at one station while another scrambles. No visibility across the supply chain.',
      stat: '$2.1M',
      statContext: 'Average annual waste from emergency procurement premiums',
    },
    {
      id: 'blind-spot-costs',
      icon: 'radar',
      headline: 'Cost Blind Spots',
      description: 'You know total spend, but not where the money bleeds. Which aircraft drain your budget? Which routes cost more to maintain? The answers are buried in data silos.',
      stat: '18%',
      statContext: 'Fleet cost reduction achievable with unified intelligence',
    },
  ],
  'zh-TW': [
    {
      id: 'fragmented-systems',
      icon: 'database',
      headline: '\u7cfb\u7d71\u788e\u7247\u5316',
      description: '\u7dad\u4fee\u7d00\u9304\u5728\u4e00\u500b\u7cfb\u7d71\uff0c\u96f6\u4ef6\u5eab\u5b58\u5728\u53e6\u4e00\u500b\uff0c\u6210\u672c\u8cc7\u6599\u5728\u8a66\u7b97\u8868\u4e2d\u3002\u60a8\u7684\u5718\u968a\u82b1\u5728\u5c0b\u627e\u8cc7\u6599\u7684\u6642\u9593\u6bd4\u57f7\u884c\u884c\u52d5\u9084\u591a\u3002',
      stat: '4.2 \u5c0f\u6642',
      statContext: '\u6bcf\u500b\u7ad9\u9ede\u6bcf\u5929\u5e73\u5747\u640d\u5931\u5728\u624b\u52d5\u8cc7\u6599\u6574\u5408\u7684\u6642\u9593',
    },
    {
      id: 'reactive-maintenance',
      icon: 'alert-triangle',
      headline: '\u88ab\u52d5\u5f0f\u7dad\u4fee',
      description: '\u7576\u60a8\u767c\u73fe\u8da8\u52e2\u6642\uff0c\u4e09\u67b6\u98db\u6a5f\u5df2\u7d93\u505c\u98db\u3002\u50b3\u7d71\u5100\u8868\u677f\u986f\u793a\u7684\u662f\u5df2\u767c\u751f\u7684\u4e8b — \u800c\u975e\u5373\u5c07\u767c\u751f\u7684\u4e8b\u3002',
      stat: '23%',
      statContext: '\u7684\u975e\u8a08\u756b\u7dad\u4fee\u4e8b\u4ef6\u53ef\u900f\u904e AI \u9810\u6e2c',
    },
    {
      id: 'procurement-chaos',
      icon: 'shopping-cart',
      headline: '\u63a1\u8cfc\u6df7\u4e82',
      description: '\u7dca\u6025 AOG \u8a02\u55ae\u4ed8\u51fa3\u500d\u6210\u672c\u6ea2\u50f9\u3002\u96f6\u4ef6\u5728\u4e00\u500b\u7ad9\u9ede\u9592\u7f6e\uff0c\u53e6\u4e00\u500b\u7ad9\u9ede\u537b\u5728\u6025\u5fdb\u5c0b\u627e\u3002\u4f9b\u61c9\u93c8\u5b8c\u5168\u6c92\u6709\u900f\u660e\u5ea6\u3002',
      stat: '210\u842c\u7f8e\u5143',
      statContext: '\u5e74\u5747\u56e0\u7dca\u6025\u63a1\u8cfc\u6ea2\u50f9\u9020\u6210\u7684\u6d6a\u8cbb',
    },
    {
      id: 'blind-spot-costs',
      icon: 'radar',
      headline: '\u6210\u672c\u76f2\u9ede',
      description: '\u60a8\u77e5\u9053\u7e3d\u652f\u51fa\uff0c\u4f46\u4e0d\u77e5\u9053\u9322\u5f9e\u54ea\u88e1\u6d29\u8d70\u3002\u54ea\u4e9b\u822a\u7a7a\u5668\u6d88\u8017\u60a8\u7684\u9810\u7b97\uff1f\u54ea\u4e9b\u822a\u7dda\u7dad\u4fee\u6210\u672c\u66f4\u9ad8\uff1f\u7b54\u6848\u57cb\u5728\u8cc7\u6599\u5b64\u5cf6\u4e2d\u3002',
      stat: '18%',
      statContext: '\u900f\u904e\u7d71\u4e00\u60c5\u5831\u53ef\u5be6\u73fe\u7684\u6a5f\u968a\u6210\u672c\u524a\u6e1b',
    },
  ],
};

const platformFeatures: Record<Locale, PlatformFeature[]> = {
  en: [
    {
      id: 'fleet-overview',
      title: 'Fleet Overview',
      description: 'Real-time fleet status across all stations. See every aircraft\'s position, status, and cost-per-flight-hour at a glance. Interactive map with great circle routes and radar display.',
      hudComponent: 'radar',
      demoProps: {},
    },
    {
      id: 'maintenance-intel',
      title: 'Maintenance Intel',
      description: 'AI-powered maintenance intelligence. Track ADs, MEL items, reliability trends, and predicted failures. Catch fleet-wide patterns before they ground your aircraft.',
      hudComponent: 'indicator',
      demoProps: {},
    },
    {
      id: 'cost-analysis',
      title: 'Cost Analysis',
      description: 'Complete cost visibility from fuel to AOG procurement. Track budget variance, spot cost anomalies, and identify the highest-cost aircraft in your fleet.',
      hudComponent: 'gauge',
      demoProps: {},
    },
    {
      id: 'tower-ai',
      title: 'Tower AI',
      description: 'Ask questions in plain language. Tower queries fleet data, surfaces anomalies, and recommends actions \u2014 like having an ops analyst that never sleeps.',
      hudComponent: 'panel',
      demoProps: {},
    },
  ],
  'zh-TW': [
    {
      id: 'fleet-overview',
      title: '\u6a5f\u968a\u7e3d\u89bd',
      description: '\u5373\u6642\u638c\u63e1\u6240\u6709\u7ad9\u9ede\u7684\u6a5f\u968a\u72c0\u614b\u3002\u4e00\u7620\u77e5\u9053\u6bcf\u67b6\u822a\u7a7a\u5668\u7684\u4f4d\u7f6e\u3001\u72c0\u614b\u548c\u98db\u884c\u5c0f\u6642\u6210\u672c\u3002\u4e92\u52d5\u5f0f\u5730\u5716\u5305\u542b\u5927\u5708\u822a\u7dda\u548c\u96f7\u9054\u986f\u793a\u3002',
      hudComponent: 'radar',
      demoProps: {},
    },
    {
      id: 'maintenance-intel',
      title: '\u7dad\u4fee\u60c5\u5831',
      description: 'AI \u9a45\u52d5\u7684\u7dad\u4fee\u60c5\u5831\u3002\u8ffd\u8e64 AD\u3001MEL \u9805\u76ee\u3001\u53ef\u9760\u5ea6\u8da8\u52e2\u548c\u9810\u6e2c\u6545\u969c\u3002\u5728\u822a\u7a7a\u5668\u505c\u98db\u524d\u6355\u6349\u6a5f\u968a\u7bc4\u570d\u7684\u7570\u5e38\u6a21\u5f0f\u3002',
      hudComponent: 'indicator',
      demoProps: {},
    },
    {
      id: 'cost-analysis',
      title: '\u6210\u672c\u5206\u6790',
      description: '\u5f9e\u71c3\u6cb9\u5230 AOG \u63a1\u8cfc\u7684\u5b8c\u6574\u6210\u672c\u900f\u660e\u5ea6\u3002\u8ffd\u8e64\u9810\u7b97\u5dee\u7570\u3001\u767c\u73fe\u6210\u672c\u7570\u5e38\uff0c\u4e26\u8b58\u5225\u6a5f\u968a\u4e2d\u6210\u672c\u6700\u9ad8\u7684\u822a\u7a7a\u5668\u3002',
      hudComponent: 'gauge',
      demoProps: {},
    },
    {
      id: 'tower-ai',
      title: 'Tower AI',
      description: '\u4ee5\u81ea\u7136\u8a9e\u8a00\u63d0\u554f\u3002Tower \u67e5\u8a62\u6a5f\u968a\u8cc7\u6599\u3001\u767c\u73fe\u7570\u5e38\u4e26\u5efa\u8b70\u884c\u52d5 \u2014 \u5c31\u50cf\u64c1\u6709\u4e00\u4f4d\u6c38\u4e0d\u4f11\u606f\u7684\u71df\u904b\u5206\u6790\u5e2b\u3002',
      hudComponent: 'panel',
      demoProps: {},
    },
  ],
};

const pricingTiers: Record<Locale, PricingTier[]> = {
  en: [
    {
      id: 'ops',
      name: 'OPS',
      tagline: 'Core fleet visibility and tracking',
      price: { amount: null, currency: 'USD', interval: 'month', perUnit: 'aircraft' },
      features: [
        { text: 'Real-time fleet tracking', included: true },
        { text: 'Basic maintenance alerts', included: true },
        { text: 'Fleet status dashboard', included: true },
        { text: 'Up to 25 aircraft', included: true },
        { text: 'Email support', included: true },
        { text: 'Maintenance intelligence', included: false },
        { text: 'Cost analytics', included: false },
        { text: 'Tower AI Co-Pilot', included: false },
      ],
      highlighted: false,
      ctaLabel: 'Schedule Meeting',
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
      ctaLabel: 'Schedule Meeting',
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
      ctaLabel: 'Schedule Meeting',
    },
  ],
  'zh-TW': [
    {
      id: 'ops',
      name: 'OPS',
      tagline: '\u6838\u5fc3\u6a5f\u968a\u53ef\u8996\u5316\u8207\u8ffd\u8e64',
      price: { amount: null, currency: 'USD', interval: 'month', perUnit: 'aircraft' },
      features: [
        { text: '\u5373\u6642\u6a5f\u968a\u8ffd\u8e64', included: true },
        { text: '\u57fa\u672c\u7dad\u4fee\u8b66\u5831', included: true },
        { text: '\u6a5f\u968a\u72c0\u614b\u5100\u8868\u677f', included: true },
        { text: '\u6700\u591a25\u67b6\u822a\u7a7a\u5668', included: true },
        { text: '\u96fb\u5b50\u90f5\u4ef6\u652f\u63f4', included: true },
        { text: '\u7dad\u4fee\u60c5\u5831', included: false },
        { text: '\u6210\u672c\u5206\u6790', included: false },
        { text: 'Tower AI \u526f\u99d5', included: false },
      ],
      highlighted: false,
      ctaLabel: '\u9810\u7d04\u6703\u8b70',
    },
    {
      id: 'intel',
      name: 'INTEL',
      tagline: 'AI \u9a45\u52d5\u7684\u7dad\u4fee\u8207\u6210\u672c\u60c5\u5831',
      price: { amount: null, currency: 'USD', interval: 'month', perUnit: 'aircraft' },
      features: [
        { text: '\u5305\u542b OPS \u6240\u6709\u529f\u80fd', included: true },
        { text: '\u7dad\u4fee\u60c5\u5831\u5957\u4ef6', included: true, tooltip: 'AD \u5408\u898f\u3001MEL \u8ffd\u8e64\u3001\u53ef\u9760\u5ea6\u8da8\u52e2' },
        { text: '\u6210\u672c\u8207\u71df\u904b\u5206\u6790', included: true },
        { text: 'Tower AI \u526f\u99d5', included: true, tooltip: '\u81ea\u7136\u8a9e\u8a00\u6a5f\u968a\u67e5\u8a62\u8207\u7570\u5e38\u5075\u6e2c' },
        { text: '\u591a\u7ad9\u9ede\u5eab\u5b58\u6aa2\u8996', included: true },
        { text: '\u9032\u968e\u8b66\u5831\u8207\u5347\u7d1a', included: true },
        { text: '\u6700\u591a100\u67b6\u822a\u7a7a\u5668', included: true },
        { text: '\u512a\u5148\u652f\u63f4', included: true },
        { text: '\u81ea\u8a02\u6574\u5408\u8207 API', included: false },
      ],
      highlighted: true,
      ctaLabel: '\u9810\u7d04\u6703\u8b70',
    },
    {
      id: 'command',
      name: 'COMMAND',
      tagline: '\u5b8c\u6574\u5e73\u53f0\u542b\u81ea\u8a02\u6574\u5408',
      price: { amount: null, currency: 'USD', interval: 'month', perUnit: 'aircraft' },
      features: [
        { text: '\u5305\u542b INTEL \u6240\u6709\u529f\u80fd', included: true },
        { text: '\u81ea\u8a02\u6574\u5408\u8207 API \u5b58\u53d6', included: true, tooltip: '\u9023\u63a5\u60a8\u7684 MRO\u3001ERP \u548c OEM \u7cfb\u7d71' },
        { text: '\u7121\u9650\u822a\u7a7a\u5668', included: true },
        { text: '\u81ea\u8a02\u5100\u8868\u677f\u8207\u5831\u544a', included: true },
        { text: '\u5c08\u5c6c\u5ba2\u6236\u7d93\u7406', included: true },
        { text: 'SSO \u8207\u9032\u968e\u5b89\u5168', included: true },
        { text: '\u5730\u7aef\u90e8\u7f72\u9078\u9805', included: true },
        { text: 'SLA \u4fdd\u8b49\u7684\u6b63\u5e38\u904b\u884c\u6642\u9593', included: true },
        { text: '24/7 \u96fb\u8a71\u8207\u5373\u6642\u804a\u5929\u652f\u63f4', included: true },
      ],
      highlighted: false,
      ctaLabel: '\u9810\u7d04\u6703\u8b70',
    },
  ],
};

// ── Exports ─────────────────────────────────────────────────────────────

export function getLandingStrings(locale: Locale) {
  return strings[locale];
}

export function getNavSections(locale: Locale) {
  return navSections[locale];
}

export function getPainPoints(locale: Locale) {
  return painPoints[locale];
}

export function getPlatformFeatures(locale: Locale) {
  return platformFeatures[locale];
}

export function getPricingTiers(locale: Locale) {
  return pricingTiers[locale];
}
