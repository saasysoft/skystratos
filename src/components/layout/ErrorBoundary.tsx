'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  retryCount: number
}

export class HUDErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, retryCount: 0 }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('[SKYLINE] System error:', error)
  }

  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      retryCount: prev.retryCount + 1,
    }))
  }

  componentDidUpdate(_: Props, prevState: State) {
    // Auto-retry after 2 seconds on first error
    if (this.state.hasError && !prevState.hasError && this.state.retryCount < 3) {
      setTimeout(() => this.handleRetry(), 2000)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hud-bg">
          <div className="hud-panel hud-clip p-8 text-center max-w-md">
            <div className="w-3 h-3 rounded-full bg-hud-warning animate-pulse-slow mx-auto mb-4" />
            <h2 className="font-mono text-hud-warning text-lg tracking-widest uppercase mb-2">
              SYSTEM RECALIBRATING
            </h2>
            <p className="text-hud-text-secondary text-sm mb-4">
              Restoring tower systems...
            </p>
            {this.state.retryCount >= 3 && (
              <button
                onClick={() => window.location.reload()}
                className="font-mono text-hud-xs text-hud-primary tracking-widest uppercase
                  px-4 py-2 border border-hud-primary/30 hover:bg-hud-primary/10 transition-colors"
              >
                RESTART SYSTEMS
              </button>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
