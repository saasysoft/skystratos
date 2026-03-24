import { type ReactNode } from 'react';

// ── Enums & Unions ──────────────────────────────────────────────────

export type FleetSizeRange = '1-10' | '11-50' | '51-100' | '101-250' | '250+';

export type HudComponentType = 'gauge' | 'indicator' | 'panel' | 'statusbar' | 'radar';

// ── Navigation ──────────────────────────────────────────────────────

export interface NavSection {
  id: string;
  label: string;
}

// ── Base Section Props ──────────────────────────────────────────────

export interface LandingSectionProps {
  id: string;
  className?: string;
}

// ── Section Props ───────────────────────────────────────────────────

export interface HeroSectionProps extends LandingSectionProps {
  onCtaClick: () => void;
}

export interface PainPointsSectionProps extends LandingSectionProps {
  cards: PainPointCard[];
}

export interface PlatformShowcaseSectionProps extends LandingSectionProps {
  features: PlatformFeature[];
}

export interface PricingSectionProps extends LandingSectionProps {
  tiers: PricingTier[];
  onSelectTier: (tierId: string) => void;
}

export interface DemoRequestFormProps {
  preselectedTier?: string;
}

export interface LandingNavProps {
  sections: NavSection[];
  activeSectionId: string;
}

export interface LandingFooterProps {
  className?: string;
}

// ── Data Models ─────────────────────────────────────────────────────

export interface PainPointCard {
  id: string;
  icon: string;
  headline: string;
  description: string;
  stat: string;
  statContext: string;
}

export interface PlatformFeature {
  id: string;
  title: string;
  description: string;
  hudComponent: HudComponentType;
  demoProps: Record<string, unknown>;
  screenshotFallback?: string;
}

export interface PricingPrice {
  amount: number | null;
  currency: 'USD';
  interval: string;
  perUnit: 'aircraft';
}

export interface PricingFeature {
  text: string;
  included: boolean;
  tooltip?: string;
}

export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  price: PricingPrice;
  features: PricingFeature[];
  highlighted: boolean;
  ctaLabel: string;
}

// ── Lead Submission ─────────────────────────────────────────────────

export interface LeadSubmissionRequest {
  fullName: string;
  email: string;
  company: string;
  jobTitle: string;
  fleetSize: FleetSizeRange;
  message?: string;
  selectedTier?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface LeadSubmissionResponse {
  success: true;
  leadId: string;
  message: string;
}

export interface LeadSubmissionError {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
}

// ── Error Boundary ──────────────────────────────────────────────────

export interface SectionErrorBoundaryProps {
  sectionName: string;
  fallbackHeight?: string;
  children: ReactNode;
}
