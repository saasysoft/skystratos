'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HUDPanel } from '@/components/hud/HUDPanel';
import { HUDGauge } from '@/components/hud/HUDGauge';
import { HUDStatusBar } from '@/components/hud/HUDStatusBar';
import { HUDIndicator } from '@/components/hud/HUDIndicator';
import { PLATFORM_FEATURES } from '@/lib/data/landing-data';
import type { PlatformShowcaseSectionProps, PlatformFeature } from '@/lib/types/landing';

function RadarDemo() {
  return (
    <div className="relative flex items-center justify-center h-64 overflow-hidden rounded">
      {/* Radar sweep animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-48 w-48">
          {/* Concentric rings */}
          {[1, 0.75, 0.5, 0.25].map((scale) => (
            <div
              key={scale}
              className="absolute inset-0 rounded-full border border-hud-primary/15"
              style={{ transform: `scale(${scale})` }}
            />
          ))}
          {/* Crosshairs */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-hud-primary/10" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-hud-primary/10" />
          {/* Sweep line */}
          <div
            className="absolute top-1/2 left-1/2 h-px w-24 origin-left bg-gradient-to-r from-hud-primary/60 to-transparent"
            style={{ animation: 'radar-sweep 3s linear infinite' }}
          />
          {/* Blips */}
          <div className="absolute top-[30%] left-[60%] h-2 w-2 rounded-full bg-hud-nominal shadow-[0_0_6px_rgba(0,255,159,0.6)]" />
          <div className="absolute top-[55%] left-[25%] h-2 w-2 rounded-full bg-hud-primary shadow-[0_0_6px_rgba(0,136,255,0.6)]" />
          <div className="absolute top-[70%] left-[65%] h-1.5 w-1.5 rounded-full bg-hud-warning shadow-[0_0_6px_rgba(255,184,0,0.6)] animate-pulse" />
        </div>
      </div>
      <style jsx>{`
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p className="absolute bottom-3 font-mono text-xs text-hud-text-dim uppercase tracking-wider">
        Live Fleet Map Preview
      </p>
    </div>
  );
}

function IndicatorDemo() {
  return (
    <div className="flex flex-col gap-3 p-2">
      <HUDIndicator status="nominal" label="AD Compliance" value="97.2%" />
      <HUDIndicator status="warning" label="Open MELs" value="3 items" />
      <HUDIndicator status="nominal" label="Fleet Reliability" value="99.1%" />
      <HUDIndicator status="critical" label="AOG Aircraft" value="1 unit" />
      <HUDStatusBar value={97} label="Overall Compliance" variant="gradient" />
    </div>
  );
}

function GaugeDemo() {
  return (
    <div className="flex items-center justify-center gap-6 flex-wrap py-4">
      <HUDGauge value={94.7} max={100} label="Dispatch Reliability" unit="%" />
      <HUDGauge value={73} max={100} label="Fleet Health" unit="%" thresholds={{ warning: 60, critical: 40 }} />
    </div>
  );
}

function TowerDemo() {
  return (
    <HUDPanel variant="primary" label="Tower AI">
      <div className="flex flex-col gap-3 font-mono text-sm">
        <div className="flex items-start gap-2">
          <span className="text-hud-text-dim text-xs mt-0.5">YOU</span>
          <span className="text-hud-text-primary">Show me aircraft approaching AD deadlines this month</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="h-2 w-2 rounded-full bg-hud-primary mt-1.5 flex-shrink-0" />
          <div className="text-hud-text-secondary text-xs space-y-1">
            <p>Found 3 aircraft with ADs due within 30 days:</p>
            <div className="bg-hud-surface/50 rounded p-2 text-hud-text-dim">
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <span>N412SK — AD 2024-15-06</span>
                <span className="text-hud-warning">Due in 8 days</span>
                <span>Parts staged</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HUDPanel>
  );
}

function FeatureDemo({ feature }: { feature: PlatformFeature }) {
  switch (feature.hudComponent) {
    case 'radar':
      return <RadarDemo />;
    case 'indicator':
      return <IndicatorDemo />;
    case 'gauge':
      return <GaugeDemo />;
    case 'panel':
      return <TowerDemo />;
    default:
      return <div className="h-48 flex items-center justify-center text-hud-text-dim font-mono text-sm">Preview</div>;
  }
}

export function PlatformShowcase({ id, className }: PlatformShowcaseSectionProps) {
  const features = PLATFORM_FEATURES;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = features[activeIndex];

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
            One Command Center for Your Entire Fleet
          </h2>
          <p className="mt-4 font-sans text-lg text-hud-text-secondary max-w-2xl mx-auto">
            Four integrated modules. One screen. Zero guesswork.
          </p>
        </motion.div>

        {/* Desktop tab bar */}
        <div className="hidden md:flex border-b border-hud-border/30 mb-8">
          {features.map((feature, i) => (
            <button
              key={feature.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`
                px-6 py-3 font-mono text-sm uppercase tracking-wider transition-all duration-200
                ${i === activeIndex
                  ? 'text-hud-primary border-b-2 border-hud-primary'
                  : 'text-hud-text-dim hover:text-hud-text-secondary border-b-2 border-transparent'
                }
              `}
            >
              {feature.title}
            </button>
          ))}
        </div>

        {/* Desktop tab content */}
        <div className="hidden md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-5 gap-8"
            >
              {/* Text content — 40% */}
              <div className="col-span-2 flex flex-col justify-center">
                <h3 className="font-mono text-2xl text-hud-primary font-semibold mb-4">
                  {activeFeature.title}
                </h3>
                <p className="font-sans text-hud-text-secondary leading-relaxed">
                  {activeFeature.description}
                </p>
              </div>

              {/* Visual demo — 60% */}
              <div className="col-span-3">
                <div className="bg-hud-bg rounded-lg border border-hud-border/20 p-4">
                  <FeatureDemo feature={activeFeature} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile accordion */}
        <div className="md:hidden flex flex-col gap-4">
          {features.map((feature, i) => (
            <div key={feature.id} className="bg-hud-bg rounded border border-hud-border/20">
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`
                  w-full px-4 py-3 text-left font-mono text-sm uppercase tracking-wider transition-colors
                  ${i === activeIndex ? 'text-hud-primary' : 'text-hud-text-dim'}
                `}
              >
                {feature.title}
              </button>
              <AnimatePresence>
                {i === activeIndex && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <p className="font-sans text-sm text-hud-text-secondary mb-4">
                        {feature.description}
                      </p>
                      <FeatureDemo feature={feature} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
