'use client';

import { motion } from 'framer-motion';
import { HUDPanel } from '@/components/hud/HUDPanel';
import type { PainPointsSectionProps } from '@/lib/types/landing';
import { useTranslation } from '@/lib/i18n/use-translation';
import { getLandingStrings, getPainPoints } from '@/lib/i18n/landing-i18n';

const iconColors: Record<string, string> = {
  radar: 'bg-hud-primary/20 border-hud-primary/40',
  'alert-triangle': 'bg-hud-critical/20 border-hud-critical/40',
  database: 'bg-hud-secondary/20 border-hud-secondary/40',
  'shopping-cart': 'bg-hud-warning/20 border-hud-warning/40',
};

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

export function PainPointsSection({ id, className }: PainPointsSectionProps) {
  const { locale } = useTranslation();
  const s = getLandingStrings(locale);
  const cards = getPainPoints(locale);

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
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold text-hud-text-primary leading-tight">
            {s.painPoints.headline}{' '}
            <span className="text-hud-secondary">{s.painPoints.costRange}</span>
            {s.painPoints.perHour ? ` ${s.painPoints.perHour}` : ''}
          </h2>
        </motion.div>

        {/* Pain point cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cards.map((card) => (
            <motion.div key={card.id} variants={cardVariants}>
              <div className="bg-hud-bg rounded h-full">
                <HUDPanel variant="primary" className="h-full">
                  <div className="flex flex-col gap-4">
                    {/* Icon placeholder */}
                    <div
                      className={`h-10 w-10 rounded border flex items-center justify-center ${
                        iconColors[card.icon] ?? 'bg-hud-primary/20 border-hud-primary/40'
                      }`}
                    >
                      <div className="h-4 w-4 rounded-sm bg-current opacity-60" />
                    </div>

                    {/* Headline */}
                    <h3 className="font-mono text-lg text-hud-primary font-semibold">
                      {card.headline}
                    </h3>

                    {/* Description */}
                    <p className="font-sans text-sm text-hud-text-secondary leading-relaxed">
                      {card.description}
                    </p>

                    {/* Stat callout */}
                    <div className="mt-auto pt-4 border-t border-hud-border/20">
                      <span className="font-mono text-2xl font-bold text-hud-secondary">
                        {card.stat}
                      </span>
                      <p className="font-sans text-xs text-hud-text-secondary mt-1">
                        {card.statContext}
                      </p>
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
