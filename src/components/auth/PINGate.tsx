'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { HUDButton } from '@/components/hud/HUDButton'

interface PINGateProps {
  onSuccess: () => void
}

const PIN_LENGTH = 4
const CORRECT_PIN = '8888'

export default function PINGate({ onSuccess }: PINGateProps) {
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(''))
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Clear error after 2 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Only accept single digits
      const digit = value.replace(/\D/g, '').slice(-1)
      if (!digit && value !== '') return

      setDigits((prev) => {
        const next = [...prev]
        next[index] = digit
        return next
      })

      // Auto-advance to next input
      if (digit && index < PIN_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    },
    [],
  )

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (digits[index] === '' && index > 0) {
          // Move back and clear previous
          setDigits((prev) => {
            const next = [...prev]
            next[index - 1] = ''
            return next
          })
          inputRefs.current[index - 1]?.focus()
        } else {
          setDigits((prev) => {
            const next = [...prev]
            next[index] = ''
            return next
          })
        }
        e.preventDefault()
      } else if (e.key === 'Enter') {
        submit()
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus()
      } else if (e.key === 'ArrowRight' && index < PIN_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [digits],
  )

  const submit = useCallback(() => {
    const pin = digits.join('')
    if (pin.length < PIN_LENGTH) return

    if (pin === CORRECT_PIN) {
      onSuccess()
    } else {
      setShaking(true)
      setError(true)
      setTimeout(() => {
        setShaking(false)
        setDigits(Array(PIN_LENGTH).fill(''))
        inputRefs.current[0]?.focus()
      }, 500)
    }
  }, [digits, onSuccess])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0A0E14', fontFamily: "'Share Tech Mono', monospace" }}
    >
      {/* Subtle animated grid background */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,136,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,136,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            animation: 'gridDrift 20s linear infinite',
          }}
        />
      </div>

      {/* Radial glow behind content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px]"
        style={{ backgroundColor: 'rgba(0,136,255,0.03)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* SKYSTRATOS title */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-5xl tracking-[0.4em] uppercase select-none"
            style={{ fontFamily: "'Share Tech Mono', monospace", color: '#0088FF' }}
          >
            SKYSTRATOS
          </h1>
          <div className="flex flex-col items-center gap-1">
            <p className="text-lg tracking-wide"
              style={{ fontFamily: "'Share Tech Mono', monospace", color: '#7EB8DA' }}
            >
              FLEET INTELLIGENCE
            </p>
            <p className="text-sm tracking-wide"
              style={{ fontFamily: "'Share Tech Mono', monospace", color: '#4A6A7F' }}
            >
              Enter authorization code to access operations dashboard
            </p>
          </div>
        </div>

        {/* Divider line */}
        <div className="w-64 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(0,136,255,0.3), transparent)' }}
        />

        {/* PIN Input */}
        <div className="flex flex-col items-center gap-5">
          <p className="text-xs uppercase tracking-[0.3em]"
            style={{ fontFamily: "'Share Tech Mono', monospace", color: '#4A6A7F' }}
          >
            AUTHORIZATION CODE
          </p>

          <div
            className={`flex gap-3 ${shaking ? 'animate-shake' : ''}`}
          >
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digits[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                autoComplete="off"
                className="outline-none transition-all duration-200"
                style={{
                  width: '60px',
                  height: '72px',
                  textAlign: 'center',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '1.875rem',
                  backgroundColor: '#0C1420',
                  border: error ? '1px solid rgba(255,59,59,0.7)' : '1px solid #1A2A3A',
                  borderRadius: '2px',
                  color: '#0088FF',
                  caretColor: '#0088FF',
                  boxShadow: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,136,255,0.7)'
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(0,136,255,0.15)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = error ? 'rgba(255,59,59,0.7)' : '#1A2A3A'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            ))}
          </div>

          {/* Error message */}
          <div className="h-6 flex items-center">
            {error && (
              <p className="text-sm tracking-widest uppercase animate-pulse"
                style={{ fontFamily: "'Share Tech Mono', monospace", color: '#FF3B3B' }}
              >
                ACCESS DENIED
              </p>
            )}
          </div>

          {/* Submit button */}
          <HUDButton
            onClick={submit}
            variant="primary"
            size="lg"
            className="w-[276px]"
          >
            AUTHENTICATE
          </HUDButton>
        </div>

        {/* Footer hint */}
        <p className="text-[10px] uppercase tracking-widest mt-4"
          style={{ fontFamily: "'Share Tech Mono', monospace", color: 'rgba(74,106,127,0.5)' }}
        >
          AUTHORIZED PERSONNEL ONLY
        </p>
      </div>

      {/* Shake animation keyframes */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes gridDrift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
      `}</style>
    </div>
  )
}
