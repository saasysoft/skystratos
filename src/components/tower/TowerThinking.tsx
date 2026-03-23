'use client'

import { useTranslation } from '@/lib/i18n/use-translation'

export function TowerThinking() {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="flex items-end gap-[3px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-[3px] rounded-full bg-hud-primary/70"
            style={{
              animation: `tower-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <span className="text-[11px] font-mono text-hud-text-dim tracking-wide">
        TOWER ANALYZING...
      </span>

      <style jsx>{`
        @keyframes tower-pulse {
          0%,
          100% {
            height: 6px;
            opacity: 0.4;
          }
          50% {
            height: 14px;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
