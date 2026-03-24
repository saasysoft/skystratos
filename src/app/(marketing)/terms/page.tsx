import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'SkyStratos terms of service and usage agreement.',
}

// TODO: Wave 5 — add LandingNav import

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="font-mono text-hud-sm text-hud-text-dim mb-12">Last Updated: March 2026</p>

        <div className="space-y-10 font-sans text-hud-text-secondary leading-relaxed text-[15px]">
          {/* 1 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the SkyStratos platform (&ldquo;Service&rdquo;), you agree to be
              bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, do not use
              the Service. These Terms apply to all users, including visitors, demo users, and
              customers with active subscriptions.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              2. Description of Service
            </h2>
            <p>
              SkyStratos is a fleet operations intelligence platform designed for airline operations
              teams. The Service provides real-time fleet visibility, maintenance intelligence, cost
              analytics, and AI-powered operational insights. Features and functionality may vary by
              subscription tier and are subject to change as we improve the platform.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              3. Demo Access
            </h2>
            <p>
              Demo access codes are provided for evaluation purposes only and do not constitute a
              production license. Demo environments contain simulated fleet data and are not intended
              for operational decision-making. Access codes are confidential and may not be shared
              with unauthorized parties. SkyStratos reserves the right to revoke demo access at any
              time without notice.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              4. User Responsibilities
            </h2>
            <p className="mb-3">As a user of the Service, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Provide accurate information when creating accounts or requesting demos</li>
              <li>Maintain the confidentiality of your access credentials</li>
              <li>
                Use the Service only for lawful purposes consistent with airline operations
                management
              </li>
              <li>
                Not attempt to reverse-engineer, decompile, or disassemble any part of the Service
              </li>
              <li>
                Not use automated systems to scrape, crawl, or extract data from the platform
              </li>
              <li>Promptly notify SkyStratos of any unauthorized use of your account</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              5. Intellectual Property
            </h2>
            <p>
              All content, software, algorithms, designs, and documentation comprising the SkyStratos
              platform are the exclusive property of SkyStratos and its licensors. Your subscription
              grants a limited, non-exclusive, non-transferable license to use the Service during the
              subscription term. You retain ownership of your data uploaded to or generated within the
              platform.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              6. Data Privacy
            </h2>
            <p>
              Your use of the Service is also governed by our{' '}
              <Link href="/privacy" className="text-hud-primary hover:underline">
                Privacy Policy
              </Link>
              , which describes how we collect, use, and protect your information. By using the
              Service, you consent to the data practices described in the Privacy Policy.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              7. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, SkyStratos and its officers,
              directors, employees, and agents shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including but not limited to loss of
              profits, data, or operational downtime, arising from your use of or inability to use
              the Service. SkyStratos&apos;s total liability shall not exceed the amounts paid by you
              to SkyStratos during the twelve (12) months preceding the claim.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              8. Termination
            </h2>
            <p>
              Either party may terminate these Terms at any time. SkyStratos may suspend or terminate
              your access immediately if you violate these Terms or engage in conduct that threatens
              the security or integrity of the platform. Upon termination, your right to use the
              Service ceases immediately. We will provide reasonable opportunity to export your data
              prior to account deletion.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              9. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be
              communicated via email or through the platform at least thirty (30) days before they
              take effect. Your continued use of the Service after changes become effective
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="font-mono text-lg text-hud-primary mb-3 tracking-wide">
              10. Contact Information
            </h2>
            <p>
              If you have questions about these Terms, please contact us at{' '}
              <a
                href="mailto:legal@skystratos.com"
                className="text-hud-primary hover:underline"
              >
                legal@skystratos.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </div>
  )
}
