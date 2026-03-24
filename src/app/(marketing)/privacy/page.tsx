import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'SkyStratos privacy policy and data handling practices.',
}

// TODO: Wave 5 — add LandingNav import

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-hud-bg text-hud-text-primary">
      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-hud-sm text-hud-text-secondary hover:text-hud-primary transition-colors"
        >
          &larr; Back to Home
        </Link>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <h1 className="font-mono text-3xl md:text-4xl tracking-wide text-hud-text-primary mb-2">
          Privacy Policy
        </h1>
        <p className="font-mono text-hud-sm text-hud-text-dim mb-12">Last Updated: March 2026</p>

        <div className="space-y-10 font-sans text-hud-text-secondary leading-relaxed text-[15px]">
          {/* 1 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              1. Information We Collect
            </h2>

            <h3 className="font-mono text-hud-base text-hud-text-primary mb-2 mt-4">
              Demo Request Form
            </h3>
            <p className="mb-4">
              When you request a demo, we collect your name, email address, company name, job title,
              and fleet size. This information is used to evaluate your needs and follow up with an
              appropriate deployment proposal.
            </p>

            <h3 className="font-mono text-hud-base text-hud-text-primary mb-2">Sign-in</h3>
            <p className="mb-4">
              Demo access uses a short-lived access code. Access codes are verified server-side and
              are not stored after validation. We do not collect passwords for demo access.
            </p>

            <h3 className="font-mono text-hud-base text-hud-text-primary mb-2">Analytics</h3>
            <p className="mb-4">
              We collect anonymized analytics data including page views and session duration via
              Vercel Analytics. This data does not include personally identifiable information and is
              used to improve platform performance and user experience.
            </p>

            <h3 className="font-mono text-hud-base text-hud-text-primary mb-2">Cookies</h3>
            <p>
              We use a single session cookie for authenticated access. This cookie is httpOnly,
              secure, and expires after 24 hours. No third-party tracking cookies are used on the
              SkyStratos platform.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              2. How We Use Information
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>To process and respond to demo requests</li>
              <li>To provide and maintain the Service</li>
              <li>To communicate with you about your account or deployment</li>
              <li>To improve platform performance and develop new features</li>
              <li>To detect and prevent fraud or security incidents</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              3. Data Sharing
            </h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties. We may share
              information with trusted service providers who assist in operating the platform (e.g.,
              hosting, analytics), but only under strict data processing agreements. We may disclose
              information if required by law, regulation, or valid legal process.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              4. Data Retention
            </h2>
            <p>
              Demo request information is retained for up to 12 months after submission, or until you
              request deletion. Analytics data is retained in aggregate form and cannot be linked to
              individual users. Customer data under active subscriptions is retained for the duration
              of the agreement plus 90 days to allow for data export.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              5. Your Rights
            </h2>

            <h3 className="font-mono text-hud-base text-hud-text-primary mb-2 mt-4">
              GDPR (European Economic Area)
            </h3>
            <p className="mb-4">
              If you are located in the EEA, you have the right to access, correct, or delete your
              personal data. You may also request data portability or object to processing. To
              exercise these rights, contact us at{' '}
              <a
                href="mailto:privacy@skystratos.com"
                className="text-hud-primary hover:underline"
              >
                privacy@skystratos.com
              </a>
              .
            </p>

            <h3 className="font-mono text-hud-base text-hud-text-primary mb-2">
              CCPA (California)
            </h3>
            <p>
              California residents have the right to know what personal information we collect and to
              request its deletion. We do not sell personal information. To submit a request, contact
              us at{' '}
              <a
                href="mailto:privacy@skystratos.com"
                className="text-hud-primary hover:underline"
              >
                privacy@skystratos.com
              </a>
              .
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              6. Cookies &amp; Tracking
            </h2>
            <p>
              SkyStratos uses only essential cookies required for authentication. We use Vercel
              Analytics for anonymized usage metrics. We do not use advertising cookies, retargeting
              pixels, or social media tracking scripts. You can disable cookies in your browser
              settings, though this may prevent authenticated access to the platform.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              7. Security Measures
            </h2>
            <p>
              We implement industry-standard security measures including encryption in transit
              (TLS&nbsp;1.3), server-side access code verification, httpOnly session cookies, and
              regular security reviews. While no system is completely secure, we are committed to
              protecting your data using reasonable technical and organizational safeguards.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              8. Children&apos;s Privacy
            </h2>
            <p>
              The SkyStratos platform is not directed at children under the age of 13. We do not
              knowingly collect personal information from children. If you believe a child has
              provided us with personal information, please contact us and we will promptly delete it.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be
              communicated via email or through a prominent notice on the platform. The
              &ldquo;Last&nbsp;Updated&rdquo; date at the top of this page reflects the most recent
              revision.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              10. Contact
            </h2>
            <p>
              For questions or requests regarding this Privacy Policy, contact us at{' '}
              <a
                href="mailto:privacy@skystratos.com"
                className="text-hud-primary hover:underline"
              >
                privacy@skystratos.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </div>
  )
}
