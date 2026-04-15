'use client';

import { motion } from 'framer-motion';
import { HUDPanel } from '@/components/hud/HUDPanel';
import type { LandingSectionProps } from '@/lib/types/landing';
import { useTranslation } from '@/lib/i18n/use-translation';
import { getLandingStrings } from '@/lib/i18n/landing-i18n';

const towerResponseTable = [
  { tail: 'N412SK', issue: 'AD 2024-15-06 due in 8 days', risk: 'HIGH' },
  { tail: 'N321SK', issue: 'Engine borescope overdue', risk: 'MEDIUM' },
  { tail: 'N208SK', issue: 'MEL item expiring in 5 days', risk: 'MEDIUM' },
];

const riskColors: Record<string, string> = {
  HIGH: 'text-hud-critical',
  MEDIUM: 'text-hud-warning',
  LOW: 'text-hud-nominal',
};

const messageVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.4 + i * 0.6,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export function TowerAISpotlight({ id, className }: LandingSectionProps) {
  const { locale } = useTranslation();
  const s = getLandingStrings(locale);

  const messages = [
    { role: 'user' as const, text: s.tower.userMsg1 },
    { role: 'tower' as const, text: null },
    { role: 'user' as const, text: s.tower.userMsg2 },
  ];

  const handleCtaClick = () => {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id={id}
      className={`py-24 md:py-32 ${className ?? ''}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left — Text content */}
          <div className="flex flex-col gap-6">
            <span className="font-mono text-hud-secondary tracking-widest text-xs uppercase">
              {s.tower.label}
            </span>

            <h2 className="font-mono text-3xl md:text-4xl font-bold text-hud-text-primary">
              {s.tower.headline}
            </h2>

            <p className="font-sans text-hud-text-secondary leading-relaxed max-w-lg">
              {s.tower.description}
            </p>

            <ul className="flex flex-col gap-3 mt-2">
              {s.tower.bullets.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-hud-primary flex-shrink-0" />
                  <span className="font-sans text-sm text-hud-text-secondary">{point}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleCtaClick}
              className="
                mt-4 self-start px-6 py-3
                font-mono text-sm uppercase tracking-wider
                text-hud-primary border border-hud-primary/30 rounded-sm
                bg-gradient-to-b from-[#0A2A3A] to-[#0C1218]
                hover:border-hud-primary/70 hover:shadow-[0_0_12px_rgba(0,136,255,0.25)]
                transition-all duration-200
              "
            >
              {s.tower.cta}
            </button>
          </div>

          {/* Right — Mock conversation */}
          <div className="bg-hud-bg rounded-lg" suppressHydrationWarning>
            <HUDPanel variant="primary" label="Tower AI">
              <div className="flex flex-col gap-4 min-h-[320px]">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={messageVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {msg.role === 'user' ? (
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-[10px] text-hud-text-dim uppercase mt-1 flex-shrink-0 w-8">
                          You
                        </span>
                        <p className="font-mono text-sm text-hud-text-primary">
                          {msg.text}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <span className="h-2 w-2 rounded-full bg-hud-primary mt-1.5 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <p className="font-mono text-xs text-hud-text-secondary">
                            {s.tower.response}
                          </p>
                          <div className="bg-hud-surface/50 rounded p-3 overflow-x-auto">
                            <table className="w-full font-mono text-[11px]">
                              <thead>
                                <tr className="text-hud-text-dim uppercase">
                                  <th className="text-left pr-4 pb-1.5">{s.tower.colTail}</th>
                                  <th className="text-left pr-4 pb-1.5">{s.tower.colIssue}</th>
                                  <th className="text-left pb-1.5">{s.tower.colRisk}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {towerResponseTable.map((row) => (
                                  <tr key={row.tail} className="text-hud-text-secondary">
                                    <td className="pr-4 py-0.5">{row.tail}</td>
                                    <td className="pr-4 py-0.5">{row.issue}</td>
                                    <td className={`py-0.5 font-semibold ${riskColors[row.risk]}`}>
                                      {row.risk}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </HUDPanel>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
