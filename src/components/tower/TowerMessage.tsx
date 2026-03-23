'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface TowerMessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isNew?: boolean
}

/** Parse basic markdown-like formatting into JSX */
function formatContent(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let listItems: React.ReactNode[] = []
  let listType: 'ul' | 'ol' | null = null

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const Tag = listType
      elements.push(
        <Tag
          key={`list-${elements.length}`}
          className={cn(
            'space-y-0.5 my-1',
            listType === 'ul' ? 'list-disc' : 'list-decimal',
            'list-inside'
          )}
        >
          {listItems}
        </Tag>
      )
      listItems = []
      listType = null
    }
  }

  const formatInline = (line: string): React.ReactNode => {
    // Bold: **text** and inline code: `code`
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-hud-text-primary font-semibold">
            {part.slice(2, -2)}
          </strong>
        )
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1 py-0.5 bg-hud-primary/10 text-hud-primary text-[11px] font-mono rounded"
          >
            {part.slice(1, -1)}
          </code>
        )
      }
      return part
    })
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Headings: ### or ## or #
    if (/^#{1,3}\s+/.test(line)) {
      flushList()
      const text = line.replace(/^#{1,3}\s+/, '')
      elements.push(
        <p
          key={`h-${i}`}
          className="font-semibold text-hud-primary text-[13px] mt-1 mb-0.5 uppercase tracking-wide"
        >
          {formatInline(text)}
        </p>
      )
      continue
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      flushList()
      elements.push(
        <hr key={`hr-${i}`} className="border-hud-border/30 my-1" />
      )
      continue
    }

    // Bullet list
    if (/^[-*]\s+/.test(line)) {
      if (listType !== 'ul') flushList()
      listType = 'ul'
      listItems.push(
        <li key={`li-${i}`}>{formatInline(line.replace(/^[-*]\s+/, ''))}</li>
      )
      continue
    }

    // Numbered list
    if (/^\d+[.)]\s+/.test(line)) {
      if (listType !== 'ol') flushList()
      listType = 'ol'
      listItems.push(
        <li key={`li-${i}`}>
          {formatInline(line.replace(/^\d+[.)]\s+/, ''))}
        </li>
      )
      continue
    }

    flushList()

    if (line.trim() === '') {
      elements.push(<div key={`br-${i}`} className="h-2" />)
    } else {
      elements.push(
        <p key={`p-${i}`} className="leading-relaxed">
          {formatInline(line)}
        </p>
      )
    }
  }

  flushList()
  return elements
}

export function TowerMessage({
  role,
  content,
  timestamp,
  isNew = false,
}: TowerMessageProps) {
  const [displayedLength, setDisplayedLength] = useState(
    isNew && role === 'assistant' ? 0 : content.length
  )
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isComplete = displayedLength >= content.length

  useEffect(() => {
    if (!isNew || role !== 'assistant') return

    intervalRef.current = setInterval(() => {
      setDisplayedLength((prev) => {
        const next = prev + 1
        if (next >= content.length) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          return content.length
        }
        return next
      })
    }, 1000 / 30) // ~30 chars/sec

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isNew, role, content.length])

  const displayedContent = isComplete ? content : content.slice(0, displayedLength)
  const isUser = role === 'user'

  const timeStr = timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={cn(
        'flex flex-col gap-1 px-3',
        isUser ? 'items-end' : 'items-start'
      )}
    >
      <div
        className={cn(
          'max-w-[240px] rounded-sm px-3 py-2 text-[12px] leading-relaxed',
          isUser
            ? 'border-l-2 border-hud-primary bg-hud-primary/5 text-hud-text-primary'
            : 'border border-hud-border/60 bg-hud-surface/80 text-hud-text-primary backdrop-blur-sm'
        )}
      >
        <div className="font-sans space-y-0.5">
          {formatContent(displayedContent)}
        </div>
        {!isComplete && (
          <span className="inline-block w-[2px] h-3 bg-hud-primary animate-pulse ml-0.5 align-middle" />
        )}
      </div>
      <span className="text-[9px] font-mono text-hud-text-dim px-1 select-none">
        {timeStr}
      </span>
    </div>
  )
}
