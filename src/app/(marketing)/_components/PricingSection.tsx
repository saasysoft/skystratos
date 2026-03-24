'use client';

import { motion } from 'framer-motion';
import { HUDPanel } from '@/components/hud/HUDPanel';
import { HUDButton } from '@/components/hud/HUDButton';
import { PRICING_TIERS } from '@/lib/data/landing-data';
import type { PricingSectionProps } from '@/lib/types/landing';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function PricingSection({ id, className, onSelectTier }: PricingSectionProps) {
  const tiers = PRICING_TIERS;

  return (
    <section
      id={id}
      className={`py-24 md:py-32 ${className ?? ''}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold text-hud-text-primary">
            Built for Your Fleet, Priced for Your Scale
          </h2>
          <p className="mt-4 font-sans text-lg text-hud-text-secondary max-w-2xl mx-auto">
            Every deployment is custom-tailored to your airline&apos;s systems, workflows, and fleet size.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {tiers.map((tier) => (
            <motion.div key={tier.id} variants={cardVariants} className="flex">
              <div
                className={`bg-hud-bg rounded flex flex-col w-full ${
                  tier.highlighted
                    ? 'ring-1 ring-hud-primary/50 shadow-[0_0_30px_rgba(0,136,255,0.15)]'
                    : ''
                }`}
              >
                <HUDPanel
                  variant={tier.highlighted ? 'primary' : 'secondary'}
                  glow={tier.highlighted}
                  className="h-full flex flex-col"
                >
                  <div className="flex flex-col h-full">
                    {/* Recommended badge */}
                    {tier.highlighted && (
                      <div className="mb-4">
                        <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-hud-primary bg-hud-primary/10 border border-hud-primary/30 rounded-sm px-2 py-0.5">
                          Recommended
                        </span>
                      </div>
                    )}

                    {/* Tier name */}
                    <h3 className="font-mono text-2xl font-bold text-hud-text-primary uppercase">
                      {tier.name}
                    </h3>

                    {/* Tagline */}
                    <p className="font-sans text-sm text-hud-text-secondary mt-1">
                      {tier.tagline}
                    </p>

                    {/* Price */}
                    <div className="mt-6 mb-6">
                      <span className="font-mono text-3xl font-bold text-hud-text-primary">
                        Contact Sales
                      </span>
                      <p className="font-mono text-xs text-hud-text-dim mt-1">
                        Custom pricing per aircraft
                      </p>
                    </div>

                    {/* Feature list */}
                    <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                      {tier.features.map((feature) => (
                        <li key={feature.text} className="flex items-start gap-2.5">
                          {feature.included ? (
                            <svg
                              className="h-4 w-4 text-hud-nominal flex-shrink-0 mt-0.5"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M3 8.5L6.5 12L13 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-4 w-4 text-hud-text-dim/40 flex-shrink-0 mt-0.5"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M4 4L12 12M12 4L4 12"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          )}
                          <span
                            className={`font-sans text-sm ${
                              feature.included
                                ? 'text-hud-text-secondary'
                                : 'text-hud-text-dim/50'
                            }`}
                            title={feature.tooltip}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-auto">
                      <HUDButton
                        onClick={() => onSelectTier(tier.id)}
                        variant={tier.highlighted ? 'primary' : 'secondary'}
                        size="lg"
                        className="w-full"
                      >
                        {tier.ctaLabel}
                      </HUDButton>
                    </div>
                  </div>
                </HUDPanel>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
