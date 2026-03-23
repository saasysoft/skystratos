'use client'

import { useTranslation } from '@/lib/i18n/use-translation'
import { HUDButton } from '@/components/hud/HUDButton'

interface TowerActionsProps {
  onAction: (action: string) => void
  disabled: boolean
}

const QUICK_ACTIONS = [
  {
    label: 'Fleet Status',
    prompt: 'Give me a fleet status briefing',
  },
  {
    label: 'AOG Report',
    prompt: 'Which aircraft are currently AOG and what is the revenue impact?',
  },
  {
    label: 'MEL Alerts',
    prompt: 'Show me MEL items approaching their category limits',
  },
  {
    label: 'Cost Analysis',
    prompt: 'What is driving our cost overruns this month?',
  },
  {
    label: "What's Critical?",
    prompt: 'What should I be worried about right now?',
  },
] as const

export function TowerActions({ onAction, disabled }: TowerActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap gap-1.5 px-3 py-2">
      {QUICK_ACTIONS.map((action) => (
        <HUDButton
          key={action.label}
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={() => onAction(action.prompt)}
          className="text-[10px] leading-tight whitespace-nowrap"
        >
          {action.label}
        </HUDButton>
      ))}
    </div>
  )
}
