'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PINGate from '@/components/auth/PINGate'

export default function SignInClient() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  // Check if user is already authenticated by probing a protected resource
  // The cookie is httpOnly so we can't read it directly
  useEffect(() => {
    async function checkAuth() {
      try {
        // Quick HEAD request to dashboard — if middleware redirects, user is not authed
        const res = await fetch('/dashboard', {
          method: 'HEAD',
          redirect: 'manual',
        })
        // A 200 means they got through (already authenticated)
        if (res.status === 200 || res.type === 'opaqueredirect') {
          // opaqueredirect means redirect happened — not authed
          // 200 means authed
          if (res.status === 200) {
            router.replace('/dashboard')
            return
          }
        }
      } catch {
        // Network error — just show sign-in
      }
      setChecking(false)
    }
    checkAuth()
  }, [router])

  function handleSuccess() {
    router.push('/dashboard')
  }

  // While checking auth, render the same dark background to avoid flash
  if (checking) {
    return (
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: '#0A0E14' }}
      />
    )
  }

  return (
    <>
      <PINGate onSuccess={handleSuccess} />

      {/* Request Demo Access — positioned below PINGate overlay */}
      <div
        className="fixed inset-x-0 bottom-8 z-50 flex flex-col items-center gap-2"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        <p
          className="text-xs tracking-wide"
          style={{ color: '#4A6A7F' }}
        >
          Don&apos;t have access yet?
        </p>
        <a
          href="/#demo-request"
          className="text-xs uppercase tracking-[0.2em] transition-colors duration-200 hover:underline"
          style={{ color: '#0088FF' }}
        >
          Request Demo Access
        </a>
      </div>
    </>
  )
}
