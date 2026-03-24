# PRD: SkyStratos Landing Page + Demo Sign-In

**Status:** Blueprint (Rev 2 — scope refined)
**Author:** jv
**Date:** 2026-03-24 (updated 2026-03-25)
**Project:** SkyStratos — Airline Fleet Operations Intelligence Platform
**Inspired by:** jv-46 (Claude Code + Nano Banana 2 scroll-stop technique)
**Blueprint dir:** `C:\Dev\_PROJECTS\_PATTERN-WEAVING\blueprints\skystratos-landing-page\`

---

## 1. Problem Statement

SkyStratos currently drops users directly into a raw PIN gate with no public-facing presence. There is no way for prospects (airline executives, fleet ops directors, maintenance VPs) to understand what the product does before seeing it. We need:

- A **conversion-focused landing page** that sells the vision with a scroll-stopping 3D aircraft animation
- A **polished sign-in page** that gates access to a live demo with mock data
- **Standard SaaS pages** (pricing, terms, privacy) for credibility
- The existing dashboard (unchanged) serves as the **live demo** — prospects explore it, then we scope their custom build (integrations, feature selection, data sources)

**Sales motion:** Landing page sells → Prospect requests demo → We issue demo credentials → They sign in and explore → Sales call to scope custom deployment (which panels, which integrations, which data sources).

---

## 2. Target Audience

**Primary ICP:** Airline maintenance executives and fleet operations directors at mid-to-large airlines (50-500+ aircraft)

**Decision Maker Profile:**
- VP of Maintenance, Director of Fleet Ops, Chief Technical Officer
- NOT technical — they need AI to translate data into decisions
- Care about: AOG costs, dispatch reliability, compliance, parts availability
- Pain points: fragmented data across MRO systems, reactive maintenance, AOG revenue loss ($10K-150K/hour per grounded aircraft)

**Sales context:** Each airline deployment is custom — different inventory systems, fleet tracking integrations, MRO platforms, compliance workflows. The demo shows the vision; the sales conversation scopes the build.

---

## 3. Scroll-Stop Hero Animation

### Concept
A photorealistic commercial aircraft (assembled) that deconstructs into its major maintenance components as the user scrolls. As parts separate, cost labels and maintenance data appear next to each component — making the invisible cost of fleet maintenance visible and visceral.

### Animation Sequence (3 phases)

**Phase 1: Assembled Aircraft**
- Clean, photorealistic commercial jet (think 737/A320 class)
- SkyStratos branding subtly visible
- Dark background matching the HUD aesthetic (#0A0E14)
- Ambient glow in aviation blue (#0088FF)

**Phase 2: Exploded/Deconstructed View**
- Major components separate: engines, landing gear, avionics bay, APU, hydraulic systems, wing assemblies, empennage
- Each component floats outward from center
- Cost labels animate in next to each part:
  - "ENGINE OVERHAUL: $3.2M"
  - "LANDING GEAR: $850K"
  - "AVIONICS UPGRADE: $1.4M"
  - "APU REPLACEMENT: $620K"
  - "HYDRAULIC SYSTEM: $340K"
- Labels use Share Tech Mono font, aviation blue (#0088FF) with amber (#FFB800) for cost figures
- Subtle particle effects (data streams) connecting parts

**Phase 3: Dashboard Reveal**
- Components reassemble but fade to semi-transparent
- SkyStratos dashboard UI materializes behind/around the aircraft
- Gauges, charts, and AI insights overlay appear
- Tagline appears: "See what's breaking before it grounds your fleet"
- CTA button pulses: "REQUEST DEMO"

### Asset Generation Pipeline (from jv-46 technique)

1. **Assembled Shot prompt** → Nano Banana Pro (16:9, 2K, dark background matching #0A0E14)
   - "Photorealistic commercial aircraft, Boeing 737-800 class, three-quarter front view, dark navy background #0A0E14, subtle blue ambient light #0088FF, aviation HUD aesthetic, cinematic lighting, 8K detail"

2. **Exploded Shot prompt** → Nano Banana Pro (same settings, use assembled as reference)
   - "Same aircraft deconstructed, major components separated and floating — engines, landing gear, avionics, APU, hydraulic systems, wing assemblies — each part clearly visible with space between, dark navy background #0A0E14, blue ambient glow #0088FF, technical cutaway style, engineering diagram feel, 8K detail"

3. **Video Transition prompt** → Nano Banana Pro video (assembled as start frame, exploded as end frame)
   - "Smooth cinematic transition, aircraft parts separate and float outward from center, mechanical precision movement, subtle particle effects, dark background, blue lighting"

4. **Web Integration** → Embed as scroll-triggered `<video>` element with Framer Motion scroll progress binding

### Technical Implementation

```
Hero Section:
├── Scroll-triggered video (Framer Motion useScroll + useTransform)
├── Cost labels (animated in via Framer Motion, staggered)
├── Dashboard overlay (GSAP timeline triggered at scroll threshold)
└── CTA button (HUDButton component from existing design system)
```

**Key:** Use the existing HUD component library (HUDPanel, HUDGauge, HUDButton, HUDIndicator) for the dashboard overlay to maintain visual consistency with the actual product.

---

## 4. Page Structure

### 4.1 Navigation
- Sticky top nav, dark glass effect (matching HUD aesthetic)
- Logo: "SKYSTRATOS" in Share Tech Mono
- Links: Features | Pricing | Sign In
- CTA: "REQUEST DEMO" (HUDButton primary style)

### 4.2 Hero Section (above fold + scroll animation)
- Scroll-stop airplane deconstruction animation (see Section 3)
- Headline: "Your Fleet's Hidden Costs — Made Visible"
- Subheadline: "AI-powered fleet intelligence for airline maintenance executives who need answers, not dashboards"
- Primary CTA: "Request Demo Access"
- Secondary CTA: "Sign In" (for existing demo users)

### 4.3 Pain Points Section
- "Every grounded aircraft costs $10K-150K per hour"
- Four pain cards (HUDPanel style):
  1. **Fragmented Data** — "Your MRO data lives in 6+ systems. Your decisions shouldn't."
  2. **Reactive Maintenance** — "By the time you know, it's already AOG."
  3. **Executive Blind Spots** — "Your board asks questions your dashboards can't answer."
  4. **Procurement Blind Spots** — "Emergency orders at 3-5x markup because you couldn't see it coming."

### 4.4 Product Showcase (Interactive)
- Tabbed section showing the 4 core capabilities:
  1. **Fleet Intelligence** — Real-time fleet map + health overview (screenshot of actual dashboard)
  2. **Maintenance Intelligence** — MEL tracking, AD compliance, predictive scheduling
  3. **Cost & Operations** — AOG burn tracker + parts procurement optimization
  4. **Tower AI** — Natural language queries for executives ("What's our biggest maintenance risk this quarter?")
- Each tab shows an actual product screenshot with HUD overlay effects
- Subtle animations (gauges filling, radar sweep) using existing HUD components

### 4.5 Tower AI Spotlight
- Dedicated section for the AI copilot
- Static screenshot showing a mock conversation:
  - Executive: "Which aircraft should I worry about this month?"
  - Tower AI: Structured response with fleet risk analysis
- "Built for executives who don't have time to learn dashboards"

### 4.6 Pricing Section
- 3 enterprise tiers (descriptions only, no dollar amounts):
  - **Operations** — Fleet visibility, tracking, MEL management, basic alerts
  - **Intelligence** — + AI copilot, maintenance forecasting, cost analytics, compliance boards
  - **Command** — + multi-station inventory, custom integrations, API access, dedicated support
- "Contact Sales" on all tiers — every deployment is custom-scoped
- Note: "Each deployment is tailored to your fleet, systems, and workflows"

### 4.7 Footer
- Columns: Product, Company, Legal
- Legal links: Terms of Service, Privacy Policy
- CTA repeat: "Ready to see what's grounding your fleet?"
- "SKYSTRATOS" wordmark + "Authorized Personnel Only" tagline

---

## 5. Sign-In Page

### Purpose
Polished gateway to the live demo dashboard. Replaces the raw PIN gate for public-facing use. Prospects who receive demo credentials sign in here to explore the product with mock data.

### Design
- Full HUD aesthetic — dark background, aviation blue accents, scan lines
- "AUTHORIZED PERSONNEL ONLY" header (matches dashboard tone)
- SkyStratos logo prominent
- Login form:
  - Access code field (styled as HUD input — monospace, glowing border)
  - "AUTHENTICATE" button (HUDButton primary)
  - Subtle radar sweep or scan line animation in background
- Below form: "Don't have access? [Request Demo]" link → scrolls to demo request or mailto
- On successful auth: existing BootSequence plays → transitions to dashboard

### Technical
- Route: `/sign-in`
- Wraps existing `PINGate` component with polished UI chrome
- Uses existing `pin-context.tsx` auth (sessionStorage)
- On success: `router.push('/dashboard')` with boot sequence
- No server-side auth changes needed — demo PIN stays hardcoded for now

---

## 6. Supporting Pages

### 6.1 Terms of Service (`/terms`)
- Standard SaaS terms template
- Covers: demo access, data usage, liability, IP
- HUD-styled page with dark theme matching landing page

### 6.2 Privacy Policy (`/privacy`)
- Standard privacy policy template
- Covers: what data we collect (demo request form), cookies, analytics
- GDPR/CCPA compliant language

### 6.3 Pricing Page (`/pricing`)
- Expanded version of Section 4.6 with more detail per tier
- Feature comparison table
- "Every deployment is custom" messaging
- "Schedule a Scoping Call" CTA
- FAQ section: "How does pricing work?", "What integrations are supported?", "How long does deployment take?"

---

## 7. Technical Specifications

### Stack (extends existing SkyStratos)
- **Framework:** Next.js 14 (App Router) — same as main app
- **Styling:** Tailwind CSS + existing HUD design tokens
- **Animation:** Framer Motion (scroll-triggered) + GSAP (complex timelines)
- **Smooth Scroll:** Lenis (already installed)
- **Video:** MP4/WebM for scroll-stop animation
- **Forms:** Native `<form>` + server action (no React Hook Form — overkill)
- **Form backend:** Next.js API route → Slack webhook (Zod validation)
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel (same as main app)

### Route Structure
```
/                    → Landing page (NEW — public)
/pricing             → Pricing page (NEW — public)
/terms               → Terms of Service (NEW — public)
/privacy             → Privacy Policy (NEW — public)
/sign-in             → Demo sign-in (NEW — polished PIN gate)
/dashboard           → Main dashboard (existing app, behind auth)
```

### Architecture
```
src/app/
  (marketing)/           # Public pages — no auth, SEO-optimized
    page.tsx             # Landing page
    pricing/page.tsx     # Pricing
    terms/page.tsx       # Terms of Service
    privacy/page.tsx     # Privacy Policy
    layout.tsx           # Marketing layout (Lenis, SEO metadata)
  (app)/                 # Protected pages — auth required
    sign-in/page.tsx     # Polished sign-in (wraps PINGate)
    dashboard/page.tsx   # Existing dashboard (extracted)
    layout.tsx           # App layout (AuthProvider, I18nProvider, etc.)
  api/
    tower/route.ts       # Existing — unchanged
    leads/route.ts       # NEW — demo request form handler
  layout.tsx             # Root layout (fonts, globals only)
```

**Key:** Route groups `(marketing)` and `(app)` give complete bundle isolation. Marketing pages never import dashboard dependencies (MapLibre, Recharts, Anthropic SDK).

### SEO Requirements
- Unique title + meta description per page
- OG tags + Twitter cards
- JSON-LD structured data (SoftwareApplication schema)
- Canonical URLs
- Sitemap.xml + robots.txt
- Target keywords: "airline fleet management software", "aircraft maintenance intelligence", "AOG cost reduction", "fleet operations platform", "airline maintenance AI"

### Performance Targets
- LCP < 2.5s (hero video lazy-loaded, poster image for instant render)
- CLS < 0.1
- FID < 100ms
- Video: WebM primary, MP4 fallback, max 5MB compressed
- Landing page bundle: < 150KB JS gzipped (no MapLibre, no Recharts)

---

## 8. Asset Requirements

| Asset | Source | Specs |
|-------|--------|-------|
| Assembled aircraft image | Nano Banana Pro | 16:9, 2K, dark bg #0A0E14 |
| Exploded aircraft image | Nano Banana Pro (ref: assembled) | 16:9, 2K, dark bg #0A0E14 |
| Scroll-stop video | Nano Banana Pro video | Start: assembled, End: exploded |
| Dashboard screenshots | Actual SkyStratos app | Cropped panels from live dashboard |
| Cost label overlays | Built in code | Share Tech Mono, #0088FF/#FFB800 |
| OG image | Composed from assembled shot | 1200x630 |
| Favicon | Extract from HUD aesthetic | 32x32, 16x16, apple-touch |

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Demo requests / month | 20+ | Form submissions via Slack |
| Time on page | > 90s | Vercel Analytics |
| Scroll depth | > 70% reach pricing section | Scroll tracking |
| Bounce rate | < 40% | Vercel Analytics |
| Demo sign-ins / month | Track | Auth events |
| Mobile responsiveness | 100% functional | Manual QA |
| Lighthouse performance | > 90 | Lighthouse CI |
| SEO: indexed pages | All pages within 2 weeks | Google Search Console |

---

## 10. Build Phases

### Phase 1: Assets + Scroll-Stop Prototype (Day 1)
- Generate assembled/exploded/video assets via Nano Banana Pro
- Build scroll-stop prototype (test cross-browser video scrubbing)
- If video scrubbing unreliable: pivot to image sequence or CSS crossfade
- Poster image for instant LCP

### Phase 2: Landing Page Sections (Day 1-2)
- Route groups: `(marketing)` + `(app)`
- Landing page with 6 sections: Nav, Hero, Pain Points, Product Showcase, Tower AI Spotlight, Pricing, Footer
- Sign-in page (polished PINGate wrapper)
- Demo request form + API route (Slack webhook)

### Phase 3: Supporting Pages + SEO (Day 2)
- Pricing page (expanded)
- Terms of Service
- Privacy Policy
- Full SEO implementation (meta, OG, JSON-LD, sitemap, robots.txt)
- OG image

### Phase 4: Polish + Deploy (Day 2-3)
- Performance audit (Lighthouse, bundle analysis)
- Mobile responsive QA
- Cross-browser testing (scroll-stop animation)
- Deploy to Vercel
- Vercel Analytics setup

---

## 11. Resolved Questions (from Blueprint review)

| Question | Decision | Rationale |
|----------|----------|-----------|
| Domain | Same app, route groups | Reuse HUD components, one deploy |
| Demo flow | "Request Demo" → form → Slack webhook | Simple, immediate team notification |
| Video hosting | Self-hosted in `/public/video/` | Vercel serves from edge CDN, <5MB |
| Testimonials | None for launch | Placeholder testimonials hurt credibility (Sherpa R6) |
| Pricing | Enterprise "Contact Sales" on all tiers | Custom per airline, no self-serve |
| Form library | Native `<form>` + server action | React Hook Form overkill for 1 form |
| Route restructure | Route groups (low risk) | No decomposition of existing page.tsx needed |
| Sign-in | Polished PINGate wrapper at `/sign-in` | Demo access for prospects, existing auth unchanged |

---

## 12. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Scroll-stop video too large (>5MB) | HIGH | Compress aggressively, poster image for instant LCP, lazy load video |
| Nano Banana generates low-quality aircraft | HIGH | Generate FIRST before any code. Multiple variations. Fallback: image crossfade |
| Cross-browser video scrubbing inconsistent | HIGH | Prototype in isolation first. Fallback: image sequence on scroll |
| HUD aesthetic too dark for marketing page | MEDIUM | Strategic contrast sections for pain points and pricing |
| Cost labels hard to read on mobile | MEDIUM | Card carousel on mobile instead of floating labels |
| Bundle size blowout | MEDIUM | Route groups isolate bundles. Landing page <150KB. Verify with analyzer. |
| Route groups break existing dashboard | LOW | Dashboard stays at `/dashboard` in `(app)` group, minimal changes |
