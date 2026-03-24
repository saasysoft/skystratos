# Error Handling Design: SkyStratos Landing Page Build

**Date:** 2026-03-24
**Scope:** Two-layer error handling for the landing page build (PRD-landing-page.md)
**Codebase context:** Next.js 14, Tailwind, Framer Motion, GSAP, Lenis, MapLibre, Recharts, Anthropic SDK

---

## Layer 1: Product Error Handling (User-Facing)

### 1.1 Failure Mode Matrix

| ID | Failure Mode | Trigger | Impact | Severity | Detection |
|----|-------------|---------|--------|----------|-----------|
| P1 | Hero video fails to load | Network timeout, CDN down, corrupt file, unsupported codec | Black/empty hero section — no visual hook, bounce | HIGH | `<video>` `error` event, `stalled` event after 4s |
| P2 | Hero video loads but is too slow | Video >5MB on 3G/4G, Vercel cold start | LCP >2.5s, user scrolls past before animation starts | HIGH | `canplaythrough` not fired within 3s |
| P3 | Scroll-stop animation jank | Low-end device, Safari requestVideoFrame missing, high DPI | Choppy deconstruction, cost labels out of sync | MEDIUM | FPS monitoring via `requestAnimationFrame` delta, `navigator.hardwareConcurrency < 4` |
| P4 | Demo request form submission fails | Slack webhook down, network error, rate limit | User thinks request was lost, no conversion | HIGH | `fetch` response status !== 200, network error catch |
| P5 | Demo request form double-submit | Impatient user clicks CTA twice | Duplicate Slack notification, confused follow-up | LOW | Button state tracking |
| P6 | Map component fails to render | MapLibre GL not supported (no WebGL), tile server down | Empty map section, broken product showcase | MEDIUM | `maplibregl.supported()` check, map `error` event |
| P7 | Auth flow broken after route restructure | `/login` not loading PINGate, session not persisting to `/dashboard`, redirect loops | Dashboard completely inaccessible | CRITICAL | Smoke test: full PIN -> boot -> dashboard flow |
| P8 | Auth context lost on route transition | `sessionStorage` key mismatch between old and new route structure | User authenticates but gets redirected back to PIN | HIGH | `useAuth` returns `isAuthenticated: false` after successful PIN entry |
| P9 | GSAP/Framer Motion conflict in hero | Both libraries fighting for transform on same element | Visual glitch, stuck animation | MEDIUM | Console warnings, visual QA |
| P10 | Lenis smooth scroll breaks anchor links | Lenis intercepts native scroll, hash navigation fails | "Features", "Pricing" nav links do nothing | MEDIUM | Click handler test for all nav anchors |
| P11 | Cost labels unreadable on mobile | Labels overflow viewport, overlapping text, too small | Mobile users miss key value proposition | HIGH | Viewport width check, `matchMedia` query |
| P12 | HUD components render with wrong theme outside dashboard | Landing page inherits `bg-hud-bg` but needs marketing contrast sections | Page looks like a dark void, unreadable pricing/pain sections | MEDIUM | Visual QA on all sections |
| P13 | Tower AI mock conversation SSR mismatch | Typewriter animation causes hydration error | Console error, flash of unstyled content | LOW | `useEffect`-gated animation start |
| P14 | Pricing cards layout break | CSS grid doesn't collapse on tablet breakpoints | Overlapping cards, unreadable pricing | LOW | Responsive QA at 768px, 1024px |
| P15 | OG image / meta tags missing | Route change drops `metadata` export | No preview card on social shares, poor SEO | MEDIUM | `next build` output check, social debugger tools |

### 1.2 Recovery Strategies

| ID | Fallback Behavior | User-Facing Message | Recovery Path |
|----|-------------------|---------------------|---------------|
| P1 | Show high-res poster image (assembled aircraft still) with CSS fade-in. Cost labels render statically positioned over poster. | None visible — seamless degradation | Retry video load once after 5s. If still fails, stay on poster. |
| P2 | Render poster image immediately as `poster` attribute. Video replaces poster only when `canplaythrough` fires. | None — poster is the initial state | Progressive: poster -> low-res video -> full video. Use `preload="metadata"` not `preload="auto"`. |
| P3 | Detect low-end device via `navigator.hardwareConcurrency < 4` or `navigator.connection?.effectiveType === '2g'`. On low-end: skip video, show static poster + staggered CSS-only label animations. | None — different experience, not broken | `prefers-reduced-motion` media query disables all scroll-triggered animations. Fall back to CSS transitions. |
| P4 | Show inline error toast with HUD styling. Store form data in `sessionStorage` so user doesn't lose input. | "Transmission failed. Your request has been saved — retrying..." | Auto-retry once after 3s. If still fails: "Unable to reach tower. Email us at [email] or try again shortly." Show email fallback. |
| P5 | Disable button on first click, show loading spinner. Re-enable after response or 10s timeout. | Button text changes: "REQUEST DEMO" -> "TRANSMITTING..." -> "CONFIRMED" | Debounce + `disabled` state. Server-side idempotency key if Slack webhook supports it. |
| P6 | Replace MapLibre component with static SVG map showing 5 hub stations with pulsing dots. | None — static map looks intentional | Check `maplibregl.supported()` before mount. If false, render `<MapFallback />` component with station markers as positioned SVG elements. |
| P7 | Redirect loop breaker: if `/login` -> `/dashboard` -> `/login` detected within 3s, clear `sessionStorage` auth key and show clean PIN gate. | "Session expired. Please re-authenticate." | Count redirects in `sessionStorage`. If > 2 in 5s, break cycle and reset auth state. |
| P8 | Ensure `STORAGE_KEY = 'skystratos-auth'` is identical across both `/login/page.tsx` and `/dashboard/page.tsx`. Auth context must wrap the root layout, not individual pages. | None if fixed correctly | Move `<AuthProvider>` from page-level to `app/layout.tsx` (but only wrap `/login` and `/dashboard` route groups, not landing page). |
| P9 | Use GSAP for hero timeline, Framer Motion for section reveals. Never apply both to the same DOM node. | None | Establish clear ownership: GSAP owns `#hero-video-container`, Framer Motion owns section wrappers. Document in code comments. |
| P10 | Use Lenis `scrollTo()` method for anchor navigation instead of native `window.location.hash`. | None | Wrap all nav anchor clicks in `lenis.scrollTo(target, { offset: -80 })` for sticky nav clearance. |
| P11 | On `screen.width < 768px`: replace floating cost labels with a scrollable card carousel below the poster/video. Each card shows component name + cost. | None — mobile gets a different, optimized layout | Use `useMediaQuery` or Tailwind `md:` breakpoint. Cards use existing `HUDPanel` component. |
| P12 | Landing page sections that need readability (Pain Points, Pricing, Footer) use a `bg-hud-surface` or `bg-slate-900` background with higher contrast text `text-white`. | None | Define a `LandingSection` wrapper component with `variant: 'dark' | 'contrast'` prop. |
| P13 | Gate typewriter effect behind `useEffect` + `useState` to avoid SSR content mismatch. Render full text in SSR, animate only on client. | None | `suppressHydrationWarning` as last resort. Preferred: render final state server-side, animate entrance client-side. |
| P14 | Use `grid-cols-1 md:grid-cols-3` with `min-w-0` on grid children to prevent overflow. | None | Standard responsive grid. Test at all breakpoints during build. |
| P15 | Each route file exports `metadata` object. Landing page has its own SEO-optimized title/description distinct from dashboard. | None | Add to build verification checklist: `curl -s localhost:3000 | grep '<meta'` for each route. |

### 1.3 Error Boundary Strategy

The existing `HUDErrorBoundary` (auto-retry 3x, then show "RESTART SYSTEMS") is designed for the dashboard. The landing page needs a different error boundary:

```
Landing Page Error Boundary Behavior:
├── Catch → Log to console (no telemetry yet)
├── First error → Attempt re-render immediately
├── Second error → Show minimal fallback:
│   ├── SkyStratos logo
│   ├── "We're experiencing a momentary disruption"
│   ├── "Request a demo at [email]" (hardcoded, no JS needed)
│   └── "Refresh page" button
└── Key difference from dashboard: NO auto-retry timer, NO "SYSTEM RECALIBRATING" HUD language
    Landing page visitors are prospects, not authenticated users — speak their language.
```

### 1.4 Form Backend Error Handling (Slack Webhook)

```
Demo Request Flow:
1. Client validates (name, email, company, fleet size)
2. POST /api/demo-request (Next.js server action or API route)
3. Server action:
   ├── Validate server-side (zod schema)
   ├── POST to Slack webhook URL (from env var)
   │   ├── 200 → Return success
   │   ├── 400/403 → Webhook misconfigured → Log, return generic error
   │   ├── 429 → Rate limited → Return "try again in 60s"
   │   ├── 500/502/503 → Slack down → Fallback: write to local JSON log file
   │   └── Network error → Fallback: write to local JSON log file
   └── Always return 200 to client if data was captured anywhere (Slack OR fallback log)

Fallback log location: /tmp/skystratos-demo-requests.json (or Vercel KV if available)
```

---

## Layer 2: Build Orchestration Error Handling

### 2.1 Build Phase Failure Matrix

| ID | Failure Mode | Phase | Impact | Severity | Detection |
|----|-------------|-------|--------|----------|-----------|
| B1 | Nano Banana unavailable or returns low-quality assets | Phase 1 (Assets) | No hero video, entire landing page concept stalls | CRITICAL | API timeout, image quality below threshold |
| B2 | Nano Banana video generation fails (start/end frame mismatch) | Phase 1 (Assets) | No scroll-stop video, must fall back to image-based hero | HIGH | Video artifact inspection, frame continuity check |
| B3 | Route restructure corrupts existing auth flow | Phase 4 | Dashboard inaccessible, existing demo at skystratos.robobffs.site broken | CRITICAL | Smoke test failure: PIN -> boot -> dashboard |
| B4 | Route restructure causes `sessionStorage` key collision | Phase 4 | Users who visited old `/` get stuck in redirect loop on new `/dashboard` | HIGH | Manual test with pre-existing sessionStorage state |
| B5 | Bundle size blows past target (>250KB first load JS) | Phase 2-3 | Poor Lighthouse score, slow mobile load | HIGH | `next build` output, `@next/bundle-analyzer` |
| B6 | Framer Motion + GSAP + Lenis + MapLibre + Recharts combined weight | Phase 2 | Landing page imports all dashboard deps via shared components | HIGH | Bundle analyzer treemap |
| B7 | Slack webhook URL not configured in env | Phase 3 | Form silently fails in production | MEDIUM | Build-time env check, runtime fallback |
| B8 | Agent builds landing page components that conflict with existing dashboard styles | Phase 2-3 | Dashboard visual regression | MEDIUM | Side-by-side comparison before/after |
| B9 | SEO metadata conflicts between landing page and dashboard routes | Phase 3 | Wrong title/description on Google, social shares | MEDIUM | `next build` metadata output, manual route check |
| B10 | Lenis version conflict (landing page smooth scroll vs dashboard scroll behavior) | Phase 2 | Dashboard panels lose scroll, or landing page stutters | MEDIUM | Test both routes after integration |
| B11 | Agent writes landing page as `'use client'` monolith (like current `page.tsx`) | Phase 2 | No SSR for SEO, entire landing page is client-rendered | HIGH | Check for `'use client'` at top of landing page route |
| B12 | Partial build completion — agent completes hero but not form | Phase 2-3 | Half-built page deployed, broken CTA | HIGH | Verification checklist per phase |
| B13 | Video file committed to git repo | Phase 1 | Repo bloat, clone time explosion | MEDIUM | `.gitignore` check, `git status` before commit |
| B14 | Existing OPERATION.md pattern doesn't cover landing page build | Phase 0 | No structured orchestration, ad-hoc build | LOW | Pre-build planning |

### 2.2 Build Recovery Strategies

| ID | Recovery Strategy | Rollback Plan | Continuation Path |
|----|-------------------|---------------|-------------------|
| B1 | **Primary:** Retry Nano Banana 3x with refined prompts. **Secondary:** Use stock 3D aircraft render from a royalty-free source (Unsplash/Pexels). **Tertiary:** Build hero with pure CSS/SVG aircraft silhouette + animated data overlay (no photo). | N/A — Phase 1 is net-new content | Any of the 3 paths produces a viable hero. The CSS/SVG path actually loads faster. |
| B2 | Use two static images (assembled + exploded) with a CSS crossfade on scroll instead of video. Cost labels still animate via Framer Motion. | N/A — Phase 1 | Crossfade approach is lighter weight and more reliable. Document as acceptable alternative in PRD. |
| B3 | **Pre-migration:** Create git branch `pre-landing-page` before any route changes. **Migration strategy:** Use Next.js route groups `(marketing)` and `(app)` to isolate landing page from dashboard routes. Never modify existing `page.tsx` — create new route files. **Rollback:** `git checkout pre-landing-page` restores original state in <30s. | `git checkout pre-landing-page` | Route group approach: `app/(marketing)/page.tsx` (landing), `app/(app)/login/page.tsx` (PIN), `app/(app)/dashboard/page.tsx` (dashboard). Existing auth context stays untouched. |
| B4 | Use different `sessionStorage` keys per route context. Landing page uses no auth storage. Dashboard auth uses existing `skystratos-auth` key. Add a `storageVersion` prefix to keys to invalidate stale data. | Clear `sessionStorage` in migration script | Key format: `skystratos-v2-auth`. Old key `skystratos-auth` ignored by new code. |
| B5 | **Immediate:** Run `ANALYZE=true npm run build` to identify heaviest modules. **Landing page must not import:** `maplibre-gl` (900KB), `recharts` (400KB), `@anthropic-ai/sdk` (200KB). Use `next/dynamic` with `ssr: false` for any heavy component shown on landing page. | Remove offending imports | Landing page component budget: <150KB first-load JS. All heavy components lazy-loaded behind interaction (tab click, scroll threshold). |
| B6 | Create a strict import boundary: `src/components/landing/` directory cannot import from `src/components/panels/` or `src/components/tower/`. Landing page may only import from `src/components/hud/` (lightweight primitives) and `src/components/landing/` (its own components). | Bundle analyzer verification | Add an ESLint rule or code comment convention: `// LANDING-SAFE: this component is <5KB gzipped` |
| B7 | **Build-time:** Check `SLACK_WEBHOOK_URL` in `next.config.js` and warn (not error) if missing. **Runtime:** API route checks env var; if missing, write to fallback log and return success to client. | N/A | Add `.env.example` with `SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...` placeholder. |
| B8 | Landing page uses its own `globals-landing.css` or scoped Tailwind classes prefixed with `lp-`. Dashboard styles untouched. | N/A — additive only | Better approach: rely on Tailwind utility classes (no custom CSS needed for landing page). Use existing HUD design tokens. |
| B9 | Each route group has its own `layout.tsx` with appropriate `metadata` export. Root `layout.tsx` has generic metadata; route-specific layouts override. | N/A | `app/(marketing)/layout.tsx` exports SEO-optimized metadata. `app/(app)/layout.tsx` exports dashboard metadata (already exists). |
| B10 | Landing page Lenis instance is separate from dashboard Lenis instance. Each initializes in its own layout. If conflicts arise, landing page can use CSS `scroll-behavior: smooth` instead of Lenis. | Remove Lenis from landing page | Lenis is 15KB — acceptable to include. But if it conflicts, CSS-native smooth scroll is zero-cost fallback. |
| B11 | **Enforcement:** Landing page `page.tsx` must NOT have `'use client'` at top. Server component renders all static content (hero poster, text, pricing, footer). Interactive islands (`VideoPlayer`, `DemoForm`, `ROICalculator`) are separate `'use client'` components imported into the server component. | Code review checkpoint | This is critical for SEO. The landing page must be server-rendered with client islands for interactivity. |
| B12 | Each build phase has a verification gate before the next phase starts. Phase cannot be marked complete until all components render without errors on `localhost:3000`. | Phase-level rollback via git commits per phase | Build order: Phase 1 commit -> Phase 2 commit -> Phase 3 commit -> Phase 4 commit. Each commit is a rollback point. |
| B13 | Add to `.gitignore` before Phase 1: `public/videos/*.mp4`, `public/videos/*.webm`. Video files stored in Vercel Blob or Cloudflare R2, referenced by URL. | `git rm --cached` if accidentally committed | If self-hosting video: add to `.gitignore` AND use Git LFS, or better, serve from CDN. |
| B14 | Write a landing-page-specific OPERATION.md or append a new wave section to the existing one. Follow the same wave/agent/produces/consumes pattern. | N/A | Reuse the proven Operation Full Send pattern from the initial build. |

### 2.3 Route Restructure — Detailed Migration Plan

This is the highest-risk operation. The current architecture has everything on `/` with client-side state machine (`pin` -> `boot` -> `dashboard`). The migration must be atomic.

```
BEFORE (current):
app/
├── layout.tsx          (root layout, fonts, global styles)
├── page.tsx            (PINGate -> BootSequence -> Dashboard — all in one)
└── api/tower/route.ts  (Tower AI endpoint)

AFTER (target):
app/
├── layout.tsx              (root layout, fonts, global styles — NO AuthProvider here)
├── (marketing)/
│   ├── layout.tsx          (landing page layout — SEO metadata, no auth)
│   ├── page.tsx            (landing page — server component)
│   ├── pricing/page.tsx    (pricing page)
│   └── contact/page.tsx    (contact/demo form)
├── (app)/
│   ├── layout.tsx          (app layout — AuthProvider + DashboardFilterProvider)
│   ├── login/page.tsx      (PINGate component — extracted from current page.tsx)
│   └── dashboard/page.tsx  (BootSequence + Dashboard — extracted from current page.tsx)
└── api/
    ├── tower/route.ts      (existing — unchanged)
    └── demo-request/route.ts (NEW — Slack webhook handler)
```

**Migration safety checklist:**
1. Create `pre-landing-page` git branch before any changes
2. Extract `PINGate` to standalone page (already a standalone component — just needs route wrapper)
3. Extract `DashboardInner` to `/dashboard/page.tsx` with auth guard redirect
4. Create `/login/page.tsx` that renders `PINGate` with `router.push('/dashboard')` on success
5. Create `(app)/layout.tsx` wrapping `AuthProvider`, `I18nProvider`, `DashboardFilterProvider`
6. Create `(marketing)/layout.tsx` with SEO metadata — NO auth providers
7. Test: `localhost:3000` shows landing page (no auth needed)
8. Test: `localhost:3000/login` shows PIN gate
9. Test: `localhost:3000/dashboard` redirects to `/login` if not authenticated
10. Test: Full flow: `/login` -> PIN -> boot -> `/dashboard` -> all panels work
11. Test: Tower AI still works from `/dashboard`
12. Test: Existing session (`skystratos-auth` in sessionStorage) still works

**State corruption prevention:**
- `AuthProvider` wraps only the `(app)` route group, not the root layout
- Landing page never touches `sessionStorage`
- If `sessionStorage.getItem('skystratos-auth') === 'true'`, `/login` auto-redirects to `/dashboard`
- Dashboard checks auth on mount; if false, redirects to `/login`

### 2.4 Bundle Budget Enforcement

| Component | Max Size (gzipped) | Landing Page? | Dashboard? |
|-----------|--------------------|---------------|------------|
| maplibre-gl | ~200KB | NO (use static SVG) | YES |
| recharts | ~80KB | NO (use CSS-only charts or none) | YES |
| @anthropic-ai/sdk | ~50KB | NO (server-only in API route) | NO (server-only) |
| framer-motion | ~30KB | YES (scroll animations) | YES |
| gsap | ~25KB | YES (hero timeline) | YES |
| lenis | ~15KB | YES (smooth scroll) | YES |
| HUD components | ~5KB total | YES (subset: HUDButton, HUDPanel) | YES (all) |

**Landing page first-load budget: <150KB JS gzipped**
**Dashboard first-load budget: <300KB JS gzipped (current baseline)**

### 2.5 Dependency Failure Handling

| Dependency | Failure Scenario | Fallback | Recovery Time |
|------------|------------------|----------|---------------|
| Nano Banana Pro (image gen) | API down, rate limited, quality insufficient | Stock aircraft images OR CSS/SVG silhouette hero | 0 (fallback is immediate) |
| Nano Banana Pro (video gen) | Video generation fails or produces artifacts | Two-image crossfade on scroll (CSS only) | 0 (fallback is immediate) |
| Slack webhook | URL invalid, Slack outage, rate limit | Write demo requests to server-side JSON log; alert on next successful Slack ping | Slack recovers on its own; batch-send queued requests |
| Vercel deployment | Build fails, domain config issue | Keep current deployment live at skystratos.robobffs.site; landing page deployed separately if needed | Debug build logs, redeploy |
| MapLibre tile server | Tiles 404 or slow | Static SVG map fallback (same as no-WebGL fallback) | 0 (fallback renders immediately) |
| Google Fonts (Share Tech Mono) | CDN slow or blocked | `font-display: swap` already configured in `layout.tsx`; system monospace font renders first | Automatic via `font-display: swap` |

### 2.6 Partial Completion Handling

If the build is interrupted or an agent fails mid-phase, the system must leave the codebase in a deployable state.

**Rule: Every git commit must pass `next build` without errors.**

| Partial State | Is Deployable? | What Works | What's Missing | Action |
|---------------|----------------|------------|----------------|--------|
| Phase 1 complete, Phase 2 incomplete | YES | Landing page with hero (video or poster), nav, basic shell | Content sections, form, pricing | Ship as "coming soon" with hero + single CTA |
| Phase 2 complete, Phase 3 incomplete | YES | Full landing page with all sections | Form backend, SEO metadata, pricing details | Ship without form; use `mailto:` link as CTA |
| Phase 3 complete, Phase 4 incomplete | YES | Complete landing page on a separate route (e.g., `/landing`) | Route restructure not done; old `/` still shows PIN gate | Ship landing page at `/landing`; restructure in next session |
| Phase 4 partial (routes half-migrated) | NO | Broken — some routes work, others 404 | Inconsistent routing state | Rollback to `pre-landing-page` branch immediately |

**Critical rule for Phase 4:** The route restructure is atomic. Either all routes are migrated and tested, or none are. There is no acceptable partial state for routing changes.

### 2.7 Build Verification Gates

Each phase must pass its gate before the next phase begins.

| Phase | Gate Criteria | Verification Command |
|-------|--------------|---------------------|
| Phase 1 | Hero section renders with video OR poster fallback. Nav component renders. `next build` succeeds. | `npm run build && npm run dev` — visual check `localhost:3000/landing` |
| Phase 2 | All 5 content sections render. No console errors. No dashboard component imports in landing page files. | `npm run build` — check bundle analyzer output for unexpected imports |
| Phase 3 | Form submits successfully (test with webhook.site or similar). SEO meta tags present on all routes. `next build` succeeds. | `curl -s localhost:3000 \| grep '<title>'` per route |
| Phase 4 | All 12 items on migration safety checklist pass. `next build` succeeds. Full auth flow works. Existing dashboard features unbroken. | Full manual smoke test of all routes + Tower AI query |

---

## Appendix: Error Message Style Guide

Landing page error messages must NOT use the HUD/aviation jargon from the dashboard. Dashboard users are authenticated operators who expect "SYSTEM RECALIBRATING" and "TOWER OFFLINE". Landing page visitors are executives evaluating the product.

| Context | Dashboard Style | Landing Page Style |
|---------|----------------|-------------------|
| Generic error | "SYSTEM RECALIBRATING" | "Something went wrong. Please refresh the page." |
| Form error | N/A | "We couldn't process your request. Please try again or email us at [email]." |
| Network error | "TOWER LINK SEVERED" | "Connection interrupted. Please check your network and try again." |
| Loading state | "INITIALIZING SUBSYSTEMS..." | "Loading..." or no text (skeleton/spinner) |
| Success state | "ACKNOWLEDGED" | "Thank you! We'll be in touch within 24 hours." |
