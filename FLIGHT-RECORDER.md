# Flight Recorder — SkyStratos

> Black box build log. Each session appends an entry below.
> Check the recorder to understand what happened and why.

**Created:** 2026-03-24T00:20:00Z
**Lenses:** Technical, Journey, Patterns, Business
**Default mode:** Auto

---

## Session 1 | 2026-03-23T22:00Z | [mode: debrief — first session]

**Objective:** Build a complete airline fleet operations intelligence platform adapted from Triton (maritime), deploy to Vercel, and set up GitHub repo.
**Outcome:** Full application built, renamed, deployed, and live at https://skystratos.robobffs.site

### Technical
- Adapted from Triton maritime dashboard — actual reuse was ~40% (HUD primitives + layout), not the 80% initially assumed
- Stack: Next.js 14, React 18, TypeScript, Tailwind CSS, Recharts, Framer Motion, GSAP, MapLibre GL, Anthropic Claude API
- 57 source files, 24,435 lines across 6 build waves
- Aviation data model is fundamentally different from maritime: multi-trigger maintenance (hours/cycles/calendar), MEL deferrals (Cat A/B/C/D with time limits), ATA chapter system, rotable vs expendable parts
- Tower AI has 9 tools (2 more than Triton's Helmsman): added `query_mel_status` and `query_compliance` for aviation-specific domains
- FleetMapGL rewritten with great circle route arcs (20-point sine-curve interpolation) and airport markers instead of ship dots and ports
- RadarDisplay rewritten centered on ORD (41.97, -87.91) with 500nm range instead of Kaohsiung maritime center
- Bulletproof caught critical issue: PIN Gate is client-only (PIN '8888' visible in JS bundle, zero server-side auth on API routes). Accepted for demo, server-side auth deferred.
- TypeScript compiles clean with 0 errors across all 57 files
- Model choice: claude-sonnet-4-6 for Tower AI (sufficient for 9-tool queries, 5x cheaper than Opus)

### Journey
- Started from cloning `robobffs/triton` as reference
- Blueprint written first — 13-section product spec mapping every Triton concept to aviation equivalent
- Bulletproof pass found 26 issues before a single line of code was written (4 critical). The "80% carries over" claim was the biggest misconception — corrected to 40%.
- Operation Full Send executed 6 waves with 12 parallel agent spawns. Waves 3-5 ran 2-3 agents in parallel each.
- Name changed from Skyline to SkyStratos mid-build (Skyline too common). rename-sync updated 37 files atomically.
- Deployed to Vercel under 404redteam scope at robobffs.site subdomain. Had to relink project from personal scope to team scope.
- Session covered: blueprint → bulletproof → operation planning → 6-wave build → GitHub setup → rename → Vercel deploy. Entire lifecycle in one session.

### Patterns
- **Operation Full Send for dashboard apps**: Panels are naturally independent — perfect for wave-based parallel builds. Data layer (Wave 2) is the critical path; everything parallelizes after it.
- **Bulletproof before build**: Caught the MEL data phase ordering dependency (Phase 3 Tower AI needed MEL data built in Phase 4). Would have been a blocking runtime error during build.
- **rename-sync for mid-project renames**: Python find-replace script with ordered replacement rules (most specific first) updated 37 files atomically. Verify with grep after — only gitignored files had stale refs.
- **Triton → SkyStratos fork pattern**: When adapting a product to a new vertical, tag every file as COPY/REWRITE/NEW before estimating. Actual reuse was half what was initially assumed.
- **Distill candidate:** Yes — "Vertical Fork" pattern: how to adapt a domain-specific dashboard to a new industry. Includes domain mapping table, type system rewrite, AI prompt adaptation, mock data generation at scale.

### Business
- Build duration: ~1 session (blueprint through deploy)
- Cost: Estimated $5-8 in Claude API (all Tier 3 agents). Actual likely in that range.
- Deliverables: 9-panel dashboard, Tower AI copilot, HUD design system, 8 mock data domains, live Vercel deployment
- GitHub: https://github.com/saasysoft/skystratos (public, MIT license)
- Live: https://skystratos.robobffs.site
- Target market: Airlines, $50K-$500K/yr contract value (higher than Triton's maritime $20K-$100K)
- Next milestone: Visual QA pass, then production hardening (auth, rate limiting, streaming)

---

## Session 2-3 | 2026-03-25T01:00Z | [mode: auto — Operation Full Send]

**Objective:** Add conversion-focused public landing page, auth hardening, polished demo sign-in, and supporting pages to the existing SkyStratos dashboard.
**Outcome:** Full landing page built, auth moved server-side, all pages verified. Not yet deployed.

### Technical
- **Blueprint pipeline** produced 8 artifacts (PRD Rev 2, capability scan, Sherpa review, error handling, foundation spec, touchpoint map, model routing) before any code was written
- **Bulletproof** found 19 issues (4 CRITICAL, 5 HIGH, 8 MED, 2 LOW) — all resolved in amendments. Biggest finding: client-side PIN '8888' + sessionStorage auth + no middleware = zero effective security.
- **Operation Full Send** executed 6 waves with 12 parallel agent spawns, producing 34 new files and ~4,100 lines of code
- Route groups: `(marketing)/` for public pages, `(app)/` for protected. Complete bundle isolation — landing page never imports MapLibre, Recharts, or Anthropic SDK.
- Auth hardened: `POST /api/auth/verify-pin` validates against `DEMO_PIN` env var, sets httpOnly cookie. `middleware.ts` protects `/dashboard/*`. Tower API checks cookie.
- Landing page bundle: 47.8KB page JS (budget was 150KB) — 68% under budget
- Scroll-stop hero: 3-phase Framer Motion animation (assembled → exploded with cost labels → dashboard reveal). Mobile fallback with card carousel. Reduced motion support. Placeholder containers ready for Nano Banana asset drop-in.
- Demo request form: Zod validation, honeypot field, UTM param capture, sessionStorage persistence, Slack webhook (URL validated against hooks.slack.com, mrkdwn sanitized)
- SEO: sitemap.ts, robots.ts, JSON-LD SoftwareApplication schema, OG placeholder (SVG — needs PNG), security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- New dependencies: zod@4.3.6, @vercel/analytics
- TypeScript: 0 errors across all 83 source files. Build: 14 static pages, all pass.
- Zod v4 note: uses `error: string` instead of v3's `errorMap` callback for z.enum

### Journey
- Started from the Session 1 handoff — dashboard was complete and deployed, needed a public face
- Watched jv-46 video (Nano Banana scroll-stop technique) → wrote PRD → ran full Blueprint pipeline
- User refined scope mid-blueprint: cut from 10 sections to 6, added sign-in page spec, clarified enterprise sales motion ("each airline is custom"), no self-serve pricing
- Bulletproof was the pivotal moment — surfaced that auth was zero-security and route restructure was the real risk, not the landing page content. Added Phase 0 (auth hardening) as prerequisite.
- Operation planned with 17 pre-approved decisions — zero mid-build interruptions
- Waves 3-4 ran 3 and 2 agents in parallel respectively — sections are naturally independent
- HUDButton renders `type="button"` internally, couldn't use for form submit — used native button with matching HUD styles instead (discovered during Wave 5 assembly)
- Session 1's "deferred auth" became Session 2-3's Wave 1 — the tech debt was paid immediately

### Patterns
- **Blueprint → Bulletproof → Operation pipeline**: The three-stage hardening (conceptual → technical → execution) caught issues at each layer that the previous layer missed. Blueprint caught scope bloat. Bulletproof caught security holes. The Operation's pre-approval model meant zero human interruptions during execution.
- **Auth hardening as Wave 1 prerequisite**: When adding public routes to a previously-all-private app, auth must be server-side BEFORE route groups are created. Client-side auth (sessionStorage) provides zero protection once SSR renders pages. This is now a hard rule for all future operations.
- **Route group bundle isolation**: Next.js `(marketing)` and `(app)` route groups naturally isolate bundles. Marketing layout is Server Component (SEO), App layout is Client Component (providers). Root layout owns `<html>/<body>` only.
- **HUD component reuse on marketing pages**: Works well BUT components assume dark context. Must wrap in `bg-hud-bg` containers. Props vary — always read the actual component before using (HUDStatusBar requires value+label, HUDIndicator status is nominal|warning|critical|offline).
- **Distill candidate**: Yes — "Marketing Site Addition" pattern: how to add a public marketing site to an existing auth-protected SaaS app. Covers route groups, auth prerequisites, bundle isolation, SEO metadata inheritance, and the sign-in page as sales gateway.

### Business
- Build duration: ~2 sessions (blueprint/bulletproof planning + 6-wave autonomous execution)
- Cost: Estimated $8-14 in Claude API for the Operation execution
- Pipeline cost: Blueprint ($3-5 estimated) + Bulletproof ($2-3) + Operation ($8-14) = ~$13-22 total
- Deliverables: 6-section landing page, scroll-stop hero, polished sign-in, pricing page, terms, privacy, demo request form, auth hardening, SEO, security headers
- Total codebase: 83 source files, ~28,500 lines
- GitHub: https://github.com/saasysoft/skystratos (not yet pushed with landing page changes)
- Next: Generate Nano Banana assets, visual QA, push to GitHub, deploy to Vercel
- Sales motion validated: Landing → Demo Request → Credentials → Prospect explores → Scoping call → Custom deployment

---

## Session 4 | 2026-03-25T13:00Z | [mode: auto — Visual QA + Asset Generation]

**Objective:** Generate hero assets, fix scrollbar, deploy to Vercel, fix auth, and push to GitHub.
**Outcome:** Full production deployment live with working sign-in flow.

### Technical
- Generated 2 hero images via Imagen 4: assembled aircraft (777KB) and exploded view (1.1MB) — both 16:9, dark navy bg, cyan wireframe HUD aesthetic
- Replaced SVG placeholder silhouettes in HeroSection.tsx with `<img>` tags for all 3 contexts (desktop Phase 1, Phase 2, mobile static)
- Fixed critical UX bug: `overflow: hidden` on global `body` in globals.css was killing the browser scrollbar on marketing pages. Moved to `.dashboard-lock` class, applied via `useEffect` in `(app)/layout.tsx` only. Marketing pages now scroll normally, dashboard still locks.
- Removed unused `data-video-src` attributes (were prepped for video but images work better for initial launch)
- Set `DEMO_PIN=8888` env var in Vercel production, deployed multiple times (Vercel API had socket hangups, eventually resolved)
- **Critical auth bug found and fixed**: Dashboard page had client-side auth check (`hasCookie('skystratos-session')`) that always returned `false` because the session cookie is `httpOnly` — invisible to `document.cookie`. This caused an infinite redirect loop between `/sign-in` and `/dashboard`. Fix: removed client-side auth redirect entirely; server-side middleware already handles protection.
- Ran network monitor investigation (built `netmon.py` utility) after user and teammate both got Google CAPTCHA — confirmed no rogue processes, cause was GoogleDriveFS polling + uBlock Origin fingerprint

### Journey
- Resumed from Session 2-3 handoff via `/landing`
- User asked for "sidebar to scroll" — initially built a dot navigation component, but user clarified they meant the actual browser scrollbar was missing
- Root cause was immediately clear: global `overflow: hidden` designed for the single-screen dashboard HUD was applied to all routes
- Quick visual QA confirmed hero images look correct and scrollbar works
- Deployed to Vercel — hit socket hangups twice, third attempt succeeded
- Sign-in with PIN `8888` returned "ACCESS DENIED" — discovered `DEMO_PIN` env var wasn't in the build that was serving. Re-set env var cleanly, redeployed.
- After env var fix, sign-in caused infinite redirect loop. Debugged to the `hasCookie()` function failing on httpOnly cookies. Removed client-side auth check entirely — middleware is the single source of truth.
- Side investigation: user and CA-based teammate both got Google CAPTCHA simultaneously. Built network monitoring utility, confirmed no malicious processes — just GoogleDriveFS (5 persistent connections), Chrome push notifications, and uBlock Origin fingerprinting.

### Patterns
- **Global CSS vs route-scoped behavior**: When a global CSS rule (like `overflow: hidden`) is needed for one route group but harmful to another, use a body class toggled by the route layout's `useEffect` rather than trying to override in CSS. Cleaner than `!important` chains.
- **Image generation for dark UI**: Imagen 4 produces excellent results when the prompt specifies dark background + specific lighting color (cyan). The generated assets matched the HUD design system perfectly without post-processing.
- **httpOnly cookies are invisible to client JS**: `document.cookie` cannot read httpOnly cookies. Any client-side auth check using `document.cookie` will always fail for httpOnly sessions. When using httpOnly cookies, auth must be server-side only (middleware). Never duplicate auth checks client-side — it creates impossible-to-debug redirect loops.
- **Distill candidate**: Yes — "httpOnly Cookie Auth" pattern: when migrating from client-side auth (sessionStorage) to server-side (httpOnly cookie + middleware), you must remove ALL client-side auth checks. The old and new auth mechanisms are fundamentally incompatible.

### Business
- Build duration: ~2 hours (including network investigation tangent and Vercel deployment issues)
- Cost: ~$2-3 (Imagen 4 generations + multiple deploys + security investigation)
- GitHub: All changes pushed to dev branch (4 commits)
- Vercel: Production live at skystratos.robobffs.site with working auth
- Utility created: `C:\Dev\_CLAUDE-RESOURCES\utilities\network-monitor\netmon.py` — reusable network connection monitor
- Next: OG image PNG conversion, team reviews, Tower AI live test
