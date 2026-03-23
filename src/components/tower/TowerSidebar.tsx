'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/use-translation'
import { TowerMessage } from './TowerMessage'
import { TowerThinking } from './TowerThinking'
import { TowerInput } from './TowerInput'
import { TowerActions } from './TowerActions'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isNew?: boolean
}

export function TowerSidebar() {
  const { t, locale } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      role: 'assistant',
      content: t('tower.greeting'),
      timestamp: new Date(),
      isNew: true,
    },
  ])
  const [isThinking, setIsThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-scroll to bottom on new messages or thinking state change
  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight
      })
    }
  }, [messages, isThinking])

  const sendMessage = useCallback(
    async (content: string) => {
      setError(null)

      const userMessage: Message = {
        role: 'user',
        content,
        timestamp: new Date(),
      }

      // Mark all existing messages as not new (stop typewriter)
      setMessages((prev) => [
        ...prev.map((m) => ({ ...m, isNew: false })),
        userMessage,
      ])
      setIsThinking(true)

      try {
        const history = [...messages, userMessage].map(({ role, content: c }) => ({
          role,
          content: c,
        }))

        const res = await fetch('/api/tower', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history, locale }),
        })

        if (!res.ok) {
          throw new Error(`Response ${res.status}`)
        }

        const data = await res.json()
        const assistantContent =
          data.response ?? data.content ?? data.message ?? data.reply ?? ''

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: assistantContent,
            timestamp: new Date(),
            isNew: true,
          },
        ])
      } catch {
        setError(t('tower.error'))
      } finally {
        setIsThinking(false)
      }
    },
    [messages, t, locale],
  )

  const handleRetry = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
    if (lastUserMsg) {
      setError(null)
      sendMessage(lastUserMsg.content)
    }
  }, [messages, sendMessage])

  return (
    <div className="flex flex-col h-full bg-hud-surface">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-hud-border/60">
        {/* Radar / control tower icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="text-hud-primary flex-shrink-0"
        >
          {/* Control tower silhouette */}
          <rect x="10" y="8" width="4" height="14" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="8" y="4" width="8" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="6" y1="4" x2="18" y2="4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="2" r="1" fill="currentColor" opacity="0.7" />
          {/* Radar sweep lines */}
          <line x1="6" y1="9" x2="2" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1="18" y1="9" x2="22" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>
        <h2 className="font-mono text-[13px] uppercase tracking-widest text-hud-primary select-none">
          {t('tower.title')}
        </h2>
        {/* Status dot */}
        <span
          className={cn(
            'ml-auto w-1.5 h-1.5 rounded-full',
            isThinking ? 'bg-hud-primary animate-pulse' : 'bg-hud-nominal',
          )}
        />
      </div>

      {/* Message list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-3 space-y-3 scrollbar-thin scrollbar-thumb-hud-border scrollbar-track-transparent"
      >
        {messages.map((msg, idx) => (
          <TowerMessage
            key={idx}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
            isNew={msg.isNew}
          />
        ))}

        {isThinking && <TowerThinking />}

        {error && (
          <div className="px-3">
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-sm border border-hud-critical/30 bg-hud-critical/5">
              <span className="text-[11px] font-mono text-hud-critical">
                {error}
              </span>
              <button
                type="button"
                onClick={handleRetry}
                className="text-[10px] font-mono uppercase tracking-wider text-hud-primary hover:text-hud-text-primary transition-colors"
              >
                {t('tower.retry')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <TowerActions onAction={sendMessage} disabled={isThinking} />

      {/* Input */}
      <TowerInput onSend={sendMessage} disabled={isThinking} />
    </div>
  )
}
